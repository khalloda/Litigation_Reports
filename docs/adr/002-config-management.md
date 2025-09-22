# 002 Configuration Management Strategy

**Status**: Proposed
**Date**: 2025-09-22
**Deciders**: Principal Software Architect, DevOps Team
**Technical Story**: Multiple duplicate configuration files across repository

## Context and Problem Statement

The repository currently has identical configuration files scattered across multiple directories:
- `config/config.php` (root level)
- `backend/config/config.php` (backend level)
- `config/database.php` vs `backend/config/database.php`
- `database/config/database.php` (third location)

This violates the 12-Factor App principle of "Config in Environment" and creates synchronization issues where different parts of the application may use different configuration values.

## Decision Drivers

- **12-Factor Compliance**: Configuration should come from environment variables
- **Single Source of Truth**: One canonical location for all configuration
- **Environment Parity**: Same config structure across dev/staging/production
- **Security**: Sensitive data should not be in source code
- **Maintainability**: Changes to config should only need to happen once

## Considered Options

1. **Consolidate to backend/config/** - Keep configs close to API service
2. **Move to root-level packages/config/** - Shared configuration package
3. **Environment variables only** - No PHP config files, pure env vars
4. **Keep multiple configs but sync them** - Maintain current structure with automation

## Decision Outcome

**Chosen option**: "Consolidate to backend/config/", because the backend service is the primary consumer of configuration, it aligns with the proposed canonical structure where backend becomes `apps/api/`, and it provides a clear migration path to environment-based configuration.

### Positive Consequences

- **Single config location**: All configuration in `backend/config/`
- **Clear ownership**: Config belongs to the service that uses it
- **Migration ready**: Easy to move to `apps/api/config/` in future restructure
- **Environment ready**: Current files already support `$_ENV` fallbacks
- **Security improved**: Can add .env file support to existing structure

### Negative Consequences

- **Breaking changes**: Any code referencing root-level configs will break
- **Migration effort**: Need to update all include/require statements
- **Frontend config**: Web app may need separate config strategy

## Pros and Cons of the Options

### Consolidate to backend/config/

**Pros**:
- Aligns with service-oriented architecture
- Clear ownership and responsibility
- Existing files already support environment variables
- Easy migration path to `apps/api/config/`
- Minimal changes to backend code

**Cons**:
- Frontend may need separate config approach
- Some root-level PHP files may break
- Need to update include paths

### Move to root-level packages/config/

**Pros**:
- True shared configuration
- Good for monorepo structure
- Centralized management

**Cons**:
- More complex migration
- May not align with service boundaries
- Shared configs can become monolithic

### Environment variables only

**Pros**:
- True 12-Factor compliance
- Maximum security
- No config files in source code

**Cons**:
- Major breaking change
- Existing PHP constants would need rewriting
- Complex default value management
- Difficult for local development

### Keep multiple configs but sync them

**Pros**:
- No immediate breaking changes
- Preserves existing functionality

**Cons**:
- Doesn't solve the fundamental problem
- Adds complexity with sync automation
- Still violates single source of truth

## Implementation Plan

### Phase 1: Analysis and Backup
1. Compare all config files to identify differences
2. Create backup of all configuration files
3. Document all code that references config files

### Phase 2: Configuration Consolidation
1. Remove duplicate config files:
   ```bash
   rm config/config.php
   rm config/config.production.php
   rm config/database.php
   rm database/config/database.php
   ```
2. Keep canonical versions in `backend/config/`
3. Update all include/require statements to use canonical paths

### Phase 3: Environment Variable Enhancement
1. Add `.env` file support to `backend/config/config.php`
2. Create `.env.example` with all required variables
3. Update config files to prioritize environment variables

### Phase 4: Documentation and Testing
1. Document new configuration approach
2. Update development setup guides
3. Test all configuration-dependent functionality
4. Verify environment variable overrides work

## Environment Variables Strategy

Following 12-Factor principles, enhance existing config with:

```php
// backend/config/config.php
define('DB_HOST', $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?? 'localhost');
define('DB_USER', $_ENV['DB_USER'] ?? getenv('DB_USER') ?? 'root');
define('JWT_SECRET', $_ENV['JWT_SECRET'] ?? getenv('JWT_SECRET') ?? 'change-in-production');
```

Required environment variables:
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`
- `JWT_SECRET` (critical for security)
- `APP_ENV` (development/staging/production)
- `APP_DEBUG` (true/false)
- `SMTP_*` (email configuration)

## Migration Path to Future Structure

This decision prepares for future migration to:
```
apps/
├── api/
│   ├── config/           # Current backend/config/
│   │   ├── app.php       # Application settings
│   │   ├── database.php  # Database configuration
│   │   └── .env.example  # Environment template
│   └── src/
```

## Security Considerations

1. **Secrets management**: Add .env support for sensitive data
2. **Environment separation**: Different configs for dev/staging/prod
3. **Access control**: Config files should not be web-accessible
4. **Validation**: Validate all environment variables on startup

## Links

- [12-Factor App Config](https://12factor.net/config)
- [API Consolidation Decision](001-api-consolidation.md)
- [Repository Structure Proposal](../_arch_audit/canonical_layout_proposal.md)
- [Duplication Analysis](../_arch_audit/dedup_report.md)