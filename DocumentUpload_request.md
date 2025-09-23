# ⚙️ Debug & Fix “/api/documents” Upload 400 Error
You are a Principal Software Architect / Senior Developer with 10+ years experience.
Your task is to investigate, diagnose, and fully fix the issue where uploading documents fails, giving a **400 (Bad Request)** from `POST /api/documents`.
As the same Document Upload Faliure issue is still there. 
Note that the Edit function is working now.
---
## Goals
1. Identify the root cause(s) of the 400 error.  
2. Write precise changes to frontend and backend to resolve it.  
3. Ensure uploads work reliably under expected conditions (correct field names, size limits, headers, file type).  
4. Add tests, logs, and documentation to prevent regressions.
---
## Requirements & Checks
For each, verify and if needed, fix:
| Area | What to Check / Fix |
|------|---------------------|
| **Route / Controller / Validation** | Locate `POST /api/documents` backend route; inspect file upload handler, required field names; inspect validation rules (file required, mimetypes, max size). |
| **HTTP Request Structure** | Confirm the frontend sends a `multipart/form-data` request. Ensure file field name matches backend (e.g. `file`, `document`, etc.). Ensure other required fields are included. Make sure **Content-Type** header is correctly set (with boundary) by browser or client library, not manually if custom code. |
| **Authentication / Headers** | Confirm `Authorization: Bearer <token>` (or whichever scheme) is sent correctly. Ensure any CSRF or session headers match what server expects. |
| **Server Limits** | Check upload limits: `php.ini` (`upload_max_filesize`, `post_max_size`) if using PHP; or body size limits if Node.js/Express. Also check web server (nginx/apache) limits (e.g. `client_max_body_size`). |
| **Error Logging / Response Handling** | Backend should log details of the request: headers, Content-Length, whether `hasFile(...)` false, validation error messages. Ensure server returns detailed JSON error messages (ideally 422 for validation, not generic 400) so client can show meaningful feedback. |
| **Frontend Behavior** | In the React code (or front end), build FormData correctly. Do not override `Content-Type` header manually. Ensure file is not empty. Check for large files / progress. |
| **Cross Origin / CORS** | If frontend origin differs from backend, ensure OPTIONS preflight works. Backend must allow required headers, methods, origins. |
| **Test Cases** | Create minimal test via `curl` or Postman to mimic frontend request. Confirm it passes. Also test invalid scenarios (wrong field, missing file, too large file). |
---
## Deliverables
- A report of findings: **what was wrong and why**.  
- A patch / PR plan with specific file changes: frontend and backend.  
- Sample test (curl or Postman) to demonstrate working upload.  
- Updated documentation in code or README explaining file upload endpoint: fields required, max size, error codes.  
- Optional: add automated test(s) for upload endpoint (unit or integration).
---
## Constraints & Style
- Do not make breaking changes without fallback. If you change field names, support old ones temporarily or provide migration notes.  
- Follow existing code conventions (error structure, logging, response shapes).  
- Use clear commit messages (e.g., `fix(upload): correct field name and increase size limit`).  
- Ensure backward compatibility unless client requests breaking change.  
---
## Example Test
```bash
curl -v -X POST http://YOUR_DOMAIN/api/documents \
  -H "Authorization: Bearer <PASTE_TOKEN_HERE>" \
  -F "file=@/path/to/your/document.pdf" \
  -F "title=Sample Document"
Replace file and title with the exact field names backend expects.
## Additional Frontend Testing Responsibilities (File Upload)
In addition to backend/debug responsibilities, you will also ensure the frontend part of document upload is fully tested. That includes:
| Test Type | What to Test / Example Scenarios |
|-----------|-----------------------------------|
| **Unit / Component Tests** | - Test the file upload UI component in isolation: ensure that when no file is selected, upload button is disabled. <br> - Ensure correct validation messages show when file exceeds size limit or wrong file type. <br> - Test error state display (e.g. server responds 400/422). |
| **Integration Tests** | - Test that the upload component calls the API with correct format (multipart form, correct field names). <br> - Mock or stub API using e.g. MSW (Mock Service Worker) to simulate both success and error responses. <br> - Check that after successful upload, the UI updates (document list refreshes, status shown). |
| **End-to-End (E2E) / UI Tests** | - Using tools like Cypress / Playwright / Selenium: simulate the full flow: select a file (via file dialog or programmatic file input), submit form, see success message / uploaded document listed. <br> - Test for error cases: missing file, wrong file type, too large file, authentication failure. <br> - Test in various browsers if cross-browser issues are possible. |
| **Accessibility / UX** | - Ensure the file input has appropriate labels, aria attributes. <br> - Keyboard navigation: user can tab to file input and activate it. <br> - Screen reader announcements for error/success. |
| **Visual Regression (optional but beneficial)** | - If UI component’s styling matters, ensure that changes to styles (button disabled/enabled, error red outlines, upload progress, etc.) are caught. |
| **Test Data & Fixtures** | - Use sample small files, large files, wrong MIME types, possibly empty files. <br> - Use fixtures for mocking upload responses. |
---
## Test Tools & Setup Suggestions
- Use **React Testing Library** (or equivalent) for unit/component/integration.  
- Use **MSW** or equivalent to mock the backend responses for frontend tests.  
- Use **Cypress / Playwright** for E2E browser tests.  
- Include **automatic screenshot/diff** if visual changes matter.  
- Ensure test coverage includes upload limits, field names mismatch, error message content.
---
## Where in the Workflow
1. Write or augment unit/component tests before or during development of upload feature.  
2. Add integration tests when mocking backend endpoints.  
3. E2E tests should run in CI to catch regressions in the full upload flow.  
---
Please include a section in your deliverables named **Frontend Upload Tests** with:
- Test plan (scenarios, error flows).  
- Example test files / code for unit/component/integration/E2E.  
- How to run the tests locally and in CI.  
- Ensure tests pass and are part of the test suite.
Please start now by examining the backend controller/route code and frontend upload code, listing what mismatches or missing pieces you find. Then propose the fixes and apply them.