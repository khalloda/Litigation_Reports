# GoDaddy Installation Guide
## Litigation Management System

This guide provides step-by-step instructions for deploying the Litigation Management System to GoDaddy shared hosting with cPanel.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [GoDaddy Account Setup](#godaddy-account-setup)
3. [cPanel Configuration](#cpanel-configuration)
4. [File Upload](#file-upload)
5. [Database Setup](#database-setup)
6. [PHP Configuration](#php-configuration)
7. [Build and Deploy](#build-and-deploy)
8. [Domain Configuration](#domain-configuration)
9. [SSL Certificate](#ssl-certificate)
10. [Testing and Verification](#testing-and-verification)
11. [Troubleshooting](#troubleshooting)
12. [Maintenance](#maintenance)

---

## 🔧 Prerequisites

### Required GoDaddy Plan
- **Shared Hosting Plan** with cPanel access
- **PHP 8.0+** support (recommended: PHP 8.4)
- **MySQL 8.0+** database
- **SSL Certificate** (free or premium)
- **Subdomain or Domain** for the application

### Local Development Requirements
- **Node.js 18+** installed locally
- **Git** for version control
- **FTP Client** (FileZilla, WinSCP, or cPanel File Manager)
- **Text Editor** (VS Code recommended)

### GoDaddy Account Requirements
- Active GoDaddy hosting account
- cPanel access credentials
- Domain or subdomain ready for deployment

---

## 🌐 GoDaddy Account Setup

### Step 1: Access Your GoDaddy Account
1. Log in to your GoDaddy account at [godaddy.com](https://godaddy.com)
2. Navigate to **My Products** → **Web Hosting**
3. Click **Manage** next to your hosting plan

### Step 2: Verify Hosting Specifications
Ensure your plan includes:
- **PHP Version**: 8.0 or higher
- **MySQL**: 8.0 or higher
- **Storage**: At least 1GB available
- **Bandwidth**: Sufficient for your expected traffic
- **SSL Certificate**: Free Let's Encrypt or premium SSL

### Step 3: Note Your Hosting Details
Record the following information:
- **cPanel URL**: Usually `https://yourdomain.com:2083`
- **cPanel Username**: Your hosting username
- **cPanel Password**: Your hosting password
- **FTP Host**: Usually `ftp.yourdomain.com`
- **FTP Username**: Same as cPanel username
- **FTP Password**: Same as cPanel password

---

## 🖥️ cPanel Configuration

### Step 1: Access cPanel
1. Go to your cPanel URL: `https://yourdomain.com:2083`
2. Log in with your credentials
3. Verify you can see the cPanel dashboard

### Step 2: Check PHP Version
1. Find **Software** section in cPanel
2. Click **Select PHP Version**
3. Ensure PHP 8.0+ is selected
4. Click **Set as Current** if needed

### Step 3: Enable Required PHP Extensions
In the **Select PHP Version** page, enable these extensions:
- ✅ **mysqli** (MySQL database connection)
- ✅ **pdo_mysql** (PDO MySQL support)
- ✅ **curl** (HTTP requests)
- ✅ **json** (JSON processing)
- ✅ **mbstring** (Multi-byte string support)
- ✅ **openssl** (SSL/TLS support)
- ✅ **zip** (Archive handling)
- ✅ **gd** (Image processing)
- ✅ **fileinfo** (File type detection)

### Step 4: Configure PHP Settings
In the **Options** tab, set these values:
- **memory_limit**: `256M` or higher
- **max_execution_time**: `300`
- **max_input_vars**: `3000`
- **post_max_size**: `64M`
- **upload_max_filesize**: `64M`
- **max_file_uploads**: `20`

---

## 📁 File Upload

### Method 1: Using cPanel File Manager (Recommended)

#### Step 1: Access File Manager
1. In cPanel, find **Files** section
2. Click **File Manager**
3. Navigate to **public_html** folder

#### Step 2: Create Application Directory
1. Right-click in **public_html**
2. Select **Create Folder**
3. Name it `litigation` (or your preferred name)
4. Double-click to enter the folder

#### Step 3: Upload Application Files
1. **Create folder structure**:
   ```
   public_html/litigation/
   ├── api/                    # PHP API files
   ├── assets/                 # Static assets
   ├── build/                  # Built React app
   ├── database/               # Database files
   ├── config/                 # Configuration files
   ├── logs/                   # Log files
   └── .htaccess              # Apache configuration
   ```

2. **Upload files** using File Manager:
   - Upload all PHP files to appropriate directories
   - Upload built React files to `build/` directory
   - Upload database files to `database/` directory

### Method 2: Using FTP Client

#### Step 1: Configure FTP Client
**FileZilla Configuration:**
- **Host**: `ftp.yourdomain.com`
- **Username**: Your cPanel username
- **Password**: Your cPanel password
- **Port**: `21`
- **Protocol**: FTP

#### Step 2: Connect and Upload
1. Connect to your FTP server
2. Navigate to `/public_html/litigation/`
3. Upload all application files maintaining directory structure

### Method 3: Using Git (Advanced)

#### Step 1: Enable SSH Access (if available)
1. In cPanel, find **Advanced** section
2. Click **Terminal** or **SSH Access**
3. Enable SSH if not already enabled

#### Step 2: Clone Repository
```bash
cd /home/username/public_html/
git clone https://github.com/yourusername/litigation-reports.git litigation
cd litigation
```

---

## 🗄️ Database Setup

### Step 1: Create MySQL Database
1. In cPanel, find **Databases** section
2. Click **MySQL Databases**
3. Create a new database:
   - **Database Name**: `litigation_db` (or your preferred name)
   - Click **Create Database**

### Step 2: Create Database User
1. In **MySQL Users** section:
   - **Username**: `litigation_user` (or your preferred name)
   - **Password**: Generate a strong password
   - Click **Create User**

### Step 3: Assign User to Database
1. In **Add User to Database** section:
   - Select your user
   - Select your database
   - Click **Add**
2. **Grant ALL PRIVILEGES** to the user
3. Click **Make Changes**

### Step 4: Record Database Credentials
Note down these details:
- **Database Name**: `username_litigation_db`
- **Username**: `username_litigation_user`
- **Password**: `your_secure_password`
- **Host**: `localhost` (usually)

### Step 5: Import Database Schema
1. In cPanel, find **Databases** section
2. Click **phpMyAdmin**
3. Select your database from the left panel
4. Click **Import** tab
5. Upload your `database/litigation_database.sql` file
6. Click **Go** to execute the import

### Step 6: Import Sample Data (Optional)
1. If you have sample data, repeat the import process
2. Upload `database/sample_data.sql` or CSV files
3. Use the migration scripts if available

---

## ⚙️ PHP Configuration

### Step 1: Create Production Configuration

Create `config/config.production.php`:
```php
<?php
/**
 * Production Configuration
 * Litigation Management System
 */

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name');
define('DB_USER', 'your_database_user');
define('DB_PASS', 'your_database_password');
define('DB_CHARSET', 'utf8mb4');

// Application configuration
define('APP_ENV', 'production');
define('APP_DEBUG', false);
define('APP_URL', 'https://yourdomain.com/litigation');

// Security settings
define('SESSION_LIFETIME', 3600); // 1 hour
define('CSRF_TOKEN_LIFETIME', 1800); // 30 minutes

// File upload settings
define('UPLOAD_MAX_SIZE', 50 * 1024 * 1024); // 50MB
define('ALLOWED_FILE_TYPES', ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']);

// Email settings (if using email notifications)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your_email@gmail.com');
define('SMTP_PASSWORD', 'your_app_password');
define('SMTP_FROM_EMAIL', 'your_email@gmail.com');
define('SMTP_FROM_NAME', 'Litigation Management System');

// Logging
define('LOG_LEVEL', 'ERROR'); // ERROR, WARNING, INFO, DEBUG
define('LOG_FILE', __DIR__ . '/../logs/app.log');
?>
```

### Step 2: Create .htaccess File

Create `.htaccess` in your application root:
```apache
# Apache Configuration for Litigation Management System

# Enable URL Rewriting
RewriteEngine On

# Redirect to HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security Headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Hide sensitive files
<FilesMatch "\.(env|log|sql|md)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# Protect config directory
<Directory "config">
    Order allow,deny
    Deny from all
</Directory>

# Protect logs directory
<Directory "logs">
    Order allow,deny
    Deny from all
</Directory>

# Protect database directory
<Directory "database">
    Order allow,deny
    Deny from all
</Directory>

# API Routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ api/index.php [QSA,L]

# React App Routes (SPA)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ build/index.html [QSA,L]

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
</IfModule>
```

### Step 3: Create Log Directory
1. Create `logs` directory in your application root
2. Create `.htaccess` in logs directory:
```apache
Order allow,deny
Deny from all
```

---

## 🏗️ Build and Deploy

### Step 1: Build React Application Locally

```bash
# Navigate to your project directory
cd /path/to/your/litigation-reports

# Install dependencies
npm install

# Build for production
npm run build

# The build files will be in the 'dist' or 'build' directory
```

### Step 2: Upload Build Files
1. Upload the contents of your `build/` directory to `public_html/litigation/build/`
2. Ensure all static assets (CSS, JS, images) are uploaded correctly

### Step 3: Set File Permissions
In cPanel File Manager, set these permissions:
- **Directories**: `755`
- **Files**: `644`
- **PHP files**: `644`
- **Configuration files**: `600`
- **Log files**: `666`

---

## 🌍 Domain Configuration

### Option 1: Subdomain Setup
1. In cPanel, find **Domains** section
2. Click **Subdomains**
3. Create subdomain:
   - **Subdomain**: `litigation`
   - **Domain**: `yourdomain.com`
   - **Document Root**: `public_html/litigation`
4. Click **Create**

### Option 2: Main Domain Setup
1. In cPanel, find **Domains** section
2. Click **Addon Domains**
3. Add your domain:
   - **New Domain Name**: `yourdomain.com`
   - **Subdomain**: `litigation`
   - **Document Root**: `public_html/litigation`
4. Click **Add Domain**

### Option 3: Directory Setup
1. Upload files to `public_html/litigation/`
2. Access via `https://yourdomain.com/litigation/`

---

## 🔒 SSL Certificate

### Step 1: Enable SSL
1. In cPanel, find **Security** section
2. Click **SSL/TLS**
3. Click **Manage SSL sites**
4. Select your domain
5. Enable **Force HTTPS Redirect**

### Step 2: Verify SSL
1. Visit your application URL
2. Ensure you see the padlock icon in the browser
3. Check that all resources load over HTTPS

---

## 🧪 Testing and Verification

### Step 1: Basic Functionality Test
1. **Access Application**: Visit `https://yourdomain.com/litigation/`
2. **Login Test**: Try logging in with default admin credentials:
   - Username: `admin`
   - Email: `admin@litigation.com`
   - Password: `password`

### Step 2: Database Connection Test
1. Create a test file `test-db.php`:
```php
<?php
require_once 'config/config.production.php';

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    echo "Database connection successful!";
} catch (PDOException $e) {
    echo "Database connection failed: " . $e->getMessage();
}
?>
```

2. Upload and access via browser
3. Delete the test file after verification

### Step 3: Feature Testing
Test these core features:
- ✅ User login/logout
- ✅ Dashboard access
- ✅ Client management
- ✅ Case management
- ✅ Permission system
- ✅ Arabic/English language switching
- ✅ File uploads
- ✅ Report generation

### Step 4: Performance Testing
- **Page Load Speed**: Should be under 3 seconds
- **Database Queries**: Should execute quickly
- **File Uploads**: Test with various file types and sizes

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Issue 1: 500 Internal Server Error
**Causes:**
- PHP syntax errors
- Missing PHP extensions
- Incorrect file permissions
- Database connection issues

**Solutions:**
1. Check PHP error logs in cPanel
2. Verify PHP extensions are enabled
3. Check file permissions
4. Test database connection

#### Issue 2: Database Connection Failed
**Causes:**
- Incorrect database credentials
- Database not created
- User not assigned to database
- Wrong host name

**Solutions:**
1. Verify database credentials in config file
2. Check database exists in cPanel
3. Ensure user has proper permissions
4. Try `localhost` as host name

#### Issue 3: React App Not Loading
**Causes:**
- Build files not uploaded correctly
- Incorrect .htaccess configuration
- Missing static assets

**Solutions:**
1. Rebuild and re-upload React files
2. Check .htaccess rewrite rules
3. Verify all CSS/JS files are accessible

#### Issue 4: File Upload Issues
**Causes:**
- PHP upload limits too low
- Incorrect file permissions
- Missing upload directory

**Solutions:**
1. Increase PHP upload limits in cPanel
2. Set correct permissions on upload directory
3. Create upload directory if missing

#### Issue 5: SSL Certificate Issues
**Causes:**
- SSL not properly configured
- Mixed content warnings
- Certificate not activated

**Solutions:**
1. Enable SSL in cPanel
2. Force HTTPS redirect
3. Update all URLs to use HTTPS

### Debug Mode
To enable debug mode for troubleshooting:
1. Edit `config/config.production.php`
2. Set `APP_DEBUG` to `true`
3. Check error logs for detailed information
4. **Remember to disable debug mode in production**

---

## 🛠️ Maintenance

### Regular Maintenance Tasks

#### Daily
- Check error logs for any issues
- Monitor disk space usage
- Verify backup processes

#### Weekly
- Review security logs
- Check for PHP/MySQL updates
- Test application functionality

#### Monthly
- Update dependencies (if needed)
- Review and rotate logs
- Performance optimization
- Security audit

### Backup Strategy

#### Database Backup
1. In cPanel, go to **Backups**
2. Click **Download a MySQL Database Backup**
3. Select your database
4. Download the backup file
5. Store backups in a secure location

#### File Backup
1. In cPanel File Manager
2. Compress your application directory
3. Download the compressed file
4. Store backups securely

#### Automated Backups
Consider setting up automated backups using:
- cPanel scheduled backups
- Third-party backup services
- Custom backup scripts

### Security Maintenance

#### Regular Security Checks
1. **Update PHP version** when available
2. **Monitor access logs** for suspicious activity
3. **Review user permissions** regularly
4. **Update passwords** periodically
5. **Check for security vulnerabilities**

#### Security Best Practices
- Use strong passwords for all accounts
- Enable two-factor authentication where possible
- Keep software updated
- Monitor for unusual activity
- Regular security scans

---

## 📞 Support and Resources

### GoDaddy Support
- **GoDaddy Help Center**: [help.godaddy.com](https://help.godaddy.com)
- **Phone Support**: Available 24/7
- **Live Chat**: Available in your GoDaddy account
- **Community Forum**: [community.godaddy.com](https://community.godaddy.com)

### Application Support
- **Documentation**: Check project README files
- **Issue Tracking**: GitHub issues (if applicable)
- **Development Team**: Contact your development team

### Useful Resources
- **PHP Documentation**: [php.net](https://php.net)
- **MySQL Documentation**: [dev.mysql.com](https://dev.mysql.com)
- **React Documentation**: [reactjs.org](https://reactjs.org)
- **Bootstrap Documentation**: [getbootstrap.com](https://getbootstrap.com)

---

## 📋 Post-Installation Checklist

### ✅ Installation Complete
- [ ] Application accessible via web browser
- [ ] Database connection working
- [ ] User authentication functional
- [ ] All pages loading correctly
- [ ] Arabic/English switching working
- [ ] File uploads functional
- [ ] SSL certificate active
- [ ] Error logging configured
- [ ] Backup strategy in place
- [ ] Security measures implemented

### ✅ Performance Optimized
- [ ] Page load times under 3 seconds
- [ ] Database queries optimized
- [ ] Static assets cached
- [ ] Compression enabled
- [ ] CDN configured (if applicable)

### ✅ Security Verified
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Sensitive files protected
- [ ] User permissions properly set
- [ ] Regular backups scheduled

---

## 🎉 Congratulations!

Your Litigation Management System is now successfully deployed on GoDaddy hosting! 

### Next Steps:
1. **Change default admin password** immediately
2. **Configure email settings** for notifications
3. **Set up regular backups**
4. **Train users** on the new system
5. **Monitor performance** and user feedback

### System Access:
- **URL**: `https://yourdomain.com/litigation/`
- **Admin Login**: `admin@litigation.com` / `password` (change immediately)
- **Database**: Accessible via phpMyAdmin in cPanel

### Support:
For any issues or questions, refer to the troubleshooting section or contact your development team.

---

*This guide was created specifically for the Litigation Management System deployment on GoDaddy shared hosting. Keep this document updated as your system evolves.*
