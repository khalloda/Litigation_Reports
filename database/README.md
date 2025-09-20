# Litigation Management System - Database Setup

This directory contains the database setup and migration scripts for the Litigation Management System.

## Files Overview

- `litigation_database.sql` - Complete MySQL database schema
- `migrate_data.php` - Data migration script from Access CSV files
- `setup.php` - Automated database setup script
- `test.php` - Database connection and functionality test
- `config/database.php` - Database configuration and helper classes

## Quick Setup

### Prerequisites

1. **WAMP Server** running with:
   - MySQL 9.1.0+
   - PHP 8.4.0+
   - Apache web server

2. **Database Credentials**:
   - Host: `localhost`
   - Username: `root` (or your MySQL username)
   - Password: (your MySQL password)

### Step 1: Run Database Setup

```bash
# Navigate to the database directory
cd database

# Run the setup script
php setup.php
```

This will:
- Create the `litigation_db` database
- Create all necessary tables, views, and stored procedures
- Insert default system settings
- Create default admin user
- Migrate data from CSV files (if available)

### Step 2: Test Database

```bash
# Run the test script
php test.php
```

This will verify:
- Database connection
- Table creation
- Arabic data support
- Basic CRUD operations
- Performance

## Manual Setup

If you prefer to set up the database manually:

### 1. Create Database

```sql
CREATE DATABASE litigation_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE litigation_db;
```

### 2. Import Schema

```bash
mysql -u root -p litigation_db < litigation_database.sql
```

### 3. Migrate Data

```bash
php migrate_data.php
```

## Database Structure

### Core Tables

| Table | Description | Arabic Name |
|-------|-------------|-------------|
| `users` | User authentication and roles | المستخدمين |
| `clients` | Client information | العملاء |
| `lawyers` | Lawyer information | المحامين |
| `cases` | Legal cases/matters | الدعاوى |
| `hearings` | Court hearings | الجلسات |
| `powers_of_attorney` | Legal powers of attorney | التوكيلات |
| `documents` | Case documents | المستندات |
| `invoices` | Billing invoices | الفواتير |
| `attendance` | Lawyer attendance tracking | الحضور |
| `admin_work` | Administrative work tracking | الأعمال الإدارية |

### Supporting Tables

| Table | Description |
|-------|-------------|
| `work_teams` | Legal work teams |
| `contacts` | Contact information |
| `meetings` | Meeting records |
| `meeting_attendance` | Meeting attendance |
| `follow_ups` | Follow-up tasks |
| `payments` | Payment records |
| `system_settings` | System configuration |
| `audit_log` | Audit trail |
| `file_attachments` | File attachments |

### Views

| View | Description |
|------|-------------|
| `v_active_cases` | Currently active cases |
| `v_recent_hearings` | Recent court hearings |
| `v_outstanding_invoices` | Unpaid invoices |

### Stored Procedures

| Procedure | Description |
|-----------|-------------|
| `GetCaseStatistics()` | Returns case statistics |
| `GetLawyerWorkload()` | Returns lawyer workload |

## User Roles

The system supports four user roles:

### Super Admin
- **Permissions**: All system access
- **Description**: Master control over entire system
- **Access**: All modules, user management, system settings

### Admin
- **Permissions**: Full control without delete permissions
- **Description**: Administrative access with restrictions
- **Access**: All modules except user deletion

### Lawyer
- **Permissions**: View, Reports, Requests access
- **Description**: Legal professional access
- **Access**: Case management, client access, reporting

### Staff
- **Permissions**: View, Reports access only
- **Description**: Limited administrative access
- **Access**: View data, generate reports

## Default Login

After setup, you can log in with:

- **Username**: `admin`
- **Email**: `admin@litigation.com`
- **Password**: `password`

**Important**: Change the default password immediately after setup!

## Data Migration

The migration script imports data from the following CSV files:

- `العملاء.csv` - Clients data
- `المحامين.csv` - Lawyers data
- `الدعاوى.csv` - Cases data
- `الجلسات.csv` - Hearings data
- `التوكيلات.csv` - Powers of attorney
- `المستندات.csv` - Documents
- `الفواتير.csv` - Invoices
- `Attendance.csv` - Attendance records
- `admin work table.csv` - Administrative work
- `Contacts.csv` - Contact information

## Arabic Support

The database is fully configured for Arabic support:

- **Character Set**: `utf8mb4`
- **Collation**: `utf8mb4_unicode_ci`
- **Mixed Content**: Supports Arabic and English text
- **RTL Support**: Proper text direction handling

## Performance Optimization

The database includes several performance optimizations:

- **Indexes**: Optimized indexes on frequently queried columns
- **Views**: Pre-computed views for common queries
- **Stored Procedures**: Optimized procedures for complex operations
- **Partitioning**: Ready for table partitioning if needed

## Backup and Recovery

### Backup

```php
// Using PHP
$backupFile = DatabaseHelper::backup('backup_' . date('Y-m-d') . '.sql');

// Using MySQL command line
mysqldump -u root -p litigation_db > backup.sql
```

### Recovery

```php
// Using PHP
DatabaseHelper::restore('backup.sql');

// Using MySQL command line
mysql -u root -p litigation_db < backup.sql
```

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check MySQL is running
   - Verify credentials in `config/database.php`
   - Ensure user has proper permissions

2. **Character Encoding Issues**
   - Verify database charset is `utf8mb4`
   - Check PHP connection charset
   - Ensure CSV files are UTF-8 encoded

3. **Migration Errors**
   - Check CSV file paths
   - Verify file permissions
   - Review error messages in console

4. **Performance Issues**
   - Check database indexes
   - Monitor query execution time
   - Consider table partitioning

### Logs

Check the following for error information:

- MySQL error log
- PHP error log
- Application logs (when available)

## Security Considerations

1. **Change Default Password**: Update admin password immediately
2. **Database User**: Create dedicated database user for application
3. **Permissions**: Grant minimal required permissions
4. **Backups**: Regular automated backups
5. **Updates**: Keep MySQL and PHP updated

## Support

For database-related issues:

1. Check the troubleshooting section above
2. Review error messages carefully
3. Verify all prerequisites are met
4. Test with the provided test script

## Next Steps

After successful database setup:

1. **Test the database** using `test.php`
2. **Configure your application** to use the database
3. **Update default passwords** and settings
4. **Import your data** if needed
5. **Set up regular backups**

The database is now ready for your Litigation Management System application!
