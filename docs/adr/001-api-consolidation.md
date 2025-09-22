# 001 API Consolidation and Single Source of Truth

**Status**: Proposed
**Date**: 2025-09-22
**Deciders**: Principal Software Architect, Development Team
**Technical Story**: Architecture audit revealed critical API duplication

## Context and Problem Statement

The litigation management system currently has three different API implementations competing for the same responsibilities:
1. `backend/api/index.php` - A comprehensive 805-line MVC-structured API
2. `api-server.php` - A 51-line development router that delegates to api-test.php
3. `router.php` - A 50-line alternative router implementation

This creates confusion, maintenance overhead, and potential conflicts. There is no single source of truth for API routing, leading to inconsistent behavior across environments.

## Decision Drivers

- **Single Source of Truth**: Need one canonical API implementation
- **Maintainability**: Multiple APIs create exponential maintenance complexity
- **12-Factor Compliance**: Stateless, self-contained service boundaries
- **Developer Experience**: Clear, predictable API behavior
- **Production Stability**: Eliminate environment-specific routing conflicts

## Considered Options

1. **Keep backend/api/index.php as canonical** - Most comprehensive, follows MVC pattern
2. **Keep api-server.php as canonical** - Simpler, development-focused
3. **Create new unified API** - Clean slate approach
4. **Keep all three and document differences** - Maintain status quo

## Decision Outcome

**Chosen option**: "Keep backend/api/index.php as canonical", because it is the most comprehensive implementation with proper MVC structure, handles all endpoints (auth, cases, clients, hearings, reports), includes proper error handling, and follows established PHP API patterns.

### Positive Consequences

- **Single API endpoint**: All requests go through one well-tested path
- **Consistent behavior**: Same API logic across all environments
- **Maintainability**: Changes only need to be made in one place
- **Clear structure**: MVC pattern is familiar to PHP developers
- **Comprehensive**: Already handles all required endpoints

### Negative Consequences

- **Breaking changes**: Any code relying on api-server.php or router.php will break
- **Migration effort**: Need to update any hardcoded references
- **Testing overhead**: Must ensure all functionality from removed APIs is preserved

## Pros and Cons of the Options

### Keep backend/api/index.php as canonical

**Pros**:
- Most complete implementation (805 lines vs 51/50)
- Proper MVC structure with Controllers, Models, Middleware
- Handles authentication with JWT tokens
- Comprehensive endpoint coverage (cases, clients, hearings, reports)
- Proper error handling and HTTP status codes
- Already follows 12-Factor principles (stateless, config via env)

**Cons**:
- More complex than alternatives
- Requires updating any references to other APIs
- May have dependencies on backend structure

### Keep api-server.php as canonical

**Pros**:
- Simpler implementation
- Good for development environments
- Lighter weight

**Cons**:
- Incomplete functionality - delegates to api-test.php
- No proper MVC structure
- Limited endpoint support
- Not production-ready

### Create new unified API

**Pros**:
- Clean slate, no legacy issues
- Can incorporate best practices from all existing APIs

**Cons**:
- Significant development effort
- Risk of introducing new bugs
- Delays other architectural improvements
- Need to migrate all existing functionality

### Keep all three APIs

**Pros**:
- No immediate breaking changes
- Preserves existing functionality

**Cons**:
- Continues maintenance nightmare
- No single source of truth
- Potential for divergent behavior
- Violates architectural principles

## Implementation Plan

### Phase 1: Backup and Analysis
1. Create backup of all API files in `_arch_audit/backup/`
2. Document all endpoints in each API implementation
3. Identify any unique functionality in api-server.php or router.php

### Phase 2: Consolidation
1. Remove `api-server.php` and `router.php`
2. Remove `api-test.php` (referenced by api-server.php)
3. Update any references to point to `backend/api/index.php`
4. Update development server configuration

### Phase 3: Verification
1. Test all API endpoints through canonical implementation
2. Verify authentication flows work correctly
3. Ensure all CRUD operations function properly
4. Validate report generation endpoints

### Phase 4: Documentation
1. Update API documentation to reflect single endpoint
2. Update development setup guides
3. Document any behavioral changes

## Links

- [Backend API Implementation](../../backend/api/index.php)
- [API Duplication Analysis](../_arch_audit/dedup_report.md)
- [Repository Structure Proposal](../_arch_audit/canonical_layout_proposal.md)