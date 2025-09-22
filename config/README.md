# Configuration Directory

This directory contains all configuration files for the Litigation Management System.

## Structure

```
/config/
├── config.php              # Base configuration (required)
├── database.php            # Database settings (required)
├── development.php         # Development overrides
├── production.php          # Production overrides
├── testing.php            # Testing overrides
└── README.md              # This file
```

## Usage

### Loading Configuration

Configuration is loaded using the following pattern:

```php
// In your application's bootstrap or config loader
$env = getenv('APP_ENV') ?: 'development';

$config = array_merge(
    require 'config/config.php',           // Base config
    require 'config/database.php',         // Database config
    file_exists("config/{$env}.php")
        ? require "config/{$env}.php"     // Environment overrides
        : []
);
```

### Environment Variables

Set the `APP_ENV` environment variable to control which overrides are loaded:

```bash
# Development
export APP_ENV=development

# Production
export APP_ENV=production

# Testing
export APP_ENV=testing
```

### Configuration Hierarchy

1. **Base Configuration** (`config.php`) - Always loaded
2. **Database Configuration** (`database.php`) - Always loaded
3. **Environment Overrides** (e.g., `development.php`) - Loaded if file exists
4. **Runtime Environment Variables** - Override any config value

## Environment Configurations

### Development (`development.php`)
- Debug mode enabled
- Detailed logging
- Development database settings
- Relaxed CORS settings for local development

### Production (`production.php`)
- Debug mode disabled
- Error-level logging only
- Production database settings from environment variables
- Strict CORS settings
- Enhanced security settings

### Testing (`testing.php`)
- Debug mode enabled for debugging tests
- Test database settings
- Automatic database reset and seeding
- Mocked external services

## Security Notes

- Never commit sensitive credentials to version control
- Use environment variables for sensitive data
- The production config uses `getenv()` for sensitive values
- Ensure `.env` files are in `.gitignore`

## Database Configuration

Database settings are split into a separate file for easier management:

```php
// config/database.php
return [
    'database' => [
        'driver' => 'mysql',
        'host' => 'localhost',
        'port' => 3306,
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
        // ... other settings
    ]
];
```

## Custom Configuration

To add custom configuration:

1. Add base settings to `config.php`
2. Add environment-specific overrides to the appropriate environment file
3. Access via the global `$config` variable or your config loader

## Troubleshooting

### Configuration Not Loading
- Check file permissions
- Verify the `APP_ENV` environment variable
- Check for PHP syntax errors in config files

### Environment Overrides Not Applied
- Ensure the environment file exists
- Check the `APP_ENV` value
- Verify file paths in your config loader

## Migration from Old Structure

If migrating from the old `backend/config/` structure:

1. Compare the files for differences
2. Merge any missing settings into the base config
3. Remove the old `backend/config/` directory
4. Update any hardcoded config paths in your code

## Best Practices

1. **Keep secrets out of config files** - Use environment variables
2. **Document your configuration** - Comment complex settings
3. **Validate configuration** - Add validation in your config loader
4. **Use consistent naming** - Follow the existing naming conventions
5. **Test configuration changes** - Verify in a staging environment first
