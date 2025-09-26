# 🛠️ Targeted Fix Plan — Clients, Cases, Hearings (view/edit/delete), Invoices (client/case selection), Lawyers (view)

You are a Principal Software Architect / Senior Developer (10+ years).

**Scope guard:** Do **not** change the already-fixed Reports “عرض” feature. Focus only on the items below and avoid breaking what works.

---

## Non-Negotiables (Safety & Standards)

- **DRY-RUN first:** print a change plan/diff and route table before modifying files.  
- Small, reversible PRs; include a **rollback plan**.  
- Use correct **HTTP semantics**: `201` create, `200`/`204` update/delete success, `422` validation errors, `404` not found, `409` conflict (e.g., FK-constraint prevents delete). MDN/RFCs. :contentReference[oaicite:0]{index=0}  
- When returning errors, use **RFC 9457 Problem Details** JSON (`type`, `title`, `status`, `detail`, `instance`) so the UI can display real reasons. :contentReference[oaicite:1]{index=1}  
- Laravel validations must return **422 JSON** with field errors. :contentReference[oaicite:2]{index=2}

---

## Symptoms to Reproduce (current)

1) **Clients**
   - **Delete** shows “Failed to delete client” with no reason. After refresh:  
     - clients **related** to cases/hearings remain (not deleted),  
     - **unrelated** clients deleted **but still showed the error toast**.
   - **Create/Edit** forms open but **Save** does nothing.

2) **Cases**
   - Buttons for **create, view, edit, delete** do nothing.

3) **Hearings**
   - **Create** now works ✅  
   - **View/Edit/Delete** buttons do nothing.

4) **Invoices**
   - Invoice form still lacks **Client/Case selection**.

5) **Lawyers**
   - **View** button does nothing.

**Goal:** Make all flows functional end-to-end with proper HTTP codes and visible, helpful error messages (no silent failures).

---

## Investigation Checklist (Backend → Frontend)

### A) Backend routes/controllers/policies

1. Print the full API route table (framework command) and confirm CRUD for:
   - `/api/clients`, `/api/cases`, `/api/hearings`, `/api/invoices`, `/api/lawyers` (index, show, store, update, destroy).
2. Ensure **auth/authorization** is not converting 401/403 to 404; keep real codes visible to the UI.  
3. **DELETE behavior (Clients):** if DB **foreign key constraints** block deletion (client has cases/hearings), return **409 Conflict** + Problem Details JSON explaining which relations prevent delete (don’t 200/204 in that case). RFC 9110/MDN. :contentReference[oaicite:3]{index=3}  
4. Standardize success responses:  
   - `DELETE` → **204 No Content** (or 200 with JSON) only when deletion truly succeeded. :contentReference[oaicite:4]{index=4}  
   - Validation errors → **422** with Laravel’s JSON structure. :contentReference[oaicite:5]{index=5}

### B) Frontend wiring (React)

1. For **Clients/Cases/Hearings/Lawyers** screens: verify onClick handlers are bound and call the correct `api.ts` functions with proper path/params; add `await/try-catch` and surface error text from Problem Details or 422 messages.  
2. **Delete toast logic:** show success toast only on `204/200`. If response is `409`, extract `detail` from Problem Details and show:  
   > “لا يمكن حذف العميل لوجود قضايا/جلسات مرتبطة” (cannot delete due to related cases/hearings).  
3. **Save buttons (Create/Edit):** ensure they’re not disabled by stale state; confirm the submit handler actually sends (`POST`/`PUT`) and handles `422` field errors inline.  
4. **Invoices:** implement **Client** and **Case** dropdowns (searchable if needed); load options on mount; require both; post their IDs.  
5. **Lawyers View:** bind the button to `GET /api/lawyers/{id}`; show modal/page with details; handle `404` with a user message.

### C) Logging & diagnostics

- Backend: log route hit, user id, method, result status; on delete failure, log the exact FK table/constraint.  
- Frontend: in dev builds, console.warn the HTTP status and parsed error body to speed triage.

### D) Tests (non-regressive)

