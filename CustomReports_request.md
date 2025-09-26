# 🐞 Debug & Fix Reports “عرض” Button → 404 Error

You are a Principal Software Architect / Senior Developer with 10+ years experience.
There is a bug: clicking the “View” (عرض) button on the various report cards (Clients, Cases, Hearings, Custom) triggers an API request like `GET /api/reports/clients`, but the server responds with **404 (Not Found)**. The same for `/api/reports/cases`, `/api/reports/hearings`, and `/api/reports/custom?type=clients` etc.
Your job: investigate, diagnose, and fully fix the “عرض” button issue so reports can be fetched correctly
---

## Goals

1. Identify why the API endpoints are returning 404: missing route, wrong URL, wrong controller, bad path, or misconfigured routing.  
2. Ensure that for each report type (“clients”, “cases”, “hearings”, “custom”) there is a working endpoint consistent with what the frontend is calling, or adjust frontend to match backend.  
3. Make sure error handling is clear: if the report type is invalid, return meaningful error (e.g. 404 + JSON message), not silent failure.  
4. Add tests, logs, and API documentation so “عرض” works and future report endpoints are reliable.

---

## Requirements & Checks

For each of the following areas, verify and if needed fix:

| Area | What to Check / Fix |
|------|---------------------|
| **Backend Routes / Controllers** | - Check that backend defines `GET /api/reports/clients`, `cases`, `hearings`, `reports/custom?type=...` routes. <br> - Confirm controller names and paths match what frontend uses. <br> - Ensure request methods are GET, parameters match (query params, path params). <br> - Check any path prefixes or versioning (e.g. `/api/v1/reports/...`) that frontend might be missing or including incorrectly. |
| **Frontend Call URLs** | - Examine ReportsPage.tsx (or equivalent) to see what path is being called on click. <br> - Confirm the exact URL string matches the backend route. Includes correct base URL, possible prefix, query param syntax. <br> - Ensure token/auth header being sent properly and middleware enforces correct access. |
| **404 Error Logging / Server Setup** | - Check server logs when these GET requests arrive: is route matched or is the request not routing at all? <br> - If using Express / Laravel / etc, ensure the route file is loaded and middleware or route caching is not outdated. <br> - Confirm no misspellings or typos (e.g. “reports/custom” vs “report/custom”, singular vs plural). |
| **Permissions / Authorization** | - Sometimes routes exist but backend rejects unauthorized or forbidden, sending 404 instead of 401/403. Check if auth middleware could be hiding route. <br> - Ensure user roles or token scopes allow access to those report endpoints. |
| **CORS / Proxy / Base URL** | - Confirm the frontend is using the correct base URL. For example, if the backend is hosted on a different host or port, or with prefix `/api/v1`, the frontend must match. <br> - If you have setup proxy in development (e.g. React dev server proxy), ensure it covers `/api/reports/**`. |
| **Tests** | - Write or extend tests: curl / Postman calls to `GET /api/reports/clients`, etc, verify HTTP 200 or correct error code and correct data. <br> - Frontend unit / integration / E2E tests: simulate button click, mock API to respond correctly, check UI updates. <br> - Test invalid “type” query param in custom report (e.g. `custom?type=invalid`) to ensure backend handles gracefully. |

---

## Deliverables

- A report of findings: what routes were missing or incorrect, what the front end was expecting.  
- Patch / PR plan with changes to backend (routes/controllers) and/or frontend (URLs, query params) to fix the 404s.  
- Example working test requests (curl or Postman) for each report type (“clients”, “cases”, “hearings”, “custom”).  
- Update documentation (API docs / README) listing available report endpoints, parameters, valid types, expected response format.  
- Add frontend tests (unit / integration / E2E) around the “عرض” button behavior.  

---

## Constraints & Style

- Maintain backwards compatibility where possible. If you rename endpoints or parameters, either alias old ones with deprecation or handle both for a migration period.  
- Follow existing project conventions (naming, error response format, auth, logging).  
- Use clear commit messages like `fix(reports): add missing /api/reports/clients route`.  
- Ensure CI runs include new tests and that no existing features break.

---

## Example Test Requests

```bash
# Clients report
curl -v -X GET http://lit.local:8080/api/reports/clients \
  -H "Authorization: Bearer <YOUR_TOKEN>"
# Cases report
curl -v -X GET http://lit.local:8080/api/reports/cases \
  -H "Authorization: Bearer <YOUR_TOKEN>"
# Hearings report
curl -v -X GET http://lit.local:8080/api/reports/hearings \
  -H "Authorization: Bearer <YOUR_TOKEN>"
# Custom report example
curl -v -X GET "http://lit.local:8080/api/reports/custom?type=clients" \
  -H "Authorization: Bearer <YOUR_TOKEN>"
