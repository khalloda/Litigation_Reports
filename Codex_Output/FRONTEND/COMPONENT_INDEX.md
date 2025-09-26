# 🧩 Component Index - Litigation Management System

## 📊 **Component Overview**

The **Litigation Management System** frontend contains **30+ React components** organized into logical categories. Each component is built with TypeScript for type safety and follows modern React patterns with hooks and functional components.

### **Component Statistics**

| Category | Count | Purpose | Evidence |
|----------|-------|---------|----------|
| **Layout Components** | 4 | Application shell and navigation | `src/components/layout/` |
| **Form Components** | 3 | Input and form handling | `src/components/forms/` |
| **Table Components** | 1 | Data display and pagination | `src/components/tables/` |
| **Modal Components** | 1 | Overlay dialogs | `src/components/modals/` |
| **UI Components** | 2 | Utility and interface components | `src/components/ui/` |
| **Auth Components** | 3 | Authentication and authorization | `src/components/auth/` |
| **Page Components** | 12 | Business logic pages | `src/pages/` |
| **Total Components** | 26+ | Complete application interface | `src/` |

## 🏗️ **Layout Components**

### **Layout.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/components/layout/Layout.tsx` | Main application layout | `src/components/layout/Layout.tsx` |
| **Props** | None | Layout container component | `src/components/layout/Layout.tsx:L9` |
| **Used By** | App.tsx | Application shell | `src/App.tsx:L52` |
| **Features** | RTL support, sidebar toggle, responsive design | `src/components/layout/Layout.tsx:L10-L40` |
| **Dependencies** | Navbar, Sidebar, Footer, useRTL, useLanguage | `src/components/layout/Layout.tsx:L3-L7` |

### **Navbar.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/components/layout/Navbar.tsx` | Top navigation bar | `src/components/layout/Navbar.tsx` |
| **Props** | `onToggleSidebar`, `sidebarCollapsed` | Navigation with sidebar control | `src/components/layout/Navbar.tsx` |
| **Used By** | Layout.tsx | Main navigation | `src/components/layout/Layout.tsx:L20` |
| **Features** | Language switcher, user menu, sidebar toggle | `src/components/layout/Navbar.tsx` |
| **Dependencies** | LanguageSwitcher, UserMenu, useRTL | `src/components/layout/Navbar.tsx` |

### **Sidebar.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/components/layout/Sidebar.tsx` | Side navigation menu | `src/components/layout/Sidebar.tsx` |
| **Props** | `collapsed`, `onToggle` | Collapsible sidebar navigation | `src/components/layout/Sidebar.tsx` |
| **Used By** | Layout.tsx | Main navigation | `src/components/layout/Layout.tsx:L23` |
| **Features** | Collapsible design, RTL support, role-based menu | `src/components/layout/Sidebar.tsx` |
| **Dependencies** | useRTL, useLanguage, usePermissions | `src/components/layout/Sidebar.tsx` |

### **Footer.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/components/layout/Footer.tsx` | Application footer | `src/components/layout/Footer.tsx` |
| **Props** | None | Footer information | `src/components/layout/Footer.tsx` |
| **Used By** | Layout.tsx | Page footer | `src/components/layout/Layout.tsx:L36` |
| **Features** | Copyright, version info, RTL support | `src/components/layout/Footer.tsx` |
| **Dependencies** | useLanguage | `src/components/layout/Footer.tsx` |

## 📝 **Form Components**

### **FormInput.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/components/FormInput.tsx` | Generic form input component | `src/components/FormInput.tsx` |
| **Props** | `label`, `type`, `value`, `onChange`, `error`, `required` | Reusable input field | `src/components/FormInput.tsx` |
| **Used By** | LoginForm, ClientModal, various forms | Form input fields | `src/components/FormInput.tsx` |
| **Features** | Validation, error display, RTL support | `src/components/FormInput.tsx` |
| **Dependencies** | React Hook Form, Bootstrap | `src/components/FormInput.tsx` |

### **MixedContentInput.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/components/forms/MixedContentInput.tsx` | Arabic/English mixed content input | `src/components/forms/MixedContentInput.tsx` |
| **Props** | `value`, `onChange`, `placeholder`, `direction` | Mixed language input | `src/components/forms/MixedContentInput.tsx` |
| **Used By** | Client forms, Case forms | Bilingual content input | `src/components/forms/MixedContentInput.tsx` |
| **Features** | Auto-direction detection, RTL/LTR switching | `src/components/forms/MixedContentInput.tsx` |
| **Dependencies** | useRTL, mixedContent utility | `src/components/forms/MixedContentInput.tsx` |

