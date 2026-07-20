## Learning objectives

- Configure Django's auth system properly: custom user model, password machinery, sessions.
- Choose between session and token auth deliberately, and explain the CSRF implications of each.
- Use the permission system (model, object-level, groups) and enforce authorization at the right layers.
- Explain Django's built-in defenses — CSRF, XSS, SQL injection, clickjacking, host-header — and what they *don't* cover.
- Pass a security review: headers, settings, secrets, and the OWASP-shaped interview questions.

## Prerequisites

[Request lifecycle](/courses/django/request-lifecycle) (middleware, sessions) and [DRF](/courses/django/drf-apis) (API auth context).

## The user model — decision zero

**Always start projects with a custom user model**, even if it's empty:

```python
# accounts/models.py
class User(AbstractUser):
    department = models.CharField(max_length=100, blank=True, default="")

# settings.py
AUTH_USER_MODEL = "accounts.User"
```

Why: `AUTH_USER_MODEL` is baked into every FK and migration touching users; switching after the first migrate is a documented-but-brutal surgery. `AbstractUser` keeps username/email/name fields and admin compatibility; `AbstractBaseUser` + custom manager is for genuinely different identity schemes (email-as-login is a common one — override `USERNAME_FIELD`). Reference it everywhere as `settings.AUTH_USER_MODEL` (FKs) or `get_user_model()` (code) — never import a user class directly.

### Passwords

Django stores `algorithm$iterations$salt$hash` — by default PBKDF2-SHA256 with per-user random salt; argon2 available by installing `argon2-cffi` and putting `Argon2PasswordHasher` first. What the design buys:

- **Salt** defeats rainbow tables (same password → different hashes).
- **Slow, iterated hashing** turns a leaked table from "cracked tonight" into "economically painful" — and Django transparently upgrades hashes on login when you raise parameters.
- `set_password()`/`check_password()` are the only APIs you touch; if you ever *see* a plaintext password outside the login form's POST, the design is wrong. Password reset flows use expiring signed tokens — build on `PasswordResetView` machinery rather than inventing token schemes.

Enable the validators (`AUTH_PASSWORD_VALIDATORS`: length, common-password list, similarity to username) — they're the cheap 80% of credential hygiene.

## Sessions vs tokens

**Sessions** (browser default): login stores the user id server-side (DB or Redis via the cache backend), the browser holds an opaque `sessionid` cookie. Server-side state means instant revocation (delete the session) and small cookies; cookies mean CSRF protection is mandatory (below). Hardened settings: `SESSION_COOKIE_SECURE`, `SESSION_COOKIE_HTTPONLY` (default), `SESSION_COOKIE_SAMESITE="Lax"`.

**Tokens/JWT** (SPAs, mobile, service-to-service): stateless verification, no CSRF exposure *if* transported in an `Authorization` header (not a cookie!) — at the price of revocation complexity ([full treatment](/courses/fastapi/auth-jwt-oauth2)).

Decision rule: server-rendered Django app → sessions, and you're done; separate frontend/mobile → JWT via DRF; hybrid admin+API apps commonly run both, per endpoint class.

## Authorization: the permission stack

Layers, from coarse to fine:

1. **Flags**: `is_authenticated`, `is_staff` (admin access), `is_superuser` (bypasses all checks).
2. **Model permissions**: auto-created `add/change/delete/view_<model>`; checked via `user.has_perm("orders.change_order")`; aggregated through **groups** (roles: assign perms to groups, users to groups — manageable in admin).
3. **Object-level**: "may *this* user edit *this* order" — Django's hooks exist but ship no implementation; enforce via queryset scoping + explicit checks (or django-guardian if you need per-object grants):

```python
@login_required
def order_edit(request, pk):
    order = get_object_or_404(Order, pk=pk, user=request.user)  # scoping = authz
    ...
```

Enforcement points: `@login_required`/`@permission_required` (FBV), `LoginRequiredMixin`/`PermissionRequiredMixin` (CBV), DRF permission classes (API). The invariant that matters: **authorization runs server-side on every mutation path** — templates hiding buttons is UX, not security; the POST endpoint must check again. And *default to authenticated*: open endpoints should be the explicit exception ([DRF defaults](/courses/django/drf-apis)).

## The attack tour — what Django blocks, and where you can still lose

### CSRF

A logged-in browser auto-attaches session cookies; a malicious page can therefore make the browser *send* authenticated requests (`<form action="https://bank/transfer">` auto-submitted). Django's defense: a per-session secret token that unsafe methods must echo (form field or `X-CSRFToken` header) — the attacker's page can't read it (same-origin policy), so forged requests fail with 403.

