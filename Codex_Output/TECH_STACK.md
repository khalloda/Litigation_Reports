# 🔧 Technology Stack Analysis

## 📋 **Languages & Runtimes**

### **Primary Languages**

| Language | Version | Role | Evidence |
|----------|---------|------|----------|
| **TypeScript** | 5.3.3 | Frontend type safety and development | `package.json:L101`, `tsconfig.json:L1-L44` |
| **PHP** | 8.4 | Backend server logic and API | `backend/config/config.php:L1-L224` |
| **JavaScript** | ES2020 | Client-side scripting | `tsconfig.json:L3`, `vite.config.ts:L1-L67` |
| **SQL** | MySQL 9.1.0 | Database queries and schema | `database/litigation_database.sql:L1-L566` |
| **SCSS** | 1.69.7 | Styling with RTL support | `package.json:L99`, `src/styles/` |

### **Runtime Requirements**

- **Node.js**: >=18.0.0 (Development tools and build system)
- **npm**: >=8.0.0 (Package management)
- **PHP**: 8.4 (Backend server)
- **MySQL**: 9.1.0 (Database server)

**Evidence**: `package.json:L137-L140`, `backend/config/config.php:L16-L22`

## 🏗️ **Frontend Framework & Libraries**

### **Core Framework**

| Library | Version | Role | Evidence |
|---------|---------|------|----------|
| **React** | 18.2.0 | Frontend framework with hooks | `package.json:L116`, `src/App.tsx` |
| **React DOM** | 18.2.0 | DOM rendering | `package.json:L120` |
| **TypeScript** | 5.3.3 | Type safety and development | `package.json:L101` |

### **Build System & Development**

| Tool | Version | Role | Evidence |
|------|---------|------|----------|
| **Vite** | 5.0.10 | Build tool and dev server | `package.json:L102`, `vite.config.ts:L1-L67` |
| **@vitejs/plugin-react** | 4.2.1 | React plugin for Vite | `package.json:L83` |
| **Sass** | 1.69.7 | CSS preprocessing | `package.json:L99` |
| **PostCSS** | 8.4.32 | CSS post-processing | `package.json:L96` |
| **Autoprefixer** | 10.4.16 | CSS vendor prefixing | `package.json:L86` |

### **UI Framework & Styling**

| Library | Version | Role | Evidence |
|---------|---------|------|----------|
| **Bootstrap** | 5.3.2 | CSS framework | `package.json:L110` |
| **React Bootstrap** | 2.9.2 | Bootstrap components for React | `package.json:L117` |
| **Lucide React** | 0.294.0 | Icon library | `package.json:L115` |

### **Routing & State Management**

| Library | Version | Role | Evidence |
|---------|---------|------|----------|
| **React Router DOM** | 6.20.1 | Client-side routing | `package.json:L126` |
| **React Query** | 3.39.3 | Server state management | `package.json:L125` |
| **React Context** | Built-in | Local state management | `src/contexts/AuthContext.tsx` |

### **Forms & Validation**

| Library | Version | Role | Evidence |
|---------|---------|------|----------|
| **React Hook Form** | 7.48.2 | Form management | `package.json:L122` |
| **@hookform/resolvers** | 3.3.2 | Form validation resolvers | `package.json:L106` |
| **Zod** | 3.22.4 | Schema validation | `package.json:L129` |

### **Data Visualization & Tables**

| Library | Version | Role | Evidence |
|---------|---------|------|----------|
| **Chart.js** | 4.4.1 | Chart library | `package.json:L111` |
| **React Chart.js 2** | 5.2.0 | React wrapper for Chart.js | `package.json:L118` |
| **React Table** | 7.8.0 | Table component library | `package.json:L128` |
| **@types/react-table** | 7.7.18 | TypeScript definitions | `package.json:L108` |

### **Internationalization & RTL**

| Library | Version | Role | Evidence |
|---------|---------|------|----------|
| **i18next** | 23.7.16 | Internationalization framework | `package.json:L114` |
| **react-i18next** | 13.5.0 | React integration for i18next | `package.json:L124` |

### **Utilities & Helpers**

