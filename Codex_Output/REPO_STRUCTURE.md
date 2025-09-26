# 📁 Repository Structure Analysis

## 🏗️ **Repository Overview**

The **Litigation Management System** follows a **hybrid monorepo structure** with clear separation between frontend and backend components. The repository contains a complete full-stack application with React frontend, PHP backend, database migrations, testing infrastructure, and deployment scripts.

### **Repository Type**: Hybrid Monorepo

- **Frontend**: React SPA with TypeScript and Vite
- **Backend**: Custom PHP MVC architecture
- **Database**: MySQL with migration scripts
- **Testing**: Comprehensive E2E and unit testing
- **Deployment**: Production-ready build and deployment scripts

**Evidence**: `package.json:L1-L150`, `backend/`, `src/`, `database/`, `tests/`

## 📂 **Directory Structure**

### **Root Level Structure**

```
Litigation_Reports/
├── src/                          # React frontend source code
├── backend/                      # PHP backend API and server
├── database/                     # Database scripts and migrations
├── tests/                        # Playwright E2E test suites
├── deploy/                       # Deployment scripts and guides
├── docs/                         # Documentation files
├── node_modules/                 # Node.js dependencies
├── package.json                  # Node.js project configuration
├── package-lock.json            # Dependency lock file
├── vite.config.ts               # Vite build configuration
├── tsconfig.json                # TypeScript configuration
├── playwright.config.mjs        # Playwright test configuration
├── vitest.config.ts             # Vitest unit test configuration
├── .eslintrc.cjs                # ESLint configuration
├── .prettierrc                  # Prettier configuration
└── README.md                    # Project documentation
```

## 🎯 **Frontend Structure (`src/`)**

### **Component Organization**

| Path | Purpose | Key Files | Evidence |
|------|---------|-----------|----------|
| `src/components/` | Reusable UI components | `Dashboard.tsx`, `LoginForm.tsx`, `FormInput.tsx` | `src/components/` |
| `src/components/auth/` | Authentication components | `AuthProvider.tsx`, `ProtectedRoute.tsx` | `src/components/auth/` |
| `src/components/forms/` | Form components with RTL support | `MixedContentInput.tsx`, `MixedContentTextarea.tsx` | `src/components/forms/` |
| `src/components/layout/` | Layout and navigation | `Layout.tsx`, `Navbar.tsx`, `Sidebar.tsx` | `src/components/layout/` |
| `src/components/tables/` | Data table components | `ServerPaginatedTable.tsx` | `src/components/tables/` |
| `src/components/ui/` | UI utility components | `LanguageSwitcher.tsx`, `UserMenu.tsx` | `src/components/ui/` |

### **Page Components**

| Path | Purpose | Key Files | Evidence |
|------|---------|-----------|----------|
| `src/pages/` | Main application pages | `Dashboard.tsx`, `Cases.tsx`, `Clients.tsx` | `src/pages/` |
| `src/pages/auth/` | Authentication pages | `Login.tsx` | `src/pages/auth/` |

### **Application Logic**

| Path | Purpose | Key Files | Evidence |
|------|---------|-----------|----------|
| `src/contexts/` | React context providers | `AuthContext.tsx` | `src/contexts/` |
| `src/hooks/` | Custom React hooks | `useLanguage.ts`, `usePermissions.ts` | `src/hooks/` |
| `src/services/` | API service layer | `api.ts` | `src/services/` |
| `src/types/` | TypeScript type definitions | `auth.ts` | `src/types/` |
| `src/utils/` | Utility functions | `mixedContent.ts` | `src/utils/` |

### **Styling & Internationalization**

| Path | Purpose | Key Files | Evidence |
|------|---------|-----------|----------|
| `src/styles/` | SCSS stylesheets | `main.scss`, `rtl.scss`, `variables.scss` | `src/styles/` |
| `src/i18n/` | Internationalization | `index.ts`, `locales/ar.ts`, `locales/en.ts` | `src/i18n/` |

### **Entry Points**

| File | Purpose | Evidence |
|------|---------|----------|
| `src/main.tsx` | React application entry point | `src/main.tsx` |
| `src/App.tsx` | Main application component | `src/App.tsx` |

## 🖥️ **Backend Structure (`backend/`)**

### **API Layer**

| Path | Purpose | Key Files | Evidence |
|------|---------|-----------|----------|
| `backend/api/` | API entry points | `index.php`, `_bootstrap.php`, `db.php` | `backend/api/` |
| `backend/router.php` | Request routing | `backend/router.php` |

