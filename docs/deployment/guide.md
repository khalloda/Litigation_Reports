# 🚀 Deployment Guide: Fix Hearing CRUD Functionality

## 🎯 Problem
The application at `lit.local:8080` is an older version that doesn't have our React-based hearing CRUD functionality.

## ✅ Solution
Deploy our React application with the hearing functionality to `lit.local:8080`.

## 📋 Step-by-Step Deployment

### 1. Build the React Application
```bash
cd "D:\Claude\Litigation_Reports"
npm run build
```

This creates a `backend/public` directory with your production-ready React application.

### 2. Verify Build Contents
The build should create:
```
backend/public/
├── index.html
├── assets/
│   ├── index-[hash].js    # Main application bundle
│   ├── index-[hash].css   # Styles
│   └── ui-[hash].js       # UI components
└── api/                   # Backend API files
```

### 3. Deploy to lit.local:8080

#### Option A: Copy Files to Web Server
```bash
# Copy the built files to your web server directory
# Replace /path/to/webserver with your actual web server path
cp -r backend/public/* /path/to/webserver/
```

#### Option B: Update Web Server Configuration
Point your web server (Apache/Nginx) document root to:
```
/path/to/Litigation_Reports/backend/public
```

#### Option C: Use Built-in PHP Server (for testing)
```bash
cd backend/public
php -S lit.local:8080
```

### 4. Configure Backend API

Ensure your PHP backend is accessible at `lit.local:8080/api/`:

```bash
# Make sure these files exist in backend/public/api/
backend/public/api/
├── index.php        # Main API router
├── hearings.php     # Hearings endpoints
├── cases.php        # Cases endpoints
└── auth.php         # Authentication endpoints
```

### 5. Test the Deployment

After deployment, visit `http://lit.local:8080` and verify:

- ✅ Login page loads (React-based)
- ✅ Authentication works with `admin@litigation.com` / `admin123`
- ✅ Navigate to `/hearings` shows the React hearings page
- ✅ "إضافة جلسة جديدة" button opens modal
- ✅ CRUD operations work

## 🔧 Quick Deployment Commands

```bash
# 1. Build the application
npm run build

# 2. Start PHP server on port 8080
cd backend/public
php -S lit.local:8080

# 3. Test in browser
# Visit: http://lit.local:8080
# Login: admin@litigation.com / admin123
# Go to: http://lit.local:8080/hearings
# Click: "إضافة جلسة جديدة" button
```

## ⚠️ Important Notes

1. **Backend API**: Make sure your PHP backend endpoints are working
2. **Database**: Ensure database connection is configured
3. **Authentication**: Verify auth endpoints return proper tokens
4. **CORS**: No CORS needed since frontend and backend are same origin

## 🧪 Verification Test

After deployment, run this test to verify everything works:

```bash
npx playwright test tests/hearings-complete.spec.ts --config=playwright.config.simple.mjs
```

This should show:
- ✅ Authentication successful
- ✅ Hearings page access successful
- ✅ Add button found
- ✅ Modal functionality working

## 🆘 Troubleshooting

### If CRUD still doesn't work after deployment:

1. **Check console errors** in browser developer tools
2. **Verify API endpoints** return proper responses
3. **Check network tab** for failed requests
4. **Ensure build is complete** - all JS/CSS files present

### Common Issues:

- **404 errors**: Check web server configuration
- **API failures**: Verify PHP backend is running
- **Auth issues**: Check database connection and user tables
- **Modal not opening**: Check for JavaScript errors

## 📞 Next Steps

Once deployed correctly, your hearing CRUD functionality will work:
- ✅ Create new hearings
- ✅ View hearing list
- ✅ Edit existing hearings
- ✅ Delete hearings
- ✅ Filter and search hearings

The "إضافة جلسة جديدة" button will open a fully functional modal with all form fields working properly!