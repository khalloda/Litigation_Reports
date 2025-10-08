# Key User Workflows

## 📊 Overview

End-to-end user workflows with sequence diagrams for critical business processes in the Litigation Management System.

---

## 🔐 Workflow 1: User Login & Authentication

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant React as React SPA
    participant API as PHP API
    participant Auth as Auth Service
    participant DB as MySQL

    User->>Browser: Navigate to http://lit.local:3005
    Browser->>React: Load SPA
    React->>React: Check localStorage for token
    React->>React: No token → Redirect to /login
    
    User->>React: Enter email & password
    User->>React: Click "Login"
    React->>React: Validate with Zod schema
    
    React->>API: POST /api/auth/login<br/>{email, password}
    API->>Auth: Auth::login()
    Auth->>DB: SELECT * FROM users WHERE email=?
    DB-->>Auth: User record
    Auth->>Auth: password_verify(input, hash)
    
    alt Password Valid
        Auth->>Auth: Generate JWT token
        Auth->>DB: UPDATE users SET last_login=NOW()
        Auth->>Auth: Start PHP session
        Auth-->>API: {user, token}
        API-->>React: 200 OK {success: true, data}
        React->>React: Store token in localStorage
        React->>React: Set AuthContext state
        React->>React: Redirect to /dashboard
        Browser->>User: Show Dashboard
    else Password Invalid
        Auth-->>API: false
        API-->>React: 401 Unauthorized
        React->>Browser: Show error toast
    end
```

**Files Involved:**
- `src/pages/auth/Login.tsx` - Login UI
- `src/services/api.ts:L100-L130` - API client
- `backend/api/index.php:L42-L48` - Route handler
- `backend/src/Core/Auth.php:L11-L41` - Auth logic
- `backend/src/Models/User.php` - User model

**Evidence:** Component and API file structure

---

## 📝 Workflow 2: Create New Case

```mermaid
sequenceDiagram
    actor Lawyer
    participant UI as Cases Page
    participant Modal as Case Modal
    participant API as API Service
    participant Backend as Case Controller
    participant DB as MySQL

    Lawyer->>UI: Click "New Case" button
    UI->>Modal: Open CaseModal (isOpen=true)
    Modal->>Modal: Initialize empty form
    
    Lawyer->>Modal: Fill case details<br/>(client, matter, dates)
    Lawyer->>Modal: Click "Save"
    
    Modal->>Modal: Validate form (react-hook-form + Zod)
    
    alt Validation Passes
        Modal->>API: POST /api/cases<br/>{case_data}
        API->>API: Add Authorization header
        API->>Backend: handleCreateCase()
        Backend->>Backend: Validate input (Validator)
        Backend->>Backend: Authorize (check role)
        Backend->>DB: INSERT INTO cases ...
        DB-->>Backend: Insert ID
        Backend-->>API: 201 Created {success, data: case}
        API-->>Modal: Success response
        Modal->>Modal: Close modal
        Modal->>UI: Trigger refresh
        UI->>API: GET /api/cases (reload list)
        UI->>Lawyer: Show success toast
    else Validation Fails
        Modal->>Lawyer: Show validation errors
    end
```

**Files Involved:**
- `src/pages/CasesPage.tsx` - List page
- `src/components/modals/CaseModal.tsx` - Form modal
- `src/services/api.ts` - API client
- `backend/api/index.php:L60-L69` - Router
- `backend/src/Controllers/CaseController.php` - Business logic
- `backend/src/Models/Case.php` - Data access

---

## 👤 Workflow 3: Client Management with Logo Upload

```mermaid
sequenceDiagram
    actor User
    participant UI as Clients Page
    participant Modal as Client Modal
    participant Upload as FileUpload Component
    participant API as API Service
    participant Backend as Client Controller
    participant FS as File System

    User->>UI: Click "New Client"
    UI->>Modal: Open ClientModal
    
    User->>Modal: Enter client name (AR/EN)
    User->>Upload: Drag & drop logo image
    Upload->>Upload: Validate file (type, size)
    Upload->>Upload: Preview image
    
    User->>Modal: Click "Save"
    Modal->>Modal: Prepare FormData with file
    Modal->>API: POST /api/clients<br/>FormData (multipart)
    
    API->>Backend: handleCreateClient()
    Backend->>FS: Save logo to uploads/
    FS-->>Backend: File path
    Backend->>Backend: Create client record with logo path
    Backend->>Backend: INSERT INTO clients ...
    Backend-->>API: 201 Created
    API-->>Modal: Success
    Modal->>UI: Refresh client list
    UI->>User: Show success + preview logo