### **MVC Architecture**

| Path | Purpose | Key Files | Evidence |
|------|---------|-----------|----------|
| `backend/src/Controllers/` | Business logic controllers | `AuthController.php`, `CaseController.php` | `backend/src/Controllers/` |
| `backend/src/Models/` | Data models | `User.php`, `Case.php`, `Client.php` | `backend/src/Models/` |
| `backend/src/Core/` | Core framework classes | `Auth.php`, `Router.php`, `Request.php` | `backend/src/Core/` |
| `backend/src/Middleware/` | Request middleware | `AuthMiddleware.php`, `CorsMiddleware.php` | `backend/src/Middleware/` |

### **Configuration & Assets**

| Path | Purpose | Key Files | Evidence |
|------|---------|-----------|----------|
| `backend/config/` | Application configuration | `config.php`, `config.production.php` | `backend/config/` |
| `backend/public/` | Built frontend assets | `index.html`, `assets/` | `backend/public/` |
| `backend/uploads/` | File upload storage | `documents/` | `backend/uploads/` |
| `backend/cache/` | Application cache | `backend/cache/` |
| `backend/logs/` | Application logs | `backend/logs/` |

## 🗄️ **Database Structure (`database/`)**

### **Database Configuration**

| Path | Purpose | Key Files | Evidence |
|------|---------|-----------|----------|
| `database/config/` | Database configuration | `database.php` | `database/config/` |
| `database/config.local.php` | Local database settings | `database/config.local.php` |

### **Schema & Migrations**

| Path | Purpose | Key Files | Evidence |
|------|---------|-----------|----------|
| `database/` | Main database files | `litigation_database.sql`, `setup.php` | `database/` |
| `database/migrations/` | Database migration scripts | `step_by_step_migration.sql` | `database/migrations/` |

### **Database Files**

| File | Purpose | Evidence |
|------|---------|----------|
| `litigation_database.sql` | Complete database schema | `database/litigation_database.sql` |
| `litigation.db` | SQLite database (backup) | `database/litigation.db` |
| `setup.php` | Database setup script | `database/setup.php` |
| `migrate_data.php` | Data migration script | `database/migrate_data.php` |

## 🧪 **Testing Structure (`tests/`)**

### **Test Organization**

| Path | Purpose | Key Files | Evidence |
|------|---------|-----------|----------|
| `tests/` | Playwright E2E tests | Various test files | `tests/` |
| `test-results/` | Test execution results | Generated during test runs | `test-results/` |
| `playwright-report/` | Test reports | Generated HTML reports | `playwright-report/` |

### **Test Configuration**

| File | Purpose | Evidence |
|------|---------|----------|
| `playwright.config.mjs` | Main Playwright configuration | `playwright.config.mjs` |
| `playwright-simple.config.mjs` | Simplified test configuration | `playwright-simple.config.mjs` |
| `vitest.config.ts` | Unit test configuration | `vitest.config.ts` |

## 🚀 **Deployment Structure (`deploy/`)**

### **Deployment Scripts**

| Path | Purpose | Key Files | Evidence |
|------|---------|-----------|----------|
| `deploy/` | Deployment configuration | Various deployment files | `deploy/` |

## 📚 **Documentation Structure**

### **Project Documentation**

| File | Purpose | Evidence |
|------|---------|----------|
| `README.md` | Main project documentation | `README.md` |
| `CHANGELOG.md` | Version history | `CHANGELOG.md` |
| `CONTRIBUTING.md` | Contribution guidelines | `CONTRIBUTING.md` |
| `SECURITY.md` | Security policy | `SECURITY.md` |
| `CODEOWNERS` | Code ownership | `CODEOWNERS` |

### **Technical Documentation**

| File | Purpose | Evidence |
|------|---------|----------|
| `CRUD_API_EXAMPLES.md` | API usage examples | `CRUD_API_EXAMPLES.md` |
| `REPORTS_API_DOCUMENTATION.md` | Reports API documentation | `REPORTS_API_DOCUMENTATION.md` |
| `UPLOAD_API_DOCUMENTATION.md` | File upload API documentation | `UPLOAD_API_DOCUMENTATION.md` |

## 🔧 **Configuration Files**

### **Build & Development**

