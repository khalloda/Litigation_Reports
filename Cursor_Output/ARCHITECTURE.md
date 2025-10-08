# System Architecture

## 📐 Architectural Overview

The Litigation Management System implements a **traditional 3-tier MVC architecture** with a modern Single Page Application (SPA) frontend. The system separates presentation (React), business logic (PHP MVC), and data (MySQL) into distinct layers with well-defined interfaces.

**Architectural Style:** Layered Architecture (3-Tier)  
**Communication Pattern:** RESTful HTTP/JSON  
**State Management:** Client-side (React Context + React Query) + Server-side (PHP Sessions + JWT)

---

## 🏛️ C4 Model: System Context

### Level 1: System Context Diagram

```mermaid
C4Context
    title System Context - Litigation Management System

    Person(lawyer, "Lawyer", "Legal professional managing cases")
    Person(admin, "Administrator", "System administrator")
    Person(staff, "Staff User", "Data entry and support")
    Person(client_user, "Client", "Law firm client (indirect)")
    
    System(lit_system, "Litigation Management System", "Web-based legal practice management platform")
    
    System_Ext(email_system, "Email System", "Email notifications (optional)")
    System_Ext(browser, "Web Browser", "Chrome, Firefox, Safari, Edge")
    System_Ext(godaddy, "GoDaddy Hosting", "Production hosting environment")
    
    Rel(lawyer, lit_system, "Manages cases, hearings, invoices", "HTTPS")
    Rel(admin, lit_system, "Administers system, manages users", "HTTPS")
    Rel(staff, lit_system, "Enters data, generates reports", "HTTPS")
    
    Rel(lit_system, email_system, "Sends notifications", "SMTP (optional)")
    Rel(lit_system, godaddy, "Deployed on", "FTP/cPanel")
    
    UpdateRelStyle(lawyer, lit_system, $offsetX="-50", $offsetY="-10")
    UpdateRelStyle(lit_system, email_system, $offsetX="-40", $offsetY="0")
```

**Key Users:**
- **Lawyers** (52 permissions): Case and hearing management
- **Administrators** (84 permissions): User and system management
- **Staff** (52 permissions): Data entry and reporting
- **Super Admin** (91 permissions): Full system control

**Evidence:** 
- User roles: `backend/config/config.php:L82-L98`
- System description: `README.md:L1-L5`

---

## 🔧 Level 2: Container Diagram

```mermaid
C4Container
    title Container Diagram - Litigation Management System

    Person(user, "System User", "Lawyer/Admin/Staff")

    Container_Boundary(c1, "Litigation Management System") {
        Container(spa, "Single Page Application", "React 18.2, TypeScript 5.3", "Provides litigation management UI via browser")
        Container(api, "REST API", "PHP 8.4 Custom MVC", "Provides business logic via JSON/HTTP")
        ContainerDb(db, "Database", "MySQL 9.1.0", "Stores cases, hearings, clients, invoices")
        Container(files, "File Storage", "Local filesystem", "Stores uploaded documents")
    }

    System_Ext(pdf_lib, "jsPDF", "Client-side PDF generation")
    System_Ext(i18n_lib, "i18next", "Internationalization")

    Rel(user, spa, "Uses", "HTTPS, Port 3005 (dev)")
    Rel(spa, api, "Makes API calls", "JSON/HTTPS, Port 8080")
    Rel(api, db, "Reads/writes", "PDO, MySQL Protocol")
    Rel(api, files, "Stores/retrieves", "PHP filesystem")
    Rel(spa, pdf_lib, "Generates PDFs", "JavaScript")
    Rel(spa, i18n_lib, "Translates UI", "JavaScript")

    UpdateRelStyle(spa, api, $offsetX="0", $offsetY="-30")
```

**Containers:**

1. **Single Page Application (SPA)**
   - **Technology:** React 18.2, TypeScript 5.3, Vite 7.1
   - **Port (Dev):** 3005 (configurable)
   - **Deployment:** Static files served from `backend/public/`
   - **Evidence:** `vite.config.ts:L14`, `package.json:L119-L120`

