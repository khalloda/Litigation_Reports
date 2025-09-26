# 🔄 Key User Flows - Litigation Management System

## 📊 **User Flow Overview**

The **Litigation Management System** supports comprehensive legal practice management workflows from client onboarding to case resolution. The system handles **6,388+ legal matters**, **20,000+ court hearings**, **540+ invoices**, and **247+ clients** with full Arabic/English bilingual support.

### **Primary User Roles**

| Role | Permissions | Key Workflows | Evidence |
|------|-------------|---------------|----------|
| **Super Admin** | 91 permissions | System management, user administration | `backend/config/config.php:L82-L86` |
| **Admin** | 84 permissions | Business operations, report generation | `backend/config/config.php:L87-L90` |
| **Lawyer** | 52 permissions | Case management, client interaction | `backend/config/config.php:L91-L94` |
| **Staff** | 52 permissions | Data entry, document management | `backend/config/config.php:L95-L98` |

## 🔐 **Authentication Flow**

### **User Login Workflow**

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as AuthController
    participant D as Database
    participant S as Session

    U->>F: Enter credentials
    F->>A: POST /api/auth/login
    A->>D: Validate user credentials
    D-->>A: User data + password hash
    A->>A: Verify password with bcrypt
    A->>S: Create JWT session
    S-->>A: JWT token
    A-->>F: Login success + token
    F->>F: Store token in localStorage
    F->>F: Redirect to dashboard
    F-->>U: Dashboard access granted
```

**Flow Details:**

| Step | Component | Action | Evidence |
|------|-----------|--------|----------|
| **1. Login Form** | Login.tsx | User enters credentials | `src/pages/auth/Login.tsx` |
| **2. API Call** | AuthController | POST /api/auth/login | `backend/src/Controllers/AuthController.php:L10-L41` |
| **3. Validation** | Validator | Input validation | `backend/src/Core/Validator.php` |
| **4. Authentication** | Auth class | Credential verification | `backend/src/Core/Auth.php` |
| **5. Session Creation** | JWT | Token generation | `backend/config/config.php:L25-L27` |
| **6. Response** | Frontend | Token storage and redirect | `src/components/auth/AuthProvider.tsx` |

**Evidence**: `src/pages/auth/Login.tsx`, `backend/src/Controllers/AuthController.php:L10-L41`, `backend/src/Core/Auth.php`, `src/components/auth/AuthProvider.tsx`

## 👥 **Client Management Flow**

### **Client Onboarding Workflow**

```mermaid
sequenceDiagram
    participant L as Lawyer
    participant F as Frontend
    participant C as ClientController
    participant D as Database
    participant N as Notification

    L->>F: Navigate to Clients page
    F->>C: GET /api/clients
    C->>D: Query clients table
    D-->>C: Client list
    C-->>F: Client data
    F-->>L: Display client list
    
    L->>F: Click "Add New Client"
    F->>F: Open ClientModal
    L->>F: Fill client form
    F->>C: POST /api/clients
    C->>D: Insert new client
    D-->>C: Client created
    C->>N: Send success notification
    N-->>F: Success message
    F->>F: Refresh client list
    F-->>L: Client added successfully
```

**Flow Details:**

| Step | Component | Action | Evidence |
|------|-----------|--------|----------|
| **1. Client List** | ClientsPage | Display existing clients | `src/pages/ClientsPage.tsx` |
| **2. Add Client** | ClientModal | Open client creation form | `src/components/modals/ClientModal.tsx` |
| **3. Form Submission** | ClientController | POST /api/clients | `backend/src/Controllers/ClientController.php` |
| **4. Data Validation** | Validator | Client data validation | `backend/src/Core/Validator.php` |
| **5. Database Insert** | Client Model | Create client record | `backend/src/Models/Client.php` |
| **6. Success Response** | Frontend | Show success message | `src/pages/ClientsPage.tsx` |

**Evidence**: `src/pages/ClientsPage.tsx`, `src/components/modals/ClientModal.tsx`, `backend/src/Controllers/ClientController.php`, `backend/src/Models/Client.php`

## ⚖️ **Case Management Flow**

### **Case Creation and Management Workflow**

```mermaid
sequenceDiagram
    participant L as Lawyer
    participant F as Frontend
    participant C as CaseController
    participant D as Database
    participant H as HearingController

    L->>F: Navigate to Cases page
    F->>C: GET /api/cases
    C->>D: Query cases with client info
    D-->>C: Case list with relationships
    C-->>F: Case data
    F-->>L: Display case list
    
    L->>F: Click "Add New Case"
    F->>F: Open case form
    L->>F: Select client and fill case details
    F->>C: POST /api/cases
    C->>D: Insert new case
    D-->>C: Case created
    C-->>F: Case data
    F->>F: Redirect to case details
    F-->>L: Case created successfully
    
    L->>F: Schedule hearing
    F->>H: POST /api/hearings
    H->>D: Insert hearing record
    D-->>H: Hearing created
    H-->>F: Hearing data
    F-->>L: Hearing scheduled
