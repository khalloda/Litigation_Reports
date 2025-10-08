# Frontend Component Index

## 📊 Overview

Complete catalog of React components in the Litigation Management System with props, usage, and dependencies.

**Total Components:** 28  
**Total Pages:** 16  
**Framework:** React 18.2 + TypeScript 5.3

---

## 📁 Component Categories

### 🔐 Authentication Components (3)

| Component | Path | Props | Purpose | Used By | Evidence |
|-----------|------|-------|---------|---------|----------|
| **AuthProvider** | `src/components/auth/AuthProvider.tsx` | `children` | Context provider for auth state | App.tsx | Directory |
| **ProtectedRoute** | `src/components/auth/ProtectedRoute.tsx` | `children`, `requiredRole?` | Route access control | App.tsx, all protected routes | Directory |
| **PermissionGate** | `src/components/auth/PermissionGate.tsx` | `permission`, `children` | Conditional rendering by permission | Various pages | Directory |

---

### 🎨 Layout Components (4)

| Component | Path | Props | Purpose | Used By | Evidence |
|-----------|------|-------|---------|---------|----------|
| **Layout** | `src/components/layout/Layout.tsx` | `children` | Main app layout wrapper | All pages | Directory |
| **Navbar** | `src/components/layout/Navbar.tsx` | - | Top navigation bar | Layout | Directory |
| **Sidebar** | `src/components/layout/Sidebar.tsx` | - | Side navigation (RTL-aware) | Layout | Directory |
| **Footer** | `src/components/layout/Footer.tsx` | - | Page footer | Layout | Directory |

---

### 📋 Modal Components (3)

| Component | Path | Props (Summary) | Purpose | Evidence |
|-----------|------|-----------------|---------|----------|
| **CaseModal** | `src/components/modals/CaseModal.tsx` | `isOpen`, `onClose`, `case?`, `onSave` | Create/edit case | CasesPage | Directory |
| **ClientModal** | `src/components/modals/ClientModal.tsx` | `isOpen`, `onClose`, `client?`, `onSave` | Create/edit client | ClientsPage | Directory |
| **HearingModal** | `src/components/modals/HearingModal.tsx` | `isOpen`, `onClose`, `hearing?`, `onSave` | Create/edit hearing | HearingsPage | Directory |

---

### 📝 Form Components (4)

| Component | Path | Props | Purpose | Evidence |
|-----------|------|-------|---------|----------|
| **FormInput** | `src/components/FormInput.tsx` | `label`, `type`, `value`, `onChange`, `error?` | Reusable form input | All forms | Directory |
| **LawyerMultiSelect** | `src/components/forms/LawyerMultiSelect.tsx` | `value`, `onChange`, `options` | Multi-select for lawyers | HearingModal | Directory |
| **MixedContentInput** | `src/components/forms/MixedContentInput.tsx` | `value`, `onChange`, `dir?` | AR/EN mixed input | Various forms | Directory |
| **MixedContentTextarea** | `src/components/forms/MixedContentTextarea.tsx` | `value`, `onChange`, `rows?` | AR/EN mixed textarea | Various forms | Directory |

---

### 🔧 UI Components (4)

| Component | Path | Props | Purpose | Evidence |
|-----------|------|-------|---------|----------|
| **LanguageSwitcher** | `src/components/ui/LanguageSwitcher.tsx` | - | AR/EN toggle | Navbar | Directory |
| **UserMenu** | `src/components/ui/UserMenu.tsx` | `user` | User dropdown menu | Navbar | Directory |
| **Logo** | `src/components/Logo.tsx` | `size?` | Company logo | Navbar | Directory |
| **StatusCheck** | `src/components/StatusCheck.tsx` | - | System status indicator | Dashboard | Directory |

---

### 📊 Table Components (1)

| Component | Path | Props (Summary) | Purpose | Evidence |
|-----------|------|-----------------|---------|----------|
| **ServerPaginatedTable** | `src/components/tables/ServerPaginatedTable.tsx` | `columns`, `data`, `pagination`, `onPageChange` | Reusable paginated table | All list pages | Directory |

---

### ⚙️ Settings Components (2)

| Component | Path | Purpose | Evidence |
|-----------|------|---------|----------|
| **GeneralSettings** | `src/components/settings/GeneralSettings.tsx` | System settings management | Directory |
| **ProfileSettings** | `src/components/settings/ProfileSettings.tsx` | User profile management | Directory |

---

### 👥 Admin Components (1)

| Component | Path | Purpose | Evidence |
|-----------|------|---------|----------|
| **RoleManagement** | `src/components/admin/RoleManagement.tsx` | User role administration | Directory |

---

### 📤 Common/Shared Components (3)

| Component | Path | Purpose | Evidence |
|-----------|------|---------|----------|
| **FileUpload** | `src/components/common/FileUpload.tsx` | Drag-drop file upload | Documents page | Directory |
| **LoginForm** | `src/components/LoginForm.tsx` | Login form | Login page | Directory |
| **Dashboard** | `src/components/Dashboard.tsx` | Dashboard component | Dashboard page | Directory |

