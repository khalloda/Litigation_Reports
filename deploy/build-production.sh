#!/bin/bash

# Production Build Script for GoDaddy Deployment
# Litigation Management System

echo "🚀 Starting production build process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version check passed: $(node -v)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm and try again."
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

print_success "Dependencies installed successfully"

# Run linting
print_status "Running ESLint..."
npm run lint

if [ $? -ne 0 ]; then
    print_warning "ESLint found issues. Continuing with build..."
fi

# Run type checking
print_status "Running TypeScript type checking..."
npm run type-check

if [ $? -ne 0 ]; then
    print_error "TypeScript type checking failed"
    exit 1
fi

print_success "Type checking passed"

# Build the React application
print_status "Building React application for production..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi

print_success "React application built successfully"

# Create production directory structure
print_status "Creating production directory structure..."
mkdir -p deploy/production/{api,assets,build,config,logs,database}

# Copy built files
print_status "Copying built files..."
cp -r dist/* deploy/production/build/ 2>/dev/null || cp -r build/* deploy/production/build/ 2>/dev/null

# Copy PHP files
print_status "Copying PHP files..."
cp -r api/* deploy/production/api/ 2>/dev/null
cp -r database/* deploy/production/database/ 2>/dev/null

# Copy configuration files
print_status "Copying configuration files..."
cp config/config.production.php deploy/production/config/ 2>/dev/null
cp .htaccess deploy/production/ 2>/dev/null

# Create production .htaccess
print_status "Creating production .htaccess..."
cat > deploy/production/.htaccess << 'EOF'
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
EOF

# Create logs directory protection
print_status "Creating logs directory protection..."
cat > deploy/production/logs/.htaccess << 'EOF'
Order allow,deny
Deny from all
EOF

# Create deployment package
print_status "Creating deployment package..."
cd deploy/production
tar -czf ../litigation-production-$(date +%Y%m%d-%H%M%S).tar.gz .
cd ../..

print_success "Deployment package created: deploy/litigation-production-$(date +%Y%m%d-%H%M%S).tar.gz"

# Generate deployment instructions
print_status "Generating deployment instructions..."
cat > deploy/DEPLOYMENT_INSTRUCTIONS.md << 'EOF'
# Deployment Instructions

## Files Ready for Upload

The following files are ready for upload to your GoDaddy hosting:

### Directory Structure
```
public_html/litigation/
├── api/                    # PHP API files
├── build/                  # Built React application
├── config/                 # Configuration files
├── logs/                   # Log files (protected)
├── database/               # Database files (protected)
└── .htaccess              # Apache configuration
```

## Upload Steps

1. **Extract the deployment package**:
   ```bash
   tar -xzf litigation-production-YYYYMMDD-HHMMSS.tar.gz
   ```

2. **Upload to GoDaddy**:
   - Use cPanel File Manager or FTP client
   - Upload all files to `public_html/litigation/`
   - Maintain directory structure

3. **Set file permissions**:
   - Directories: 755
   - Files: 644
   - PHP files: 644
   - Configuration files: 600

4. **Configure database**:
   - Update `config/config.production.php` with your database credentials
   - Import database schema via phpMyAdmin

5. **Test the application**:
   - Visit your domain
   - Test login functionality
   - Verify all features work correctly

## Important Notes

- Change the default admin password immediately after deployment
- Enable SSL certificate in cPanel
- Set up regular backups
- Monitor error logs regularly

## Support

For deployment issues, refer to the main GoDaddy Installation Guide.
EOF

print_success "Deployment instructions generated"

# Final summary
echo ""
echo "🎉 Production build completed successfully!"
echo ""
echo "📁 Deployment files are ready in: deploy/production/"
echo "📦 Deployment package: deploy/litigation-production-$(date +%Y%m%d-%H%M%S).tar.gz"
echo "📖 Instructions: deploy/DEPLOYMENT_INSTRUCTIONS.md"
echo ""
echo "Next steps:"
echo "1. Upload files to GoDaddy hosting"
echo "2. Configure database settings"
echo "3. Test the application"
echo "4. Change default admin password"
echo ""
echo "For detailed instructions, see: GODADDY_INSTALLATION_GUIDE.md"