2. **REST API**
   - **Technology:** PHP 8.4, Custom MVC framework
   - **Port:** 8080 (dev), 80/443 (production)
   - **Authentication:** JWT (HS256) + PHP Sessions
   - **Evidence:** `backend/api/index.php:L1-L3646`, `backend/config/config.php:L25-L27`

3. **Database**
   - **Technology:** MySQL 9.1.0, UTF-8mb4
   - **Tables:** 21 tables (users, clients, cases, hearings, etc.)
   - **Connection:** PDO with persistent connections
   - **Evidence:** `database/litigation_database.sql:L1-L616`, `backend/config/database.php:L14-L24`

4. **File Storage**
   - **Location:** `backend/uploads/`
   - **Types:** Documents (PDF, DOC, images), Client logos
   - **Max Size:** 50MB per file
   - **Evidence:** `backend/config/config.php:L35-L37`

---

## ⚙️ Level 3: Component Diagram (Backend API)

```mermaid
C4Component
    title Component Diagram - Backend API Container

    Container_Boundary(api, "REST API (PHP)") {
        Component(router, "Router", "Core/Router.php", "Routes HTTP requests to controllers")
        Component(auth_mw, "Auth Middleware", "Middleware/AuthMiddleware.php", "Validates JWT/Session")
        Component(cors_mw, "CORS Middleware", "Middleware/CorsMiddleware.php", "Handles CORS headers")
        
        Component(auth_ctrl, "Auth Controller", "Controllers/AuthController.php", "Login, logout, token refresh")
        Component(case_ctrl, "Case Controller", "Controllers/CaseController.php", "Case CRUD operations")
        Component(client_ctrl, "Client Controller", "Controllers/ClientController.php", "Client management")
        Component(hearing_ctrl, "Hearing Controller", "Controllers/HearingController.php", "Hearing scheduling")
        Component(invoice_ctrl, "Invoice Controller", "Controllers/InvoiceController.php", "Invoice management")
        Component(report_ctrl, "Report Controller", "Controllers/ReportController.php", "Report generation")
        
        Component(auth_svc, "Auth Service", "Core/Auth.php", "JWT generation, password hashing")
        Component(validator, "Validator", "Core/Validator.php", "Input validation")
        
        ComponentDb(models, "Models", "Models/*.php", "Data access layer")
    }

    ContainerDb(db, "MySQL Database", "PDO")

    Rel(router, auth_mw, "Passes request")
    Rel(auth_mw, cors_mw, "Passes authorized request")
    Rel(cors_mw, auth_ctrl, "Routes to controller")
    Rel(cors_mw, case_ctrl, "Routes to controller")
    Rel(cors_mw, client_ctrl, "Routes to controller")
    
    Rel(auth_ctrl, auth_svc, "Uses")
    Rel(case_ctrl, validator, "Validates input")
    Rel(client_ctrl, models, "Queries data")
    Rel(hearing_ctrl, models, "Queries data")
    Rel(invoice_ctrl, models, "Queries data")
    
    Rel(models, db, "PDO prepared statements")

    UpdateRelStyle(router, auth_mw, $offsetY="-10")
```

**Key Components:**

| Component | File | Responsibility | Evidence |
|-----------|------|----------------|----------|
| **Router** | `backend/src/Core/Router.php` | HTTP routing, middleware chain | Lines 1-165 |
| **Auth Middleware** | `backend/src/Middleware/AuthMiddleware.php` | JWT/Session validation | Directory observation |
| **Auth Service** | `backend/src/Core/Auth.php` | Token generation, password verification | Lines 1-371 |
| **Controllers** | `backend/src/Controllers/*.php` | Business logic orchestration | 9 controller files |
| **Models** | `backend/src/Models/*.php` | Database abstraction | 7 model files |
| **Validator** | `backend/src/Core/Validator.php` | Input sanitization | Directory observation |

---

## 🔄 Data Flow Diagrams

### Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant SPA as React SPA
    participant API as PHP API
    participant Auth as Auth Service
    participant DB as MySQL DB

    User->>SPA: Enter credentials
    SPA->>API: POST /api/auth/login<br/>{email, password}
    API->>Auth: Verify credentials
    Auth->>DB: SELECT user WHERE email=?
    DB-->>Auth: User record
    Auth->>Auth: password_verify()
    Auth->>Auth: Generate JWT token
    Auth-->>API: {user, token}
    API-->>SPA: 200 OK + JWT
    SPA->>SPA: Store token in localStorage
    SPA->>SPA: Redirect to dashboard
    
    Note over SPA,API: Subsequent requests include JWT
    
    SPA->>API: GET /api/cases<br/>Header: Authorization: Bearer {token}
    API->>Auth: Validate token
    Auth->>Auth: Decode and verify JWT
    Auth-->>API: User ID + Role
    API->>DB: SELECT cases WHERE ...
    DB-->>API: Cases data
    API-->>SPA: 200 OK + JSON
```

**Evidence:**
- Login handler: `backend/api/index.php:L42-L48`
- Auth logic: `backend/src/Core/Auth.php:L11-L41`
- JWT validation: `backend/src/Core/Auth.php:L267-L319`

### CRUD Data Flow (Case Management Example)

```mermaid
sequenceDiagram
    actor User
    participant SPA as React Component
    participant API_Service as API Service (api.ts)
    participant API as REST API
    participant Controller as CaseController
    participant Model as Case Model
    participant DB as MySQL

    User->>SPA: Click "Create Case"
    SPA->>SPA: Open CaseModal
    User->>SPA: Fill form + Submit
    SPA->>SPA: Validate with Zod schema
    SPA->>API_Service: createCase(data)
    API_Service->>API: POST /api/cases<br/>Body: {case_data}
    API->>Controller: handleCreateCase()
    Controller->>Controller: Validate input
    Controller->>Model: Case::create(data)
    Model->>DB: INSERT INTO cases ...
    DB-->>Model: Insert ID
    Model-->>Controller: New case object
    Controller-->>API: 201 Created + JSON
    API-->>API_Service: Response
    API_Service-->>SPA: Case created
    SPA->>SPA: Show success toast
    SPA->>SPA: Refresh case list
```

**Evidence:**
- React component: `src/components/modals/CaseModal.tsx`
- API service: `src/services/api.ts:L1-L624`
- Controller: `backend/src/Controllers/CaseController.php`
- Model: `backend/src/Models/Case.php`

### Report Generation & PDF Export Flow

```mermaid
sequenceDiagram
    actor User
    participant SPA as Reports Page
    participant PDF as jsPDF Library
    participant API as Reports API
    participant DB as MySQL

    User->>SPA: Select report criteria
    SPA->>API: GET /api/reports/client-report?client_id=X
    API->>DB: Complex JOIN query
    DB-->>API: Report data (JSON)
    API-->>SPA: Report data
    SPA->>SPA: Render report in UI
    
    User->>SPA: Click "Export PDF"
    SPA->>PDF: new jsPDF()
    SPA->>PDF: Add company logo (base64)
    SPA->>PDF: Add header (Arabic text)
    SPA->>PDF: Add data table (autoTable)
    SPA->>PDF: Add footer (branding)
    PDF-->>SPA: PDF Blob
    SPA->>SPA: Download PDF file
