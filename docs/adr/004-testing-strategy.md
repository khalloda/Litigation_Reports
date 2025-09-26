# 004 Testing Strategy and Organization

**Status**: Proposed
**Date**: 2025-09-22
**Deciders**: Principal Software Architect, QA Team, Development Team
**Technical Story**: Consolidate 40+ scattered test files into organized testing strategy

## Context and Problem Statement

The repository currently has 40+ test files scattered at the root level with no clear organization:

- 15+ API test files (`test-api-*.php`, `test-*-api.php`)
- 10+ database test files (`check-*.php`, `test-db.php`)
- 5+ authentication test files (`test-auth-*.php`)
- 10+ debug files (`debug-*.php`, `test-*-debug.php`)
- Proper Playwright tests in `tests/` directory

This creates confusion about which tests to run, makes it difficult to understand test coverage, and violates the principle of organized test architecture.

## Decision Drivers

- **Test Organization**: Clear categorization by service and type
- **Developer Experience**: Easy to run relevant tests during development
- **CI/CD Efficiency**: Run only affected tests when code changes
- **Maintainability**: Tests should be easy to find, update, and remove
- **Coverage Clarity**: Understand what functionality is tested
- **Quality Assurance**: Comprehensive testing strategy across all layers

## Considered Options

1. **Service-based organization** - Organize by service (api/, web/, integration/)
2. **Type-based organization** - Organize by test type (unit/, integration/, e2e/)
3. **Feature-based organization** - Organize by business feature (auth/, cases/, reports/)
4. **Keep current structure but clean up** - Remove debug files, organize minimally

## Decision Outcome

**Chosen option**: "Service-based organization", because it aligns with the proposed repository structure, enables targeted testing during development, supports independent service evolution, and provides clear ownership boundaries.

### Positive Consequences

- **Clear test ownership**: Each service team owns their tests
- **Targeted testing**: Run only tests for changed services
- **Service independence**: Services can have different testing strategies
- **CI/CD optimization**: Parallel test execution by service
- **Coverage clarity**: Easy to see test coverage per service

### Negative Consequences

- **Migration effort**: Need to categorize and move 40+ test files
- **Duplicate setup**: Some test utilities may be duplicated
- **Integration complexity**: Cross-service tests need special handling

## Target Test Structure

```
tests/
├── api/                          # Backend API Tests
│   ├── auth/                     # Authentication tests
│   │   ├── login.spec.php        # Login endpoint tests
│   │   ├── jwt.spec.php          # JWT token tests
│   │   └── permissions.spec.php  # Authorization tests
│   ├── endpoints/                # CRUD endpoint tests
│   │   ├── cases.spec.php        # Cases API tests
│   │   ├── clients.spec.php      # Clients API tests
│   │   ├── hearings.spec.php     # Hearings API tests
│   │   └── reports.spec.php      # Reports API tests
│   ├── database/                 # Database layer tests
│   │   ├── connection.spec.php   # DB connection tests
│   │   ├── migrations.spec.php   # Migration tests
│   │   └── models.spec.php       # Model tests
│   └── helpers/                  # API test utilities
│       ├── test-client.php       # HTTP test client
│       └── fixtures.php          # Test data management
│
├── web/                          # Frontend Tests (existing Playwright)
│   ├── components/               # Component tests
│   ├── pages/                    # Page tests
│   ├── e2e/                      # End-to-end workflows
│   └── helpers/                  # Frontend test utilities
│
├── integration/                  # Cross-service Integration Tests
│   ├── api-web/                  # API-Frontend integration
│   │   ├── auth-flow.spec.ts     # Complete auth workflow
│   │   ├── crud-operations.spec.ts # CRUD workflows
│   │   └── report-generation.spec.ts # Report workflows
│   ├── database/                 # Database integration
│   │   ├── full-stack.spec.ts    # End-to-end data flow
│   │   └── performance.spec.ts   # Performance tests
│   └── deployment/               # Deployment verification
│       ├── health-check.spec.ts  # Service health
│       └── smoke-tests.spec.ts   # Basic functionality
│
├── fixtures/                     # Shared Test Data
│   ├── users.json               # Test user data
│   ├── cases.json               # Test case data
│   ├── clients.json             # Test client data
│   └── database/                # Database fixtures
│       ├── seed-data.sql        # Test database setup
│       └── cleanup.sql          # Test database cleanup
│
└── config/                      # Test Configuration
    ├── phpunit.xml              # PHP unit test config
    ├── playwright.config.ts     # Playwright config
    └── jest.config.js           # Jest config (if needed)
```