| File | Purpose | Evidence |
|------|---------|----------|
| `package.json` | Node.js project configuration | `package.json` |
| `package-lock.json` | Dependency lock file | `package-lock.json` |
| `vite.config.ts` | Vite build configuration | `vite.config.ts` |
| `tsconfig.json` | TypeScript configuration | `tsconfig.json` |
| `tsconfig.node.json` | Node.js TypeScript configuration | `tsconfig.node.json` |

### **Code Quality**

| File | Purpose | Evidence |
|------|---------|----------|
| `.eslintrc.cjs` | ESLint configuration | `.eslintrc.cjs` |
| `.prettierrc` | Prettier configuration | `.prettierrc` |

### **Testing**

| File | Purpose | Evidence |
|------|---------|----------|
| `playwright.config.mjs` | Playwright E2E test configuration | `playwright.config.mjs` |
| `vitest.config.ts` | Vitest unit test configuration | `vitest.config.ts` |

## 📊 **File Size Analysis**

### **Large Directories (Excluded from Analysis)**

| Directory | Purpose | Size | Notes |
|-----------|---------|------|-------|
| `node_modules/` | Node.js dependencies | ~200MB | Standard npm dependencies |
| `backend/public/assets/` | Built frontend assets | ~5MB | Minified and optimized |
| `test-results/` | Test execution results | Variable | Generated during testing |
| `playwright-report/` | Test reports | Variable | Generated HTML reports |

### **Source Code Distribution**

| Directory | File Count | Primary Language | Purpose |
|-----------|------------|------------------|---------|
| `src/` | 30+ files | TypeScript/TSX | Frontend React application |
| `backend/src/` | 20+ files | PHP | Backend API and business logic |
| `database/` | 15+ files | SQL/PHP | Database schema and migrations |
| `tests/` | 20+ files | JavaScript/TypeScript | E2E test suites |

## 🎯 **Code Organization Patterns**

### **Frontend Patterns**

- **Component-based Architecture**: React functional components with hooks
- **Feature-based Organization**: Components grouped by functionality
- **TypeScript Integration**: Strong typing throughout the application
- **RTL Support**: Arabic language support with mixed content handling
- **Responsive Design**: Bootstrap-based responsive layout

### **Backend Patterns**

- **MVC Architecture**: Clear separation of concerns
- **RESTful API**: Standard HTTP methods and status codes
- **Middleware Pattern**: Request processing pipeline
- **Database Abstraction**: PDO-based database layer
- **Authentication**: JWT token-based security

### **Testing Patterns**

- **E2E Testing**: Playwright for full user workflows
- **Unit Testing**: Vitest for component and utility testing
- **Component Testing**: Storybook for isolated component development
- **Cross-browser Testing**: Multiple browser configurations
- **RTL Testing**: Arabic language and layout validation

## 🔍 **Generated vs Source Code**

### **Generated Files**

| Path | Purpose | Generated By | Evidence |
|------|---------|--------------|----------|
| `backend/public/` | Built frontend assets | Vite build process | `vite.config.ts:L44` |
| `node_modules/` | Dependencies | npm install | `package-lock.json` |
| `test-results/` | Test execution results | Playwright | `playwright.config.mjs:L208` |
| `playwright-report/` | Test reports | Playwright | `playwright.config.mjs:L19` |

### **Source Files**

| Path | Purpose | Language | Evidence |
|------|---------|----------|----------|
| `src/` | Frontend source code | TypeScript/TSX | `src/` |
| `backend/src/` | Backend source code | PHP | `backend/src/` |
| `database/` | Database scripts | SQL/PHP | `database/` |
| `tests/` | Test source code | JavaScript/TypeScript | `tests/` |

## 🚀 **Deployment Structure**

### **Production Build**

| Path | Purpose | Evidence |
|------|---------|----------|
| `backend/public/` | Production frontend assets | `vite.config.ts:L44` |
| `backend/` | Production backend code | `backend/` |
| `database/` | Production database scripts | `database/` |

### **Deployment Scripts**

| Path | Purpose | Evidence |
|------|---------|----------|
| `deploy/` | Deployment configuration | `deploy/` |
| `scripts/` | Build and deployment scripts | `scripts/` |

---

**Evidence Summary**: `package.json:L1-L150`, `src/`, `backend/`, `database/`, `tests/`, `vite.config.ts:L1-L67`, `tsconfig.json:L1-L44`, `playwright.config.mjs:L1-L210`, `vitest.config.ts:L1-L21`