```

**Evidence:**
- Reports page: `src/pages/ReportsPage.tsx`
- PDF export: `src/utils/exportUtils.ts`
- jsPDF: `package.json:L116-L117`
- Reports API: `backend/api/index.php:L113-L147`, `backend/src/Controllers/ReportController.php`

---

## 🔐 Security Architecture

### Authentication & Authorization Layers

```mermaid
flowchart TD
    Request[HTTP Request] --> CORS{CORS Check}
    CORS -->|Invalid Origin| Reject[403 Forbidden]
    CORS -->|Valid| Auth{Auth Check}
    
    Auth -->|No Token/Session| Guest[Guest Access]
    Auth -->|Valid JWT| ValidateJWT[Validate JWT]
    Auth -->|Valid Session| ValidateSession[Validate PHP Session]
    
    ValidateJWT --> Decode[Decode Token]
    Decode -->|Expired| Reject
    Decode -->|Valid| LoadUser[Load User from DB]
    
    ValidateSession --> CheckSession[Check $_SESSION]
    CheckSession --> LoadUser
    
    LoadUser --> CheckRole{Check Role Permissions}
    CheckRole -->|Insufficient| Reject
    CheckRole -->|Sufficient| Controller[Execute Controller]
    
    Controller --> Response[HTTP Response]
    Guest --> PublicEndpoint{Public Endpoint?}
    PublicEndpoint -->|Yes| Controller
    PublicEndpoint -->|No| Reject
```

**Security Layers:**

1. **CORS Middleware**
   - Origin validation
   - Evidence: `backend/src/Middleware/CorsMiddleware.php`

2. **Authentication Middleware**
   - JWT validation
   - Session validation
   - Evidence: `backend/src/Middleware/AuthMiddleware.php`

3. **Role-Based Access Control (RBAC)**
   - 4 roles: Super Admin, Admin, Lawyer, Staff
   - Permission matrix per role
   - Evidence: `backend/config/config.php:L82-L98`

4. **Input Validation**
   - Frontend: Zod schemas
   - Backend: Validator class
   - Evidence: `backend/src/Core/Validator.php`, `package.json:L133` (Zod)

---

## 🌍 Internationalization Architecture

```mermaid
flowchart LR
    User[User Action] --> Detect{Language<br/>Preference}
    Detect -->|localStorage| LoadLang[Load Language]
    Detect -->|Default| Arabic[Arabic RTL]
    
    LoadLang --> i18next[i18next Library]
    Arabic --> i18next
    
    i18next --> Translations[Translation Files]
    Translations --> ar[ar.ts]
    Translations --> en[en.ts]
    
    ar --> Render[Render UI]
    en --> Render
    
    Render --> RTL{RTL Language?}
    RTL -->|Yes| ApplyRTL[Apply RTL Styles]
    RTL -->|No| ApplyLTR[Apply LTR Styles]
    
    ApplyRTL --> Display[Display to User]
    ApplyLTR --> Display
    
    User --> ToggleLang[Toggle Language]
    ToggleLang --> UpdateStorage[Update localStorage]
    UpdateStorage --> Detect
