# Technology Stack Analysis

## 📋 Overview

Complete inventory of languages, frameworks, libraries, tools, and runtime dependencies for the Litigation Management System.

---

## 🔤 Languages & Runtimes

### Frontend Languages

| Language | Version | Usage | Evidence |
|----------|---------|-------|----------|
| **TypeScript** | 5.3.3 | Primary frontend language, strict mode enabled | `package.json:L102`, `tsconfig.json:L20` (strict: true) |
| **JavaScript** | ES2020 | Target compilation, modern features | `tsconfig.json:L3` (target: ES2020) |
| **SCSS/Sass** | 1.69.7 | Styling with variables, mixins, RTL support | `package.json:L100`, `src/styles/*.scss` |
| **HTML** | 5 | Template structure | `index.html:L1` |

### Backend Languages

| Language | Version | Usage | Evidence |
|----------|---------|-------|----------|
| **PHP** | 8.4+ | Server-side logic, custom MVC framework | `backend/config/config.production.php:L1` (comments), `README.md:L148` |
| **SQL** | MySQL 9.1.0 | Database queries, migrations | `database/litigation_database.sql:L1-L616` |

### Node.js Environment

- **Node.js:** ≥18.0.0 (required)
- **npm:** ≥8.0.0 (required)
- **Evidence:** `package.json:L141-L144`

---

## ⚛️ Frontend Frameworks & Libraries

### Core Framework

| Package | Version | Role | Evidence |
|---------|---------|------|----------|
| **React** | 18.2.0 | UI library, functional components + hooks | `package.json:L119` |
| **React DOM** | 18.2.0 | DOM rendering | `package.json:L123` |
| **React Router** | 6.20.1 | Client-side routing, protected routes | `package.json:L129` |

### UI & Styling

| Package | Version | Role | Evidence |
|---------|---------|------|----------|
| **Bootstrap** | 5.3.2 | CSS framework, responsive grid | `package.json:L111` |
| **React Bootstrap** | 2.9.2 | React components for Bootstrap | `package.json:L120` |
| **Lucide React** | 0.294.0 | Icon library | `package.json:L118` |
| **clsx** | 2.0.0 | Conditional className utility | `package.json:L113` |

### State Management & Data Fetching

| Package | Version | Role | Evidence |
|---------|---------|------|----------|
| **React Query** | 3.39.3 | Server state management, caching | `package.json:L128` |
| **Axios** | 1.6.2 | HTTP client | `package.json:L110` |

### Forms & Validation

| Package | Version | Role | Evidence |
|---------|---------|------|----------|
| **React Hook Form** | 7.48.2 | Form state management | `package.json:L125` |
| **@hookform/resolvers** | 3.3.2 | Validation resolvers | `package.json:L107` |
| **Zod** | 3.22.4 | Schema validation | `package.json:L133` |

### Internationalization

| Package | Version | Role | Evidence |
|---------|---------|------|----------|
| **i18next** | 23.7.16 | i18n core library | `package.json:L115` |
| **react-i18next** | 13.5.0 | React bindings for i18n | `package.json:L127` |

### Data Visualization & Export

| Package | Version | Role | Evidence |
|---------|---------|------|----------|
| **Chart.js** | 4.4.1 | Charting library | `package.json:L112` |
| **react-chartjs-2** | 5.2.0 | React wrapper for Chart.js | `package.json:L121` |
| **jsPDF** | 3.0.3 | PDF generation | `package.json:L116` |
| **jspdf-autotable** | 5.0.2 | Table plugin for jsPDF | `package.json:L117` |

### Date & File Handling

| Package | Version | Role | Evidence |
|---------|---------|------|----------|
| **date-fns** | 3.0.6 | Date manipulation | `package.json:L114` |
| **react-datepicker** | 4.25.0 | Date picker component | `package.json:L122` |
| **react-dropzone** | 14.2.3 | File upload with drag-drop | `package.json:L124` |
| **react-select** | 5.10.2 | Advanced select/dropdown | `package.json:L130` |

### Additional UI Components

| Package | Version | Role | Evidence |
|---------|---------|------|----------|
| **react-table** | 7.8.0 | Table component with sorting/filtering | `package.json:L131` |
| **react-hot-toast** | 2.4.1 | Toast notifications | `package.json:L126` |
| **swagger-ui** | 3.29.0 | API documentation UI | `package.json:L132` |

---

## 🔧 Build Tools & Bundlers

### Primary Build System

| Tool | Version | Role | Evidence |
|------|---------|------|----------|
| **Vite** | 7.1.7 | Build tool, dev server, HMR | `package.json:L103`, `vite.config.ts:L1-L67` |
| **@vitejs/plugin-react** | 4.2.1 | React Fast Refresh support | `package.json:L84`, `vite.config.ts:L10` |

