## Learning objectives

- Configure `ModelAdmin` well enough that non-developers can actually work in the admin.
- Keep the admin fast on tables with millions of rows.
- Lock the admin down: permissions, read-only fields, audit trails, and network exposure.
- Write custom actions, inlines, filters, and admin views without forking Django templates.
- Judge honestly when the admin is the right tool and when to build a real internal app.

## Prerequisites

[Models and the ORM](/courses/django/models-and-the-orm), [queryset optimization](/courses/django/queryset-optimization), and [auth and security](/courses/django/auth-and-security).

## What the admin is — and is not

Django's admin is a **generated CRUD interface driven by your model metadata**. That's its superpower and its ceiling.

It is excellent for: internal data inspection, content editing by trusted staff, one-off corrections, and early-stage product work where the alternative is a `psql` prompt.

It is a poor fit for: customer-facing pages, complex multi-step workflows, anything where a mis-click is unrecoverable, and any interface used by people who don't understand your data model. The admin exposes *tables*, not *processes* — and users think in processes.

> **The load-bearing rule:** the admin has no undo. Every `delete` is real and immediate. Design around this with soft deletes, restricted permissions, and audit logging rather than hoping.

## A ModelAdmin worth using

The default registration (`admin.site.register(Order)`) gives an unusable list of `Order object (1)` rows. Ten lines of configuration change everything:

```python
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    # --- list view ---
    list_display = ["reference", "customer_link", "status_badge", "total", "created_at"]
    list_display_links = ["reference"]
    list_select_related = ["customer"]              # kills the N+1 on customer_link
    list_filter = ["status", "created_at", ("customer__country", admin.RelatedOnlyFieldListFilter)]
    search_fields = ["reference", "customer__email"]   # indexed columns only!
    date_hierarchy = "created_at"
    ordering = ["-created_at"]
    list_per_page = 50

    # --- detail view ---
    fieldsets = [
        (None, {"fields": ["reference", "customer", "status"]}),
        ("Money", {"fields": ["subtotal", "tax", "total"],
                   "description": "Totals are computed at checkout and are read-only."}),
        ("Audit", {"fields": ["created_at", "updated_at", "created_by"],
                   "classes": ["collapse"]}),
    ]
    readonly_fields = ["reference", "subtotal", "tax", "total",
                       "created_at", "updated_at", "created_by"]
    autocomplete_fields = ["customer"]              # not a 500k-option <select>
    raw_id_fields = ["shipping_address"]

    @admin.display(description="Customer", ordering="customer__email")
    def customer_link(self, obj):
        url = reverse("admin:accounts_user_change", args=[obj.customer_id])
        return format_html('<a href="{}">{}</a>', url, obj.customer.email)

    @admin.display(description="Status", ordering="status")
    def status_badge(self, obj):
        colour = {"paid": "#059669", "pending": "#d97706", "failed": "#dc2626"}[obj.status]
        return format_html('<span style="color:{};font-weight:600">{}</span>',
                           colour, obj.get_status_display())
```

Details that carry weight:

- **`list_select_related`** — without it, `customer_link` fires one query per row. A 50-row page becomes 51 queries.
- **`autocomplete_fields`** requires `search_fields` on the *target* admin; it replaces a full-table `<select>` with an AJAX search. Mandatory past a few hundred related rows.
- **`@admin.display`** replaces the old `short_description`/`admin_order_field` attributes and lets a computed column stay sortable by mapping it to a real database expression.
- **`readonly_fields`** is your main safety mechanism — computed and audit fields must not be hand-editable.

## Inlines, and their cost

```python
class LineInline(admin.TabularInline):     # or StackedInline for wide forms
    model = Line
    extra = 0                              # don't render blank rows by default
    fields = ["sku", "qty", "unit_price", "subtotal"]
    readonly_fields = ["subtotal"]
    autocomplete_fields = ["sku"]
    show_change_link = True

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [LineInline]
```

Inlines render **every** related row. An order with 12 lines is fine; a customer with 40 000 orders inlined will time out the page and possibly the worker. Guard it:

```python
class OrderInline(admin.TabularInline):
    model = Order
    max_num = 0                # no adding from here
    can_delete = False
    def get_queryset(self, request):
        return super().get_queryset(request).order_by("-created_at")[:20]
```

Better still: don't inline high-cardinality children at all. Add a link to the filtered changelist instead — `?customer__id__exact=42` — which is paginated and searchable.

## Actions: bulk operations done safely

```python
@admin.action(description="Mark selected orders as shipped")
def mark_shipped(modeladmin, request, queryset):
    # One UPDATE, not N saves. Note: this skips save() and signals — deliberate here.
    updated = queryset.filter(status=Order.Status.PAID).update(
        status=Order.Status.SHIPPED, shipped_at=timezone.now())
    skipped = queryset.count() - updated
    modeladmin.message_user(request, f"{updated} marked shipped.", messages.SUCCESS)
    if skipped:
        modeladmin.message_user(
            request, f"{skipped} skipped — only paid orders can ship.", messages.WARNING)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    actions = [mark_shipped]
```

Three things separate a good action from a dangerous one:

1. **Filter inside the action.** Users select rows carelessly; the action decides what's eligible and reports what it skipped.
2. **Report both counts.** Silent partial success is how data drifts.
3. **Confirm anything destructive** with an intermediate page:

```python
@admin.action(description="Refund selected orders", permissions=["refund"])
def refund(modeladmin, request, queryset):
    if request.POST.get("confirmed"):
        for order in queryset.select_for_update():
            payments.refund(order)             # per-object: real side effects
        return None
    return render(request, "admin/confirm_refund.html",
                  {"orders": queryset, "action": "refund",
                   ACTION_CHECKBOX_NAME: request.POST.getlist(ACTION_CHECKBOX_NAME)})
```

`permissions=["refund"]` ties the action to `has_refund_permission(self, request)` on the ModelAdmin — the clean way to give one team bulk refunds without giving them everything.

Note the trade-off in the first example: `.update()` is one fast query but bypasses `save()`, `full_clean()`, and signals. When side effects matter (emails, webhooks, audit rows), you must loop — and then you should be doing it in a [Celery task](/courses/django/caching-celery-and-deployment), not in a request that will time out at 500 rows.

## Permissions and the read-only pattern

The admin checks four permissions per model: `view`, `add`, `change`, `delete`. `view` alone gives a genuinely useful read-only admin — the right default for support staff.

```python
@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ["at", "actor", "action", "target"]

    def has_add_permission(self, request):     return False
    def has_change_permission(self, request, obj=None): return False
    def has_delete_permission(self, request, obj=None): return False
```

Row-level access needs `get_queryset`, and field-level access needs `get_readonly_fields`:

```python
def get_queryset(self, request):
    qs = super().get_queryset(request)
    if request.user.is_superuser:
        return qs
    return qs.filter(organisation=request.user.organisation)   # tenant isolation

def get_readonly_fields(self, request, obj=None):
    base = list(super().get_readonly_fields(request, obj))
    if not request.user.is_superuser:
        base += ["status", "total"]           # staff can annotate, not re-price
    if obj and obj.status == Order.Status.SHIPPED:
        base += ["customer", "shipping_address"]   # immutable after shipping
    return base
```

`get_queryset` is the important one: it filters the changelist, the detail view, **and** what actions can touch. Filtering only the list view while leaving detail URLs open is a classic IDOR — a user guesses `/admin/orders/order/999/change/` and reads another tenant's data.

Attributing changes needs `save_model`, and auditing them needs `LogEntry` (which Django already writes) or your own model:

```python
def save_model(self, request, obj, form, change):
    if not change:
        obj.created_by = request.user
    obj.updated_by = request.user
    super().save_model(request, obj, form, change)
```

Django's own `django.contrib.admin.models.LogEntry` records who changed what and when for every admin action — expose it read-only and you have a free audit trail. It does **not** record changes made outside the admin, so don't mistake it for a complete history.

## Common mistakes

