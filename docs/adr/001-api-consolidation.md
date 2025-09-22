# ADR-001: Consolidate Multiple API Entry Points into Single Service

## Status
**Accepted**

## Context
The Litigation Management System currently has multiple competing API entry points:
- `api-server.php` in the root directory
- `backend/api/index.php`
- `backend/public/index.php`
- `router.php`

This creates confusion about which endpoint to use, security vulnerabilities with multiple entry points, and maintenance burden with duplicated API logic.

## Decision
We will consolidate all API functionality into a single `/apps/api/` service with clear boundaries and responsibilities.

## Rationale
1. **Security**: Single entry point reduces attack surface
2. **Maintainability**: Single codebase for API logic
3. **Clarity**: Clear API boundaries for frontend integration
4. **12-Factor Compliance**: Clear separation of concerns
5. **Scalability**: Single service can be easily containerized and scaled

## Consequences
### Positive
- **Reduced Security Risk**: Single entry point with unified authentication
- **Easier Maintenance**: API logic consolidated in one location
- **Clear API Documentation**: Single API specification
- **Better Testing**: Comprehensive test coverage for single service
- **Deployment Simplicity**: Single API service to deploy and monitor

### Negative
- **Breaking Changes**: All existing API calls will need path updates
- **Migration Effort**: Frontend and external integrations need updates
- **Temporary Downtime**: Risk during migration period

## Implementation Plan
1. **Phase 1**: Create backup of current API structure
2. **Phase 2**: Create new `/apps/api/` directory structure
3. **Phase 3**: Move and consolidate API files:
   - Move `api-server.php` → `/apps/api/api-server.php`
   - Move `backend/api/` → `/apps/api/`
   - Move `backend/src/Controllers/` → `/apps/api/src/controllers/`
   - Move `backend/src/Core/` → `/apps/api/src/core/`
   - Move `backend/src/Middleware/` → `/apps/api/src/middleware/`
   - Move `backend/src/Models/` → `/apps/api/src/models/`
4. **Phase 4**: Update all import paths and API calls
5. **Phase 5**: Test thoroughly and deploy incrementally

## Alternatives Considered
1. **Keep Multiple APIs**: Rejected due to security and maintenance concerns
2. **Microservices Architecture**: Rejected due to project scope and complexity
3. **API Gateway Pattern**: Considered but rejected for simplicity

## Related ADRs
- ADR-002: Configuration Unification
- ADR-003: Frontend Service Organization

## Compliance
- ✅ 12-Factor App: Clear service boundaries
- ✅ Single Source of Truth: One API service
- ✅ Security Best Practices: Reduced attack surface

---
**ADR Created**: January 22, 2025
**Decision Date**: January 22, 2025
**Status**: Accepted
**Author**: Principal Software Architect