| Library | Version | Role | Evidence |
|---------|---------|------|----------|
| **Axios** | 1.6.2 | HTTP client | `package.json:L109` |
| **date-fns** | 3.0.6 | Date manipulation | `package.json:L113` |
| **clsx** | 2.0.0 | Conditional CSS classes | `package.json:L112` |
| **React Hot Toast** | 2.4.1 | Toast notifications | `package.json:L123` |
| **React Dropzone** | 14.2.3 | File upload handling | `package.json:L121` |
| **React Select** | 5.8.0 | Select component | `package.json:L127` |
| **React Datepicker** | 4.25.0 | Date picker component | `package.json:L119` |

## 🖥️ **Backend Framework & Architecture**

### **Core Backend**

| Technology | Version | Role | Evidence |
|------------|---------|------|----------|
| **PHP** | 8.4 | Server-side language | `backend/config/config.php:L1-L224` |
| **Custom MVC** | N/A | Architecture pattern | `backend/src/Controllers/`, `backend/src/Models/` |
| **PDO** | Built-in | Database abstraction | `database/config/database.php:L16-L52` |

### **Database & ORM**

| Technology | Version | Role | Evidence |
|------------|---------|------|----------|
| **MySQL** | 9.1.0 | Primary database | `database/config/database.php:L22` |
| **PDO MySQL** | Built-in | Database driver | `database/config/database.php:L23-L28` |
| **UTF-8** | utf8mb4 | Character encoding | `database/litigation_database.sql:L7-L9` |

### **Authentication & Security**

| Technology | Version | Role | Evidence |
|------------|---------|------|----------|
| **JWT** | Custom | Token-based authentication | `backend/config/config.php:L25-L27` |
| **bcrypt** | Built-in | Password hashing | `backend/config/config.php:L28` |
| **PHP Sessions** | Built-in | Session management | `backend/config/config.php:L30-L32` |

## 🧪 **Testing Framework & Tools**

### **End-to-End Testing**

| Tool | Version | Role | Evidence |
|------|---------|------|----------|
| **Playwright** | 1.40.0 | E2E testing framework | `package.json:L65`, `playwright.config.mjs:L1-L210` |
| **@playwright/test** | 1.40.0 | Core Playwright testing | `package.json:L65` |

### **Unit Testing**

| Tool | Version | Role | Evidence |
|------|---------|------|----------|
| **Vitest** | 1.0.4 | Unit testing framework | `package.json:L103`, `vitest.config.ts:L1-L21` |
| **@vitest/ui** | 1.0.4 | Test UI interface | `package.json:L85` |
| **@vitest/coverage-v8** | 1.0.4 | Code coverage | `package.json:L84` |
| **jsdom** | 23.0.1 | DOM environment for tests | `package.json:L95` |

### **Testing Libraries**

| Library | Version | Role | Evidence |
|---------|---------|------|----------|
| **@testing-library/react** | 14.1.2 | React testing utilities | `package.json:L76` |
| **@testing-library/jest-dom** | 6.1.5 | Jest DOM matchers | `package.json:L75` |
| **@testing-library/user-event** | 14.5.1 | User interaction testing | `package.json:L77` |

### **Component Development**

| Tool | Version | Role | Evidence |
|------|---------|------|----------|
| **Storybook** | 7.6.6 | Component development environment | `package.json:L100` |
| **@storybook/react** | 7.6.6 | React integration | `package.json:L72` |
| **@storybook/react-vite** | 7.6.6 | Vite integration | `package.json:L73` |
| **@storybook/addon-essentials** | 7.6.6 | Essential addons | `package.json:L68` |
| **@storybook/addon-a11y** | 7.6.6 | Accessibility testing | `package.json:L66` |
| **@storybook/addon-docs** | 7.6.6 | Documentation | `package.json:L67` |
| **@storybook/addon-interactions** | 7.6.6 | Interaction testing | `package.json:L69` |
| **@storybook/addon-links** | 7.6.6 | Component linking | `package.json:L70` |
| **@storybook/blocks** | 7.6.6 | Documentation blocks | `package.json:L71` |
| **@storybook/test** | 7.6.6 | Testing utilities | `package.json:L74` |

## 🔍 **Code Quality & Linting**

### **Linting & Formatting**