You can still lose by: exempting views (`@csrf_exempt` sprinkled to "fix" 403s), doing state changes in GET handlers (CSRF protection only covers unsafe methods!), or `CORS_ALLOW_ALL_ORIGINS=True` with credentialed requests. `SameSite=Lax` cookies add modern defense-in-depth; token-in-header APIs are structurally immune.

### XSS

Injected script running in your users' browsers (stealing sessions, acting as them). Django templates **auto-escape** `{{ variable }}` — the top-tier defense. You can still lose by: `|safe` / `mark_safe` on user-influenced content (audit every one), rendering user HTML without sanitization (use bleach/nh3 with an allowlist), inserting data into `<script>` blocks or attributes hand-rolled (`json_script` filter exists for exactly this), and DOM-side sinks (`innerHTML` in your JS). CSP headers (via middleware) are the modern second layer.

### SQL injection

The ORM parameterizes everything — `filter(name=user_input)` is safe by construction. You can still lose by: string-formatting into `raw()`/`extra()`/`cursor.execute` (`f"WHERE name = '{name}'"` — the classic; always use placeholder params), or interpolating *identifiers* (column/table names from user input) which placeholders can't cover — allowlist them.

### The header set

| Attack | Defense | Setting |
|---|---|---|
| Clickjacking (invisible iframe overlay) | `X-Frame-Options: DENY` | `XFrameOptionsMiddleware` (default) |
| Host-header poisoning (password-reset links to attacker host) | strict host allowlist | `ALLOWED_HOSTS` |
| Protocol downgrade | HTTPS redirect + HSTS | `SECURE_SSL_REDIRECT`, `SECURE_HSTS_SECONDS` |
| MIME sniffing | nosniff | `SECURE_CONTENT_TYPE_NOSNIFF` (default on) |
| Session theft over HTTP | secure cookies | `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE` |

`manage.py check --deploy` audits precisely this list — wire it into CI.

## Common mistakes

1. **Default user model kept "for now"** — the most expensive procrastination in Django.
2. **`@csrf_exempt` as a debugging tool** that ships; state-changing GETs.
3. **Authorization by obscurity** — unlinked-but-unprotected URLs, sequential ids as the only barrier (IDOR); scope querysets, check ownership.
4. **`mark_safe` on anything user-influenced**; trusting rich-text input unsanitized.
5. **Secrets in settings.py in git** — `SECRET_KEY`, DB passwords, API keys belong in environment/secret managers; a leaked `SECRET_KEY` forges sessions and password-reset tokens (rotate it if ever exposed).
6. **`DEBUG=True` in production** — stack traces expose settings, SQL, and paths; combined with an open `ALLOWED_HOSTS = ["*"]` it's a data-exfiltration page.
7. **Logging sensitive data** — passwords in request-body logs, tokens in URLs (URLs land in proxy logs); use `sensitive_post_parameters`/`sensitive_variables` on auth views.

## Best practices

- Custom user + argon2 + password validators + email-verified reset flows — the identity baseline.
- Rate-limit login and reset endpoints (django-ratelimit / DRF throttles) and use constant-shape responses ("if the account exists, we emailed it") to stop enumeration.
- Groups-as-roles for permissions; never scatter `is_superuser` checks through business code — name the capability (`can_refund`) and check that.
- Every `|safe`, `raw()`, `csrf_exempt` gets a comment justifying it and a reviewer's eyebrow — keep them greppable and rare.
- Add 2FA (django-otp) for staff/admin accounts; restrict `/admin/` by network or SSO where feasible.
- Dependency hygiene: `pip-audit`/Dependabot — most real Django compromises come through outdated packages, not the framework.

## Performance & memory notes

- Password hashing is *deliberately* slow (~50–300ms): keep it off hot paths (don't re-hash per request; that's what sessions are for), and thread-offload it in async contexts.
- DB sessions add a query per request; `django.contrib.sessions.backends.cache` (Redis) or `cached_db` removes/halves it ([caching lesson](/courses/django/caching-celery-and-deployment)).
- Permission checks hit caches on the user object after first lookup per request; group-heavy schemes cost a couple of queries — fine; per-object grant tables (guardian) at scale need indexing care.
- Auth middleware's user is lazy — endpoints that never touch `request.user` pay nothing; keep it that way in your own middleware.

## Production tips

- Terminate TLS at the proxy → set `SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")` — without it Django thinks requests are HTTP and redirects loop or secure cookies never set.
- Separate session domains for admin vs API if you run both publicly; consider a distinct admin hostname.
- Audit trail: log login success/failure, permission denials, and admin object changes (`django.contrib.admin.models.LogEntry` exists; ship it to your log platform) — incident response depends on it.
- Have a key-rotation story: `SECRET_KEY_FALLBACKS` (Django 4.1+) enables graceful rotation without logging everyone out.

## Interview questions