### Vite Configuration

- **Dev Server:** Port 3005, host 0.0.0.0
- **Allowed Hosts:** `lit.local`, `localhost`, `127.0.0.1`
- **Build Output:** `./backend/public` (integrated with backend)
- **Source Maps:** Enabled for debugging
- **Code Splitting:** Manual chunks (vendor, router, ui, forms, utils)
- **Evidence:** `vite.config.ts:L12-L59`

### Build Scripts

```json
{
  "dev": "vite",                    // Development server
  "build": "vite build",            // Production build
  "preview": "vite preview",        // Preview production build
  "clean": "rimraf dist",           // Clean build artifacts
  "prebuild": "npm run clean",      // Pre-build cleanup
}
```

**Evidence:** `package.json:L7-L39`

---

## 🧪 Testing Frameworks

### End-to-End Testing

| Tool | Version | Role | Evidence |
|------|---------|------|----------|
| **Playwright** | 1.40.0 | E2E testing framework | `package.json:L65`, `playwright.config.mjs:L1-L210` |

**Playwright Configuration:**
- **Test Directory:** `./tests`
- **Browsers:** Chromium, Firefox, WebKit (desktop + mobile)
- **RTL Support:** Dedicated Arabic locale configurations
- **Reporters:** HTML, JSON, JUnit, GitHub, Line
- **Screenshots/Videos:** On failure only
- **Parallel Execution:** Enabled with CI optimizations
- **Evidence:** `playwright.config.mjs:L8-L210`

### Unit Testing

| Tool | Version | Role | Evidence |
|------|---------|------|----------|
| **Vitest** | 3.2.4 | Unit test runner (Vite-native) | `package.json:L104`, `vitest.config.ts:L1-L20` |
| **@vitest/ui** | 3.2.4 | Visual test UI | `package.json:L86` |
| **@vitest/coverage-v8** | 3.2.4 | Code coverage reporting | `package.json:L85` |
| **jsdom** | 23.0.1 | DOM simulation for tests | `package.json:L96`, `vitest.config.ts:L14` |

### Testing Libraries

| Tool | Version | Role | Evidence |
|------|---------|------|----------|
| **@testing-library/react** | 14.1.2 | React component testing | `package.json:L76` |
| **@testing-library/user-event** | 14.5.1 | User interaction simulation | `package.json:L77` |
| **@testing-library/jest-dom** | 6.1.5 | Custom Jest matchers | `package.json:L75` |

---

## 📚 Documentation & Component Development

### Storybook

| Package | Version | Role | Evidence |
|---------|---------|------|----------|
| **Storybook** | 9.1.8 | Component documentation | `package.json:L101` |
| **@storybook/react** | 9.1.8 | React framework for Storybook | `package.json:L72` |
| **@storybook/react-vite** | 9.1.8 | Vite builder for Storybook | `package.json:L73` |
| **@storybook/addon-essentials** | 8.6.14 | Essential addons bundle | `package.json:L68` |
| **@storybook/addon-a11y** | 7.6.6 | Accessibility testing addon | `package.json:L66` |
| **@storybook/addon-docs** | 9.1.8 | Documentation addon | `package.json:L67` |

**Storybook Scripts:**
```json
{
  "storybook": "storybook dev -p 6006",
  "build-storybook": "storybook build",
  "storybook:rtl": "storybook dev -p 6006 --config-dir .storybook-rtl"
}
```

**Evidence:** `package.json:L32-L34`

**Stories Found:** 1 component story  
**Evidence:** `src/components/forms/MixedContentInput.stories.tsx`

---

## 🎨 Code Quality & Linting

### Linting & Formatting

| Tool | Version | Role | Evidence |
|------|---------|------|----------|
| **ESLint** | 8.57.1 | JavaScript/TypeScript linting | `package.json:L88` |
| **@typescript-eslint/parser** | 6.21.0 | TypeScript parser for ESLint | `package.json:L83` |
| **@typescript-eslint/eslint-plugin** | 6.21.0 | TypeScript ESLint rules | `package.json:L82` |
| **Prettier** | 3.1.1 | Code formatting | `package.json:L98` |
| **eslint-config-prettier** | 10.1.8 | Disable conflicting ESLint rules | `package.json:L89` |
| **eslint-plugin-prettier** | 5.5.4 | Run Prettier as ESLint rule | `package.json:L92` |

### ESLint Plugins

| Plugin | Version | Purpose | Evidence |
|--------|---------|---------|----------|
| **eslint-plugin-react** | 7.37.5 | React-specific linting | `package.json:L93` |
| **eslint-plugin-react-hooks** | 4.6.2 | React Hooks rules | `package.json:L94` |
| **eslint-plugin-react-refresh** | 0.4.5 | React Fast Refresh rules | `package.json:L95` |
| **eslint-plugin-jsx-a11y** | 6.10.2 | Accessibility linting | `package.json:L90` |
| **eslint-plugin-playwright** | 2.2.2 | Playwright test linting | `package.json:L91` |