```

**i18n Implementation:**
- **Library:** i18next + react-i18next
- **Default Language:** Arabic (ar-SA)
- **Fallback:** Arabic
- **Persistence:** localStorage
- **RTL Detection:** Automatic per language
- **Evidence:** `src/i18n/index.ts:L1-L52`, `src/styles/rtl.scss`

---

## 🗄️ Database Architecture

### Entity Relationship Overview

```mermaid
erDiagram
    USERS ||--o{ USER_SESSIONS : has
    USERS {
        int id PK
        string username UK
        string email UK
        string password_hash
        enum role
        boolean is_active
    }
    
    CLIENTS ||--o{ CASES : has
    CLIENTS ||--o{ INVOICES : receives
    CLIENTS ||--o{ DOCUMENTS : owns
    CLIENTS {
        int id PK
        string client_name_ar
        string client_name_en
        enum client_type
        enum cash_pro_bono
        string logo
    }
    
    LAWYERS ||--o{ CASES : handles
    LAWYERS ||--o{ HEARINGS : attends
    LAWYERS {
        int id PK
        string lawyer_name_ar
        string lawyer_name_en
        string lawyer_email
        boolean is_active
    }
    
    CASES ||--o{ HEARINGS : schedules
    CASES ||--o{ DOCUMENTS : contains
    CASES {
        int id PK
        int client_id FK
        string case_number UK
        string case_status
        date case_date
    }
    
    HEARINGS ||--o{ HEARING_LAWYERS : involves
    HEARINGS {
        int id PK
        int case_id FK
        date hearing_date
        string court_name
        string decision
    }
    
    INVOICES ||--o{ LAWYER_INVOICE_SHARES : splits
    INVOICES {
        int id PK
        string invoice_number UK
        decimal amount
        enum invoice_status
        date invoice_date
    }
```

**Key Relationships:**
- **1:N** - Client → Cases (one client has many cases)
- **1:N** - Case → Hearings (one case has many hearings)
- **M:N** - Hearings ↔ Lawyers (via `hearing_lawyers` junction table)
- **1:N** - Invoice → Lawyer Shares (invoice amount split among lawyers)

**Evidence:** `database/litigation_database.sql:L23-L443`

---

## 📦 Deployment Architecture

### Development Environment

```mermaid
flowchart TB
    Dev[Developer Machine]
    
    subgraph "Local Development"
        Vite[Vite Dev Server<br/>Port 3005]
        PHP[PHP Built-in Server<br/>Port 8080]
        MySQL[MySQL 9.1<br/>Port 3306]
    end
    
    Dev --> Vite
    Vite --> PHP
    PHP --> MySQL
    
    Vite -.->|HMR| Dev
```

**Configuration:**
- **Frontend:** `npm run dev` (Vite port 3005)
- **Backend:** `php -S localhost:8080 -t backend`
- **Database:** MySQL on localhost:3306
- **Evidence:** `package.json:L7`, `vite.config.ts:L12-L16`

### Production Environment (GoDaddy)

```mermaid
flowchart TB
    Internet[Internet] --> GoDaddy[GoDaddy Shared Hosting]
    
    subgraph "GoDaddy Server"
        Apache[Apache/LiteSpeed<br/>Port 80/443]
        PHP_Prod[PHP 8.4 FastCGI]
        MySQL_Prod[MySQL 9.1]
        Files[File Storage<br/>/uploads/]
    end
    
    GoDaddy --> Apache
    Apache --> SSL[SSL Certificate<br/>lit.sarieldin.com]
    SSL --> PHP_Prod
    PHP_Prod --> MySQL_Prod
    PHP_Prod --> Files
    
    Apache -.->|Static Files| PublicDir[/backend/public/<br/>React SPA]
```

**Production Stack:**
- **Web Server:** Apache/LiteSpeed (GoDaddy default)
- **PHP:** 8.4+ with FastCGI
- **Database:** MySQL 9.1 (shared hosting)
- **SSL:** HTTPS enforced
- **Domain:** lit.sarieldin.com
- **Evidence:** `backend/config/config.production.php:L1-L220`, `README.md:L360-L362`

---

## 🔄 State Management Architecture

### Frontend State Layers

```mermaid
flowchart TB
    Component[React Component]
    
    subgraph "State Layers"
        Local[Local State<br/>useState/useReducer]
        Context[Context State<br/>AuthContext]
        Server[Server State<br/>React Query]
        Persistent[Persistent State<br/>localStorage]
    end
    
    Component --> Local
    Component --> Context
    Component --> Server
    Component --> Persistent
    
    Local -->|Transient UI| Component
    Context -->|Global Auth| Component
    Server -->|API Data Cache| Component
    Persistent -->|Preferences| Component
```

**State Management:**

1. **Local Component State**
   - Form state (react-hook-form)
   - Modal visibility
   - Evidence: `src/components/modals/*.tsx`

2. **Global Context State**
   - Authentication state (user, token, permissions)
   - Evidence: `src/contexts/AuthContext.tsx`

3. **Server State**
   - API data caching with React Query
   - Evidence: `package.json:L128` (react-query)

4. **Persistent State**
   - Language preference (localStorage)
   - JWT token (localStorage)
   - Evidence: `src/i18n/index.ts:L18`

---

## 🧩 Integration Points

### External Dependencies

| Service | Purpose | Integration Type | Evidence |
|---------|---------|------------------|----------|
| **jsPDF** | PDF generation | Client-side library | `package.json:L116-L117` |
| **i18next** | Internationalization | Client-side library | `package.json:L115`, `src/i18n/` |
| **Bootstrap** | UI framework | Client-side library | `package.json:L111` |
| **Chart.js** | Data visualization | Client-side library | `package.json:L112` |
| **React Select** | Advanced dropdowns | Client-side library | `package.json:L130` |

**No External API Integrations Detected**  
(Email/SMS would be via SMTP - currently disabled)

---

## 🎯 Architectural Decisions & Rationale

### 1. Why Custom PHP MVC vs Framework?

**Decision:** Custom lightweight MVC instead of Laravel/Symfony

**Rationale:**
- ✅ **Simplicity:** Smaller learning curve for team
- ✅ **Performance:** No framework overhead
- ✅ **Control:** Full control over routing and middleware
- ⚠️ **Maintenance:** Requires custom documentation and testing

**Evidence:** `backend/src/Core/` (custom Router, Auth, Request, Response classes)

### 2. Why React Query for Server State?

**Decision:** React Query over Redux for API data

**Rationale:**
- ✅ **Caching:** Automatic request deduplication and caching
- ✅ **Simplicity:** Less boilerplate than Redux
- ✅ **Optimistic Updates:** Built-in support for mutations
- ✅ **Background Sync:** Automatic refetching

**Evidence:** `package.json:L128`, `src/services/api.ts`

### 3. Why Vite over Webpack?

**Decision:** Vite for build tooling

**Rationale:**
- ✅ **Speed:** Lightning-fast HMR
- ✅ **Modern:** ES modules, native TypeScript
- ✅ **Simplicity:** Minimal configuration
- ✅ **Optimized:** Better tree-shaking and code splitting

**Evidence:** `vite.config.ts`, `package.json:L103`

### 4. Why JWT + Sessions (Hybrid Auth)?

**Decision:** JWT tokens alongside PHP sessions

**Rationale:**
- ✅ **API-Friendly:** JWT for stateless API requests
- ✅ **Web-Friendly:** PHP sessions for web browser requests
- ✅ **Security:** Dual validation provides defense-in-depth
- ⚠️ **Complexity:** More complex auth logic

**Evidence:** `backend/src/Core/Auth.php:L53-L78` (hybrid check)

---

## 📏 Architectural Constraints & Assumptions

### Constraints

1. **GoDaddy Shared Hosting**
   - Limited to Apache/LiteSpeed
   - No Docker/containerization
   - No custom server configurations
   - Evidence: `README.md:L360-L362`

2. **No Microservices**
   - Monolithic architecture required for shared hosting
   - All services must run on single PHP runtime

3. **File-Based Storage**
   - No cloud storage (S3, Azure Blob)
   - Local filesystem only
   - Evidence: `backend/config/config.php:L37`

### Assumptions

**Assumption (High Confidence):** MySQL supports 50+ concurrent connections  
**Evidence:** Shared hosting typical limits  
**How to Verify:** Check GoDaddy MySQL connection pool limits

**Assumption (Medium Confidence):** Apache handles 100+ req/sec  
**Evidence:** Typical shared hosting performance  
**How to Verify:** Load testing with Apache Bench or similar

---

## 🔮 Scalability Considerations

### Current Limitations

| Aspect | Current Limit | Bottleneck | Evidence |
|--------|---------------|------------|----------|
| **Concurrent Users** | ~50 users | MySQL connection pool | Shared hosting limit |
| **File Storage** | ~10GB | Disk space quota | GoDaddy plan limit |
| **Database Size** | ~2GB | MySQL storage | GoDaddy plan limit |
| **Request Rate** | ~100 req/sec | Apache workers | Shared hosting limit |

### Future Scaling Paths

1. **Vertical Scaling:**
   - Upgrade to VPS/dedicated hosting
   - Increase MySQL connection pool
   - Add Redis for caching

2. **Horizontal Scaling:**
   - Migrate to cloud (AWS, Azure, GCP)
   - Implement load balancing
   - Separate API servers from web servers

3. **Database Scaling:**
   - Read replicas for reporting
   - Partition large tables (hearings, cases)
   - Implement connection pooling (PgBouncer-equivalent)

---

**End of Architecture Documentation**

