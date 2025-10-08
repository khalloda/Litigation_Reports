# Repository Structure Analysis

## 📂 Overview

The Litigation Management System follows a **monolithic structure** with clear separation between frontend (React/TypeScript) and backend (PHP) concerns. The repository is organized as a **single codebase** with frontend and backend colocated but logically separated.

**Repository Type:** Monolithic (Single Application)  
**Primary Languages:** TypeScript (Frontend), PHP (Backend), SQL (Database)

---

## 🌳 Top-Level Directory Tree

```
Litigation_Reports/
├── src/                        # React frontend source (TypeScript)
├── backend/                    # PHP backend application
├── database/                   # MySQL schemas, migrations, and setup
├── tests/                      # Playwright E2E test suite
├── docs/                       # Project documentation
├── scripts/                    # Build and deployment scripts
├── deploy/                     # Deployment configurations
├── uploads/                    # User-uploaded files
├── logs/                       # Application logs
├── node_modules/               # npm dependencies (gitignored)
├── package.json                # Frontend dependencies and scripts
├── vite.config.ts              # Vite build configuration
├── tsconfig.json               # TypeScript configuration
├── playwright.config.mjs       # E2E test configuration
├── index.html                  # Frontend entry HTML
└── README.md                   # Project documentation
```

**Evidence:** Root directory listing, `package.json:L1-L153`, file structure observation

---

## 📦 Detailed Directory Breakdown

### 🎨 `src/` - Frontend Application

**Purpose:** React TypeScript application source code  
**Owner:** Frontend team  
**Size:** 28 components, 16 pages, ~50 TypeScript files

```
src/
├── components/               # Reusable React components
│   ├── auth/                # Authentication components
│   │   ├── AuthProvider.tsx   # Context provider for auth
│   │   ├── PermissionGate.tsx # Permission-based rendering
│   │   └── ProtectedRoute.tsx # Route guards
│   ├── forms/               # Form-related components
│   │   ├── LawyerMultiSelect.tsx
│   │   ├── MixedContentInput.tsx
│   │   ├── MixedContentInput.stories.tsx  # Storybook story
│   │   └── MixedContentTextarea.tsx
│   ├── layout/              # Layout components
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── modals/              # Modal dialogs
│   │   ├── CaseModal.tsx
│   │   ├── ClientModal.tsx
│   │   └── HearingModal.tsx
│   ├── tables/              # Table components
│   │   └── ServerPaginatedTable.tsx
│   ├── ui/                  # UI components
│   │   ├── LanguageSwitcher.tsx
│   │   └── UserMenu.tsx
│   ├── admin/               # Admin-only components
│   │   └── RoleManagement.tsx
│   ├── common/              # Shared components
│   │   └── FileUpload.tsx
│   └── settings/            # Settings components
│       ├── GeneralSettings.tsx
│       └── ProfileSettings.tsx
├── pages/                   # Page-level components
│   ├── auth/                # Authentication pages
│   │   └── Login.tsx
│   ├── Dashboard.tsx
│   ├── CasesPage.tsx
│   ├── ClientsPage.tsx
│   ├── HearingsPage.tsx
│   ├── InvoicesPage.tsx
│   ├── LawyersPage.tsx
│   ├── ReportsPage.tsx
│   ├── Documents.tsx
│   ├── Settings.tsx
│   ├── Users.tsx
│   └── NotFound.tsx
├── services/                # API client services
│   └── api.ts               # Axios-based API service
├── hooks/                   # Custom React hooks
│   ├── useLanguage.ts
│   ├── usePermissions.ts
│   └── useRTL.ts
├── contexts/                # React Context providers
│   └── AuthContext.tsx
├── types/                   # TypeScript type definitions
│   └── auth.ts
├── utils/                   # Utility functions
│   ├── exportUtils.ts
│   └── mixedContent.ts
├── i18n/                    # Internationalization
│   ├── index.ts             # i18next initialization
│   └── locales/
│       ├── ar.ts            # Arabic translations
│       └── en.ts            # English translations
├── styles/                  # Global styles
│   ├── main.scss            # Main stylesheet
│   ├── variables.scss       # SCSS variables
│   ├── mixins.scss          # SCSS mixins
│   └── rtl.scss             # RTL-specific styles
├── test/                    # Unit test setup
│   └── setup.ts
├── main.tsx                 # Application entry point
└── App.tsx                  # Root component
```