```

**Flow Details:**

| Step | Component | Action | Evidence |
|------|-----------|--------|----------|
| **1. Case List** | CasesPage | Display cases with client info | `src/pages/CasesPage.tsx` |
| **2. Case Creation** | CaseController | POST /api/cases | `backend/src/Controllers/CaseController.php` |
| **3. Client Selection** | Client dropdown | Select existing client | `src/pages/CasesPage.tsx` |
| **4. Case Details** | Case form | Fill case information | `src/pages/CasesPage.tsx` |
| **5. Database Insert** | Case Model | Create case record | `backend/src/Models/Case.php` |
| **6. Hearing Scheduling** | HearingController | Schedule court hearing | `backend/src/Controllers/HearingController.php` |

**Evidence**: `src/pages/CasesPage.tsx`, `backend/src/Controllers/CaseController.php`, `backend/src/Models/Case.php`, `backend/src/Controllers/HearingController.php`

## 🏛️ **Hearing Management Flow**

### **Court Hearing Workflow**

```mermaid
sequenceDiagram
    participant L as Lawyer
    participant F as Frontend
    participant H as HearingController
    participant D as Database
    participant C as CaseController

    L->>F: Navigate to Hearings page
    F->>H: GET /api/hearings
    H->>D: Query hearings with case info
    D-->>H: Hearing list
    H-->>F: Hearing data
    F-->>L: Display hearing calendar
    
    L->>F: Click "Add New Hearing"
    F->>F: Open hearing form
    L->>F: Select case and fill hearing details
    F->>H: POST /api/hearings
    H->>D: Insert hearing record
    D-->>H: Hearing created
    H-->>F: Hearing data
    F-->>L: Hearing scheduled
    
    Note over L,F: After court hearing
    L->>F: Update hearing outcome
    F->>H: PUT /api/hearings/{id}
    H->>D: Update hearing record
    D-->>H: Hearing updated
    H->>C: Update case status if needed
    H-->>F: Hearing updated
    F-->>L: Outcome recorded
```

**Flow Details:**

| Step | Component | Action | Evidence |
|------|-----------|--------|----------|
| **1. Hearing List** | HearingsPage | Display upcoming hearings | `src/pages/HearingsPage.tsx` |
| **2. Hearing Creation** | HearingController | POST /api/hearings | `backend/src/Controllers/HearingController.php` |
| **3. Case Selection** | Case dropdown | Select related case | `src/pages/HearingsPage.tsx` |
| **4. Hearing Details** | Hearing form | Fill hearing information | `src/pages/HearingsPage.tsx` |
| **5. Outcome Recording** | HearingController | PUT /api/hearings/{id} | `backend/src/Controllers/HearingController.php` |
| **6. Case Status Update** | Case Model | Update case based on hearing | `backend/src/Models/Case.php` |

**Evidence**: `src/pages/HearingsPage.tsx`, `backend/src/Controllers/HearingController.php`, `backend/src/Models/Hearing.php`, `backend/src/Models/Case.php`

## 💰 **Invoice Management Flow**

### **Billing and Payment Workflow**

```mermaid
sequenceDiagram
    participant A as Admin
    participant F as Frontend
    participant I as InvoiceController
    participant D as Database
    participant R as ReportController

    A->>F: Navigate to Invoices page
    F->>I: GET /api/invoices
    I->>D: Query invoices with status
    D-->>I: Invoice list
    I-->>F: Invoice data
    F-->>A: Display invoice list
    
    A->>F: Click "Create Invoice"
    F->>F: Open invoice form
    A->>F: Fill invoice details
    F->>I: POST /api/invoices
    I->>D: Insert invoice record
    D-->>I: Invoice created
    I-->>F: Invoice data
    F-->>A: Invoice created
    
    A->>F: Send invoice to client
    F->>I: PUT /api/invoices/{id}
    I->>D: Update invoice status
    D-->>I: Invoice updated
    I-->>F: Invoice sent
    F-->>A: Invoice sent notification
    
    Note over A,F: Payment received
    A->>F: Mark invoice as paid
    F->>I: PUT /api/invoices/{id}
    I->>D: Update payment status
    D-->>I: Payment recorded
    I-->>F: Payment confirmed
    F-->>A: Payment recorded