1. **No `list_select_related`** with related fields in `list_display` — N+1 on every page load.
2. **`search_fields` on unindexed or text-heavy columns** — `icontains` becomes a full table scan; at a few million rows the admin search times out.
3. **Inlining high-cardinality relations** — the page renders 40 000 rows and dies.
4. **Editable computed fields** — someone types a total that no longer matches the lines.
5. **Giving everyone `is_superuser`** because permissions felt fiddly.
6. **Exposing `/admin/` on the public internet at the default path** with no IP restriction and no 2FA.
7. **Destructive actions with no confirmation step** and no dry-run.
8. **`list_editable` on a big table** — every page submit writes every row, and it's easy to shift values into the wrong record.
9. **Treating the admin as the product** — six months later, non-technical users are editing raw foreign keys and creating orphans.

## Best practices

- Configure every registered model at minimum with `list_display`, `search_fields`, `list_filter`, and `ordering`. An unconfigured admin is worse than none.
- Make every computed, monetary, and audit field read-only.
- Use `autocomplete_fields`/`raw_id_fields` for all foreign keys to large tables; never a bare `<select>`.
- Prefer a link to a filtered changelist over an inline when children can be numerous.
- Put long-running actions on the queue and message the user that it started.
- Group fields into `fieldsets` with descriptions — the admin is documentation for people who never read the code.
- Soft-delete (`is_deleted` + a manager) instead of granting `delete` permission on anything important.
- Add `django-admin-honeypot` or move the URL, and put the whole admin behind SSO/VPN/2FA.

## Performance & memory notes

- The changelist runs a `COUNT(*)` for the paginator. On a 50-million-row table that alone is seconds. Fix with `show_full_result_count = False`, or a custom paginator returning an estimate from `pg_class.reltuples`:

```python
class EstimatedPaginator(Paginator):
    @cached_property
    def count(self):
        with connection.cursor() as cur:
            cur.execute("SELECT reltuples::bigint FROM pg_class WHERE relname = %s",
                        [self.object_list.model._meta.db_table])
            return int(cur.fetchone()[0])
```

- `list_filter` on a foreign key renders **every** related object as an option. Use `RelatedOnlyFieldListFilter` (only values actually present) or a custom `SimpleListFilter` with a fixed choice list.
- `date_hierarchy` issues extra aggregate queries per page; drop it on very large tables.
- `search_fields` with a leading `^` prefixes the match (`istartswith`) and can use a B-tree index; the default `icontains` cannot. For real text search, use `SearchVector` with a GIN index.
- Every `@admin.display` method runs per row. Anything doing a query there is an N+1 — annotate in `get_queryset` instead:

```python
def get_queryset(self, request):
    return super().get_queryset(request).annotate(line_count=Count("lines"))

@admin.display(description="Lines", ordering="line_count")
def line_count(self, obj):
    return obj.line_count          # already computed, zero extra queries
```

## Production tips

- Move the admin off `/admin/` and restrict by IP or VPN; the default path is scanned continuously.
- Require 2FA for staff (`django-otp` + `OTPAdminSite`); a leaked staff password otherwise equals a full data breach.
- Set `SESSION_COOKIE_AGE` shorter for staff, and `SESSION_EXPIRE_AT_BROWSER_CLOSE = True`.
- Log every admin request (user, path, method) to your central log with a distinct marker — you will want this during an incident.
- Never point the admin at a read replica: writes will fail confusingly. Give it the primary and a modest connection pool.
- Back up before bulk actions. "I ran the action on the wrong filter" is a real Tuesday.
- If the admin is becoming the main internal tool, budget for a purpose-built app before it becomes load-bearing — the migration only gets harder.

## Interview questions

1. **"How do you make an admin changelist fast on a huge table?"** — `list_select_related`, annotate instead of per-row queries, indexed `search_fields` (`^` prefix or full-text), `show_full_result_count = False` or an estimated paginator, drop `date_hierarchy`, narrow `list_filter`.
2. **"How do you scope the admin to a tenant?"** — Override `get_queryset` (which covers list, detail, and actions), plus `has_*_permission` and `formfield_for_foreignkey` so related dropdowns are scoped too.
3. **"Bulk action: `.update()` or a loop?"** — `.update()` is one query but skips `save()`, validation, and signals; loop when side effects matter, and move it to a task queue if it can exceed the request timeout.
4. **"How would you audit admin changes?"** — `LogEntry` for free coverage of admin actions, `save_model` for attribution, a dedicated append-only audit model for anything compliance-relevant — and be explicit that `LogEntry` misses non-admin writes.
5. **"When would you not use the admin?"** — Customer-facing UI, multi-step workflows, non-technical users needing process-shaped screens, or anywhere a mis-click is unrecoverable.