- **Unit/Integration (majority):** API client wrappers, reducers/stores, form validation, delete flows including `409` and `422`.  
- **Targeted E2E:**  
  - Clients: create → edit → delete (expect `409` when related; success when unrelated).  
  - Cases: CRUD happy path.  
  - Hearings: view/edit/delete happy paths.  
  - Invoices: create with valid client/case.  
  - Lawyers: view details.  
Use fast, focused specs; keep CI green. MDN on methods/idempotency for DELETE helpful context. :contentReference[oaicite:6]{index=6}

---

## Fix Plan (apply in small steps)

> **Step 0 — DRY-RUN:** print the list of code files to change and the route diffs; do not edit yet.

1) **Clients – Delete & Save**
   - Backend `DELETE /api/clients/{id}`:  
     - On FK violation → **409** Problem Details with `detail` like: “Client has N related cases/hearings.”  
     - On success → **204**.  
   - Frontend: only show success toast on `204/200`. On `409`, show `detail`. On other 4xx/5xx, show generic error + console diagnostics.  
   - Create/Edit Save: send correct body (JSON or multipart), map names (`client_id` vs `clientId`), show inline `422` errors.

2) **Cases – CRUD**
   - Verify all routes; implement/repair handlers.  
   - Wire buttons; ensure modals/pages mount and submit; refresh list on success.

3) **Hearings – view/edit/delete**
   - Bind buttons to `GET/PUT/DELETE` endpoints.  
   - After edit/delete, refresh list; show toasts; handle `404/422/409` correctly.

4) **Invoices – client/case selection**
   - Add dropdowns (`client_id`, `case_id`); load options; validate both required.  
   - Backend validates presence; return `422` with field messages if missing.

5) **Lawyers – view**
   - Wire `GET /api/lawyers/{id}`; show details; handle `404` nicely.

6) **Problem Details middleware**
   - Add a small middleware/exception handler to serialize server errors using **RFC 9457 Problem Details** format consistently. :contentReference[oaicite:7]{index=7}

7) **Docs & samples**
   - Add brief API docs and `curl` examples for each fixed endpoint and error case (`409`, `422`, `404`).

---

## Smoke `curl` (examples)

```bash
# Client delete that should fail (FK)
curl -i -X DELETE -H "Authorization: Bearer <TOKEN>" http://<HOST>/api/clients/123

# Expect: 409 with JSON:
# { "type":"about:blank","title":"Conflict","status":409,
#   "detail":"Client has 3 related cases and 2 hearings.","instance":"/api/clients/123" }

# Client delete success
curl -i -X DELETE -H "Authorization: Bearer <TOKEN>" http://<HOST>/api/clients/999  # unrelated
# Expect: 204

# Client create (example)
curl -i -X POST -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{"name":"عميل تجريبي","phone":"+20123456789"}' http://<HOST>/api/clients
# Expect: 201 or 422 with field errors

# Lawyer view
curl -i -H "Authorization: Bearer <TOKEN>" http://<HOST>/api/lawyers/55

## Definition of Done

- Clients: Delete returns correct code/message; Create/Edit Save works with visible field errors on 422.

- Cases: full CRUD works.

- Hearings: view/edit/delete work (Create already OK).

- Invoices: client/case selectors present and validated.

- Lawyers: view works.

- Errors use Problem Details (machine-readable & user-friendly).

- All new tests pass in CI; no regressions elsewhere.
```

## 📎 Annex: Playwright Verification Plan (Frontend E2E)

You will add **Playwright** tests to *prove* the fixes work and stay working. Follow these steps exactly.

---

## A. Install & Baseline

1. Add Playwright to the repo (skip if already present):

   ```bash
   npm install --save-dev @playwright/test
   npx playwright install```

Use Playwright's auto-waiting matchers in @playwright/test to reduce flakiness. (playwright.dev)

2. Create or update playwright.config.ts:

Set use.baseURL to the local FE dev URL.

Enable HTML report & trace on failure:

ts
Copy code
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: '<http://localhost:3000>',  // ← adjust to your FE dev URL
    trace: 'on-first-retry'
  },
  reporter: [['html', { open: 'never' }]]
});
Ensure test isolation using fixtures/context. (playwright.dev)

## B. Test Structure & Fixtures

Create tests/e2e/ with one spec per feature:

clients.spec.ts

cases.spec.ts

hearings.spec.ts

invoices.spec.ts

lawyers.spec.ts

Add a custom fixture for authenticated state or token injection, if required (e.g. storageState or setting request headers). (playwright.dev)

Use semantic locators (getByRole, getByLabel) instead of brittle ones; use Playwright’s web aware assertions (expect(locator).toBeVisible(), etc.). (playwright.dev)

## C. Network Mocking (Fast & Deterministic)

For non-critical backend paths, mock API calls using page.route() so the tests are fast and reliable; for critical flows, consider real backend calls if infra allows. (playwright.dev)

Mock common responses:

409 Conflict (e.g. Client deletion blocked by FK constraints)

422 Validation errors (create/edit missing fields)

200/201/204 success happy paths

## D. Minimum Smoke Specs

Adapt selectors and URLs to match your actual app.

Clients

Test deletion of a client that has related items (expect 409 Conflict, with error detail shown in UI)

Test deletion of an unrelated client (expect 204 No Content, row disappears)

Test create/edit save: missing required field(s) → 422, show inline field errors; valid data → success & UI refresh

Hearings

On “Create Hearing” form: verify dropdowns (مدة الجلسة, نتيجة الجلسة, نوع الجلسة) load options correctly

Test view/edit/delete actions: view loads detail, edit persists, delete removes item

Cases

CRUD operations via UI: create, view, edit, delete

Invoices

Form shows Client and Case selectors

Both required; test validation; on success invoice saved

Lawyers

View details works; invalid id → nice 404 error in UI

## E. Example Patterns

Mock an endpoint:

ts
Copy code
await page.route('**/api/clients/123', route =>
  route.fulfill({
    status: 409,
    contentType: 'application/problem+json',
    body: JSON.stringify({
      type: 'about:blank',
      title: 'Conflict',
      status: 409,
      detail: 'لا يمكن حذف العميل لوجود قضايا/جلسات مرتبطة',
      instance: '/api/clients/123'
    })
  })
);
Assertions that auto-wait:

ts
Copy code
await expect(page.getByText('لا يمكن حذف العميل')).toBeVisible();
await expect(page.getByRole('row', { name: /عميل غير مرتبط/i })).toHaveCount(0);

## F. Running, Debugging, Reporting

CLI commands:

bash
Copy code
npx playwright test                      # Run all E2E tests
npx playwright test tests/e2e/clients.spec.ts --debug  # Run specific suite in debug mode
npx playwright show-report               # Show HTML report
CI Integration:

Install with browsers: npx playwright install --with-deps

Run tests in CI; upload HTML report and trace.zip artifacts for failures. (playwright.dev)

## G. Pass/Fail Criteria

For each broken flow, there must be at least one green E2E covering both success and error paths:

Flow Success Criteria
Clients delete (related) 409 + error message visible
Clients delete (unrelated) 204 + row removed
Clients create/edit 422 for missing fields, success path works
Hearings dropdowns Options loaded and selectable
Hearings view/edit/delete Buttons work, UI updates
Cases CRUD All four operations succeed
Invoices Client/Case selection + validation
Lawyers view Details appear, 404 handled nicely

No regressions elsewhere—existing working features (e.g. Reports) still work.

CI build must pass, E2E stability good (minimal flakiness).

## H. Deliverables

tests/e2e/*.spec.ts covering all features above

playwright.config.ts updated with HTML report & trace settings

CI job (e.g. GitHub Actions) configured to run tests + upload report/trace

TESTING.md explaining how to run the tests locally, how to interpret the reports, how to debug failures

If tests show failures due to selectors, brittle waiting, missing routes or broken wiring, fix those upstream. Prioritize strong selectors (by role/label), consistent error formats, and deterministic flows.

Begin now by printing routes and proposing the DRY-RUN change plan before applying.