```

**Flow Details:**

| Step | Component | Action | Evidence |
|------|-----------|--------|----------|
| **1. Invoice List** | Invoices page | Display invoices with status | `src/pages/Invoices.tsx` |
| **2. Invoice Creation** | InvoiceController | POST /api/invoices | `backend/src/Controllers/InvoiceController.php` |
| **3. Invoice Details** | Invoice form | Fill billing information | `src/pages/Invoices.tsx` |
| **4. Invoice Sending** | InvoiceController | PUT /api/invoices/{id} | `backend/src/Controllers/InvoiceController.php` |
| **5. Payment Recording** | InvoiceController | Update payment status | `backend/src/Controllers/InvoiceController.php` |
| **6. Financial Reporting** | ReportController | Generate payment reports | `backend/src/Controllers/ReportController.php` |

**Evidence**: `src/pages/Invoices.tsx`, `backend/src/Controllers/InvoiceController.php`, `backend/src/Models/Invoice.php`, `backend/src/Controllers/ReportController.php`

## 📄 **Document Management Flow**

### **Document Upload and Management Workflow**

```mermaid
sequenceDiagram
    participant S as Staff
    participant F as Frontend
    participant D as DocumentController
    participant FS as FileSystem
    participant DB as Database

    S->>F: Navigate to Documents page
    F->>D: GET /api/documents
    D->>DB: Query documents table
    DB-->>D: Document list
    D-->>F: Document data
    F-->>S: Display document list
    
    S->>F: Click "Upload Document"
    F->>F: Open file upload dialog
    S->>F: Select file and fill details
    F->>D: POST /api/documents/upload
    D->>FS: Save file to uploads/
    FS-->>D: File saved
    D->>DB: Insert document record
    DB-->>D: Document created
    D-->>F: Document data
    F-->>S: Document uploaded
    
    S->>F: Search documents
    F->>D: GET /api/documents?search=term
    D->>DB: Search document descriptions
    DB-->>D: Search results
    D-->>F: Filtered documents
    F-->>S: Display search results
```

**Flow Details:**

| Step | Component | Action | Evidence |
|------|-----------|--------|----------|
| **1. Document List** | Documents page | Display document library | `src/pages/Documents.tsx` |
| **2. File Upload** | DocumentController | POST /api/documents/upload | `backend/src/Controllers/DocumentController.php` |
| **3. File Validation** | File validation | Check file type and size | `backend/config/config.php:L35-L37` |
| **4. File Storage** | File system | Save to uploads directory | `backend/uploads/documents/` |
| **5. Database Record** | Document Model | Create document record | `backend/src/Models/Document.php` |
| **6. Document Search** | DocumentController | Search document content | `backend/src/Controllers/DocumentController.php` |

**Evidence**: `src/pages/Documents.tsx`, `backend/src/Controllers/DocumentController.php`, `backend/src/Models/Document.php`, `backend/uploads/documents/`

## 📊 **Reporting Flow**

### **Report Generation Workflow**

```mermaid
sequenceDiagram
    participant A as Admin
    participant F as Frontend
    participant R as ReportController
    participant D as Database
    participant E as Export

    A->>F: Navigate to Reports page
    F->>R: GET /api/reports/dashboard
    R->>D: Query summary statistics
    D-->>R: Dashboard data
    R-->>F: Summary statistics
    F-->>A: Display dashboard
    
    A->>F: Select report type
    F->>F: Open report filters
    A->>F: Set date range and filters
    F->>R: GET /api/reports/cases?filters
    R->>D: Query filtered data
    D-->>R: Report data
    R-->>F: Report results
    F-->>A: Display report
    
    A->>F: Click "Export Report"
    F->>R: GET /api/reports/cases?format=pdf
    R->>D: Query report data
    D-->>R: Data for export
    R->>E: Generate PDF/Excel
    E-->>R: Export file
    R-->>F: Download link
    F-->>A: Download report
