# CI/CD Pipeline Documentation

## Overview

The Litigation Management System uses GitHub Actions for continuous integration and deployment. This document outlines the complete CI/CD pipeline, including workflows, triggers, and deployment processes.

## Pipeline Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │    │     Staging     │    │   Production    │
│     (local)     │───▶│   (automatic)   │───▶│    (manual)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
   Feature Branch          Develop Branch         Release Tags
   Pull Requests           Auto-deploy            Manual Review
```

## Workflows

### 1. Continuous Integration (`ci.yml`)

**Triggers:**
- Push to `main`, `develop`, `fix/*`, `feature/*` branches
- Pull requests to `main`, `develop`

**Jobs:**
- **Frontend Tests**: TypeScript checking, linting, unit tests, build validation
- **Backend Tests**: PHP API testing, database validation
- **E2E Tests**: Full Playwright test suite with real browsers
- **Security Scan**: Dependency audit, secret detection
- **Build Validation**: Production build verification

**Environment:** Ubuntu Latest with Node.js 18, PHP 8.2, MySQL 8.0

### 2. Staging Deployment (`deploy-staging.yml`)

**Triggers:**
- Push to `develop` branch
- Manual trigger with branch selection

**Process:**
1. Run full test suite
2. Build application for staging
3. Create deployment package
4. Generate deployment artifact
5. Provide manual deployment instructions

**Artifacts:** 30-day retention of staging deployment packages

### 3. Production Deployment (`deploy-production.yml`)

**Triggers:**
- Release publication
- Manual trigger with version confirmation

**Process:**
1. **Pre-deployment Security Checks**
   - Security audit (high severity issues)
   - Hardcoded secret detection
   - Version validation

2. **Production Build**
   - Full test suite execution
   - Optimized production build
   - Development artifact removal

3. **Deployment Package Creation**
   - Frontend optimization
   - Backend sanitization
   - Database migration files
   - Security checklists

4. **Manual Deployment Process**
   - Artifact download
   - GoDaddy upload instructions
   - Post-deployment verification

**Security Features:**
- Requires "CONFIRM" input for manual deployments
- 90-day artifact retention
- Comprehensive security checklists

### 4. Release Management (`release.yml`)

**Triggers:**
- Git tags matching `v*.*.*` pattern
- Manual version bumping workflow

**Features:**
- Semantic version validation
- Automatic release notes generation
- Changelog creation from commit history
- Production deployment triggering

## Environment Configuration

### Development
```bash
# Local development
npm run dev              # Frontend development server
npm run start:backend    # PHP backend server
npm run test:all         # Complete test suite
```

### Staging
```bash
# Staging environment
NODE_ENV=staging
APP_ENV=staging
APP_URL=https://staging.lit.sarieldin.com
```

### Production
```bash
# Production environment
NODE_ENV=production
APP_ENV=production
APP_URL=https://lit.sarieldin.com
APP_DEBUG=false
```

## Testing Strategy

### Test Pyramid

```
     ┌─────────────────┐
     │   E2E Tests     │  ← Full user workflows
     │   (Playwright)  │
     ├─────────────────┤
     │ Integration     │  ← API + Database
     │ Tests (PHP)     │
     ├─────────────────┤
     │  Unit Tests     │  ← Component testing
     │ (Vitest/Jest)   │
     └─────────────────┘
```

### Test Categories

1. **Frontend Tests**
   - Unit tests for React components
   - TypeScript type checking
   - ESLint code quality
   - Build validation

2. **Backend Tests**
   - API endpoint testing
   - Database connection validation
   - Authentication flow testing
   - Business logic verification

3. **End-to-End Tests**
   - User authentication flows
   - Case management workflows
   - Report generation testing
   - Cross-browser compatibility

4. **Security Tests**
   - Dependency vulnerability scanning
   - Secret detection in code
   - Authentication security
   - Input validation testing

## Deployment Process

### Automatic Deployments

**Staging Deployment:**
1. Developer pushes to `develop` branch
2. CI pipeline runs automatically
3. All tests must pass
4. Staging deployment package created
5. Manual upload to staging server
6. Staging environment updated

### Manual Deployments

**Production Deployment:**
1. Create release tag: `git tag v1.2.3`
2. Push tag: `git push origin v1.2.3`
3. GitHub automatically creates release
4. Production deployment workflow triggered
5. Security checks and full test suite
6. Production deployment package created
7. Manual review and approval required
8. Download artifact and deploy to GoDaddy

## Security Measures

### Pre-deployment Checks
- High-severity dependency vulnerabilities blocked
- Hardcoded password detection
- Secret scanning with TruffleHog
- Production confirmation required

### Production Security Checklist
- [ ] JWT_SECRET properly configured
- [ ] Database credentials secure
- [ ] HTTPS enforced
- [ ] Debug mode disabled
- [ ] Error reporting configured
- [ ] File upload restrictions active

## Monitoring and Alerts

### Post-deployment Monitoring
- Application response time tracking
- Error rate monitoring
- Database performance metrics
- SSL certificate validity
- Authentication flow health

### Alert Thresholds
- 5xx HTTP errors
- Response times >3 seconds
- Database connection failures
- Failed authentication attempts
- Certificate expiration warnings

## Branch Strategy

### Git Flow
```
main         ──●──────●──────●──      (production releases)
               │      │      │
develop      ──●──●──●──●──●──●──      (staging deployments)
               │  │     │  │
feature/auth ──●──●─────┘  │            (feature development)
                          │
fix/reports  ─────────────●─┘           (hotfixes)
```

### Branch Policies
- `main`: Production-ready code only
- `develop`: Integration branch for staging
- `feature/*`: New feature development
- `fix/*`: Bug fixes and hotfixes

## Artifact Management

### Retention Policies
- **CI Artifacts**: 7 days
- **Staging Deployments**: 30 days
- **Production Deployments**: 90 days
- **Test Reports**: 30 days

### Artifact Contents
- Built frontend application
- Sanitized backend code
- Database migration scripts
- Configuration templates
- Deployment documentation

## Troubleshooting

### Common CI Issues

**Test Failures:**
```bash
# Check test logs in GitHub Actions
# Run tests locally to reproduce
npm run test:all
npm run test:e2e
```

**Build Failures:**
```bash
# Verify dependencies
npm ci
npm run build

# Check for type errors
npm run type-check
```

**Deployment Issues:**
```bash
# Verify environment configuration
# Check artifact contents
# Review deployment logs
```

### Recovery Procedures

**Failed Deployment:**
1. Check deployment logs
2. Verify artifact integrity
3. Rollback to previous version if needed
4. Use emergency rollback script if available

**Pipeline Failures:**
1. Review failed job logs
2. Check for dependency issues
3. Verify environment configuration
4. Re-run failed jobs if transient
5. Fix issues and re-trigger pipeline

## Performance Optimization

### CI Pipeline Optimization
- Parallel job execution
- Dependency caching
- Artifact reuse
- Conditional job execution

### Build Optimization
- Tree shaking for production builds
- Asset compression
- Bundle size monitoring
- Development artifact removal

## Maintenance

### Regular Tasks
- **Weekly**: Review failed deployments
- **Monthly**: Update dependencies
- **Quarterly**: Security audit
- **Annually**: Pipeline architecture review

### Updates and Maintenance
- GitHub Actions version updates
- Dependency security updates
- Test suite maintenance
- Documentation updates

---

**Related Documentation:**
- [Development Setup](../setup/development.md)
- [Deployment Guide](guide.md)
- [Testing Guide](../setup/testing.md)
- [Security Policy](../../SECURITY.md)