1. **"How does Django store passwords?"** — Salted, slow, iterated hashes (PBKDF2/argon2), `algorithm$params$salt$hash` format, transparent upgrade on login; explain *why* each property matters.
2. **"Explain CSRF and Django's defense."** — Cookie auto-attachment abuse; per-session token echoed in unsafe requests; why header-token APIs are immune; SameSite as defense-in-depth.
3. **"Sessions vs JWT?"** — Server-state revocability + CSRF exposure vs stateless scale + revocation complexity; transport rules (header vs cookie).
4. **"Where does object-level authorization live in your Django apps?"** — Queryset scoping as the choke point + explicit checks; templates are never a security layer; IDOR examples.
5. **"You inherit a Django codebase — first security audit steps?"** — `check --deploy`, grep for `csrf_exempt|mark_safe|raw(|extra(|DEBUG`, settings/secrets review, dependency audit, auth throttles.

## Summary

- Custom user model first; passwords only through the hashing APIs; validators + throttles + constant-shape auth responses.
- Sessions for browsers (CSRF handled), header-tokens for APIs (CSRF-immune, revocation is your problem).
- Authorization = server-side checks at choke points (scoped querysets, permission classes), roles via groups.
- Django blocks the classics by default; you re-open the holes via `safe`/`exempt`/`raw`/settings — keep those greppable, justified, and rare; `check --deploy` in CI.

## Exercises

**Easy**

1. Start a project with a custom `User` (extra `department` field), argon2 hashing, and all password validators; register it in admin.
2. Demonstrate auto-escaping: render `<script>alert(1)</script>` from a model field; then show (in a sandbox template) what `|safe` does with it.

**Medium**

3. Build roles: groups `support` (view orders) and `managers` (change orders); enforce in views via `PermissionRequiredMixin` and in a DRF viewset via a custom permission class; test the matrix.
4. Add login throttling (5/min/IP) and an enumeration-safe password-reset flow; prove with tests that existing/nonexistent emails return identical responses and timing isn't wildly divergent.

**Hard**

5. Write a security-audit management command: flags `DEBUG`, wildcard `ALLOWED_HOSTS`, missing secure-cookie settings, `csrf_exempt` views (walk the URL resolver), and `|safe` occurrences in templates (scan files). Run it in CI.

**Debugging exercise**

6. Pen-testers filed three findings against this snippet. Name each vulnerability class and fix:

```python
@csrf_exempt
def transfer(request):
    amount = request.GET["amount"]
    to_id = request.GET["to"]
    cursor.execute(f"UPDATE accounts SET balance = balance - {amount} "
                   f"WHERE user_id = {request.user.id}")
    return HttpResponse(mark_safe(f"Sent {request.GET['note']}!"))
```

**Refactoring exercise**

7. A codebase checks `request.user.is_superuser` in 14 places for various capabilities. Refactor to named permissions on groups (`orders.can_refund`, `reports.can_export`), update checks, write the data migration creating the groups, and document the role → permission map.

**Mini project**

Build an internal tool's auth slice end-to-end: email-login custom user, invite-only registration (signed, expiring invite tokens), session auth for the web UI + JWT for its API, roles (admin/editor/viewer) via groups enforced across FBVs and a DRF viewset, login rate-limiting, and an audit-log model recording auth events — with the security-audit command from exercise 5 green.

## Quiz

<details>
<summary>1. Why does a random per-user salt matter even with a slow hash?</summary>
It forces attackers to crack each user's hash separately — precomputed (rainbow) tables and cross-user deduplication become useless.
</details>

<details>
<summary>2. Why doesn't CSRF protection apply to GET, and what rule does that impose on you?</summary>
The token check covers unsafe methods only, per HTTP semantics that GET is safe — so state changes must never live in GET handlers.
</details>

<details>
<summary>3. An API authenticates via <code>Authorization: Bearer …</code>. Is CSRF a threat? Why?</summary>
No — browsers don't auto-attach custom headers cross-site; the attack relied on automatic credential attachment (cookies).
</details>

<details>
<summary>4. What can an attacker do with a leaked <code>SECRET_KEY</code>?</summary>
Forge anything Django signs: session data, password-reset tokens, signed cookies — i.e., become any user. Rotate immediately (with fallbacks for grace).
</details>

<details>
<summary>5. Placeholders (<code>%s</code> params) can't protect one category of dynamic SQL — which, and what's the fix?</summary>
Identifiers (table/column names, ORDER BY targets) — parameters only bind values. Allowlist-map user input to known identifiers.
</details>

## Further reading

- Django docs — "Security in Django", auth topics, password management (all three, fully)
- OWASP Top 10 + OWASP Cheat Sheets (CSRF, XSS, Authentication)
- django-otp, django-ratelimit, nh3/bleach docs
