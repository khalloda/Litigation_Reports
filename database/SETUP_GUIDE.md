# Database Setup Guide

## Quick Setup Instructions

### Step 1: Configure Database Credentials

Edit the file `config.local.php` and update your MySQL credentials:

```php
$mysql_host = 'localhost';
$mysql_username = 'root';
$mysql_password = 'your_mysql_password_here'; // ← Update this
$mysql_database = 'litigation_db';
```

### Step 2: Run Database Setup

```bash
php setup.php
```

### Step 3: Test Database

```bash
php test.php
```

## What the Setup Does

1. **Creates Database**: Creates `litigation_db` with UTF-8 support
2. **Creates Tables**: All 26+ tables from your Access database
3. **Creates Views**: Optimized views for common queries
4. **Creates Procedures**: Stored procedures for statistics
5. **Migrates Data**: Imports data from your CSV files
6. **Creates Admin User**: Default admin account

## Default Admin Login

After setup, you can log in with:
- **Username**: `admin`
- **Email**: `admin@litigation.com`
- **Password**: `password`

**Important**: Change this password immediately!

## Troubleshooting

### "Access denied for user 'root'@'localhost'"

This means your MySQL password is incorrect. Update `config.local.php` with the correct password.

### "Connection failed"

1. Make sure WAMP is running
2. Check MySQL service is started
3. Verify your credentials in `config.local.php`

### "Table already exists"

This is normal if you've run setup before. The script will skip existing tables.

## Next Steps

After successful setup:

1. **Test the database**: Run `php test.php`
2. **Update admin password**: Change the default password
3. **Configure your app**: Point your application to this database
4. **Import additional data**: If you have more CSV files to import

## Files Created

- `litigation_db` - Your MySQL database
- All tables, views, and procedures
- Default system settings
- Admin user account

The database is now ready for your application!