### **MixedContentTextarea.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/components/forms/MixedContentTextarea.tsx` | Arabic/English mixed content textarea | `src/components/forms/MixedContentTextarea.tsx` |
| **Props** | `value`, `onChange`, `placeholder`, `rows` | Mixed language textarea | `src/components/forms/MixedContentTextarea.tsx` |
| **Used By** | Case forms, Document forms | Bilingual text input | `src/components/forms/MixedContentTextarea.tsx` |
| **Features** | Auto-direction detection, resizable | `src/components/forms/MixedContentTextarea.tsx` |
| **Dependencies** | useRTL, mixedContent utility | `src/components/forms/MixedContentTextarea.tsx` |

## 📊 **Table Components**

### **ServerPaginatedTable.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/components/tables/ServerPaginatedTable.tsx` | Server-side paginated data table | `src/components/tables/ServerPaginatedTable.tsx` |
| **Props** | `columns`, `data`, `pagination`, `onPageChange`, `loading` | Data table with pagination | `src/components/tables/ServerPaginatedTable.tsx` |
| **Used By** | ClientsPage, CasesPage, HearingsPage | Data display | `src/components/tables/ServerPaginatedTable.tsx` |
| **Features** | Server pagination, sorting, filtering, RTL support | `src/components/tables/ServerPaginatedTable.tsx` |
| **Dependencies** | React Table, Bootstrap, useRTL | `src/components/tables/ServerPaginatedTable.tsx` |

## 🪟 **Modal Components**

### **ClientModal.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/components/modals/ClientModal.tsx` | Client creation/editing modal | `src/components/modals/ClientModal.tsx` |
| **Props** | `show`, `onHide`, `client`, `onSave` | Client form modal | `src/components/modals/ClientModal.tsx` |
| **Used By** | ClientsPage | Client management | `src/components/modals/ClientModal.tsx` |
| **Features** | Form validation, RTL support, file upload | `src/components/modals/ClientModal.tsx` |
| **Dependencies** | React Hook Form, Bootstrap Modal, FormInput | `src/components/modals/ClientModal.tsx` |

## 🎛️ **UI Components**

### **LanguageSwitcher.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/components/LanguageSwitcher.tsx` | Language toggle component | `src/components/LanguageSwitcher.tsx` |
| **Props** | None | Language switching interface | `src/components/LanguageSwitcher.tsx` |
| **Used By** | Navbar, Layout | Language selection | `src/components/LanguageSwitcher.tsx` |
| **Features** | Arabic/English toggle, RTL switching | `src/components/LanguageSwitcher.tsx` |
| **Dependencies** | useLanguage, useRTL | `src/components/LanguageSwitcher.tsx` |

### **UserMenu.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/components/ui/UserMenu.tsx` | User dropdown menu | `src/components/ui/UserMenu.tsx` |
| **Props** | `user`, `onLogout` | User account menu | `src/components/ui/UserMenu.tsx` |
| **Used By** | Navbar | User account access | `src/components/ui/UserMenu.tsx` |
| **Features** | Profile access, logout, RTL support | `src/components/ui/UserMenu.tsx` |
| **Dependencies** | Bootstrap Dropdown, useAuth | `src/components/ui/UserMenu.tsx` |

## 🔐 **Authentication Components**

### **AuthProvider.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/components/auth/AuthProvider.tsx` | Authentication context provider | `src/components/auth/AuthProvider.tsx` |
| **Props** | `children` | Authentication state management | `src/components/auth/AuthProvider.tsx` |
| **Used By** | App.tsx | Application-wide auth state | `src/App.tsx:L41` |
| **Features** | JWT token management, user state, login/logout | `src/components/auth/AuthProvider.tsx` |
| **Dependencies** | React Context, API service | `src/components/auth/AuthProvider.tsx` |

### **ProtectedRoute.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/components/auth/ProtectedRoute.tsx` | Route protection wrapper | `src/components/auth/ProtectedRoute.tsx` |
| **Props** | `children`, `requiredRole`, `requiredPermission` | Route access control | `src/components/auth/ProtectedRoute.tsx` |
| **Used By** | App.tsx | Protected route wrapper | `src/App.tsx:L51` |
| **Features** | Authentication check, role-based access, redirect | `src/components/auth/ProtectedRoute.tsx` |
| **Dependencies** | useAuth, React Router | `src/components/auth/ProtectedRoute.tsx` |