## Summary

- The admin generates CRUD from model metadata: fast to get, limited by design.
- Ten lines of `ModelAdmin` config are the difference between unusable and genuinely productive.
- Performance work is the same work as anywhere else in Django: kill N+1s, index what you search, avoid unbounded result sets.
- Security is permissions + `get_queryset` scoping + read-only fields + network restriction + 2FA.
- It's a staff tool. The moment it starts serving a process rather than a table, build the real thing.

## Exercises

**Easy**

1. Configure `ModelAdmin` for an existing model with `list_display`, `list_filter`, `search_fields`, `ordering`, and `date_hierarchy`. Compare before/after on the same data.
2. Add a `status_badge` coloured column using `@admin.display` and `format_html`, sortable by the underlying field.

**Medium**

3. Build a read-only `AuditLogAdmin` (no add/change/delete) and expose Django's own `LogEntry` alongside it.
4. Add an action "Export selected to CSV" that streams the response and includes only the columns in `list_display`. Test it with 10 000 selected rows.

**Hard**

5. Take an admin changelist on a 5-million-row table that takes 8 seconds and get it under 500 ms: measure with `django-debug-toolbar`, replace the count with an estimate, add the right indexes, convert per-row methods to annotations, and swap `list_filter` foreign keys for `SimpleListFilter`. Document each change's contribution.

**Debugging exercise**

6. Support reports that a staff member from Org A can open Org B's orders by editing the URL, even though the list only shows their own. The admin has:

```python
def get_list_queryset(self, request):        # note the name
    return Order.objects.filter(org=request.user.org)
```

Explain the bug and write the correct override plus a regression test.

**Refactoring exercise**

7. An `OrderAdmin` inlines `Line` (unbounded), computes `total` in a display method with a query per row, and lets staff edit `total` and `created_at`. Fix all three problems and show the query count before and after for a 50-row page.

**Mini project**

Build a "support console" admin for a small SaaS: read-only customer view with related subscriptions and invoices, a confirmed `issue_refund` action gated behind a custom permission and logged to an append-only audit model, a tenant-scoped `get_queryset`, an estimated-count paginator, and 2FA required for login. Write tests for the permission matrix and the tenant isolation.

## Quiz

<details>
<summary>1. Why does <code>list_display</code> with a related field need <code>list_select_related</code>?</summary>
Each row's related object is otherwise fetched lazily — one extra query per row (N+1) on every page load.
</details>

<details>
<summary>2. Which single override scopes the list, the detail page, and bulk actions to a tenant?</summary>
<code>get_queryset(self, request)</code>. Filtering only the list leaves detail URLs guessable — an IDOR.
</details>

<details>
<summary>3. What does <code>queryset.update()</code> in an action skip?</summary>
<code>save()</code>, <code>full_clean()</code>, <code>auto_now</code> fields, and <code>pre_save</code>/<code>post_save</code> signals. Fast, but silent about side effects.
</details>

<details>
<summary>4. Why is <code>autocomplete_fields</code> preferable to a plain FK widget?</summary>
The default renders every related row as an <code>&lt;option&gt;</code>; autocomplete does a paginated AJAX search against the target admin's <code>search_fields</code>.
</details>

<details>
<summary>5. Does <code>LogEntry</code> give you a complete change history?</summary>
No — only actions performed through the admin. Shell, API, management command, and signal-driven writes are invisible to it.
</details>

## Further reading

- Django docs — "The Django admin site", "ModelAdmin options", "Admin actions"
- Django source: `django/contrib/admin/options.py` — `ModelAdmin.get_queryset`, `changelist_view`
- `django-otp` docs for `OTPAdminSite`; `django-import-export` for real import/export workflows
