# Frontend Architecture Overview

## ⚛️ Framework & Technologies

**Primary Framework:** React 18.2.0  
**Language:** TypeScript 5.3.3 (Strict mode)  
**Build Tool:** Vite 7.1.7  
**UI Library:** Bootstrap 5.3.2 + React Bootstrap 2.9.2  
**Rendering Mode:** CSR (Client-Side Rendering)

**Evidence:** `package.json:L119-L120`, L102-L103, `tsconfig.json:L20`

---

## 🗺️ Router Configuration

### React Router Setup

**Version:** react-router-dom 6.20.1  
**Type:** Browser Router (HTML5 History API)

**Routes:**

| Path | Component | Access | Evidence |
|------|-----------|--------|----------|
| `/` | Dashboard | Protected | App.tsx |
| `/login` | Login | Public | App.tsx |
| `/dashboard` | Dashboard | Protected | App.tsx |
| `/cases` | CasesPage | Protected (Lawyer+) | App.tsx |
| `/clients` | ClientsPage | Protected (Lawyer+) | App.tsx |
| `/hearings` | HearingsPage | Protected (Lawyer+) | App.tsx |
| `/invoices` | Invoices | Protected (Admin+) | App.tsx |
| `/lawyers` | LawyersPage | Protected (Admin+) | App.tsx |
| `/reports` | ReportsPage | Protected (Lawyer+) | App.tsx |
| `/documents` | Documents | Protected (Staff+) | App.tsx |
| `/settings` | Settings | Protected | App.tsx |
| `/users` | Users | Protected (Admin+) | App.tsx |
| `*` | NotFound | Public | App.tsx |

**Evidence:** `src/pages/` directory (16 page files)

**Route Protection:**

```typescript
<ProtectedRoute requiredRole="admin">
    <UsersPage />
</ProtectedRoute>
```

**Evidence:** `src/components/auth/ProtectedRoute.tsx`

---

## 🎨 Styling Architecture

### CSS Framework

**Primary:** Bootstrap 5.3.2  
**Preprocessor:** Sass 1.69.7  
**RTL Support:** Built-in Bootstrap RTL + custom overrides

**Style Files:**

| File | Purpose | Evidence |
|------|---------|----------|
| `src/styles/main.scss` | Main stylesheet | Directory listing |
| `src/styles/variables.scss` | SCSS variables | Vite auto-import |
| `src/styles/mixins.scss` | Reusable mixins | Vite auto-import |
| `src/styles/rtl.scss` | RTL-specific styles | Directory listing |

**Evidence:** `src/styles/` directory, `vite.config.ts:L35-L37`

**Auto-Import Configuration:**

```typescript
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `
        @import "@styles/variables.scss";
        @import "@styles/mixins.scss";
      `
    }
  }
}
```

**Evidence:** `vite.config.ts:L33-L41`

---

## 🌍 Internationalization (i18n)

### i18n Framework

**Library:** i18next 23.7.16 + react-i18next 13.5.0

**Configuration:**

```typescript
i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    en: { translation: en }
  },
  lng: localStorage.getItem('language') || 'ar',
  fallbackLng: 'ar'
});
```

**Evidence:** `src/i18n/index.ts:L9-L40`

**Languages:**
- **Arabic (ar):** Primary, default, RTL
- **English (en):** Secondary, LTR

**Translation Files:**
- `src/i18n/locales/ar.ts` - Arabic translations
- `src/i18n/locales/en.ts` - English translations

**Persistence:** localStorage (`language` key)

---

### RTL (Right-to-Left) Support

**Implementation:**

1. **HTML dir attribute:** `<html dir="rtl">` for Arabic
2. **Bootstrap RTL:** Separate RTL stylesheet
3. **Custom RTL styles:** `src/styles/rtl.scss`
4. **Per-field direction:** Mixed content components

**Evidence:** `index.html`, `src/styles/rtl.scss`

**Custom Hook:**

```typescript
// src/hooks/useRTL.ts
export const useRTL = () => {
  const { i18n } = useTranslation();
  return i18n.language === 'ar';
};
```

**Evidence:** `src/hooks/useRTL.ts`

---

## 📊 State Management

### State Architecture

**Layers:**

