# 🛠️ Safe Fix Plan — Hearings, Cases, Clients, Invoices, Lawyers (No Regressions)

You are a Principal Software Architect & Senior Developer (10+ years).

**Scope note:** Reports “عرض” (view) endpoints are already fixed. Do **not** change working report routes/handlers. Focus only on the items below.

---

## Non-Negotiables (Safety First)

- **DRY-RUN first**: print a change plan/diff before modifying files.  
- Make **small PRs**; keep a **rollback plan**; guard risky UI changes with a **feature flag**. :contentReference[oaicite:0]{index=0}  
- Follow the **Test Pyramid**: bias to fast unit/integration tests; add a few focused E2E tests for critical flows. :contentReference[oaicite:1]{index=1}  
- Use accurate **HTTP status codes** (e.g., 200/201/204 success; 404 not found; 422 validation). :contentReference[oaicite:2]{index=2}  
- Keep security basics (auth, HTTPS, least privilege) intact. :contentReference[oaicite:3]{index=3}

---

## Current Symptoms to Reproduce (Do Not Change Reports)

### 1) Hearings
- **View / Edit / Delete** buttons do nothing.  
- **Create** opens, but dropdowns are **empty**:  
  - `مدة الجلسة` (duration)  
  - `نتيجة الجلسة` (result)  
  - `نوع الجلسة` (type)

**Goal:** Wire CRUD actions; fetch/populate dropdown options; persist successfully.

### 2) Cases
- Cannot **Create / View / Edit / Delete** (buttons do nothing).

**Goal:** Fully working CRUD with proper responses and UI updates.

### 3) Clients
- **Delete** → shows “Failed to delete client”.  
- **View/Edit** forms open, but **Save** (both Create & Edit) does nothing.

**Goal:** Fix Delete and Save flows; surface validation errors clearly (use 422). :contentReference[oaicite:4]{index=4}

### 4) Invoices
- Must allow selecting **Client** and **Case** (currently missing).

**Goal:** Add dependable Client/Case selectors, with validation.

### 5) Lawyers
- **View** button not working.

**Goal:** View should open and load details reliably.

---

## Investigation Checklist (Back → Front)

### A) Routes / Controllers / Policies
1. List API routes (framework-specific “route:list” or router dump).  
2. Ensure CRUD endpoints exist for **hearings, cases, clients, invoices, lawyers** with correct methods and paths.  
3. Verify auth/authorization isn’t masking a 401/403 as 404; keep HTTPS/auth intact. :contentReference[oaicite:5]{index=5}

### B) Frontend Wiring (React)
1. In each page/module, confirm **onClick** handlers are bound and call the **correct api.ts** functions.  
2. Check URLs, path params, and query shapes exactly match backend.  
3. Ensure `await`/`try-catch` is present and UI handles loading/error states (toasts/messages).  
4. **Hearings dropdowns**: identify lookup endpoints; fetch on mount; handle empty/error states; cache options to avoid re-fetch storms.

### C) Validation & Responses
1. Standardize success codes and bodies:  
   - **Create** → `201 Created`; **Update** → `200 OK`; **Delete** → `204 No Content` or `200`. :contentReference[oaicite:6]{index=6}  
2. Validation errors → **422** with structured JSON (field → message). :contentReference[oaicite:7]{index=7}  
3. Keep error messages helpful, not verbose; no secrets.

### D) Data Contracts
1. Document request/response shapes per endpoint (IDs, enums, required fields).  
2. Align naming (`client_id` vs `clientId`); map where necessary.  
3. Define the **lookup lists** for hearing dropdowns (enums or reference tables).

### E) Tests (Add/Update)
- **Unit/Integration (majority):**  
  - API client calls, reducers/stores, form validation, dropdown loaders.  
- **Focused E2E:**  
  - Hearings CRUD (incl. dropdown fetch + save).  
  - Cases CRUD path.  
  - Clients: Create/Edit/Save + Delete.  
  - Invoices: Create with Client/Case selection.  
  - Lawyers: View.  
Run these in CI; keep them fast. :contentReference[oaicite:8]{index=8}

---

## Fix Plan (Apply in Small Steps)

> **Step 0 (DRY-RUN):** Print intended file changes and updated routes. Do not modify code until this plan is displayed.

1) **Hearings**
- Ensure `/api/hearings` CRUD and `/api/lookups/hearings` (or equivalent) exist.  
- Wire UI actions and pass IDs correctly.  
- Implement dropdown loaders; show “no options” state if response is empty.  
- On save, handle 201/200 and refresh list; on validation, show 422 field errors.

2) **Cases**
- Confirm `/api/cases` CRUD; fix onClick bindings and `api.ts` calls.  
- Implement success/error UX + list refresh.

3) **Clients**
- **Delete:** verify method/URL/CSRF or auth; expect `204` or `200`. :contentReference[oaicite:9]{index=9}  
- **Create/Edit Save:** ensure body format correct (JSON or multipart); map field names; show 422 messages.

4) **Invoices**
- Add **Client** and **Case** selectors (typeahead if large datasets).  
- Validate both selected before submit; backend enforces the same.

5) **Lawyers**
- Wire **View** to correct route; handle 404 gracefully with UI message.

6) **Docs & Examples**
- For each fixed endpoint, add short API docs and `curl` examples.

7) **Feature Flag & Rollback**
- Gate any risky refactor behind a flag; include how to disable quickly. :contentReference[oaicite:10]{index=10}

---

## Example `curl` Smoke Tests

```bash
# Hearings list
curl -s -H "Authorization: Bearer <TOKEN>" http://<HOST>/api/hearings

# Create hearing (sample fields)
curl -s -X POST -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{"case_id":123,"date":"2025-09-05","duration":"60m","type":"جلسة","result":"مؤجلة"}' \
  http://<HOST>/api/hearings

# Cases list
curl -s -H "Authorization: Bearer <TOKEN>" http://<HOST>/api/cases

# Create client
curl -s -X POST -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{"name":"عميل تجريبي","phone":"+20123456789"}' \
  http://<HOST>/api/clients

# Delete client
curl -i -X DELETE -H "Authorization: Bearer <TOKEN>" http://<HOST>/api/clients/123

# Invoice with client/case
curl -s -X POST -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{"client_id":42,"case_id":777,"items":[{"desc":"رسوم","amount":1000}]}' \
  http://<HOST>/api/invoices

# Lawyer view
curl -s -H "Authorization: Bearer <TOKEN>" http://<HOST>/api/lawyers/55
```

## Deliverables
- /_fix_crud/plan.md — What was wrong + step-by-step changes.
- /_fix_crud/tests.md — Test plan + how to run locally/CI.
- **Updated code with**
  - Working Hearings/Cases/Clients CRUD.
  - Invoices: Client/Case selection.
  - Lawyers: View works.
- /_fix_crud/curl-examples.md — ready-to-run curls for QA. 

## Definition of Done
- All five areas function end-to-end (list, view, create, edit, delete).
- Hearings dropdowns populate correctly.
- Invoices require and persist Client & Case.
- Tests pass in CI; no regressions elsewhere (Reports untouched).
- HTTP codes and error messages are consistent and helpful. 

Start now by listing current routes for hearings, cases, clients, invoices, lawyers and mapping them to the frontend calls, then print the DRY-RUN plan.