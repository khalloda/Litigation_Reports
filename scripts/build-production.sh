#!/bin/bash

# Build Production Script
# Builds React app and prepares for deployment

echo "🚀 Building Litigation Management System for Production..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/
rm -rf public_html/assets/
rm -rf public_html/static/

# Build React app
echo "⚛️ Building React application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

# Copy built files to public_html
echo "📁 Copying built files to public_html..."
cp -r dist/* public_html/

# Ensure API directory exists
echo "🔧 Ensuring API directory structure..."
mkdir -p public_html/api

# Copy API files if they don't exist
if [ ! -f "public_html/api/index.php" ]; then
    echo "📋 API files already in place"
fi

# Ensure .htaccess exists
if [ ! -f "public_html/.htaccess" ]; then
    echo "⚠️ Warning: .htaccess file not found in public_html/"
fi

echo "✅ Production build completed!"
echo "📂 Files ready in public_html/ directory"
echo ""
echo "🚀 Deployment Instructions:"
echo "1. Upload public_html/ contents to your web server"
echo "2. Ensure MySQL database is configured"
echo "3. Update database credentials in public_html/api/db.php if needed"
echo "4. Test the application at your domain"
echo ""
echo "🔍 Test endpoints:"
echo "- Health check: /api/ping"
echo "- API root: /api/"
echo "- Frontend: / (should serve React app)"