| Tool | Version | Role | Evidence |
|------|---------|------|----------|
| **ESLint** | 8.55.0 | JavaScript/TypeScript linting | `package.json:L87`, `.eslintrc.cjs:L1-L107` |
| **@typescript-eslint/parser** | 6.21.0 | TypeScript parser for ESLint | `package.json:L81` |
| **@typescript-eslint/eslint-plugin** | 6.21.0 | TypeScript rules for ESLint | `package.json:L80` |
| **eslint-plugin-react** | 7.37.5 | React-specific linting rules | `package.json:L92` |
| **eslint-plugin-react-hooks** | 4.6.2 | React hooks linting | `package.json:L93` |
| **eslint-plugin-jsx-a11y** | 6.10.2 | Accessibility linting | `package.json:L89` |
| **eslint-plugin-prettier** | 5.5.4 | Prettier integration | `package.json:L91` |
| **eslint-config-prettier** | 10.1.8 | Prettier configuration | `package.json:L88` |
| **eslint-plugin-playwright** | 2.2.2 | Playwright-specific rules | `package.json:L90` |
| **eslint-plugin-react-refresh** | 0.4.5 | React refresh linting | `package.json:L94` |
| **Prettier** | 3.1.1 | Code formatting | `package.json:L97`, `.prettierrc:L1-L14` |

### **Type Checking**

| Tool | Version | Role | Evidence |
|------|---------|------|----------|
| **TypeScript** | 5.3.3 | Static type checking | `package.json:L101` |
| **@types/node** | 20.10.5 | Node.js type definitions | `package.json:L78` |
| **@types/react** | 18.2.45 | React type definitions | `package.json:L79` |
| **@types/react-dom** | 18.2.18 | React DOM type definitions | `package.json:L80` |

## 🛠️ **Build Tools & Scripts**

### **Build Configuration**

| Tool | Version | Role | Evidence |
|------|---------|------|----------|
| **Vite** | 5.0.10 | Build tool and bundler | `vite.config.ts:L1-L67` |
| **Rimraf** | 5.0.5 | Cross-platform file deletion | `package.json:L98` |

### **Development Scripts**

| Script | Command | Purpose | Evidence |
|--------|---------|---------|----------|
| **Development** | `npm run dev` | Start Vite dev server | `package.json:L7` |
| **Build** | `npm run build` | Production build | `package.json:L8` |
| **Preview** | `npm run preview` | Preview production build | `package.json:L9` |
| **Lint** | `npm run lint` | Run ESLint | `package.json:L10` |
| **Lint Fix** | `npm run lint:fix` | Fix ESLint issues | `package.json:L11` |
| **Type Check** | `npm run type-check` | TypeScript type checking | `package.json:L12` |
| **Test** | `npm run test` | Run Vitest unit tests | `package.json:L13` |
| **Test UI** | `npm run test:ui` | Vitest UI interface | `package.json:L14` |
| **Test Coverage** | `npm run test:coverage` | Code coverage report | `package.json:L15` |
| **E2E Tests** | `npm run test:e2e` | Run Playwright tests | `package.json:L16` |
| **Storybook** | `npm run storybook` | Start Storybook | `package.json:L32` |
| **Build Storybook** | `npm run build-storybook` | Build Storybook | `package.json:L33` |
| **Format** | `npm run format` | Format code with Prettier | `package.json:L35` |
| **Format Check** | `npm run format:check` | Check Prettier formatting | `package.json:L36` |

## 🌐 **Browser Support**

### **Target Browsers**

| Browser | Version | Support Level | Evidence |
|---------|---------|---------------|----------|
| **Chrome** | Latest 2 versions | Full support | `package.json:L131-L135` |
| **Firefox** | Latest 2 versions | Full support | `package.json:L131-L135` |
| **Safari** | Latest 2 versions | Full support | `package.json:L131-L135` |
| **Edge** | Latest 2 versions | Full support | `package.json:L131-L135` |
| **IE 11** | Not supported | Explicitly excluded | `package.json:L135` |

### **Mobile Support**

| Platform | Browser | Support Level | Evidence |
|----------|---------|---------------|----------|
| **iOS** | Safari, Chrome | Full support | `playwright.config.mjs:L115-L139` |
| **Android** | Chrome, Firefox | Full support | `playwright.config.mjs:L115-L139` |

## 🔧 **Development Environment**

### **Local Development Stack**

