# Search Queries for Evidence Collection

## 📋 Purpose

This document contains all reproducible search queries used to collect evidence during the codebase audit. These queries can be re-run to verify findings or update the audit as the codebase evolves.

**Primary Tool:** `grep` (ripgrep / Windows PowerShell)  
**Repository:** Litigation_Reports  
**Audit Date:** October 7, 2025

---

## 🔍 Cross-Platform Query Commands

### Using `grep` Tool (Preferred - Available in Workspace)

The workspace has a `grep` tool that respects .gitignore/.cursorignore and is faster than terminal grep.

```bash
# Example: Find all React components
grep "^(function|const|class|export)\s+\w+" --type tsx --path src/components

# Example: Find API endpoints
grep "case '/" --path backend/api/index.php
```

### Using ripgrep (rg) - Cross-Platform

```bash
# List all files (excluding common ignore patterns)
rg --files --hidden -g '!.git' -g '!node_modules' -g '!vendor' -g '!dist' -g '!build' -g '!.next'

# Find specific patterns
rg "pattern" --type ts --type tsx
```

### Windows PowerShell Alternative

```powershell
# List files excluding bulky directories
Get-ChildItem -Recurse -File | Where-Object { 
    $_.FullName -notmatch "node_modules|vendor|dist|build|\.next|coverage" 
} | Select-Object -ExpandProperty FullName
```

---

## 🏗️ Repository Structure Queries

### File Inventory

**Find all source files:**

```bash
# Using grep tool
grep "" --files_with_matches --path src

# Using ripgrep
rg --files src/

# PowerShell
Get-ChildItem -Path src -Recurse -File | Select-Object FullName
```

**Count files by type:**

```bash
# TypeScript/TSX files
rg --files --glob "*.{ts,tsx}" | wc -l

# PHP files
rg --files --glob "*.php" | wc -l

# SQL files
rg --files --glob "*.sql" | wc -l
```

### Directory Structure

**Generate directory tree:**

```bash
# Using tree (if available)
tree -d -L 3 -I "node_modules|vendor|dist"

# Using find
find . -type d -not -path "*/node_modules/*" -not -path "*/vendor/*" | head -50

# PowerShell
Get-ChildItem -Recurse -Directory | Where-Object { 
    $_.FullName -notmatch "node_modules|vendor" 
} | Select-Object FullName
```

---

## 📦 Technology Stack Queries

### Package Dependencies

**Find package.json files:**

```bash
rg --files --glob "package.json"
```

**Extract npm dependencies:**

```bash
# Using grep tool
grep "\"react\":" --path package.json

# Using ripgrep
rg '"[^"]+"\s*:\s*"\^?[\d.]+"' package.json -A 0

# PowerShell
Get-Content package.json | Select-String '"[^"]+"\s*:\s*"'
```

**Find composer.json:**

```bash
rg --files --glob "composer.json"
# Result: Not found
```

### Framework Detection

**React version:**

```bash
grep "\"react\":" --path package.json -C 1
```

**PHP version requirement:**

```bash
grep -i "php" --path README.md backend/config/config.production.php
```

**TypeScript config:**

```bash
rg --files --glob "tsconfig*.json"
# Result: tsconfig.json, tsconfig.node.json
```

---

## 🗄️ Database Queries

### Schema Discovery

**Find CREATE TABLE statements:**

```bash
# Using grep tool
grep "^CREATE TABLE" --path database/litigation_database.sql

# Using ripgrep
rg "^CREATE TABLE" database/litigation_database.sql

# Result: 21 tables found
```

**Find foreign keys:**

```bash
rg "FOREIGN KEY" database/litigation_database.sql
```

**Find indexes:**

```bash
rg "INDEX idx_" database/litigation_database.sql
```

### Database Configuration

**Find database credentials:**

```bash
# Constants definition
grep "define\\(.*DB_" --path backend/config

# Environment variables
rg "DB_HOST|DB_NAME|DB_USER|DB_PASS" backend/config/config.php
```

**Find PDO usage:**

```bash
rg "new PDO|PDO::" backend/
```

---

## 🔌 API & Routes Queries

### API Endpoint Discovery

**Find route definitions:**

```bash
# Switch-case routes in index.php
grep "case '/" --path backend/api/index.php

# Function-based routes
rg "function handle\w+" backend/api/index.php
```

**Count total endpoints:**

```bash
rg "case '/" backend/api/index.php | wc -l
# Result: 50+ routes
```

**Find authentication endpoints:**

```bash
rg "'/auth/" backend/api/index.php -C 3
```

**Find CRUD endpoints:**

```bash
rg "'/(?:cases|clients|hearings|invoices)'" backend/api/index.php
```

### Controller Discovery

**Find all controllers:**

```bash
rg --files --glob "*Controller.php" backend/src/Controllers/
```

**List controller methods:**

```bash
grep "public function" --path backend/src/Controllers -C 2
```

---

## ⚛️ Frontend Queries

### React Component Discovery

**Find all React components:**

