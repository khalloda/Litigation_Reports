@echo off
REM Build Production Script for Windows
REM Builds React app and prepares for deployment

echo 🚀 Building Litigation Management System for Production...

REM Clean previous build
echo 🧹 Cleaning previous build...
if exist dist rmdir /s /q dist
if exist public_html\assets rmdir /s /q public_html\assets
if exist public_html\static rmdir /s /q public_html\static

REM Build React app
echo ⚛️ Building React application...
npm run build

REM Check if build was successful
if not exist dist (
    echo ❌ Build failed - dist directory not found
    exit /b 1
)

REM Copy built files to public_html
echo 📁 Copying built files to public_html...
if not exist public_html mkdir public_html
xcopy /E /I /Y dist\* public_html\

REM Ensure API directory exists
echo 🔧 Ensuring API directory structure...
if not exist public_html\api mkdir public_html\api

echo ✅ Production build completed!
echo 📂 Files ready in public_html\ directory
echo.
echo 🚀 Deployment Instructions:
echo 1. Upload public_html\ contents to your web server
echo 2. Ensure MySQL database is configured
echo 3. Update database credentials in public_html\api\db.php if needed
echo 4. Test the application at your domain
echo.
echo 🔍 Test endpoints:
echo - Health check: /api/ping
echo - API root: /api/
echo - Frontend: / (should serve React app)
