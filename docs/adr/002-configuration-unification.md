# ADR-002: Unify Configuration Management

## Status
**Accepted**

## Context
Configuration files are currently duplicated across multiple locations:
- `config/` in root directory
- `backend/config/` in backend directory

This creates risk of configuration drift between environments and makes it unclear which configuration file is authoritative.

## Decision
We will consolidate all configuration into a single `/config/` directory with environment-specific overrides and clear precedence rules.

## Rationale
1. **Consistency**: Single source of truth for all configuration
2. **Environment Management**: Clear separation of dev/staging/prod configs
3. **12-Factor Compliance**: Configuration stored in environment variables
4. **Maintainability**: Easier to update and audit configurations
5. **Security**: Centralized secret management

## Consequences
### Positive
- **Reduced Drift Risk**: Single config eliminates inconsistencies
- **Environment Clarity**: Clear dev/prod configuration separation
- **Easier Deployment**: Simple config management across environments
- **Better Security**: Centralized secret handling
- **Audit Trail**: Clear configuration history

### Negative
- **Migration Complexity**: Need to merge existing configs carefully
- **Breaking Changes**: Config file paths will change
- **Learning Curve**: Team needs to understand new config structure

## Implementation Plan
1. **Phase 1**: Audit current configuration files
2. **Phase 2**: Create new `/config/` directory structure
3. **Phase 3**: Merge configuration files:
   - Use `config/config.php` as base (most comprehensive)
   - Merge `backend/config/config.php` additions
   - Create environment-specific configs (`development.php`, `production.php`)
4. **Phase 4**: Update all PHP files to use new config paths
5. **Phase 5**: Set up environment variable overrides

## Configuration Structure
```
/config/
├── config.php              # Base configuration
├── database.php            # Database settings
├── development.php         # Development overrides
├── production.php          # Production overrides
├── testing.php            # Testing overrides
└── README.md              # Configuration documentation
```

## Environment Variable Strategy
```php
// Base config with environment overrides
$config = array_merge(
    require 'config.php',
    file_exists('config/' . getenv('APP_ENV') . '.php')
        ? require 'config/' . getenv('APP_ENV') . '.php'
        : []
);
```

## Alternatives Considered
1. **Environment Variables Only**: Rejected due to complexity for PHP deployment
2. **Keep Separate Configs**: Rejected due to drift risk
3. **YAML/JSON Configs**: Considered but rejected for PHP ecosystem fit

## Related ADRs
- ADR-001: API Consolidation
- ADR-004: Deployment Strategy

## Compliance
- ✅ 12-Factor App: Config stored in environment
- ✅ Security Best Practices: Centralized config management
- ✅ Maintainability: Clear config organization

---
**ADR Created**: January 22, 2025
**Decision Date**: January 22, 2025
**Status**: Accepted
**Author**: Principal Software Architect