---

### 📊 Additional Components (3)

| Component | Path | Purpose | Evidence |
|-----------|------|---------|----------|
| **ClientSpecificReportModal** | `src/components/ClientSpecificReportModal.tsx` | Advanced report builder | ReportsPage | Directory |
| **LanguageSwitcher** | `src/components/LanguageSwitcher.tsx` | Duplicate/alternate implementation | - | Directory |

---

## 📄 Page Components (16)

| Page | Path | Purpose | Route | Evidence |
|------|------|---------|-------|----------|
| **Login** | `src/pages/auth/Login.tsx` | Login page | `/login` | Directory |
| **Dashboard** | `src/pages/Dashboard.tsx` | Dashboard | `/dashboard` | Directory |
| **CasesPage** | `src/pages/CasesPage.tsx` | Case management | `/cases` | Directory |
| **ClientsPage** | `src/pages/ClientsPage.tsx` | Client management | `/clients` | Directory |
| **HearingsPage** | `src/pages/HearingsPage.tsx` | Hearing management | `/hearings` | Directory |
| **Invoices** | `src/pages/Invoices.tsx` | Invoice management | `/invoices` | Directory |
| **LawyersPage** | `src/pages/LawyersPage.tsx` | Lawyer management | `/lawyers` | Directory |
| **ReportsPage** | `src/pages/ReportsPage.tsx` | Report generation | `/reports` | Directory |
| **Documents** | `src/pages/Documents.tsx` | Document management | `/documents` | Directory |
| **Settings** | `src/pages/Settings.tsx` | System settings | `/settings` | Directory |
| **Users** | `src/pages/Users.tsx` | User management | `/users` | Directory |
| **NotFound** | `src/pages/NotFound.tsx` | 404 error page | `*` | Directory |

**Duplicate Pages (Legacy):**
- Cases.tsx, Clients.tsx, Hearings.tsx, Reports.tsx (older versions)

**Evidence:** `src/pages/` directory (16 files)

---

## 🔄 Component Reusability

### Highly Reused Components

| Component | Usage Count (Est.) | Used In |
|-----------|-------------------|---------|
| **ServerPaginatedTable** | 6+ | All list pages (Cases, Clients, Hearings, etc.) |
| **FormInput** | 20+ | All forms |
| **ProtectedRoute** | 10+ | All protected routes |
| **LanguageSwitcher** | 1 | Navbar (global) |
| **Logo** | 2-3 | Navbar, Login page |

### Single-Use Components

- ClientSpecificReportModal (ReportsPage only)
- RoleManagement (Admin page only)
- UserMenu (Navbar only)

---

## 📦 Component Dependencies

### Third-Party Component Libraries

| Library | Components Used | Evidence |
|---------|-----------------|----------|
| **react-bootstrap** | Button, Modal, Form, Table, Nav, Navbar | `package.json:L120` |
| **react-select** | Advanced dropdowns | `package.json:L130` |
| **react-datepicker** | Date inputs | `package.json:L122` |
| **react-dropzone** | File upload | `package.json:L124` |
| **react-table** | Table functionality | `package.json:L131` |

---

## 🎯 Component Quality Assessment

### Strengths

✅ **Clear Organization:** Logical directory structure  
✅ **TypeScript:** Full type safety  
✅ **Reusability:** Shared components well-defined  
✅ **Accessibility:** Bootstrap + custom a11y  
✅ **RTL Support:** Comprehensive Arabic support

### Gaps

❌ **Component Stories:** Only 1/28 have Storybook stories  
⚠️ **Duplicate Components:** LanguageSwitcher in two locations  
⚠️ **Legacy Pages:** Duplicate page files (Cases.tsx vs CasesPage.tsx)  
⚠️ **PropTypes Documentation:** Limited JSDoc on components

---

## 🔍 Component Analysis

### Dead/Unused Components

**Potentially Unused:**
- `Cases.tsx`, `Clients.tsx`, `Hearings.tsx`, `Reports.tsx` (if "Page" versions are primary)

**Recommendation:** Remove duplicates or clarify naming convention

### Duplicate Components

| Component | Locations | Recommendation |
|-----------|-----------|----------------|
| **LanguageSwitcher** | `components/`, `components/ui/` | Remove one |

---

## 🚀 Component Development Workflow

**Current:**
1. Create component in appropriate directory
2. Add TypeScript types
3. Import and use in pages
4. (Optional) Create Storybook story

**Recommended:**
1. Design in Storybook first
2. Create component with TypeScript
3. Write interaction tests in Storybook
4. Integrate into pages
5. E2E test with Playwright

---

## 🔗 Related Documentation

- **[STORYBOOK.md](STORYBOOK.md)** - Storybook setup and coverage
- **[TECH_STACK.md](../TECH_STACK.md)** - Frontend technology details
- **[ARCHITECTURE.md](../ARCHITECTURE.md)** - Overall architecture

---

**Last Updated:** October 7, 2025  
**Component Count:** 28 components, 16 pages  
**Reusability Score:** Good (shared components well-defined)