**Evidence:** `src/` directory listing, file observations

---

### ⚙️ `backend/` - PHP Backend Application

**Purpose:** PHP MVC backend with REST API  
**Owner:** Backend team  
**Architecture:** Custom lightweight MVC

```
backend/
├── api/                     # API entry points
│   ├── index.php            # Main API router (3,500+ lines)
│   ├── db.php               # Database handlers
│   ├── _bootstrap.php       # Bootstrap configuration
│   ├── ping.php             # Health check endpoint
│   ├── lawyer_associations.php  # Lawyer relationships API
│   ├── test.php             # Test utilities
│   └── export/              # PDF export endpoints
│       ├── pdf.php
│       ├── pdf-simple.php
│       └── pdf-chrome.php
├── src/                     # MVC source code
│   ├── Controllers/         # API controllers
│   │   ├── AuthController.php
│   │   ├── CaseController.php
│   │   ├── ClientController.php
│   │   ├── DocumentController.php
│   │   ├── HearingController.php
│   │   ├── InvoiceController.php
│   │   ├── LawyerController.php
│   │   ├── ReportController.php
│   │   └── UserController.php
│   ├── Models/              # Data models
│   │   ├── Case.php
│   │   ├── Client.php
│   │   ├── Document.php
│   │   ├── Hearing.php
│   │   ├── Invoice.php
│   │   ├── Lawyer.php
│   │   └── User.php
│   ├── Core/                # Framework core
│   │   ├── Auth.php         # Authentication (JWT + Sessions)
│   │   ├── Router.php       # Routing logic
│   │   ├── Request.php      # HTTP request wrapper
│   │   ├── Response.php     # HTTP response wrapper
│   │   └── Validator.php    # Input validation
│   └── Middleware/          # Middleware classes
│       ├── AuthMiddleware.php
│       ├── CorsMiddleware.php
│       └── ValidationMiddleware.php
├── config/                  # Configuration files
│   ├── config.php           # Development config
│   ├── config.production.php  # Production config
│   ├── database.php         # Database connection class
│   └── database_sqlite.php  # SQLite fallback config
├── public/                  # Public web root (built frontend)
│   ├── index.html           # Frontend SPA entry
│   └── assets/              # Compiled frontend assets
│       ├── index-*.js       # JavaScript bundles
│       ├── index-*.css      # CSS bundles
│       └── *.map            # Source maps
├── migrations/              # Database migrations
│   └── 001_add_lawyer_relationships.sql
├── sql/                     # SQL utilities
│   ├── create_hearing_lawyers_table.sql
│   └── verify_hearing_lawyers_table.sql
├── uploads/                 # User uploads
│   └── documents/           # Uploaded documents
├── temp/                    # Temporary files (PDFs, JSON)
├── logs/                    # Application logs
├── cache/                   # File cache directory
├── router.php               # Frontend routing fallback
├── pdf-generator.js         # Node.js PDF generator
├── pdf-validator.js         # PDF validation
├── package.json             # Node dependencies (for PDF gen)
└── error.log                # Error log file
```

**Evidence:** `backend/` directory listing, file observations

**Note:** The `backend/public/` directory serves as the deployment target for the Vite build (`vite.config.ts:L44`).

---

### 🗄️ `database/` - Database Schema & Migrations

**Purpose:** MySQL database setup, migrations, and data import  
**Schema:** 21+ tables with UTF-8mb4 support

```
database/
├── litigation_database.sql  # Complete schema (616 lines)
├── litigation.db            # SQLite backup/fallback
├── config/
│   └── database.php         # Database connection config
├── migrations/              # Schema migration scripts
│   ├── add_missing_features.sql
│   ├── add_missing_features_compatible.sql
│   ├── create_documents_table.sql
│   ├── update_database_for_new_features.sql
│   └── step_by_step_migration.sql
├── setup.php                # Database setup script
├── setup_simple.php         # Simplified setup
├── setup_sqlite.php         # SQLite setup
├── setup_users.php          # User table seeding
├── create_database.php      # Database creation
├── migrate_data.php         # Data migration from Access
├── migrate_simple.php       # Simplified migration
├── add_client_fields.php    # Schema alteration
├── test.php                 # Database connection test
├── config.local.php         # Local DB configuration
├── README.md                # Database documentation
└── SETUP_GUIDE.md           # Setup instructions
```