### **PermissionGate.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/components/auth/PermissionGate.tsx` | Permission-based component rendering | `src/components/auth/PermissionGate.tsx` |
| **Props** | `children`, `permission`, `role` | Conditional rendering based on permissions | `src/components/auth/PermissionGate.tsx` |
| **Used By** | Various components | Permission-based UI | `src/components/auth/PermissionGate.tsx` |
| **Features** | Role checking, permission validation, fallback UI | `src/components/auth/PermissionGate.tsx` |
| **Dependencies** | usePermissions | `src/components/auth/PermissionGate.tsx` |

## 📄 **Page Components**

### **Dashboard.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/pages/Dashboard.tsx` | Main dashboard page | `src/pages/Dashboard.tsx` |
| **Props** | None | Dashboard overview | `src/pages/Dashboard.tsx` |
| **Used By** | App.tsx | Main dashboard route | `src/App.tsx:L57` |
| **Features** | Statistics cards, recent activity, quick actions | `src/pages/Dashboard.tsx` |
| **Dependencies** | React Query, Chart.js, useAuth | `src/pages/Dashboard.tsx` |

### **ClientsPage.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/pages/ClientsPage.tsx` | Client management page | `src/pages/ClientsPage.tsx` |
| **Props** | None | Client CRUD operations | `src/pages/ClientsPage.tsx` |
| **Used By** | App.tsx | Client management routes | `src/App.tsx:L58-L61` |
| **Features** | Client listing, search, filtering, CRUD operations | `src/pages/ClientsPage.tsx` |
| **Dependencies** | ServerPaginatedTable, ClientModal, React Query | `src/pages/ClientsPage.tsx` |

### **CasesPage.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/pages/CasesPage.tsx` | Case management page | `src/pages/CasesPage.tsx` |
| **Props** | None | Case CRUD operations | `src/pages/CasesPage.tsx` |
| **Used By** | App.tsx | Case management routes | `src/App.tsx:L62-L65` |
| **Features** | Case listing, search, filtering, CRUD operations | `src/pages/CasesPage.tsx` |
| **Dependencies** | ServerPaginatedTable, React Query, useAuth | `src/pages/CasesPage.tsx` |

### **HearingsPage.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/pages/HearingsPage.tsx` | Hearing management page | `src/pages/HearingsPage.tsx` |
| **Props** | None | Hearing CRUD operations | `src/pages/HearingsPage.tsx` |
| **Used By** | App.tsx | Hearing management routes | `src/App.tsx:L66-L69` |
| **Features** | Hearing listing, calendar view, CRUD operations | `src/pages/HearingsPage.tsx` |
| **Dependencies** | ServerPaginatedTable, React Query, date-fns | `src/pages/HearingsPage.tsx` |

### **Invoices.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/pages/Invoices.tsx` | Invoice management page | `src/pages/Invoices.tsx` |
| **Props** | None | Invoice CRUD operations | `src/pages/Invoices.tsx` |
| **Used By** | App.tsx | Invoice management routes | `src/App.tsx:L70-L73` |
| **Features** | Invoice listing, payment tracking, CRUD operations | `src/pages/Invoices.tsx` |
| **Dependencies** | ServerPaginatedTable, React Query, Chart.js | `src/pages/Invoices.tsx` |

### **LawyersPage.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/pages/LawyersPage.tsx` | Lawyer management page | `src/pages/LawyersPage.tsx` |
| **Props** | None | Lawyer CRUD operations | `src/pages/LawyersPage.tsx` |
| **Used By** | App.tsx | Lawyer management routes | `src/App.tsx:L74-L77` |
| **Features** | Lawyer listing, profile management, CRUD operations | `src/pages/LawyersPage.tsx` |
| **Dependencies** | ServerPaginatedTable, React Query | `src/pages/LawyersPage.tsx` |

### **Documents.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/pages/Documents.tsx` | Document management page | `src/pages/Documents.tsx` |
| **Props** | None | Document CRUD operations | `src/pages/Documents.tsx` |
| **Used By** | App.tsx | Document management routes | `src/App.tsx:L78-L80` |
| **Features** | Document listing, file upload, CRUD operations | `src/pages/Documents.tsx` |
| **Dependencies** | React Dropzone, React Query, FileUpload | `src/pages/Documents.tsx` |

