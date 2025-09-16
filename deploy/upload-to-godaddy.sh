#!/bin/bash

# GoDaddy Upload Script
# Litigation Management System

echo "🌐 GoDaddy Upload Script"
echo "========================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Configuration
FTP_HOST=""
FTP_USER=""
FTP_PASS=""
FTP_DIR="/public_html/litigation"
LOCAL_DIR="deploy/production"

# Function to prompt for input
prompt_input() {
    local prompt="$1"
    local variable="$2"
    local is_password="$3"
    
    if [ "$is_password" = "true" ]; then
        read -s -p "$prompt: " input
        echo ""
    else
        read -p "$prompt: " input
    fi
    
    eval "$variable='$input'"
}

# Get FTP credentials
echo "Please provide your GoDaddy FTP credentials:"
prompt_input "FTP Host (e.g., ftp.yourdomain.com)" FTP_HOST
prompt_input "FTP Username" FTP_USER
prompt_input "FTP Password" FTP_PASS "true"

# Optional: Custom FTP directory
read -p "FTP Directory (default: /public_html/litigation): " custom_ftp_dir
if [ ! -z "$custom_ftp_dir" ]; then
    FTP_DIR="$custom_ftp_dir"
fi

print_status "Configuration:"
echo "  Host: $FTP_HOST"
echo "  User: $FTP_USER"
echo "  Directory: $FTP_DIR"
echo "  Local Directory: $LOCAL_DIR"
echo ""

# Check if local directory exists
if [ ! -d "$LOCAL_DIR" ]; then
    print_error "Local directory '$LOCAL_DIR' does not exist."
    print_error "Please run the build script first: ./deploy/build-production.sh"
    exit 1
fi

# Check if lftp is installed
if ! command -v lftp &> /dev/null; then
    print_error "lftp is not installed. Please install lftp to use this script."
    print_error "Installation commands:"
    echo "  Ubuntu/Debian: sudo apt-get install lftp"
    echo "  CentOS/RHEL: sudo yum install lftp"
    echo "  macOS: brew install lftp"
    exit 1
fi

# Confirm upload
echo ""
read -p "Are you sure you want to upload to GoDaddy? (y/N): " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    print_warning "Upload cancelled."
    exit 0
fi

print_status "Starting upload to GoDaddy..."

# Create lftp script
LFTP_SCRIPT=$(mktemp)
cat > "$LFTP_SCRIPT" << EOF
set ftp:ssl-allow no
set ftp:passive-mode on
set ftp:list-options -a
set ftp:charset utf8

open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST

# Create directory if it doesn't exist
mkdir -p $FTP_DIR

# Change to target directory
cd $FTP_DIR

# Upload files
lcd $LOCAL_DIR
mirror -R -v --delete --exclude-glob="*.log" --exclude-glob="*.tmp"

# Set permissions
chmod 755 .
find . -type d -exec chmod 755 {} \;
find . -type f -name "*.php" -exec chmod 644 {} \;
find . -type f -name "*.html" -exec chmod 644 {} \;
find . -type f -name "*.css" -exec chmod 644 {} \;
find . -type f -name "*.js" -exec chmod 644 {} \;
find . -type f -name "*.htaccess" -exec chmod 644 {} \;

quit
EOF

# Execute lftp script
if lftp -f "$LFTP_SCRIPT"; then
    print_success "Upload completed successfully!"
    echo ""
    print_status "Next steps:"
    echo "1. Update database configuration in cPanel"
    echo "2. Import database schema via phpMyAdmin"
    echo "3. Test the application at your domain"
    echo "4. Change the default admin password"
    echo ""
    print_status "For detailed instructions, see: GODADDY_INSTALLATION_GUIDE.md"
else
    print_error "Upload failed. Please check your credentials and try again."
    exit 1
fi

# Clean up
rm -f "$LFTP_SCRIPT"

print_success "Upload process completed!"
