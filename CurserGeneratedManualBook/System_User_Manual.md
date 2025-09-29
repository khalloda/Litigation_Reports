# Litigation Management System — Comprehensive System User Manual

Version: September 2025

## 1. About This System

The Litigation Management System is a bilingual (Arabic/English), RTL-friendly web application for end‑to‑end legal practice operations: client onboarding, matter/case tracking, hearings, invoices, documents, reports, and user/role administration. The system is deployed as a PHP backend with React static frontend on the same host and origin.

- Backend: PHP 8+, custom MVC-style controllers and models, MySQL database
- Frontend: React 18 + TypeScript, built into static assets served by PHP/Apache
- URL/Host: strictly single-origin on `lit.local` (development) and your production domain
- No CORS required or used; frontend and API are served together by the PHP server

Evidence (selected): `backend/api/index.php`, `src/App.tsx`, `docs/setup/development.md`, `docs/deployment/overview.md`, `Codex_Output/WORKFLOWS/KEY_USER_FLOWS.md`

## 2. Intended Audience

- Business users: Admins, Lawyers, Staff managing day-to-day operations
- System administrators: Super Admins handling users, permissions, and settings
- Operators/Support: Users responsible for deployments and environment configuration

## 3. Accessing the System

- Development: `http://lit.local/` (via WAMP/Apache and hosts entry)
- Production: Your domain or subdomain (same-origin PHP + static React files)

Navigation is provided via the sidebar and top navigation bar after login.

## 4. Authentication and User Roles

### 4.1 Login

1. Open `http://lit.local/`
2. You will be redirected to `/login` if unauthenticated
3. Enter email and password, then submit

Flow is handled by the frontend `Login` page with API `POST /api/auth/login` delegating to backend `AuthController`/`Auth`.

Evidence: `src/pages/auth/Login.tsx`, `backend/src/Controllers/AuthController.php`, `backend/src/Core/Auth.php`

### 4.2 Session/JWT

The backend generates a JWT on successful login and stores session context server-side for web usage. The frontend persists the token for API requests. Authentication checks exist in controllers, with a temporary bypass in development.

Evidence: `backend/src/Core/Auth.php`

### 4.3 Roles and Permissions

System roles:
- Super Admin: full system permissions
- Admin: full operations with some restrictions
- Lawyer: case-centric operations and reports
- Staff: limited operations

Frontend permission helpers: `src/hooks/usePermissions.ts`, mappings in `src/types/auth.ts`. Backend role permissions are also enforced in `Auth`.

Evidence: `backend/config/config.php`, `src/types/auth.ts`, `backend/src/Core/Auth.php`

## 5. Main Modules and Daily Tasks

The application uses a protected layout. After login, the default route is `/dashboard`. All modules are available via the sidebar.

Routes evidence: `src/App.tsx`

### 5.1 Dashboard

Purpose: Overview of totals, quick stats, and recent activity.

- Open: `Dashboard`
- Data: `GET /api/reports/dashboard`

Evidence: `src/pages/Dashboard.tsx`, `backend/api/index.php` (dashboard handler)

### 5.2 Clients

Purpose: Manage client records.

- Open: `Clients`
- Common actions: create, view, edit, search, export
- API: `/api/clients` (GET/POST), `/api/clients/{id}` (GET/PUT/DELETE)

Evidence: `src/pages/ClientsPage.tsx`, `backend/api/index.php`, `backend/src/Models/Client.php`

### 5.3 Cases

Purpose: Track legal matters linked to clients.

- Open: `Cases`
- Common actions: create matter, update status/category/priority, link client and lawyers
- API: `/api/cases` and `/api/cases/{id}`

Evidence: `src/pages/CasesPage.tsx`, `backend/src/Models/Case.php`, `backend/api/index.php`

### 5.4 Hearings

Purpose: Plan and record court hearings.

- Open: `Hearings`
- Common actions: create/edit hearing, assign lawyer(s), track outcomes
- API: `/api/hearings` and `/api/hearings/{id}`

Evidence: `src/pages/HearingsPage.tsx`, `backend/src/Controllers/HearingController.php`, `backend/src/Models/Hearing.php`

### 5.5 Lawyers

Purpose: Maintain lawyer directory and associations.

- Open: `Lawyers`
- Common actions: add/update lawyer, activate/deactivate, associate with cases/hearings
- API: `/api/lawyers`, `/api/lawyers/{id}`

Evidence: `src/pages/LawyersPage.tsx`, `backend/api/index.php`

### 5.6 Invoices

Purpose: Manage billing and track payments.

- Open: `Invoices`
- Common actions: create invoice, update status, export summaries
- API: `/api/invoices`, `/api/invoices/{id}`

Evidence: `src/pages/Invoices.tsx`, `backend/api/index.php`, `backend/src/Models/Invoice.php`

### 5.7 Documents

Purpose: Upload and manage documents related to clients, cases, hearings, invoices, and general files.

- Open: `Documents`
- Upload: Choose entity type and attach file (size/type validated)
- Storage: Files saved under backend uploads directory
- API: `/api/documents` (GET/POST), `/api/documents/{id}` (GET/PUT/DELETE), `/api/documents/{id}/download`