```

**Files Involved:**
- `src/components/modals/ClientModal.tsx`
- `src/components/common/FileUpload.tsx`
- `backend/src/Controllers/ClientController.php`

---

## 📊 Workflow 4: Generate Client-Specific Report

```mermaid
sequenceDiagram
    actor User
    participant UI as Reports Page
    participant Modal as ClientReportModal
    participant API as Reports API
    participant PDF as jsPDF Library
    participant DB as MySQL

    User->>UI: Navigate to Reports page
    UI->>UI: Load available clients
    
    User->>Modal: Click "Client-Specific Report"
    Modal->>Modal: Open modal
    Modal->>Modal: Show client dropdown
    
    User->>Modal: Select client
    User->>Modal: Select date range
    User->>Modal: Choose columns to include
    User->>Modal: Click "Generate Report"
    
    Modal->>API: GET /reports/client-specific<br/>?client_id=X&start=...&end=...
    API->>DB: Complex JOIN query<br/>(cases, hearings, invoices)
    DB-->>API: Report dataset
    API-->>Modal: JSON data
    
    Modal->>Modal: Render data table in UI
    User->>User: Review report
    
    User->>Modal: Click "Export PDF"
    Modal->>PDF: new jsPDF()
    Modal->>PDF: Add company logo (base64)
    Modal->>PDF: Add Arabic header text
    Modal->>PDF: autoTable(reportData)
    Modal->>PDF: Add footer (branding)
    PDF-->>Modal: PDF Blob
    Modal->>Modal: Download file
    Modal->>User: PDF downloaded
```

**Files Involved:**
- `src/pages/ReportsPage.tsx`
- `src/components/ClientSpecificReportModal.tsx`
- `src/utils/exportUtils.ts` - PDF generation
- `backend/src/Controllers/ReportController.php`

**Evidence:** Component structure, `package.json:L116-L117` (jsPDF)

---

## 🔄 Workflow 5: Court Hearing Workflow

```mermaid
sequenceDiagram
    actor Lawyer
    participant UI as Hearings Page
    participant Modal as Hearing Modal
    participant API as API Service
    participant Email as Email System (Optional)

    Note over Lawyer: View upcoming hearings
    Lawyer->>UI: Navigate to Hearings
    UI->>API: GET /api/hearings?date_from=today
    API-->>UI: Upcoming hearings list
    
    Note over Lawyer: After court session
    Lawyer->>UI: Click "Edit" on hearing
    UI->>Modal: Open with hearing data
    Modal->>Modal: Pre-fill form
    
    Lawyer->>Modal: Enter hearing decision
    Lawyer->>Modal: Select outcome (won/lost/postponed)
    Lawyer->>Modal: Add lawyer notes
    Lawyer->>Modal: Set next hearing date (if postponed)
    Lawyer->>Modal: Click "Save"
    
    Modal->>API: PUT /api/hearings/:id
    API->>API: Update hearing record
    API->>API: Update case status (if final decision)
    API-->>Modal: Success
    
    opt Email notifications enabled
        API->>Email: Send notification to client
    end
    
    Modal->>UI: Close and refresh
    UI->>Lawyer: Show updated hearing
```

**Files Involved:**
- `src/pages/HearingsPage.tsx`
- `src/components/modals/HearingModal.tsx`
- `backend/src/Controllers/HearingController.php`

---

## 💰 Workflow 6: Invoice Generation & Payment Tracking

```mermaid
sequenceDiagram
    actor Admin
    participant UI as Invoices Page
    participant Modal as Invoice Modal
    participant API as Invoice API
    participant DB as MySQL

    Admin->>UI: Click "New Invoice"
    UI->>Modal: Open InvoiceModal
    
    Modal->>API: GET /invoices/options
    API->>DB: Get clients & cases for dropdowns
    DB-->>API: Options data
    API-->>Modal: Dropdown options
    
    Admin->>Modal: Select client
    Modal->>Modal: Filter cases by client
    Admin->>Modal: Select case
    Admin->>Modal: Enter amount & details
    Admin->>Modal: Select lawyers & shares
    Admin->>Modal: Click "Save"
    
    Modal->>API: POST /api/invoices
    API->>DB: BEGIN TRANSACTION
    API->>DB: INSERT INTO invoices
    API->>DB: INSERT INTO lawyer_invoice_shares (multiple)
    API->>DB: COMMIT
    DB-->>API: Success
    API-->>Modal: 201 Created with invoice_number
    
    Modal->>UI: Close and refresh
    UI->>UI: Show new invoice in list
    UI->>Admin: Success notification