**Evidence:** `database/` directory, `database/litigation_database.sql:L1-L616`

**Tables Defined:** 21 tables including `users`, `clients`, `lawyers`, `cases`, `hearings`, `invoices`, `documents`, etc.

---

### 🧪 `tests/` - Test Suite

**Purpose:** End-to-end testing with Playwright  
**Test Count:** 140+ test specification files

```
tests/
├── api/                     # API integration tests
├── auth.spec.js             # Authentication tests
├── client-crud.spec.ts      # Client CRUD tests
├── hearings*.spec.ts        # Hearing management tests (15+ files)
├── invoices*.spec.ts        # Invoice tests (10+ files)
├── reports*.spec.ts         # Report generation tests (12+ files)
├── pdf-export*.spec.ts      # PDF export tests (8+ files)
├── rtl-mixed-content.spec.js  # RTL/i18n tests
├── accessibility.spec.js    # Accessibility tests
├── visual-regression.spec.js  # Visual regression tests
├── fixtures/                # Test fixtures
├── helpers/                 # Test helper utilities
├── integration/             # Integration test scenarios
├── utils/                   # Test utilities
├── web/                     # Web-specific tests
├── global-setup.js          # Playwright global setup
└── global-teardown.js       # Playwright global teardown
```

**Evidence:** `tests/` directory (140+ `.spec.{js,ts}` files)

**Test Coverage:**
- Authentication and authorization
- CRUD operations for all entities
- PDF export functionality
- RTL and mixed content
- Accessibility compliance
- Visual regression
- API integration

---

### 📚 `docs/` - Project Documentation

**Purpose:** Technical documentation, architecture decision records  
**Content:** 20+ documentation files

```
docs/
├── Agent_Rules.md           # AI agent rules and conventions
├── Universal_Codebase_Audit_Prompt_FULL.md  # Audit template
├── DOCUMENTATION_INDEX.md   # Doc index
├── PDF_EXPORT_DOCUMENTATION.md
├── UPLOAD_API_DOCUMENTATION.md
├── REPORTS_API_DOCUMENTATION.md
├── CRUD_API_EXAMPLES.md
├── CustomReports_request.md
├── Report_Export_Request.md
├── DocumentUpload_request.md
├── Lawyer_Dropdown_Plan.md
├── LAWYER_NAME_DISPLAY_ISSUE.md
├── LOGIN_FIX_SUCCESS_REPORT.md
├── REAL_DATA_VALIDATION_REPORT.md
├── CRUD_COMPLETION_REPORT.md
├── CRUD_FIX_REQUEST.md
├── Structure_Check_Request.md
├── FEATURES_COMPLETE.md
├── PROJECT_STATUS_COMPLETE.md
└── (other markdown files)
```

**Evidence:** `docs/` directory listing

---

### 🚀 `scripts/` - Build & Deployment Scripts

**Purpose:** Automation scripts for build and deployment

```
scripts/
├── build-production.sh      # Linux/Mac production build
├── build-production.bat     # Windows production build
├── deploy-to-godaddy.sh     # FTP deployment to GoDaddy
├── setup-tests.sh           # Test environment setup
└── run-tests.sh             # Test execution wrapper
```

**Evidence:** `scripts/` directory

---

### 📦 `deploy/` - Deployment Configurations

**Purpose:** Deployment-specific files and guides

```
deploy/
├── DEPLOYMENT_CHECKLIST.md  # 200+ point checklist
├── (deployment configurations)
└── (environment-specific files)
```

**Evidence:** `deploy/` directory, `README.md:L297-L303`

---

### 📁 Other Important Directories

