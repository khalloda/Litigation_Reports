#!/bin/bash

# Deploy to GoDaddy Script
# Uploads built application to GoDaddy cPanel

# Configuration
FTP_HOST="your-domain.com"
FTP_USER="your-username"
FTP_PASS="your-password"
REMOTE_DIR="/public_html"

echo "🚀 Deploying to GoDaddy cPanel..."

# Check if required tools are installed
if ! command -v lftp &> /dev/null; then
    echo "❌ lftp is required but not installed. Please install it first:"
    echo "   - Ubuntu/Debian: sudo apt-get install lftp"
    echo "   - macOS: brew install lftp"
    echo "   - Windows: Download from https://lftp.yar.ru/"
    exit 1
fi

# Check if public_html exists
if [ ! -d "public_html" ]; then
    echo "❌ public_html directory not found. Please run build-production.sh first."
    exit 1
fi

# Upload files
echo "📤 Uploading files to GoDaddy..."
lftp -c "
set ftp:ssl-allow no
open -u $FTP_USER,$FTP_PASS $FTP_HOST
lcd public_html
cd $REMOTE_DIR
mirror -R --delete --verbose --exclude-glob .git*
quit
"

if [ $? -eq 0 ]; then
    echo "✅ Deployment completed successfully!"
    echo "🌐 Your application should now be available at: http://$FTP_HOST"
    echo ""
    echo "🔍 Test these endpoints:"
    echo "- Health check: http://$FTP_HOST/api/ping"
    echo "- API root: http://$FTP_HOST/api/"
    echo "- Frontend: http://$FTP_HOST/"
else
    echo "❌ Deployment failed. Please check your FTP credentials and try again."
    exit 1
fi
