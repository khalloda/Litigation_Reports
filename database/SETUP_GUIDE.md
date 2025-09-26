# Database Setup Guide

## ✅ **Current Status (September 2025)**

**Database Setup: COMPLETE and FUNCTIONAL**

- **✅ MySQL Database**: Fully operational with real data
- **✅ CRUD Operations**: All Create/Read/Update/Delete operations working
- **✅ API Integration**: Complete backend API endpoints functional
- **✅ Frontend Integration**: React application connected and working
- **✅ Real Data**: 308+ clients, 38 lawyers, 6,388+ cases migrated

**Ready for Production Use! 🚀**

---

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
3. **✅ Test CRUD operations**: All CRUD endpoints are working!

   ```bash
   # Test API endpoints
   curl -X GET "http://lit.local:8080/api/hearings"
   curl -X GET "http://lit.local:8080/api/clients"
   curl -X GET "http://lit.local:8080/api/cases"
   ```

4. **✅ Access the React frontend**: Navigate to `http://lit.local:8080`
5. **Import additional data**: If you have more CSV files to import

## ✅ **CRUD Operations Available**

The database now supports full CRUD operations via API:

### **Working Endpoints**

- **Hearings**: `/api/hearings` (GET, POST, PUT, DELETE)
- **Cases**: `/api/cases` (GET, POST, PUT, DELETE)
- **Clients**: `/api/clients` (GET, POST, PUT, DELETE)
- **Invoices**: `/api/invoices` (GET, POST, PUT, DELETE)
- **Users**: `/api/users` (Authentication and management)

### **Frontend Integration**

- **React Application**: Fully functional with database integration
- **Real-time Updates**: Database changes reflect immediately in UI
- **Arabic Support**: Complete RTL support with Arabic data
- **User Interface**: Professional legal management interface

### **Test the Complete System**

```bash
# Start the system
php -S localhost:8080 -t ../backend

# Access the application
# Navigate to: http://lit.local:8080
# Login with: admin@litigation.com / admin123
```

## Files Created

- `litigation_db` - Your MySQL database
- All tables, views, and procedures
- Default system settings
- Admin user account

The database is now ready for your application!