```bash
# Using grep tool
grep "^(export (default )?)?

(function|const|class)" --type tsx --path src/components

# Using ripgrep
rg "^export (default )?(function|const|class) \w+" --glob "*.tsx" src/components/
```

**Find hooks:**

```bash
rg "^export (default )?function use\w+" src/hooks/
```

**Find Context providers:**

```bash
rg "createContext|useContext" src/
```

### Page Components

**List all pages:**

```bash
rg --files src/pages/ --glob "*.tsx"
```

**Find router configuration:**

```bash
rg "BrowserRouter|Routes|Route" src/
```

### State Management

**Find useState usage:**

```bash
rg "useState" src/ --count
```

**Find React Query usage:**

```bash
rg "useQuery|useMutation" src/
```

**Find Context usage:**

```bash
rg "useContext" src/
```

---

## 🎨 Styling Queries

### SCSS Files

**Find all SCSS files:**

```bash
rg --files --glob "*.scss" src/styles/
```

**Find RTL styles:**

```bash
rg "rtl|right-to-left|direction:\s*rtl" src/styles/
```

**Find Bootstrap usage:**

```bash
rg "@import.*bootstrap|from ['\"]bootstrap" src/
```

### CSS Variables

**Find CSS custom properties:**

```bash
rg "--[a-z-]+:" src/styles/
```

---

## 🧪 Testing Queries

### Test File Discovery

**Count test files:**

```bash
# Using grep tool
grep "" --files_with_matches --glob "*.spec.{ts,js}" --path tests

# Using ripgrep
rg --files --glob "*.spec.{ts,js}" tests/ | wc -l
# Result: 140+ files
```

**Find test suites:**

```bash
rg "describe\\(" tests/ --count
```

**Find test cases:**

```bash
rg "it\\(|test\\(" tests/ --count
```

### Playwright Configuration

**Find Playwright config:**

```bash
rg --files --glob "playwright.config*"
# Result: playwright.config.mjs, playwright-simple.config.mjs
```

**Find test projects:**

```bash
rg "projects:\s*\[" playwright.config.mjs -A 20
```

---

## 🔐 Security Queries

### Authentication

**Find JWT usage:**

```bash
rg "jwt|JWT|jsonwebtoken" backend/src/
```

**Find password hashing:**

```bash
rg "password_hash|password_verify|bcrypt" backend/
```

**Find session management:**

```bash
rg "session_start|\\$_SESSION" backend/
```

### Input Validation

**Find validation logic:**

```bash
rg "validate|sanitize" backend/src/
```

**Find Zod schemas:**

```bash
rg "z\\.(string|number|object|array)" src/
```

### CORS & Security Headers

**Find CORS middleware:**

```bash
rg "CORS|Access-Control" backend/
```

**Find security headers:**

```bash
rg "X-Frame-Options|Content-Security-Policy|Strict-Transport-Security" backend/config/
```

---

## 🌍 Internationalization Queries

### i18n Configuration

**Find i18n initialization:**

```bash
rg "i18next|initReactI18next" src/i18n/
```

**Find translation files:**

```bash
rg --files --glob "{ar,en}.ts" src/i18n/locales/
```

**Find translation usage:**

```bash
rg "useTranslation|t\\(|i18n\\.t" src/
```

### RTL Support

**Find RTL logic:**

```bash
rg "rtl|right-to-left|direction" src/
```

**Find Arabic text:**

```bash
rg "[\u0600-\u06FF]+" src/i18n/locales/ar.ts
```

---

## 🚀 Build & Deployment Queries

### Build Configuration

**Find build scripts:**

```bash
rg '"(build|deploy|start)":\s*"[^"]+"' package.json
```

**Find Vite config:**

```bash
rg "defineConfig" vite.config.ts -A 50
```

### Deployment Files

**Find deployment scripts:**

```bash
rg --files --glob "*deploy*" scripts/
```

**Find production config:**

```bash
rg --files --glob "*production*" backend/config/
```

### Environment Variables

**Find env variable usage:**

```bash
# PHP
rg "\\$_ENV\\[|getenv\\(" backend/

# JavaScript
rg "process\\.env\\.|import\\.meta\\.env\\." src/
```

---

## 📊 Performance & Monitoring Queries

### Performance Optimization

**Find lazy loading:**

```bash
rg "React\\.lazy|dynamic import" src/
```

**Find code splitting:**

```bash
rg "manualChunks" vite.config.ts
```

**Find caching:**

```bash
rg "cache|Cache" backend/config/
```

### Logging

**Find logging calls:**

```bash
# PHP
rg "error_log|\\$logger" backend/

# JavaScript
rg "console\\.(log|error|warn)" src/
```

---

## 🔍 Code Quality Queries

### ESLint/Prettier

**Find linting config:**

```bash
rg --files --glob ".eslintrc*|.prettierrc*"
# Result: No dedicated files (likely in package.json)
```

**Find linting in package.json:**

```bash
rg "eslint|prettier" package.json
```

### TypeScript Strict Mode

**Check TypeScript strict mode:**

```bash
rg '"strict":\s*true' tsconfig.json
```

### TODO Comments

