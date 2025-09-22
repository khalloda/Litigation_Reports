# Canonical Repository Layout Proposal

## Current Problems

The current repository structure violates multiple architectural principles:
- **No clear service boundaries** (frontend and backend mixed)
- **Configuration scattered** across 3 different locations
- **No separation of concerns** (tests, scripts, docs all at root)
- **Multiple API implementations** creating confusion

## Proposed Canonical Structure

Based on **12-Factor App** principles and modern monorepo patterns:

```
litigation-management-system/
├── apps/                              # 🏗️ Application Layer
│   ├── api/                          # Backend PHP API Service
│   │   ├── src/
│   │   │   ├── Controllers/          # HTTP Controllers
│   │   │   ├── Models/               # Data Models
│   │   │   ├── Middleware/           # Request/Response Middleware
│   │   │   └── Core/                 # Core Framework Classes
│   │   ├── config/                   # Environment-specific configs
│   │   ├── public/                   # Public assets & entry point
│   │   └── composer.json             # PHP dependencies (to be added)
│   │
│   └── web/                          # Frontend React Application
│       ├── src/                      # React source code
│       ├── public/                   # Static assets
│       ├── package.json              # Node dependencies
│       └── vite.config.ts            # Build configuration
│
├── packages/                          # 🔧 Shared Packages
│   ├── config/                       # Shared configuration utilities
│   │   ├── environments.php          # Environment management
│   │   ├── constants.php             # Global constants
│   │   └── validation.php            # Shared validation rules
│   │
│   ├── database/                     # Database layer
│   │   ├── migrations/               # Database migrations
│   │   ├── seeders/                  # Test data seeders
│   │   ├── schemas/                  # Table schemas
│   │   └── connection.php            # Database connection manager
│   │
│   └── shared-types/                 # TypeScript type definitions
│       ├── api.d.ts                  # API interfaces
│       ├── database.d.ts             # Database types
│       └── common.d.ts               # Common types
│
├── scripts/                          # 🔨 Build & Automation
│   ├── build/                        # Build scripts
│   │   ├── production.sh             # Production build
│   │   ├── production.bat            # Windows production build
│   │   └── development.sh            # Development setup
│   ├── deploy/                       # Deployment scripts
│   │   ├── godaddy.sh               # GoDaddy deployment
│   │   └── docker.sh                # Docker deployment
│   └── database/                     # Database scripts
│       ├── migrate.php               # Run migrations
│       ├── seed.php                  # Seed test data
│       └── backup.php                # Database backup
│
├── tests/                            # 🧪 All Testing
│   ├── api/                          # API tests
│   │   ├── auth.spec.ts             # Authentication tests
│   │   ├── cases.spec.ts            # Cases endpoint tests
│   │   └── helpers/                  # Test helpers
│   ├── web/                          # Frontend tests
│   │   ├── components/              # Component tests
│   │   ├── pages/                   # Page tests
│   │   └── e2e/                     # End-to-end tests
│   ├── integration/                  # Integration tests
│   │   ├── full-flow.spec.ts        # Complete user flows
│   │   └── api-web.spec.ts          # API-Web integration
│   └── fixtures/                     # Test data & mocks
│       ├── users.json               # User test data
│       └── cases.json               # Cases test data
│
├── docs/                             # 📚 Documentation
│   ├── setup/                        # Setup & Installation
│   │   ├── README.md                # Main setup guide
│   │   ├── development.md           # Dev environment setup
│   │   └── dependencies.md          # System requirements
│   ├── deployment/                   # Deployment Guides
│   │   ├── production.md            # Production deployment
│   │   ├── godaddy.md              # GoDaddy specific
│   │   └── docker.md               # Docker deployment
│   ├── api/                          # API Documentation
│   │   ├── authentication.md        # Auth endpoints
│   │   ├── cases.md                 # Cases API
│   │   └── reports.md               # Reports API
│   ├── troubleshooting/              # Problem Resolution
│   │   ├── common-issues.md         # FAQ
│   │   └── database.md              # DB troubleshooting
│   └── adr/                          # Architecture Decision Records
│       ├── 001-api-consolidation.md # API unification decision
│       ├── 002-config-management.md # Config strategy
│       └── template.md              # ADR template
│
├── .github/                          # 🤖 GitHub Integration
│   ├── workflows/                    # CI/CD pipelines
│   │   ├── test.yml                 # Run tests
│   │   ├── build.yml                # Build applications
│   │   └── deploy.yml               # Deploy to staging/prod
│   ├── ISSUE_TEMPLATE/              # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md     # PR template
│
└── root-level files/                 # 📋 Repository Configuration
    ├── package.json                  # Main project config
    ├── composer.json                 # PHP dependencies (to be added)
    ├── .env.example                  # Environment template
    ├── .gitignore                    # Git ignore rules
    ├── .editorconfig                # Code formatting
    ├── CODEOWNERS                   # Code ownership
    ├── CONTRIBUTING.md              # Contribution guide
    ├── SECURITY.md                  # Security policy
    ├── CHANGELOG.md                 # Version history
    └── LICENSE                      # License file
```