### **ReportsPage.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/pages/ReportsPage.tsx` | Report generation page | `src/pages/ReportsPage.tsx` |
| **Props** | None | Report generation and export | `src/pages/ReportsPage.tsx` |
| **Used By** | App.tsx | Reports route | `src/App.tsx:L81` |
| **Features** | Report filters, data visualization, export options | `src/pages/ReportsPage.tsx` |
| **Dependencies** | Chart.js, React Query, date-fns | `src/pages/ReportsPage.tsx` |

### **Settings.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/pages/Settings.tsx` | Application settings page | `src/pages/Settings.tsx` |
| **Props** | None | System configuration | `src/pages/Settings.tsx` |
| **Used By** | App.tsx | Settings route | `src/App.tsx:L82` |
| **Features** | User preferences, system settings, language options | `src/pages/Settings.tsx` |
| **Dependencies** | useLanguage, useRTL, React Hook Form | `src/pages/Settings.tsx` |

### **Users.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/pages/Users.tsx` | User management page | `src/pages/Users.tsx` |
| **Props** | None | User CRUD operations | `src/pages/Users.tsx` |
| **Used By** | App.tsx | User management route | `src/App.tsx:L83` |
| **Features** | User listing, role management, CRUD operations | `src/pages/Users.tsx` |
| **Dependencies** | ServerPaginatedTable, React Query, PermissionGate | `src/pages/Users.tsx` |

### **Login.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/pages/auth/Login.tsx` | Authentication page | `src/pages/auth/Login.tsx` |
| **Props** | None | User login interface | `src/pages/auth/Login.tsx` |
| **Used By** | App.tsx | Login route | `src/App.tsx:L45` |
| **Features** | Login form, RTL support, error handling | `src/pages/auth/Login.tsx` |
| **Dependencies** | LoginForm, useAuth, useRTL | `src/pages/auth/Login.tsx` |

### **NotFound.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/pages/NotFound.tsx` | 404 error page | `src/pages/NotFound.tsx` |
| **Props** | None | Error page display | `src/pages/NotFound.tsx` |
| **Used By** | App.tsx | Catch-all route | `src/App.tsx:L87` |
| **Features** | Error message, navigation back, RTL support | `src/pages/NotFound.tsx` |
| **Dependencies** | React Router, useRTL | `src/pages/NotFound.tsx` |

## 🎣 **Custom Hooks**

### **useLanguage.ts**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/hooks/useLanguage.ts` | Language state management | `src/hooks/useLanguage.ts` |
| **Returns** | `currentLanguage`, `setLanguage`, `isArabic` | Language utilities | `src/hooks/useLanguage.ts` |
| **Used By** | App.tsx, Layout.tsx, LanguageSwitcher | Language management | `src/hooks/useLanguage.ts` |
| **Features** | Language switching, persistence, RTL detection | `src/hooks/useLanguage.ts` |
| **Dependencies** | localStorage, i18next | `src/hooks/useLanguage.ts` |

### **useRTL.ts**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/hooks/useRTL.ts` | RTL direction management | `src/hooks/useRTL.ts` |
| **Returns** | `isRTL`, `setDirection`, `direction` | RTL utilities | `src/hooks/useRTL.ts` |
| **Used By** | App.tsx, Layout.tsx, various components | RTL support | `src/hooks/useRTL.ts` |
| **Features** | Direction detection, document updates | `src/hooks/useRTL.ts` |
| **Dependencies** | useLanguage | `src/hooks/useRTL.ts` |

### **usePermissions.ts**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/hooks/usePermissions.ts` | Permission checking | `src/hooks/usePermissions.ts` |
| **Returns** | `hasPermission`, `hasRole`, `userRole` | Permission utilities | `src/hooks/usePermissions.ts` |
| **Used By** | PermissionGate, Sidebar, various components | Access control | `src/hooks/usePermissions.ts` |
| **Features** | Role-based access, permission validation | `src/hooks/usePermissions.ts` |
| **Dependencies** | useAuth | `src/hooks/usePermissions.ts` |

## 🔧 **Utility Components**

### **FileUpload.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/components/common/FileUpload.tsx` | File upload component | `src/components/common/FileUpload.tsx` |
| **Props** | `onUpload`, `accept`, `maxSize` | File upload interface | `src/components/common/FileUpload.tsx` |
| **Used By** | Documents.tsx, ClientModal | File upload functionality | `src/components/common/FileUpload.tsx` |
| **Features** | Drag and drop, file validation, progress tracking | `src/components/common/FileUpload.tsx` |
| **Dependencies** | React Dropzone, React Query | `src/components/common/FileUpload.tsx` |