```

**Files Involved:**
- `src/pages/Invoices.tsx`
- `backend/src/Controllers/InvoiceController.php`
- Database tables: `invoices`, `lawyer_invoice_shares`

---

## 🌍 Workflow 7: Language Switching

```mermaid
sequenceDiagram
    actor User
    participant UI as Any Page
    participant Switch as LanguageSwitcher
    participant i18n as i18next
    participant Storage as localStorage

    User->>Switch: Click language toggle
    Switch->>i18n: i18n.changeLanguage('en')
    i18n->>i18n: Load English translations
    i18n->>Storage: setItem('language', 'en')
    i18n->>UI: Trigger re-render
    
    UI->>UI: Update text direction (LTR)
    UI->>UI: Re-render all components
    UI->>UI: Apply LTR styles
    
    Note over User: All text now in English
    
    User->>Switch: Toggle back to Arabic
    Switch->>i18n: i18n.changeLanguage('ar')
    i18n->>Storage: setItem('language', 'ar')
    UI->>UI: Update text direction (RTL)
    UI->>User: Display in Arabic (RTL)
```

**Files Involved:**
- `src/components/ui/LanguageSwitcher.tsx`
- `src/i18n/index.ts`
- `src/styles/rtl.scss`

---

## 📱 Workflow 8: Document Upload

```mermaid
sequenceDiagram
    actor User
    participant UI as Documents Page
    participant Upload as FileUpload
    participant API as Document API
    participant Validator as File Validator
    participant FS as File System

    User->>UI: Navigate to Documents
    User->>Upload: Drag file (PDF/DOC)
    
    Upload->>Upload: Validate file type
    Upload->>Upload: Check file size (< 50MB)
    
    alt Valid File
        Upload->>Upload: Show preview
        User->>Upload: Click "Upload"
        
        Upload->>API: POST /api/documents<br/>FormData
        API->>Validator: Validate file
        Validator->>Validator: Check MIME type
        Validator->>Validator: Check extensions
        
        API->>FS: Save to uploads/documents/
        FS-->>API: File path
        API->>DB: INSERT INTO documents
        DB-->>API: Document ID
        API-->>Upload: 201 Created
        Upload->>UI: Show success
    else Invalid File
        Upload->>User: Show error message
    end
```

**Files Involved:**
- `src/pages/Documents.tsx`
- `src/components/common/FileUpload.tsx`
- `backend/src/Controllers/DocumentController.php`

---

## 🔒 Error Handling & Recovery

### Common Error Paths

1. **Session Timeout:**
   - JWT expires after 1 hour
   - User redirected to login
   - Show "Session expired" message

2. **Permission Denied:**
   - 403 response from API
   - Show "Access denied" toast
   - Redirect to allowed page

3. **Network Error:**
   - Axios timeout (10 seconds)
   - Retry mechanism (implied)
   - Show "Connection error" message

4. **Validation Error:**
   - 400 response with error details
   - Highlight invalid fields
   - Display error messages

**Evidence:** `src/services/api.ts` error handling patterns

---

## 🎯 Workflow Complexity Assessment

| Workflow | Steps | Complexity | Error Paths | Evidence |
|----------|-------|------------|-------------|----------|
| **Login** | 5 steps | Simple | 2 paths | Standard flow |
| **Create Case** | 8 steps | Medium | 3 paths | CRUD pattern |
| **Generate Report** | 12 steps | Complex | 4 paths | Multi-step process |
| **Upload Document** | 7 steps | Medium | 3 paths | File handling |
| **Language Switch** | 4 steps | Simple | 0 paths | UI only |

---

## 📋 Critical Paths (Must Always Work)

1. **Login** ← Blocks all other functionality
2. **View Cases/Clients** ← Core business value
3. **Create Hearing** ← Daily operations
4. **Generate Reports** ← Business reporting needs

---

**Evidence Base:** Component structure, API routes, architecture analysis

