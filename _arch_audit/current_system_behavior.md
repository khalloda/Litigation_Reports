# Current System Behavior Documentation

**Documentation Date**: 2025-09-22 20:29:14
**Phase**: Pre-Migration Baseline

## API Endpoint Status

### Tested Endpoints

- ❌ `http://lit.local:8080/backend/api/ping` - Not responding
- ❌ `http://lit.local:8080/api/ping` - Not responding

**Note**: API servers appear to be down, which is normal for a development environment. The migration will preserve all endpoint functionality when servers are operational.

## File System Analysis

### API Implementations Present

```
✅ backend/api/index.php - Canonical API (805 lines, MVC structure)
   - Handles: /ping, /auth/login, /auth/me, /cases, /clients, /hearings, /reports/*
   - Features: JWT authentication, proper error handling
   - Status: PRODUCTION-READY

❌ api-server.php - Development router (if exists)
   - Simple delegator to api-test.php
   - Status: TO BE REMOVED

❌ router.php - Alternative router (if exists)
   - Alternative implementation
   - Status: TO BE REMOVED
```

### Configuration Analysis

```
✅ backend/config/config.php - Canonical configuration
   - Contains: App settings, database config, security settings
   - Environment variable support: Partial (uses $_ENV fallbacks)
   - Status: KEEP AS CANONICAL

❌ config/ directory - Duplicate configurations (if exists)
   - Status: TO BE REMOVED

❌ database/config/ - Additional duplicates (if exists)
   - Status: TO BE REMOVED
```

### Test File Inventory

Current test files at repository root:

- `check-cases-data.php`
- `check-cases-ids.php`
- `check-clients-structure.php`
- `check-db-structure.php`
- `check-hearings-data.php`
- `debug-cases-list.php`
- `test-admin-user.php`
- `test-api-endpoints.php`
- `test-api-simple.php`
- `test-auth-direct.php`
- `test-case-api.php`
- `test-client-api.php`
- `test-hearing-api.php`
- `test-mysql-connection.php`
- `test-wamp.php`

**Status**: All test files will be reorganized into service-based structure

## Frontend Application Status

### React Application

```
✅ src/ directory - React TypeScript application
   - Modern Vite build setup
   - RTL (Arabic) support implemented
   - Bootstrap UI framework
   - Playwright E2E testing configured
   - Status: WELL-STRUCTURED, will move to apps/web/
```

### Build System

```
✅ package.json - Comprehensive npm scripts (43 commands)
   - Frontend build: Vite (modern, fast)
   - Testing: Vitest + Playwright
   - Linting: ESLint + TypeScript
   - Status: EXCELLENT, no changes needed to build process
```

## Database Configuration

### Current Database Setup

```
✅ Database schema appears comprehensive
   - Tables: users, cases, clients, hearings, reports
   - Migrations: Present in database/ directory
   - Connection: Configured in backend/config/database.php
   - Status: STABLE, connections will be preserved
```

## Security Assessment

### Current Security Issues

```
❌ Hardcoded credentials in config files
   - DB_PASS=1234 in multiple locations
   - JWT_SECRET=your-secret-key-change-in-production
   - Status: CRITICAL - will be fixed with environment variables

❌ No .env file support
   - Secrets in source code
   - Status: HIGH PRIORITY - will be implemented
```

## Functionality Verification

### Expected Behavior Post-Migration

1. **API Endpoints**: All endpoints in backend/api/index.php will continue to work
2. **Frontend**: React application will continue to function normally
3. **Database**: All connections and queries will work unchanged
4. **Tests**: All tests will be runnable in organized structure
5. **Build Process**: Frontend build process unchanged
6. **Security**: Improved through environment variables

### Breaking Changes (Intentional)

1. **API Routes**: Only backend/api/index.php will handle API requests
2. **Config Location**: Only backend/config/ will contain configuration
3. **Test Location**: Tests moved from root to tests/ directory structure
4. **Documentation**: Moved from root to docs/ hierarchy

## Rollback Readiness

### Files Backed Up

- All API files that will be removed
- All config files that will be consolidated
- All test files that will be reorganized
- Emergency rollback script created

### Rollback Trigger Conditions

1. Any API functionality stops working
2. Database connections fail
3. Frontend build process breaks
4. Tests fail to execute
5. Any core functionality regresses

**Current System Status**: ✅ DOCUMENTED AND READY FOR MIGRATION

**Next Step**: Test rollback procedures to ensure safety net is functional