| Layer | Technology | Purpose | Evidence |
|-------|------------|---------|----------|
| **Local State** | useState/useReducer | Component state | React hooks |
| **Global State** | React Context | Auth, language | `src/contexts/AuthContext.tsx` |
| **Server State** | React Query 3.39.3 | API data caching | `package.json:L128` |
| **Persistent State** | localStorage | Token, preferences | `src/services/api.ts:L96` |

**No Redux:** React Context + React Query sufficient for app complexity

---

### Context Providers

| Context | File | Provides | Evidence |
|---------|------|----------|----------|
| **AuthContext** | `src/contexts/AuthContext.tsx` | user, login, logout, isAuthenticated | Directory listing |

**Evidence:** `src/contexts/` directory

---

## 🎣 Custom Hooks

| Hook | File | Purpose | Evidence |
|------|------|---------|----------|
| **useLanguage** | `src/hooks/useLanguage.ts` | Language switching | Directory listing |
| **usePermissions** | `src/hooks/usePermissions.ts` | Permission checks | Directory listing |
| **useRTL** | `src/hooks/useRTL.ts` | RTL detection | Directory listing |

**Evidence:** `src/hooks/` directory

---

## 🔌 API Integration

### API Service

**File:** `src/services/api.ts`  
**HTTP Client:** Axios 1.6.2  
**Lines of Code:** 624

**Features:**
- Token management (localStorage)
- Request/response interceptors
- Error handling
- Pagination support
- Type-safe responses

**Base URL Configuration:**

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';
```

**Evidence:** `src/services/api.ts:L8-L10`

---

## 🏗️ Build Configuration

### Vite Settings

**Development:**
- **Port:** 3005
- **Host:** 0.0.0.0
- **Allowed Hosts:** lit.local, localhost, 127.0.0.1
- **HMR:** WebSocket (automatic)

**Production:**
- **Output:** `backend/public/`
- **Empty on build:** true
- **Source maps:** Enabled
- **Minification:** Automatic
- **Code splitting:** Manual chunks (vendor, router, ui, forms, utils)

**Evidence:** `vite.config.ts:L12-L59`

---

## 📦 Bundle Optimization

**Manual Chunks:**

```typescript
manualChunks: {
  vendor: ['react', 'react-dom'],        // ~140KB
  router: ['react-router-dom'],          // ~50KB
  ui: ['react-bootstrap', 'bootstrap'],  // ~200KB
  forms: ['react-hook-form', '@hookform/resolvers', 'zod'],  // ~80KB
  utils: ['axios', 'date-fns', 'clsx']   // ~100KB
}
```

**Evidence:** `vite.config.ts:L50-L56`

**Benefits:**
- ✅ Better caching (vendor changes less often)
- ✅ Parallel loading
- ✅ Smaller initial bundle

---

## ♿ Accessibility (a11y)

**Testing:** Playwright a11y addon  
**Standards:** WCAG 2.1 AA compliance (goal)

**Features:**
- ✅ Semantic HTML
- ✅ ARIA labels (Bootstrap default)
- ✅ Keyboard navigation
- ✅ Screen reader testing
- ✅ Reduced motion support

**Evidence:** `playwright.config.mjs:L53` (reducedMotion), `tests/accessibility.spec.js`

---

## 📱 Responsive Design

**Breakpoints:** Bootstrap default
- **xs:** <576px
- **sm:** ≥576px
- **md:** ≥768px
- **lg:** ≥992px
- **xl:** ≥1200px
- **xxl:** ≥1400px

**Mobile Testing:** Pixel 5, iPhone 12  
**Evidence:** `playwright.config.mjs:L116-L139`

---

## 🚀 Performance Optimizations

**Implemented:**
- ✅ Code splitting (manual chunks)
- ✅ Tree shaking (Vite automatic)
- ✅ Asset minification
- ⚠️ Lazy loading (not explicitly configured)
- ⚠️ Image optimization (not configured)
- ⚠️ Service workers (not configured)

**Recommended Additions:**
1. React.lazy for route-based code splitting
2. Image optimization (vite-plugin-imagemin)
3. Service worker for offline support
4. Bundle analyzer (rollup-plugin-visualizer)

---

## 🔗 Related Documentation

- **[TECH_STACK.md](../TECH_STACK.md)** - Complete frontend stack
- **[COMPONENT_INDEX.md](COMPONENT_INDEX.md)** - Component catalog
- **[ARCHITECTURE.md](../ARCHITECTURE.md)** - Overall architecture

---

**Last Updated:** October 7, 2025  
**Frontend Maturity:** PRODUCTION-READY