| Component | Version | Role | Evidence |
|-----------|---------|------|----------|
| **WAMP** | N/A | Windows, Apache, MySQL, PHP stack | `README.md:L194-L197` |
| **Apache** | N/A | Web server | `README.md:L194` |
| **MySQL** | 9.1.0 | Database server | `database/config/database.php:L22` |
| **PHP** | 8.4 | Backend runtime | `backend/config/config.php:L1-L224` |
| **Node.js** | 18+ | Frontend development | `package.json:L137-L140` |

### **Development Domains**

| Service | URL | Purpose | Evidence |
|---------|-----|---------|----------|
| **Frontend** | `lit.local:3001` | React development server | `vite.config.ts:L12-L16` |
| **Backend** | `lit.local:8080` | PHP API server | `README.md:L61-L62` |
| **Database** | `localhost:3306` | MySQL database | `backend/config/config.php:L16-L17` |

## 🚀 **Production Environment**

### **Hosting & Deployment**

| Component | Details | Evidence |
|-----------|---------|----------|
| **Hosting Provider** | GoDaddy Shared Hosting | `README.md:L200-L201` |
| **Domain** | `lit.sarieldin.com` | `package.json:L148` |
| **SSL** | HTTPS with security headers | `README.md:L202` |
| **Build Output** | `./backend/public` | `vite.config.ts:L44` |

### **Production Configuration**

| Setting | Value | Evidence |
|---------|-------|----------|
| **Environment** | Production | `backend/config/config.production.php` |
| **Debug Mode** | Disabled | `backend/config/config.php:L12` |
| **Error Reporting** | Disabled | `backend/config/config.php:L192-L193` |
| **Asset Optimization** | Enabled | `vite.config.ts:L43-L59` |

## 📦 **Package Management**

### **Package Manager**

| Tool | Version | Role | Evidence |
|------|---------|------|----------|
| **npm** | >=8.0.0 | Primary package manager | `package.json:L139` |
| **package-lock.json** | Version 3 | Lock file format | `package-lock.json:L4` |

### **Dependency Categories**

| Category | Count | Examples | Evidence |
|----------|-------|----------|----------|
| **Dependencies** | 20 | React, Axios, Bootstrap | `package.json:L105-L130` |
| **Dev Dependencies** | 40 | TypeScript, ESLint, Playwright | `package.json:L64-L103` |
| **Total Packages** | 60+ | All production and development tools | `package-lock.json:L1-L20782` |

## 🔍 **Notable Configuration Details**

### **TypeScript Configuration**

- **Target**: ES2020 with DOM support
- **Module Resolution**: Bundler mode
- **Strict Mode**: Enabled with comprehensive rules
- **Path Mapping**: Extensive alias configuration for clean imports
- **JSX**: React JSX transform

**Evidence**: `tsconfig.json:L1-L44`

### **Vite Configuration**

- **Base URL**: Root path (`/`)
- **Server**: Host on all interfaces (0.0.0.0) port 3005
- **Build Output**: `./backend/public` directory
- **Asset Optimization**: Manual chunk splitting for vendor libraries
- **SCSS Integration**: Global variables and mixins

**Evidence**: `vite.config.ts:L1-L67`

### **ESLint Configuration**

- **Extends**: Recommended rules for TypeScript, React, accessibility
- **Plugins**: React hooks, JSX accessibility, Prettier integration
- **Rules**: Strict TypeScript rules, accessibility warnings, Prettier formatting
- **Overrides**: Special rules for tests, Playwright, and Storybook files

**Evidence**: `.eslintrc.cjs:L1-L107`

### **Playwright Configuration**

- **Test Directory**: `./tests`
- **Parallel Execution**: Enabled with CI optimization
- **Browser Support**: Chrome, Firefox, Safari, Edge with RTL variants
- **Mobile Testing**: iOS and Android device emulation
- **Accessibility Testing**: Reduced motion and forced colors
- **RTL Support**: Arabic locale and timezone configuration

**Evidence**: `playwright.config.mjs:L1-L210`

---

**Evidence Summary**: `package.json:L1-L150`, `package-lock.json:L1-L20782`, `vite.config.ts:L1-L67`, `tsconfig.json:L1-L44`, `.eslintrc.cjs:L1-L107`, `playwright.config.mjs:L1-L210`, `vitest.config.ts:L1-L21`, `backend/config/config.php:L1-L224`, `database/config/database.php:L1-L194`
