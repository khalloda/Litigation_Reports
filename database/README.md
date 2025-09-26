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

## ✅ **CRUD API Integration (September 2025)**

The database is now fully integrated with working CRUD API endpoints:

### **Complete API Endpoints**

- **`/api/hearings`**: Full CRUD operations (GET, POST, PUT, DELETE)
- **`/api/cases`**: Complete case management with client relationships
- **`/api/clients`**: Full client CRUD with logo upload support
- **`/api/invoices`**: Invoice creation with dynamic client/case filtering
- **`/api/users`**: User authentication and management
- **`/api/lawyers`**: Lawyer information and management

### **Options Endpoints**

```php
// Dynamic dropdown data from database
GET /api/hearings/options    // Hearing types, results, etc.
GET /api/cases/options       // Case statuses, importance levels
GET /api/clients/options     // Client types, service types
GET /api/lawyers/options     // Lawyer specializations, teams
```

### **Real Data Status**

- **✅ 308 Clients** migrated and operational
- **✅ 38 Lawyers** with complete profiles
- **✅ 6,388+ Cases** with full relationships
- **✅ 20,000+ Hearings** with court information
- **✅ 540+ Invoices** with financial data
- **✅ JWT Authentication** working with database users

### **Frontend Integration**

- **Build System**: React frontend compiles to `./backend/public/`
- **API Communication**: Complete AJAX integration with database
- **Real-time Updates**: Database changes reflect immediately in UI
- **Toast Notifications**: Success/error messages from database operations

### **Example CRUD Usage**

```bash
# Test hearings CRUD
curl -X GET "http://lit.local:8080/api/hearings"
curl -X POST "http://lit.local:8080/api/hearings" -d '{"case_id":1,"hearing_date":"2025-10-01"}'
curl -X PUT "http://lit.local:8080/api/hearings/1" -d '{"hearing_result":"postponed"}'
curl -X DELETE "http://lit.local:8080/api/hearings/1"

# Test clients with Arabic names
curl -X PUT "http://lit.local:8080/api/clients/1" \
  -d '{"client_name_ar":"ناجي رمضان المحدث","client_name_en":"Updated Name"}'
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
6. **✅ Test CRUD operations** - All CRUD endpoints are functional!

## Additional Documentation

- **[CRUD API Examples](../CRUD_API_EXAMPLES.md)** - Complete API documentation with curl examples
- **[CRUD Completion Report](../CRUD_COMPLETION_REPORT.md)** - Full report on completed CRUD functionality
- **[Tasks Status](../Tasks.md)** - Current project completion status

The database is now ready and **fully functional** with complete CRUD operations for your Litigation Management System application! 🚀
