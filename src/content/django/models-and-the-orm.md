## Learning objectives

- Model relational data with fields, relationships, constraints, and `Meta` options — and know the SQL each produces.
- Explain what a `Model` class actually is and how querysets map to SQL.
- Write custom managers and queryset methods that make business queries readable and reusable.
- Run the migration workflow safely, including the operations that bite in production.
- Use (and mostly avoid) signals with clear judgment.

## Prerequisites

[The Request/Response Lifecycle](/courses/django/request-lifecycle); SQL basics (SELECT/JOIN/INDEX at a reading level).

## What a model really is

```python
from django.db import models

class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending"
        PAID = "paid"
        SHIPPED = "shipped"

    user = models.ForeignKey("auth.User", on_delete=models.PROTECT,
                             related_name="orders")
    status = models.CharField(max_length=20, choices=Status.choices,
                              default=Status.PENDING, db_index=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    note = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.CheckConstraint(check=models.Q(total__gte=0),
                                   name="order_total_nonnegative"),
        ]

    def __str__(self):
        return f"Order #{self.pk} ({self.status})"
```

`Model`'s metaclass reads the class body at import time and builds: a table mapping (`appname_order`), `_meta` (field registry the admin/forms/migrations all read), the default manager `objects`, and descriptors for every field. An **instance is one row**; `save()` emits `INSERT` or `UPDATE`; class-level attributes are column definitions, instance attributes are values — the ORM is a mapping between the object world and the relational world, and you must stay fluent in both.

Field-choice notes that separate production models from tutorial models:

- **Money is `DecimalField`**, never float (binary floats can't represent 0.1; accounting drift is real). Many teams go further: integer minor units.
- `null=True` vs `blank=True`: database nullability vs form/validation optionality. For strings, prefer `blank=True, default=""` and avoid `null=True` (two "empty" states is a query trap).
- `choices` via `TextChoices` gives you enum ergonomics ([enums lesson](/courses/python/oop-and-the-data-model)) with DB-stable values.
- **Constraints belong in the database** (`CheckConstraint`, `UniqueConstraint`) — application-level validation can be bypassed by any code path (admin, shell, another service); the DB cannot.
- `auto_now_add`/`auto_now` for created/updated stamps; `default=timezone.now` (callable — not called!) when you need overridability.

## Relationships and `on_delete`

| Field | Cardinality | SQL |
|---|---|---|
| `ForeignKey` | many→one | FK column + index on the "many" side |
| `OneToOneField` | one→one | FK + unique constraint (profile/extension tables) |
| `ManyToManyField` | many↔many | hidden join table (or explicit `through=` model) |

`on_delete` is a **business decision** you're forced to encode: `CASCADE` (children die with parent — comments of a post), `PROTECT` (refuse deletion while children exist — orders of a user; the safe default for valuable data), `SET_NULL` (orphan gracefully; requires `null=True`), `RESTRICT`, `SET_DEFAULT`, `DO_NOTHING` (you enjoy integrity errors). Reverse access comes free: `user.orders.all()` via `related_name` (set it always; the default `order_set` reads poorly).

For M2M with payload (role on membership, quantity on order-line), use an explicit `through` model — it almost always grows fields eventually.

## QuerySets: lazy pipelines over SQL

```python
qs = (Order.objects
      .filter(status=Order.Status.PAID,          # WHERE ... AND ...
              created_at__gte=month_start)
      .exclude(user__email__endswith="@test.dev") # JOIN via __
      .select_related("user")                     # JOIN now, not later
      .order_by("-total")[:10])                   # ORDER BY ... LIMIT 10
```

Everything about laziness and evaluation lives in [the optimization lesson](/courses/django/queryset-optimization); here, the query *language*:

- **Lookups**: `field__exact/iexact/contains/icontains/in/gt/gte/lt/lte/range/isnull/startswith/date/year`… and **relationship traversal with `__`** — `filter(user__profile__country="UZ")` compiles to JOINs.
- **`Q` objects** for OR/NOT: `filter(Q(status="paid") | Q(total=0))`; combine with `&`, `|`, `~`.
- **`F` expressions** reference columns in the DB: `update(views=F("views") + 1)` is atomic (no read-modify-write race) and set-based.
- **Aggregation**: `aggregate(total=Sum("total"))` returns a dict; `annotate(n=Count("lines"))` adds a computed column per row — `values("status").annotate(n=Count("id"))` is `GROUP BY status`.
- Write-side set operations: `update()`, `delete()`, `bulk_create()`, `bulk_update()` — orders of magnitude faster than per-instance saves, but **skip `save()` overrides and signals** (a feature and a trap).
- `get()` raises `DoesNotExist`/`MultipleObjectsReturned` — in views, `get_object_or_404`; also know `get_or_create`, `update_or_create` (with the uniqueness caveat: they're only race-safe when backed by a DB unique constraint).

Debugging fluency: `str(qs.query)` shows generated SQL (approximate), `connection.queries` (DEBUG) shows what actually ran, and `qs.explain()` asks the database for its plan.

## Custom managers and queryset methods

Business vocabulary belongs on the queryset, not copy-pasted into views:

```python
class OrderQuerySet(models.QuerySet):
    def paid(self):
        return self.filter(status=Order.Status.PAID)
    def for_user(self, user):
        return self.filter(user=user)
    def this_month(self):
        return self.filter(created_at__gte=now().replace(day=1))

class Order(models.Model):
    ...
    objects = OrderQuerySet.as_manager()

# views read like the domain:
Order.objects.paid().for_user(request.user).this_month()
```

`as_manager()` keeps methods **chainable** (each returns a queryset) — prefer it over separate `Manager` subclasses for filtering vocabulary. One warning from the school of hard knocks: overriding `get_queryset()` on the *default* manager to hide rows (e.g. soft-deleted) makes the admin, migrations, and teammates all see filtered data mysteriously — expose filtered views as named methods (`objects.active()`) instead.

## Migrations

Models are Python; tables are DDL; **migrations are the bridge and the audit log**:

```bash
python manage.py makemigrations      # diff models vs migration history → new file
python manage.py migrate             # apply pending migrations
python manage.py sqlmigrate app 0007 # show the SQL first
python manage.py showmigrations      # what's applied where
```

Rules for not breaking production:

1. **Migrations are code**: reviewed, committed, never edited after being applied somewhere shared.
2. **Adding a non-nullable field to a populated table** needs a default or a three-step dance (add nullable → backfill → alter to non-null). Django will prompt; don't paste a throwaway default to silence it.
3. **Data migrations** (`RunPython`) use the *historical* model (`apps.get_model("app", "Order")`) — never import the live model; write reverse operations or `RunPython.noop` deliberately.
4. **Locking**: `ALTER TABLE` takes locks; on big tables in Postgres, adding an index should be `AddIndexConcurrently` (with `atomic = False`), and column type changes deserve a maintenance plan.
5. Deploy order: migrate before (or with) code that needs the schema; keep each migration backward-compatible with the *previous* code version so rolling deploys don't crash mid-way.

## Signals — the sharp tool

`post_save`, `pre_delete`, `m2m_changed` etc. let decoupled code react to model events:

```python
@receiver(post_save, sender=Order)
def on_order_created(sender, instance, created, **kwargs):
    if created:
        notify_ops(instance)
```

Honest guidance: signals are **implicit control flow** — invisible at the call site, easy to double-register, skipped by `bulk_*`/`update()`, and they run synchronously inside your transaction (a slow signal handler slows every save; an email send inside `post_save` can fire for a transaction that later rolls back — use `transaction.on_commit`). Legitimate uses: reacting to models you don't own (auth's `User`), cache invalidation, denormalization maintenance. For your own models, an explicit service function (`services.place_order()` that saves *and* notifies) is clearer 90% of the time.

## Common mistakes

1. **Float for money**; string statuses without `choices`; missing `related_name`.
2. **Uniqueness/validation only in Python** — race conditions duplicate what the DB would have refused; constraints + catching `IntegrityError` is the correct pattern.
3. **Editing applied migrations** or resolving migration conflicts by deleting the folder ("migration bankruptcy" has a real procedure; that isn't it).
4. **`Model.save()` overrides with side effects** (emails, HTTP calls) — they fire from admin, shell, tests, loaddata… and not from `bulk_create`. Side effects belong in services.
5. **`.delete()` expectations**: queryset delete is one SQL statement but still emits signals per-object only for cascades it fetches; `on_delete` is enforced by Django (in Python!), not the DB, unless you add DB constraints — know which layer you're relying on.
6. **`get_or_create` without a unique constraint** — two racing requests both "get nothing, create one".

## Best practices

- Fat models / queryset methods for *data* vocabulary, service functions for *processes* spanning models; views stay orchestration-thin.
- Every FK: explicit `on_delete` chosen for the business, explicit `related_name`.
- `Meta.constraints` for every invariant the DB can express; treat `IntegrityError` as a normal, handled outcome.
- `__str__` on every model (admin/logs/debugging), `get_absolute_url` where a canonical page exists.
- Review `sqlmigrate` output for any migration touching big tables — before it reviews you at 3 a.m.

## Performance & memory notes

- Model-instance creation is noticeably heavier than dict/tuple rows: for read-heavy bulk endpoints, `values()`/`values_list()` return plain dicts/tuples and can be several times faster and lighter.
- `bulk_create(objs, batch_size=1000)` turns N inserts into N/1000 statements; same for `bulk_update`.
- Per-row `save()` in a loop = per-row transaction by default; wrap batches in `transaction.atomic()` even when you can't bulk.
- The `__` JOIN convenience makes it easy to build five-table queries by accident — read `str(qs.query)` when a "simple filter" is slow. Full performance treatment: [next lesson](/courses/django/queryset-optimization).

## Production tips

- Never trust `makemigrations` on deploy machines — generate in dev, commit, apply in deploy (`migrate --check` in CI catches missing ones).
- Squash old migrations periodically (`squashmigrations`) to keep fresh-environment setup fast.
- Multi-tenant or soft-delete requirements: design them into managers/constraints from day one; retrofitting row-level filters onto a mature codebase is a rewrite in disguise.
- Take periodic `dumpdata`-style logical backups *and* test restoring them; migrations guard schema history, not your data.

## Interview questions

1. **"How does a Django model become SQL?"** — Metaclass builds `_meta` at import; migrations diff models to DDL; querysets compile lazily to SELECTs; instances map to rows.
2. **"`null` vs `blank`?"** — DB nullability vs validation optionality; the strings convention.
3. **"Choose `on_delete` for a User's Orders."** — PROTECT (or SET_NULL for anonymization) with reasoning about data value; CASCADE for truly dependent children.
4. **"What do `bulk_create`/`update()` skip?"** — `save()` overrides, `auto_now`, and signals; when that's fine and when it's a data-integrity trap.
5. **"Why are DB constraints needed if you validate in forms?"** — Multiple write paths + races; the DB is the only serialization point; `IntegrityError` handling pattern.

## Summary

- Models declare tables; `Meta.constraints` encode invariants where they can't be bypassed; `on_delete` and `related_name` are always deliberate.
- The queryset language (`__` traversal, Q/F, annotate/aggregate, bulk ops) is set-based SQL wearing Python syntax — stay fluent in what it compiles to.
- Custom queryset methods give the codebase a domain vocabulary; migrations are reviewed code with production-safety rules; signals are a last resort, services the default.

## Exercises

**Easy**

1. Model `Author`/`Book` (FK) with constraints: non-empty title, published_year between 1450 and next year. Verify both by trying to violate them in the shell.
2. Write queryset expressions for: books this decade by authors whose name contains "va", newest first, only title+year, as tuples.

**Medium**

3. Add `BookQuerySet` with `.published()`, `.by(author)`, `.recent(years=5)`; refactor three view-level filters to use them.
4. Perform the three-step non-null field addition (`isbn`) on a populated table: three migrations, including the `RunPython` backfill with historical models — and demonstrate `sqlmigrate` output for each.

**Hard**

5. Implement an audit-log: an `Activity` model + `post_save`/`post_delete` receivers for two models you own, with `transaction.on_commit` for the external notification part; then write the service-function version and compare test complexity for both designs.

**Debugging exercise**

6. This runs one UPDATE per row, loses increments under concurrency, and sometimes emails users about orders that never committed. Identify all three fixes:

```python
def mark_shipped(order_ids):
    with transaction.atomic():
        for o in Order.objects.filter(id__in=order_ids):
            o.ship_count = o.ship_count + 1
            o.status = "shipped"
            o.save()
            send_email(o.user.email, "Shipped!")
```

**Refactoring exercise**

7. A `Product.save()` override recalculates category counters, calls a pricing API, and invalidates cache. Refactor into a `services.update_product()` function; enumerate every code path (admin, bulk import, tests) whose behavior just changed and how you'd handle each.

**Mini project**

Build a small library-loans domain: `Member`, `Book`, `Loan` (through-model with due dates), constraints (a member ≤ 5 active loans — enforce what you can in DB, the rest in one service function), queryset vocabulary (`overdue()`, `active()`), a data migration seeding fixtures, and a management command printing an overdue report with one query (annotate + filter).

## Quiz

<details>
<summary>1. What SQL does <code>filter(user__profile__country="UZ")</code> imply?</summary>
Two JOINs (orders→users→profiles) with a WHERE on profiles.country — the double-underscore is JOIN syntax.
</details>

<details>
<summary>2. Why is <code>update(views=F("views")+1)</code> safe where <code>obj.views += 1; obj.save()</code> is not?</summary>
The F-expression increments in the database in one statement (atomic); read-modify-write in Python lets two requests read the same value and lose an update.
</details>

<details>
<summary>3. When must <code>RunPython</code> use <code>apps.get_model</code>?</summary>
Always — the live model may have fields/behavior from the future relative to that migration point; historical models match the schema at that step.
</details>

<details>
<summary>4. What's wrong with a default manager filtering out soft-deleted rows?</summary>
Everything inherits the filter invisibly — admin, migrations, aggregates, teammates' queries — causing "missing data" bugs; use an explicit named method instead.
</details>

<details>
<summary>5. Signals fire inside the transaction. Why does that matter for sending email in <code>post_save</code>?</summary>
The transaction may still roll back — the user gets email about a nonexistent order. Defer side effects with <code>transaction.on_commit</code> (or better, a task queue after commit).
</details>

## Further reading

- Django docs — Models, QuerySet API reference (read the whole lookup list once), Migrations
- "Two Scoops of Django" — model/manager patterns chapters
- PostgreSQL docs — constraints and DDL locking