**Find TODO/FIXME:**

```bash
rg "TODO|FIXME|XXX|HACK" src/ backend/
```

---

## 📝 Documentation Queries

### Markdown Files

**Find all documentation:**

```bash
rg --files --glob "*.md"
```

**Find API documentation:**

```bash
rg --files --glob "*API*.md"
# Result: CRUD_API_EXAMPLES.md, REPORTS_API_DOCUMENTATION.md, etc.
```

### Code Comments

**Find JSDoc comments:**

```bash
rg "/\\*\\*" src/ backend/
```

**Find inline comments:**

```bash
rg "//\s*\w+" src/ --count
```

---

## 🔄 Git & Version Control Queries

### Git Configuration

**Find .gitignore:**

```bash
rg --files --glob ".gitignore"
```

**Find git hooks:**

```bash
rg --files .git/hooks/
```

### Commit History (Terminal Only)

```bash
# Recent commits
git log --oneline -20

# Files changed recently
git diff --name-only HEAD~10 HEAD

# Contributors
git shortlog -sn
```

---

## 🎯 Custom Audit Queries

### Find Main Entry Points

```bash
# Frontend
rg "ReactDOM\\.render|createRoot" src/

# Backend
rg "\\$_SERVER\\['REQUEST_URI'\\]" backend/api/
```

### Find Database Models

```bash
rg "class \w+ (extends Model)?" backend/src/Models/
```

### Find Middleware

```bash
rg "class \w+Middleware" backend/src/Middleware/
```

### Find Configuration Files

```bash
# All config files
rg --files | grep -E "(config|\.rc|\.yml|\.json)$"

# Specific configs
rg --files --glob "{tsconfig,vite.config,playwright.config}*"
```

---

## 💡 Advanced Query Patterns

### Multi-Pattern Search

```bash
# Find imports of specific libraries
rg "(import|require|from) .*(react|axios|i18next)" src/
```

### Context-Aware Search

```bash
# Find function definitions with context
rg "function \w+\(" -A 5 -B 2 backend/src/Controllers/
```

### File Type Filtering

```bash
# Search only in TypeScript files
rg "pattern" --type ts --type tsx

# Exclude test files
rg "pattern" --glob "!*.spec.*" --glob "!*.test.*"
```

---

## 🔄 Verification Queries

### After Code Changes

**Verify imports after refactoring:**

```bash
rg "from ['\"]@/(components|utils|hooks)" src/
```

**Verify API endpoint consistency:**

```bash
# Backend routes
rg "case '/" backend/api/index.php

# Frontend API calls
rg "\\.get\\(|post\\(|put\\(|delete\\(" src/services/api.ts
```

### Dependency Verification

**Check for unused dependencies:**

```bash
# List all imports
rg "^import .* from ['\"]([^'\"]+)" src/ -r '$1' --no-filename | sort | uniq

# Compare with package.json dependencies
rg '"[^"]+"\s*:' package.json --only-matching
```

---

## 🛠️ Utility Queries

### Count Lines of Code

```bash
# Using cloc (if available)
cloc src/ backend/src/ --exclude-dir=node_modules,vendor

# Using ripgrep + wc
rg --files src/ | xargs wc -l | tail -1
```

### Find Large Files

```bash
# Files over 500 lines
rg --files src/ backend/ | xargs wc -l | awk '$1 > 500'
```

### Find Duplicate Code

```bash
# Find similar function names
rg "function \w+" src/ | sort | uniq -d
```

---

## 📋 Query Execution Log

Below are actual queries executed during this audit with their results:

| Query | Command | Result | Evidence |
|-------|---------|--------|----------|
| Count React components | `grep "^function\|const\|class" --count --path src/components --type tsx` | 91 matches in 28 files | Grep output |
| Count PHP classes | `grep "^class\|public function" --count --path backend/src --type php` | 25 matches in 24 files | Grep output |
| Find CREATE TABLE | `grep "^CREATE TABLE" --path database/litigation_database.sql` | 21 tables | SQL analysis |
| Count test files | `rg --files --glob "*.spec.*" tests/` | 140+ files | Directory listing |
| Find JWT usage | `rg "JWT|jwt" backend/src/Core/Auth.php` | Multiple matches | Auth.php analysis |

---

## 🔍 How to Use These Queries

### For Auditors

1. Run queries to verify audit findings
2. Update queries as codebase evolves
3. Add new queries for additional evidence

### For Developers

1. Use queries to locate specific code patterns
2. Verify changes don't break patterns
3. Find examples of existing implementations

### For Security Reviews

1. Search for common vulnerabilities
2. Verify security best practices
3. Find authentication/authorization code

---

## 📚 Additional Resources

- **ripgrep Documentation:** https://github.com/BurntSushi/ripgrep
- **PowerShell Select-String:** https://docs.microsoft.com/powershell/module/microsoft.powershell.utility/select-string
- **grep Tool:** Workspace-integrated search (preferred)

---

**Query Collection Version:** 1.0  
**Last Updated:** October 7, 2025  
**Total Queries Documented:** 50+