### **StatusCheck.tsx**

| Property | Type | Purpose | Evidence |
|----------|------|---------|----------|
| **Path** | `src/components/StatusCheck.tsx` | System status indicator | `src/components/StatusCheck.tsx` |
| **Props** | None | Status monitoring | `src/components/StatusCheck.tsx` |
| **Used By** | Layout.tsx, Dashboard | System health display | `src/components/StatusCheck.tsx` |
| **Features** | API connectivity, status indicators | `src/components/StatusCheck.tsx` |
| **Dependencies** | React Query, API service | `src/components/StatusCheck.tsx` |

## 📊 **Component Usage Analysis**

### **Most Used Components**

| Component | Usage Count | Used By | Evidence |
|-----------|-------------|---------|----------|
| **FormInput** | 15+ | All form components | `src/components/FormInput.tsx` |
| **ServerPaginatedTable** | 8 | All data pages | `src/components/tables/ServerPaginatedTable.tsx` |
| **MixedContentInput** | 10+ | Bilingual forms | `src/components/forms/MixedContentInput.tsx` |
| **PermissionGate** | 12+ | Access-controlled components | `src/components/auth/PermissionGate.tsx` |
| **useLanguage** | 20+ | All components | `src/hooks/useLanguage.ts` |

### **Component Dependencies**

| Component | Dependencies | Evidence |
|-----------|--------------|----------|
| **Layout** | Navbar, Sidebar, Footer, useRTL, useLanguage | `src/components/layout/Layout.tsx:L3-L7` |
| **Navbar** | LanguageSwitcher, UserMenu, useRTL | `src/components/layout/Navbar.tsx` |
| **Sidebar** | useRTL, useLanguage, usePermissions | `src/components/layout/Sidebar.tsx` |
| **FormInput** | React Hook Form, Bootstrap | `src/components/FormInput.tsx` |
| **ServerPaginatedTable** | React Table, Bootstrap, useRTL | `src/components/tables/ServerPaginatedTable.tsx` |

## 🔍 **Component Quality Analysis**

### **TypeScript Coverage**

| Component Category | TypeScript Usage | Type Safety | Evidence |
|-------------------|------------------|-------------|----------|
| **Layout Components** | Full TypeScript | Strong typing | `src/components/layout/` |
| **Form Components** | Full TypeScript | Interface definitions | `src/components/forms/` |
| **Page Components** | Full TypeScript | Props typing | `src/pages/` |
| **Custom Hooks** | Full TypeScript | Return type definitions | `src/hooks/` |

### **RTL Support Coverage**

| Component Category | RTL Support | Implementation | Evidence |
|-------------------|-------------|----------------|----------|
| **Layout Components** | Full RTL | Direction-aware styling | `src/components/layout/` |
| **Form Components** | Full RTL | Mixed content support | `src/components/forms/` |
| **Table Components** | Full RTL | RTL table layout | `src/components/tables/` |
| **UI Components** | Full RTL | Direction switching | `src/components/ui/` |

## 🚀 **Component Performance**

### **Optimization Strategies**

| Component | Optimization | Purpose | Evidence |
|-----------|--------------|---------|----------|
| **ServerPaginatedTable** | Virtual scrolling | Large dataset handling | `src/components/tables/ServerPaginatedTable.tsx` |
| **FormInput** | Debounced validation | Input performance | `src/components/FormInput.tsx` |
| **Layout** | Memoized sidebar state | Re-render optimization | `src/components/layout/Layout.tsx` |
| **MixedContentInput** | Direction caching | RTL performance | `src/components/forms/MixedContentInput.tsx` |

### **Bundle Impact**

| Component | Bundle Size | Impact | Evidence |
|-----------|-------------|--------|----------|
| **Layout Components** | ~15KB | Core application shell | `src/components/layout/` |
| **Form Components** | ~8KB | Form functionality | `src/components/forms/` |
| **Table Components** | ~12KB | Data display | `src/components/tables/` |
| **Page Components** | ~25KB | Business logic | `src/pages/` |

---

**Evidence Summary**: `src/components/`, `src/pages/`, `src/hooks/`, `src/App.tsx:L1-L95`, `src/main.tsx:L1-L40`, `package.json:L105-L130`
