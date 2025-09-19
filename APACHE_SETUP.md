# Apache Setup for Strict Parity DEV/PROD Environment

## 🎯 Current Status
✅ Backend directory structure created
✅ Vite configured to build to `backend/public`
✅ .htaccess created with API passthrough and SPA fallback
✅ React app built successfully to `backend/public`
✅ API files copied to `backend/api`

## 📁 Directory Structure
```
D:\Claude\Litigation_Reports\
├─ backend/
│  ├─ public/                # Apache DocumentRoot
│  │  ├─ index.html          # Built React SPA
│  │  ├─ assets/             # Built assets
│  │  ├─ .htaccess           # Rewrite rules
│  │  └─ index.php           # (optional legacy file)
│  └─ api/                   # PHP API endpoints
│     ├─ ping.php            # Test endpoint
│     ├─ index.php           # Main API router
│     └─ ...                 # All your existing API files
└─ src/                      # React source (development only)
```

## ⚙️ Required Apache Configuration

### 1. Update your Apache VirtualHost
Edit your Apache configuration (usually in `httpd-vhosts.conf`) to point DocumentRoot to `backend/public`:

```apache
<VirtualHost *:80>
    ServerName lit.local
    DocumentRoot "D:/Claude/Litigation_Reports/backend/public"

    <Directory "D:/Claude/Litigation_Reports/backend/public/">
        AllowOverride All
        Require all granted
        Options Indexes FollowSymLinks
        DirectoryIndex index.html index.php
    </Directory>

    ErrorLog  "logs/lit-error.log"
    CustomLog "logs/lit-access.log" common
</VirtualHost>
```

### 2. Ensure mod_rewrite is enabled
Make sure these lines are uncommented in your `httpd.conf`:
```apache
LoadModule rewrite_module modules/mod_rewrite.so
```

### 3. Restart Apache
After making these changes, restart your Apache server.

## 🚀 Testing the Setup

### 1. Test the SPA
- Open: http://lit.local/
- Should load the React application
- Try navigating to: http://lit.local/clients
- Should work without 404 errors (SPA routing)

### 2. Test the API
- Open: http://lit.local/api/ping.php
- Should return JSON: `{"success":true,"message":"API is working",...}`

### 3. Test API Integration
- Login to the application with: `admin@litigation.com` / `admin123`
- All navigation modules should be visible (Dashboard, Clients, Cases, Hearings, Invoices, Lawyers, Documents, Reports, Users, Settings)
- No CORS errors in browser console

## 🔄 Development Workflow

### Continuous Build (for development)
```bash
cd D:\Claude\Litigation_Reports
npm run build -- --watch
```

This will automatically rebuild the React app to `backend/public` whenever you make changes to the source files.

### Production Build
```bash
cd D:\Claude\Litigation_Reports
npm run build
```

## ✅ Benefits of This Setup
- ❌ **No CORS issues** - Frontend and API served from same origin
- ✅ **Identical DEV/PROD** - Same Apache/PHP stack in both environments
- ✅ **Real API testing** - Uses actual PHP backend, not mocks
- ✅ **Easy deployment** - Same file structure as production cPanel
- ✅ **Hot reloading** - Use `--watch` flag for development

## 🐛 Troubleshooting

### If you get 404 errors on React routes:
- Check that `.htaccess` exists in `backend/public/`
- Verify `AllowOverride All` is set in Apache config
- Ensure mod_rewrite is enabled

### If API calls fail:
- Check that API files exist in `backend/api/`
- Test direct API access: http://lit.local/api/ping.php
- Check Apache error logs

### If styles/assets don't load:
- Verify build completed successfully
- Check that `assets/` folder exists in `backend/public/`
- Clear browser cache

## 🎉 Ready to Go!
Once Apache is configured correctly, you'll have:
- ✅ No CORS issues
- ✅ All navigation modules visible
- ✅ Working login functionality
- ✅ Real API integration
- ✅ Production-identical environment