### TypeScript Configuration

**Compiler Options:**
- **Target:** ES2020
- **Module:** ESNext
- **JSX:** react-jsx (new JSX transform)
- **Strict Mode:** Enabled
- **No Unused Locals/Parameters:** Enabled
- **Module Resolution:** bundler (Vite-optimized)
- **Source Maps:** Inline for debugging

**Evidence:** `tsconfig.json:L2-L23`

**Path Aliases Configured:**
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@pages/*` → `src/pages/*`
- `@hooks/*` → `src/hooks/*`
- `@utils/*` → `src/utils/*`
- `@types/*` → `src/types/*`
- `@styles/*` → `src/styles/*`
- `@assets/*` → `src/assets/*`
- `@i18n/*` → `src/i18n/*`
- `@api/*` → `src/api/*`
- `@store/*` → `src/store/*`

**Evidence:** `tsconfig.json:L26-L60`, `vite.config.ts:L18-L30`

---

## 🗄️ Backend Technologies

### PHP Frameworks & Libraries

| Component | Version/Type | Role | Evidence |
|-----------|--------------|------|----------|
| **PHP** | 8.4+ | Server-side runtime | `README.md:L148` |
| **PDO** | Built-in | Database abstraction layer | `backend/config/database.php:L14-L24` |
| **Custom MVC** | - | Lightweight MVC framework | `backend/src/Core/Router.php`, `backend/src/Core/Request.php` |
| **JWT (Manual)** | - | Token-based authentication | `backend/src/Core/Auth.php:L29-L40` |

### PHP Extensions Required

- **pdo_mysql** - MySQL PDO driver
- **mbstring** - Multi-byte string support (Arabic text)
- **json** - JSON encoding/decoding
- **openssl** - Encryption and hashing
- **session** - Session management
- **fileinfo** - File upload validation

**Evidence:** Implied from `backend/src/Core/Auth.php`, `backend/config/database.php`

### Database

| Technology | Version | Role | Evidence |
|------------|---------|------|----------|
| **MySQL** | 9.1.0 | Primary database | `README.md:L149` |
| **UTF-8mb4** | - | Character set for Arabic support | `database/litigation_database.sql:L7-L9` |
| **InnoDB** | - | Storage engine | `database/litigation_database.sql:L38` |

---

## 🔌 CSS & Styling Technologies

### CSS Frameworks & Preprocessors

| Technology | Version | Role | Evidence |
|------------|---------|------|----------|
| **Sass** | 1.69.7 | SCSS preprocessing | `package.json:L100` |
| **Autoprefixer** | 10.4.16 | CSS vendor prefixing | `package.json:L87` |
| **PostCSS** | 8.4.32 | CSS transformations | `package.json:L97` |

### Styling Architecture

- **Variables:** Centralized in `src/styles/variables.scss`
- **Mixins:** Reusable SCSS mixins in `src/styles/mixins.scss`
- **RTL Support:** Dedicated `src/styles/rtl.scss` for right-to-left layouts
- **Global Imports:** Auto-imported via Vite config
- **Evidence:** `vite.config.ts:L33-L41`, `src/styles/` directory

---

## 🛠️ Development & Utility Tools

### Package Management

- **npm:** Primary package manager (lockfile present)
- **Evidence:** `package-lock.json` (6,000+ lines)

### Build & Development Utilities

| Tool | Version | Role | Evidence |
|------|---------|------|----------|
| **rimraf** | 5.0.5 | Cross-platform file deletion | `package.json:L99` |
| **@types/node** | 20.10.5 | Node.js type definitions | `package.json:L78` |
| **@types/react** | 18.2.45 | React type definitions | `package.json:L79` |
| **@types/react-dom** | 18.2.18 | React DOM type definitions | `package.json:L80` |

---

## 🌐 Browser Support

**Target Browsers:**
- **Modern Browsers:** > 1% market share
- **Last 2 Versions:** All major browsers
- **Exclusions:** IE 11, Dead browsers

**Evidence:** `package.json:L135-L140`

```json
"browserslist": [
  "> 1%",
  "last 2 versions",
  "not dead",
  "not ie 11"
]
```

---

## 🚀 Runtime Flags & Optimizations

### Vite Build Optimizations

- **Tree Shaking:** Enabled by default
- **Minification:** Production builds minified
- **Code Splitting:** Manual chunks configuration
  - `vendor`: React, React DOM
  - `router`: React Router
  - `ui`: Bootstrap, React Bootstrap
  - `forms`: Form libraries
  - `utils`: Utilities (Axios, date-fns, clsx)
- **Evidence:** `vite.config.ts:L48-L58`

### TypeScript Compiler Flags

- **isolatedModules:** true (Vite optimization)
- **skipLibCheck:** true (faster compilation)
- **allowImportingTsExtensions:** true (modern imports)
- **resolveJsonModule:** true (import JSON files)
- **Evidence:** `tsconfig.json:L11-L17`

---

## 📦 Notable Polyfills & Runtime Dependencies

### MCP Server Integration

| Package | Version | Purpose | Evidence |
|---------|---------|---------|----------|
| **@matpb/mysql-mcp-server** | 1.0.6 | MySQL MCP server connector | `package.json:L108` |

### Type Definitions

- **@types/react-table** (7.7.18) - React Table types
- **@types/trusted-types** (2.0.7) - Trusted Types API
- **Evidence:** `package.json:L109`, `package.json:L81`

---

## 🔐 Security-Related Libraries

| Library | Version | Purpose | Evidence |
|---------|---------|---------|----------|
| **bcrypt** | - (PHP built-in) | Password hashing | `backend/src/Core/Auth.php:L18` (password_verify) |
| **JWT** | Manual implementation | Token-based auth | `backend/src/Core/Auth.php:L267-L319` |
| **CSRF Tokens** | Manual implementation | Cross-site request forgery protection | `backend/config/config.production.php:L26` |

---

## 📊 Dependency Summary

### Production Dependencies

- **Total npm packages:** 28
- **Evidence:** `package.json:L106-L134`

### Development Dependencies

- **Total npm devDependencies:** 40
- **Evidence:** `package.json:L64-L105`

### Backend (PHP)

- **Composer:** Not detected (manual dependency management)
- **Evidence:** No `composer.json` found

---

## 🔄 Version Consistency

### React Ecosystem

✅ **Consistent:** React 18.2.0 across all packages  
- `react@18.2.0`
- `react-dom@18.2.0`
- React libraries compatible with v18

### Storybook Ecosystem

⚠️ **Mixed Versions:** Storybook packages span v7-v9  
- Core: 9.1.8
- Addons: 7.6.6 - 9.1.8
- **Recommendation:** Align all Storybook packages to v9.x

### TypeScript/ESLint

✅ **Consistent:** TypeScript 5.x with ESLint 8.x compatibility

---

## 🎯 Technology Stack Recommendations

### Immediate Actions

1. **Upgrade Storybook:** Align all packages to v9.1.8
2. **Add Composer:** Introduce PHP dependency management
3. **Update React Query:** Migrate to TanStack Query v5 (latest)

### Strategic Enhancements

1. **Add Monorepo Support:** Consider pnpm workspaces
2. **Integrate API Mocking:** Add MSW (Mock Service Worker) for testing
3. **Performance Monitoring:** Add web-vitals reporting
4. **Error Tracking:** Integrate Sentry or Rollbar SDK

---

## 📁 Configuration Files Inventory

| File | Purpose | Status | Evidence |
|------|---------|--------|----------|
| `package.json` | npm dependencies and scripts | ✅ Complete | Root directory |
| `tsconfig.json` | TypeScript compilation | ✅ Complete | Root directory |
| `tsconfig.node.json` | Node.js TypeScript config | ✅ Present | Root directory |
| `vite.config.ts` | Vite build configuration | ✅ Complete | Root directory |
| `vitest.config.ts` | Vitest test configuration | ✅ Complete | Root directory |
| `playwright.config.mjs` | Playwright E2E config | ✅ Complete | Root directory |
| `webpack.config.js` | Legacy Webpack config | ⚠️ Unused | Root directory |
| `.eslintrc.*` | ESLint configuration | ❌ Not found | (Likely inline in package.json) |
| `.prettierrc.*` | Prettier configuration | ❌ Not found | (Likely defaults) |
| `composer.json` | PHP dependencies | ❌ Not found | - |

---

## 🔍 Technology Gaps & Opportunities

### Missing Technologies

1. **CI/CD:** No GitHub Actions, GitLab CI, or CircleCI
2. **API Documentation:** No OpenAPI/Swagger generator
3. **State Debugging:** No Redux DevTools or React Query DevTools setup
4. **Bundle Analysis:** No webpack-bundle-analyzer or similar
5. **PHP Composer:** Manual PHP dependency management

### Modern Alternatives to Consider

- **React Query → TanStack Query v5:** Latest version with better TypeScript
- **Axios → ky or ofetch:** Modern, lightweight HTTP clients
- **React Bootstrap → Radix UI or Shadcn/ui:** Headless, accessible components
- **Chart.js → Recharts or Victory:** React-first charting libraries

---

**End of Technology Stack Analysis**

