# 003 Repository Structure Transformation

**Status**: Proposed
**Date**: 2025-09-22
**Deciders**: Principal Software Architect, Development Team, DevOps Team
**Technical Story**: Complete repository restructure to eliminate chaos and establish clear service boundaries

## Context and Problem Statement

The current repository structure violates multiple architectural principles:

- 40+ test files scattered at root level (test-*.php, check-*.php, debug-*.php)
- 20+ documentation files at root level with overlapping content
- No clear separation between frontend (React) and backend (PHP) services
- Build scripts duplicated across scripts/ and deploy/ directories
- No governance structure (missing CODEOWNERS, CONTRIBUTING.md, etc.)

This creates a maintenance nightmare where developers can't quickly find files, changes require updates in multiple locations, and onboarding new team members is difficult.

## Decision Drivers

- **Developer Experience**: Predictable structure where files are easy to find
- **Maintainability**: Each file has a clear location and purpose
- **Service Boundaries**: Clear separation between web and API services
- **CI/CD Efficiency**: Build only what has changed
- **12-Factor Compliance**: Clear build/release/run separation
- **Industry Standards**: Follow monorepo best practices

## Considered Options

1. **Monorepo with apps/ and packages/** - Clear service separation
2. **Separate repositories** - Split into multiple repos
3. **Clean root with organized subdirectories** - Keep monorepo but organize
4. **Keep current structure but add organization** - Minimal changes

## Decision Outcome

**Chosen option**: "Monorepo with apps/ and packages/", because it provides clear service boundaries, enables independent scaling, follows industry best practices for full-stack applications, and creates a foundation for future growth.

### Positive Consequences

- **Clear service boundaries**: Web app and API can evolve independently
- **Predictable structure**: Developers know exactly where to find/place files
- **Scalable**: Can add new apps/packages without restructuring
- **CI/CD optimization**: Build systems can target specific services
- **Easy onboarding**: New developers can navigate quickly
- **Future-proof**: Structure supports microservices evolution

### Negative Consequences

- **Major migration effort**: Need to move hundreds of files
- **Breaking changes**: All imports/includes need updating
- **Tooling updates**: CI/CD, build scripts, documentation all need updates
- **Team coordination**: All developers need to understand new structure

## Target Structure

```
litigation-management-system/
├── apps/                           # Applications
│   ├── api/                       # PHP Backend Service
│   └── web/                       # React Frontend Service
├── packages/                      # Shared Code
│   ├── config/                    # Configuration utilities
│   ├── database/                  # Database layer
│   └── shared-types/              # TypeScript definitions
├── scripts/                       # Build & Deploy Scripts
├── tests/                         # All Tests Organized
│   ├── api/                       # Backend tests
│   ├── web/                       # Frontend tests
│   └── integration/               # Cross-service tests
├── docs/                          # Documentation Hub
│   ├── setup/                     # Installation guides
│   ├── deployment/                # Deploy guides
│   └── adr/                       # Architecture decisions
└── .github/                       # GitHub integration
```

## Pros and Cons of the Options

### Monorepo with apps/ and packages/

**Pros**:

- Industry standard structure (used by Google, Facebook, Microsoft)
- Clear service boundaries with shared code reuse
- Single CI/CD pipeline can handle multiple services
- Atomic commits across services
- Shared tooling and configuration
- Easy code sharing between services

**Cons**:

- Complex initial migration
- Need monorepo tooling for optimal performance
- Single point of failure for CI/CD
- Can become large over time

### Separate repositories

**Pros**:

- Complete service isolation
- Independent CI/CD pipelines
- Smaller, focused repositories
- Different teams can own different repos

**Cons**:

- Cross-service changes require multiple PRs
- Shared code becomes difficult to manage
- Deployment coordination complexity
- Duplicate tooling setup

### Clean root with organized subdirectories

**Pros**:

- Less radical change
- Maintains single repository
- Can be implemented incrementally

**Cons**:

- Doesn't solve service boundary issues
- Still unclear what goes where
- May become messy again over time

### Keep current structure but add organization

**Pros**:

- Minimal disruption
- No breaking changes
- Can be done gradually

**Cons**:

- Doesn't solve fundamental problems
- Technical debt continues to accumulate
- Developer experience remains poor

## Migration Strategy

### Phase 1: Core Service Migration (Week 1)

```bash
# Create new structure
mkdir -p apps/{api,web}
mkdir -p packages/{config,database,shared-types}
mkdir -p tests/{api,web,integration,fixtures}
mkdir -p docs/{setup,deployment,api,troubleshooting,adr}

# Move backend to apps/api/
mv backend/* apps/api/
rmdir backend

# Move frontend to apps/web/
mv src/* apps/web/src/
mv public/* apps/web/public/
```

### Phase 2: Shared Code Organization (Week 2)

```bash
# Move configuration
mv config/* packages/config/
rmdir config

# Move database utilities
mv database/* packages/database/
rmdir database

# Create shared types
# (Generate TypeScript definitions from PHP models)
```

### Phase 3: Test Organization (Week 2)

```bash
# Organize API tests
mv test-*-api.php tests/api/
mv test-auth-*.php tests/api/auth/

# Organize database tests
mv check-*.php tests/database/
mv test-db.php tests/database/

# Remove debug files
rm debug-*.php
rm test-*-debug.php
```

### Phase 4: Documentation Consolidation (Week 3)

```bash
# Setup guides
mv README-*.md docs/setup/

# Deployment guides
mv DEPLOYMENT*.md docs/deployment/
mv GODADDY*.md docs/deployment/

# Troubleshooting
mv *TROUBLESHOOTING*.md docs/troubleshooting/
```

### Phase 5: Build and Governance (Week 3)

```bash
# Consolidate scripts
mv deploy/* scripts/deploy/
rmdir deploy

# Add governance files
touch CODEOWNERS CONTRIBUTING.md SECURITY.md
```

## Impact Analysis

### Files to be moved: ~200 files

### Import statements to update: ~50 locations

### Documentation references to update: ~30 files

### CI/CD configurations to update: 5 files

## Risk Mitigation

1. **Comprehensive Backup**: Full repository backup before migration
2. **Incremental Testing**: Test each phase before proceeding
3. **Parallel Development**: Use feature branches during migration
4. **Rollback Plan**: Document rollback steps for each phase
5. **Team Communication**: Daily standups during migration period

## Success Metrics

1. **Zero duplicate files**: Each file exists in exactly one location
2. **Fast navigation**: Developers can find any file in <30 seconds
3. **Clean CI/CD**: Build times improved by >30%
4. **Easy onboarding**: New developers productive in <1 day
5. **Maintainable**: Zero "where does this go?" questions

## Future Evolution

This structure supports:

- **Microservices**: Each app can become independent service
- **Multiple frontends**: Mobile app, admin panel as separate apps
- **Shared libraries**: Common utilities in packages
- **Team ownership**: Clear boundaries for team responsibility

## Links

- [API Consolidation Decision](001-api-consolidation.md)
- [Configuration Management Strategy](002-config-management.md)
- [Canonical Layout Proposal](../_arch_audit/canonical_layout_proposal.md)
- [Duplication Analysis](../_arch_audit/dedup_report.md)