## Migration Plan

### Phase 1: Categorize Existing Tests

1. **Audit all test files** to understand their purpose
2. **Group by functionality**:
   - Authentication: `test-auth-*.php`, `test-admin-user.php`
   - API endpoints: `test-*-api.php`, `test-api-*.php`
   - Database: `check-*.php`, `test-db.php`
   - Debug (DELETE): `debug-*.php`, `test-*-debug.php`

### Phase 2: Create New Structure

```bash
mkdir -p tests/{api/{auth,endpoints,database,helpers},integration/{api-web,database,deployment},fixtures/database,config}
```

### Phase 3: Migrate Test Files

```bash
# API Authentication tests
mv test-auth-*.php tests/api/auth/
mv test-admin-user.php tests/api/auth/admin.spec.php

# API Endpoint tests
mv test-*-api.php tests/api/endpoints/
mv test-api-*.php tests/api/endpoints/

# Database tests
mv check-*.php tests/api/database/
mv test-db.php tests/api/database/connection.spec.php

# Remove debug files
rm debug-*.php
rm test-*-debug.php
```

### Phase 4: Standardize Test Format

1. **Rename files** to follow `.spec.php` convention
2. **Add test documentation** headers
3. **Standardize assertion patterns**
4. **Add setup/teardown methods**

## Testing Strategy by Service

### API Service Tests (`tests/api/`)

- **Unit Tests**: Individual function/method testing
- **Integration Tests**: Database + API layer testing
- **Contract Tests**: API endpoint validation
- **Security Tests**: Authentication and authorization

**Tools**: PHPUnit, custom HTTP client

### Web Service Tests (`tests/web/`)

- **Component Tests**: React component isolation testing
- **Page Tests**: Full page functionality
- **E2E Tests**: User workflow testing
- **Accessibility Tests**: WCAG compliance

**Tools**: Playwright (existing), Jest, React Testing Library

### Integration Tests (`tests/integration/`)

- **API-Web Integration**: Frontend + Backend workflows
- **Database Integration**: Full data flow testing
- **Performance Tests**: Load and stress testing
- **Deployment Tests**: Production readiness verification

**Tools**: Playwright for E2E, custom integration harnesses

## Test Execution Strategy

### Development Workflow

```bash
# Run tests for specific service during development
npm run test:api           # Run all API tests
npm run test:web           # Run all frontend tests
npm run test:integration   # Run integration tests

# Run tests for specific feature
npm run test:api:auth      # Run only auth tests
npm run test:web:components # Run component tests
```

### CI/CD Pipeline

1. **Parallel Execution**: Run API and Web tests in parallel
2. **Conditional Execution**: Run tests only for changed services
3. **Integration Gates**: Integration tests after service tests pass
4. **Deployment Verification**: Smoke tests after deployment

### Test Quality Standards

- **Coverage Targets**: 80% for API, 70% for Web, 90% for critical paths
- **Performance**: Tests should complete in <5 minutes per service
- **Reliability**: <1% flaky test rate
- **Documentation**: Every test file has purpose and setup documentation

## Pros and Cons of the Options

### Service-based organization

**Pros**:

- Aligns with repository structure
- Clear ownership boundaries
- Supports parallel development
- Easy to run relevant tests
- Scales with service growth

**Cons**:

- Some test utilities may be duplicated
- Cross-service testing requires special structure
- Migration effort is significant

### Type-based organization

**Pros**:

- Clear by testing methodology
- Easy to run all unit tests, all integration tests
- Familiar to testing frameworks

**Cons**:

- Doesn't align with service boundaries
- Harder to determine service-specific coverage
- Cross-cutting concerns in multiple places

### Feature-based organization

**Pros**:

- Aligns with business requirements
- Easy to test complete features
- Good for product team understanding

**Cons**:

- Features cross service boundaries
- Technical tests don't fit well
- Harder to maintain technical test categories

## Success Metrics

1. **Zero root-level test files**: All tests in organized structure
2. **Fast test discovery**: Developers can find relevant tests in <15 seconds
3. **Improved CI time**: Test execution time reduced by >30%
4. **Better coverage visibility**: Clear coverage reports per service
5. **Reduced flaky tests**: Test reliability >99%

## Links

- [Repository Structure Decision](003-repository-restructure.md)
- [API Consolidation Decision](001-api-consolidation.md)
- [Duplication Analysis](../_arch_audit/dedup_report.md)