```

**Flow Details:**

| Step | Component | Action | Evidence |
|------|-----------|--------|----------|
| **1. Dashboard** | ReportsPage | Display summary statistics | `src/pages/ReportsPage.tsx` |
| **2. Report Filters** | Report form | Set report parameters | `src/pages/ReportsPage.tsx` |
| **3. Data Query** | ReportController | GET /api/reports/cases | `backend/src/Controllers/ReportController.php` |
| **4. Data Processing** | Report Model | Process and format data | `backend/src/Models/Report.php` |
| **5. Export Generation** | Export service | Generate PDF/Excel | `backend/src/Controllers/ReportController.php` |
| **6. File Download** | Frontend | Download generated report | `src/pages/ReportsPage.tsx` |

**Evidence**: `src/pages/ReportsPage.tsx`, `backend/src/Controllers/ReportController.php`, `backend/src/Models/Report.php`

## 🔧 **Error Handling and Recovery**

### **Error Flow Patterns**

| Error Type | Handling | Recovery | Evidence |
|------------|----------|----------|----------|
| **Authentication Errors** | Redirect to login | Re-authentication | `src/components/auth/ProtectedRoute.tsx` |
| **Validation Errors** | Form error display | User correction | `src/components/FormInput.tsx` |
| **Network Errors** | Retry mechanism | Automatic retry | `src/services/api.ts` |
| **Permission Errors** | Access denied message | Role-based access | `src/components/auth/PermissionGate.tsx` |

### **Error Recovery Workflows**

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant E as ErrorHandler

    U->>F: Perform action
    F->>A: API request
    A-->>F: Error response
    F->>E: Handle error
    E->>E: Determine error type
    E->>F: Show appropriate message
    F-->>U: Error notification
    
    alt Network Error
        E->>F: Retry request
        F->>A: Retry API call
        A-->>F: Success response
        F-->>U: Action completed
    else Validation Error
        E->>F: Highlight form fields
        F-->>U: Show validation errors
    else Permission Error
        E->>F: Show access denied
        F-->>U: Permission message
    end
```

## 🌐 **Multi-language Workflow**

### **Language Switching Flow**

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant L as LanguageSwitcher
    participant I as i18next
    participant R as RTL

    U->>L: Click language toggle
    L->>I: Change language
    I->>I: Load new translations
    I-->>L: Language changed
    L->>R: Update RTL direction
    R->>F: Apply RTL/LTR styles
    F->>F: Update all text content
    F-->>U: Interface in new language
```

**Flow Details:**

| Step | Component | Action | Evidence |
|------|-----------|--------|----------|
| **1. Language Toggle** | LanguageSwitcher | User clicks language button | `src/components/LanguageSwitcher.tsx` |
| **2. Language Change** | i18next | Change application language | `src/i18n/index.ts:L18` |
| **3. Translation Load** | i18next | Load new language translations | `src/i18n/locales/` |
| **4. RTL Update** | useRTL hook | Update text direction | `src/hooks/useRTL.ts` |
| **5. Style Application** | CSS | Apply RTL/LTR styles | `src/styles/rtl.scss` |
| **6. Content Update** | Components | Update all text content | `src/components/` |

**Evidence**: `src/components/LanguageSwitcher.tsx`, `src/i18n/index.ts:L18`, `src/hooks/useRTL.ts`, `src/styles/rtl.scss`

## 📱 **Mobile Responsive Workflows**

### **Mobile Navigation Flow**

| Device | Navigation | Features | Evidence |
|--------|------------|----------|----------|
| **Mobile** | Collapsible sidebar | Touch-friendly navigation | `src/components/layout/Sidebar.tsx` |
| **Tablet** | Responsive layout | Optimized for touch | `src/styles/main.scss` |
| **Desktop** | Full sidebar | Complete navigation | `src/components/layout/Layout.tsx` |

### **Mobile Form Workflow**

```mermaid
sequenceDiagram
    participant U as User (Mobile)
    participant F as Frontend
    participant M as MobileForm
    participant V as Validation

    U->>F: Open form on mobile
    F->>M: Render mobile-optimized form
    M-->>F: Mobile form layout
    F-->>U: Touch-friendly form
    
    U->>M: Fill form fields
    M->>V: Validate input
    V-->>M: Validation result
    M-->>U: Show validation feedback
    
    U->>M: Submit form
    M->>F: Submit form data
    F-->>U: Success/error message
```

---

**Evidence Summary**: `src/pages/auth/Login.tsx`, `src/pages/ClientsPage.tsx`, `src/pages/CasesPage.tsx`, `src/pages/HearingsPage.tsx`, `src/pages/Invoices.tsx`, `src/pages/Documents.tsx`, `src/pages/ReportsPage.tsx`, `backend/src/Controllers/`, `backend/src/Models/`, `src/components/auth/`, `src/components/layout/`