| Directory | Purpose | Gitignored | Evidence |
|-----------|---------|------------|----------|
| **node_modules/** | npm dependencies | ✅ Yes | Standard npm practice |
| **uploads/** | User-uploaded files | ❌ No | `backend/uploads/documents/` (5+ files) |
| **logs/** | Application logs | ✅ Yes (typical) | `backend/logs/` |
| **cache/** | File-based cache | ✅ Yes (typical) | `backend/cache/` |
| **temp/** | Temporary files | ⚠️ No | `backend/temp/` (130+ PDF/JSON files) |
| **DB_DUMP/** | Database dumps | ⚠️ No | Root directory |
| **reports_samples/** | Sample reports | ❌ No | Root directory |
| **test-results/** | Test artifacts | ✅ Should be | `playwright.config.mjs:L208` |
| **playwright-report/** | Test reports | ✅ Should be | Root directory |
| **screenshot_error/** | Error screenshots | ⚠️ No | Root directory |

---

## 🔍 Configuration Files (Root)

| File | Purpose | Status | Evidence |
|------|---------|--------|----------|
| **package.json** | npm dependencies, scripts | ✅ Complete | Root, 153 lines |
| **package-lock.json** | Dependency lockfile | ✅ Present | Root, 6000+ lines |
| **tsconfig.json** | TypeScript compiler config | ✅ Complete | Root, 74 lines |
| **tsconfig.node.json** | Node.js TS config | ✅ Present | Root |
| **vite.config.ts** | Vite build configuration | ✅ Complete | Root, 67 lines |
| **vitest.config.ts** | Vitest test config | ✅ Complete | Root, 20 lines |
| **playwright.config.mjs** | Playwright E2E config | ✅ Complete | Root, 210 lines |
| **playwright.config.simple.mjs** | Simplified Playwright config | ✅ Present | Root |
| **webpack.config.js** | Legacy Webpack config | ⚠️ Unused | Root |
| **index.html** | Frontend entry HTML | ✅ Present | Root |
| **README.md** | Project documentation | ✅ Comprehensive | Root, 493 lines |
| **CHANGELOG.md** | Change log | ✅ Present | Root |
| **CONTRIBUTING.md** | Contribution guidelines | ✅ Present | Root |
| **SECURITY.md** | Security policy | ✅ Present | Root |
| **CODEOWNERS** | Code ownership | ✅ Present | Root |

---

## 🚫 .gitignore Analysis

**Assumption (High Confidence):** Standard Node.js and PHP `.gitignore` patterns are used.

**Expected Ignored Paths:**
- `node_modules/`
- `dist/` or `build/`
- `.env`, `.env.local`
- `*.log`
- `cache/`
- `.DS_Store`
- IDE-specific files (`.vscode/`, `.idea/`)

**Evidence:** Standard practice, but `.gitignore` file not directly examined

**Potential Issue:** `temp/` directory (130+ files) and `uploads/` may not be gitignored and could bloat the repository.

---

## 📊 Hot Paths & Critical Files

### Entry Points

| Layer | File | Purpose | Evidence |
|-------|------|---------|----------|
| **Frontend** | `src/main.tsx` | React app entry | `src/main.tsx:L1-L30` |
| **Frontend** | `index.html` | HTML entry | Root directory |
| **Backend API** | `backend/api/index.php` | API router | `backend/api/index.php:L1-L3646` |
| **Backend Public** | `backend/public/index.html` | Compiled frontend | Build output |
| **Database** | `database/litigation_database.sql` | Schema definition | `database/litigation_database.sql:L1-L616` |

### Core Business Logic

| Module | File(s) | Lines of Code | Evidence |
|--------|---------|---------------|----------|
| **Authentication** | `backend/src/Core/Auth.php` | 371 lines | File observation |
| **API Routing** | `backend/api/index.php` | 3,646 lines | File observation |
| **Database Layer** | `backend/config/database.php` | 231 lines | File observation |
| **Frontend API** | `src/services/api.ts` | 624 lines | File observation |
| **i18n** | `src/i18n/locales/ar.ts`, `en.ts` | ~500 lines total | Directory observation |

---

## 🗂️ Code Ownership (Inferred)

| Directory | Primary Owner | Secondary Owner | Evidence |
|-----------|---------------|-----------------|----------|
| `src/` | Frontend team | - | TypeScript/React code |
| `backend/src/` | Backend team | - | PHP MVC code |
| `backend/api/` | Backend team | - | API endpoints |
| `database/` | DBA / Backend | - | SQL migrations |
| `tests/` | QA / Full-stack | All teams | E2E tests |
| `docs/` | Technical writers | All teams | Documentation |
| `scripts/` | DevOps | Backend | Build/deploy scripts |

**Evidence:** Inferred from file types and content

---

## 📈 Repository Statistics

### File Counts (Approximate)

| Type | Count | Evidence |
|------|-------|----------|
| **TypeScript/TSX** | 60+ files | `src/` directory |
| **PHP** | 30+ files | `backend/` directory |
| **SQL** | 10+ files | `database/` directory |
| **Test Specs** | 140+ files | `tests/` directory |
| **Markdown Docs** | 30+ files | Root and `docs/` |
| **Config Files** | 15+ files | Root directory |

### Lines of Code (Estimated)

| Language | LOC (approx) | Evidence |
|----------|--------------|----------|
| **TypeScript** | ~8,000 lines | Frontend components + services |
| **PHP** | ~6,000 lines | Backend MVC + API |
| **SQL** | ~1,500 lines | Schema + migrations |
| **Test Code** | ~10,000 lines | 140+ test files |

---

## 🔧 Generated vs Source Directories

### Generated Directories (Build Artifacts)

| Directory | Generator | Cleanup | Evidence |
|-----------|-----------|---------|----------|
| `backend/public/` | Vite build | `npm run clean` | `vite.config.ts:L44` |
| `node_modules/` | npm install | Manual | Standard npm |
| `test-results/` | Playwright | Manual | `playwright.config.mjs:L208` |
| `playwright-report/` | Playwright | Manual | Root directory |

### Source Directories (Version Controlled)

- `src/` - Frontend source
- `backend/src/` - Backend source
- `database/` - Database source
- `tests/` - Test source

---

## ⚠️ Repository Organization Issues

### 1. Bloated Root Directory

**Issue:** 100+ files in root directory including test scripts, debug files, and temporary data.

**Examples:**
- `test-*.js`, `test-*.php` (50+ files)
- `debug-*.png` (20+ screenshots)
- `test-results/`, `playwright-report/`

**Recommendation:** Move test utilities to `tests/utils/`, screenshots to `docs/screenshots/`, consolidate debug files.

### 2. Mixed Test Locations

**Issue:** Test files scattered across multiple locations:
- `tests/` (E2E tests)
- Root directory (`test-*.js`, `test-*.php`)
- `backend/api/test.php`

**Recommendation:** Consolidate all tests under `tests/` with subdirectories: `tests/e2e/`, `tests/api/`, `tests/unit/`.

### 3. Temporary Files Committed

**Issue:** `backend/temp/` contains 130+ generated PDFs and JSON files that should be gitignored.

**Recommendation:** Add `backend/temp/` to `.gitignore` and clean existing files.

### 4. Redundant Configurations

**Issue:** Multiple Playwright configs (`playwright.config.mjs`, `playwright-simple.config.mjs`, `playwright.config.custom-reports.mjs`)

**Recommendation:** Use environment-based configuration with a single config file.

---

## ✅ Repository Organization Strengths

1. **Clear Frontend/Backend Separation:** `src/` vs `backend/` is intuitive
2. **Organized Component Structure:** Logical grouping in `src/components/`
3. **MVC Architecture:** Clean separation in `backend/src/` (Controllers, Models, Core)
4. **Comprehensive Documentation:** `docs/` directory with extensive markdown files
5. **Deployment Ready:** Dedicated `scripts/` and `deploy/` directories

---

## 🎯 Recommendations

### Immediate Actions (Low Effort)

1. **Clean Root Directory:**
   - Move test files to `tests/utils/`
   - Archive screenshots to `docs/screenshots/archive/`
   - Remove obsolete files (`webpack.config.js`)

2. **Update .gitignore:**
   ```
   backend/temp/
   backend/cache/
   test-results/
   playwright-report/
   screenshot_error/
   ```

3. **Consolidate Test Configs:**
   - Use environment variables in single `playwright.config.mjs`
   - Remove redundant config files

### Strategic Improvements (Medium Effort)

4. **Create Monorepo Structure:**
   ```
   packages/
   ├── frontend/       (move src/ here)
   ├── backend/        (move backend/ here)
   └── shared/         (shared types/utils)
   ```

5. **Add Lerna/pnpm Workspaces:**
   - Enable shared dependencies
   - Improve build efficiency

6. **Separate Build Outputs:**
   - `dist/frontend/`
   - `dist/backend/`
   - `dist/database/` (migration bundles)

---

**End of Repository Structure Analysis**