Evidence: `src/pages/Documents.tsx`, `backend/src/Controllers/DocumentController.php`, `backend/api/index.php`, `backend/uploads/documents/`

### 5.8 Reports

Purpose: Generate operational and client-specific reports.

- Open: `Reports`
- Client Report: select client, choose format (PDF preferred), and generate
- Dashboard stats: `/api/reports/dashboard`
- Client report API: `/api/reports/client-report?client_id=...&format=pdf&template=franke`

Evidence: `src/pages/ReportsPage.tsx`, `backend/src/Controllers/ReportController.php`, `backend/api/index.php`

### 5.9 Users and Settings

Purpose: User management and system settings (languages, currencies, court settings, etc.).

Evidence: `src/pages/Users.tsx`, `src/pages/Settings.tsx`, `backend/config/config.php`

## 6. Working With Reports

### 6.1 Client Report Generation (PDF)

Steps:
1. Go to `Reports`
2. From Clients list, select the client to report on
3. Choose format = PDF
4. Click Generate; a printable HTML opens in a new tab and triggers printing to PDF

Formats supported: PDF (preferred), JPG for snapshots. Templates include “Franke”.

Evidence: `src/pages/ReportsPage.tsx` (print window flow), `backend/src/Controllers/ReportController.php` (HTML→PDF generation logic)

### 6.2 Summary Dashboard

The dashboard aggregates counts and recent activity for quick insights.

Evidence: `backend/api/index.php` (dashboard handler)

## 7. Working With Documents (Uploads)

### 7.1 Upload Requirements

- Allowed file types and size are validated
- Files are stored under `backend/uploads/documents/`
- Metadata saved to the `documents` table

Evidence: `backend/src/Controllers/DocumentController.php`, `backend/api/index.php`, `database/migrations/create_documents_table.sql`

### 7.2 Upload Steps

1. Go to `Documents`
2. Click “New”/Upload
3. Fill title, description (optional), and classify document (type and related entity)
4. Attach file and submit
5. Verify success notice and that the file appears in the list

### 7.3 Downloading

- Use the download action to fetch stored files
- API: `/api/documents/{id}/download`

## 8. Language, RTL, and Accessibility

- Default language: Arabic; English supported
- RTL layout is the default (Arabic-first)
- Switch language via settings/navigation toggle where provided

Evidence: `backend/config/config.php` (DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES), i18n usage in frontend

## 9. Data Model Overview

Primary entities:
- Users, Clients, Lawyers, Cases, Hearings, Documents, Invoices

Useful references:
- `database/litigation_database.sql`
- `Codex_Output/DATABASE/DB_SCHEMA_MAP.md`
- `database/README.md`

## 10. Environment and Deployment (Operators)

### 10.1 Development Setup

Key points:
- WAMP/Apache hosts `lit.local`
- PHP 8+, MySQL, Node.js 18+ for building frontend
- React dev server at `http://lit.local:3001` proxied to PHP API `http://lit.local/api/` (dev only)
- Build outputs copied into `backend/public/`

Reference: `docs/setup/development.md`, `docs/deployment/overview.md`

### 10.2 Production Deployment (GoDaddy cPanel)

High-level steps:
1. Build frontend
2. Upload static files and backend PHP API to hosting
3. Configure database and `.env`/config
4. Test `http://yourdomain/api/ping` and app routes

Reference: `docs/deployment/overview.md`, `docs/deployment/godaddy.md`, `deploy/DEPLOYMENT_CHECKLIST.md`

## 11. Security & Privacy

- Single-origin deployment (no CORS); API and frontend on the same host
- Authentication required for protected resources
- JWT tokens with expiry; session support for web
- Logging enabled with configurable levels

Evidence: `backend/router.php`, `backend/src/Core/Auth.php`, `backend/config/config.php`, `Codex_Output/SECURITY_AND_PRIVACY.md`

## 12. Troubleshooting

### Login Issues
- Verify database connectivity and user status is active
- Check `POST /api/auth/login` responses in browser devtools

### API Errors
- Inspect `backend/logs/` and server error logs
- Confirm routes in `backend/api/index.php`

### File Upload Failures
- Confirm `backend/uploads/documents/` exists and is writable
- Check allowed types and size caps

### Report Generation
- Verify parameters (`client_id`, `format`, `template`)
- Ensure the print window is not blocked by the browser

## 13. Frequently Asked Questions (FAQ)

Q: Can we call the API from another origin?
A: No. The system is designed and configured to run as a same-origin app (no CORS).

Q: Where are the built frontend files served from?
A: From `backend/public/` along with `index.html` and assets.

Q: How do I export a client report as PDF?
A: Generate from `Reports` page with format `pdf`; the browser print dialog is triggered to save as PDF.

Q: How do I change language defaults?
A: See `backend/config/config.php` for supported languages and update UI toggles as needed.

---

For detailed technical references, consult the code paths included above and the documentation hub at `docs/`.