## Service Boundaries (12-Factor Compliant)

### 1. API Service (`apps/api/`)
- **Single Responsibility**: Handle all backend logic
- **Stateless**: No session state, JWT-based auth
- **Config via Environment**: All config from environment variables
- **Logs as Event Stream**: Structured logging to stdout
- **Port Binding**: Self-contained HTTP service

### 2. Web Service (`apps/web/`)
- **Single Responsibility**: User interface and client-side logic
- **Build/Release/Run**: Clear separation via Vite
- **Config via Environment**: Environment-specific builds
- **Static Assets**: Served from CDN or static hosting

### 3. Shared Packages (`packages/`)
- **DRY Principle**: Shared code between services
- **Dependency Management**: Clear internal dependencies
- **Versioned**: Each package can be versioned independently

## Migration Benefits

### ✅ Single Source of Truth
- **One API implementation**: `apps/api/src/`
- **One config location**: `apps/api/config/` + environment variables
- **One test strategy**: Organized by service and type

### ✅ Clear Separation of Concerns
- **Applications**: Business logic and user interfaces
- **Packages**: Shared utilities and data layer
- **Scripts**: Automation and deployment
- **Tests**: Quality assurance
- **Docs**: Knowledge management

### ✅ Developer Experience
- **Predictable structure**: Developers know where to find things
- **Easy onboarding**: Clear setup documentation
- **Maintainable**: Each service can be modified independently

### ✅ DevOps Benefits
- **Environment parity**: Same structure dev → staging → production
- **Scalable deployment**: Services can be deployed independently
- **CI/CD optimization**: Test/build only what changed

## Migration Strategy

### Phase 1: Core Services
1. Create `apps/api/` and move `backend/` contents
2. Create `apps/web/` and move `src/` contents
3. Update build scripts to target new locations

### Phase 2: Shared Infrastructure
1. Create `packages/config/` and consolidate config files
2. Create `packages/database/` and move database utilities
3. Update imports across services

### Phase 3: Testing & Documentation
1. Reorganize all test files into `tests/` by service
2. Consolidate documentation into `docs/` hierarchy
3. Create ADRs for all major decisions

### Phase 4: Governance
1. Add CODEOWNERS for each major path
2. Set up GitHub workflows for new structure
3. Create contributing guidelines

## Compliance & Standards

- ✅ **12-Factor App**: Config, build/release/run, stateless
- ✅ **Conventional Commits**: For automated changelogs
- ✅ **SemVer**: For version management
- ✅ **Monorepo Best Practices**: Clear service boundaries
- ✅ **Security**: Secrets in environment, not in code

## Success Metrics

1. **Zero duplicate files**: Each piece of code/config exists once
2. **Fast builds**: Only rebuild changed services
3. **Clear ownership**: Every file has an owner in CODEOWNERS
4. **Easy navigation**: Developers can find anything in <30 seconds
5. **Automated quality**: CI fails if structure violations occur

This structure transforms the current chaos into a professional, maintainable, and scalable codebase that follows industry best practices.