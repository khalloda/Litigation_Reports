# 🟦 WAMP Virtual Host Setup Guide

## 📋 Current Application Structure

After the architecture refactoring, your application now has this structure:

```
/apps/
├── web/                    # Frontend React Application
│   ├── public/            # Web server root (document root)
│   │   ├── index.html     # Main HTML entry point
│   │   └── assets/        # Built JavaScript, CSS, images
│   ├── src/               # React source code
│   ├── vite.config.ts     # Build configuration
│   └── package.json       # Frontend dependencies
└── api/                   # Backend API Service
    ├── api-server.php     # API entry point
    ├── src/               # API source code
    └── routes.php         # Route definitions
```

## 🔧 WAMP Virtual Host Configuration

### Option 1: Frontend Only Virtual Host (Recommended)

**For the main application:**
```
ServerName lit.local
DocumentRoot "D:/Claude/Litigation_Reports/apps/web/public"
<Directory "D:/Claude/Litigation_Reports/apps/web/public">
    AllowOverride All
    Require all granted
    DirectoryIndex index.html
</Directory>
```

### Option 2: API Virtual Host (Optional)

**For API development/testing:**
```
ServerName api.lit.local
DocumentRoot "D:/Claude/Litigation_Reports/apps/api"
<Directory "D:/Claude/Litigation_Reports/apps/api">
    AllowOverride All
    Require all granted
    DirectoryIndex api-server.php
</Directory>
```

## 🏠 Hosts File Configuration

Add these entries to your `C:\Windows\System32\drivers\etc\hosts` file:

```
127.0.0.1 lit.local
127.0.0.1 api.lit.local
```

## 🚀 How to Use

### Development Workflow

1. **Start the API server:**
   ```bash
   # From project root
   php -S localhost:8000 apps/api/api-server.php
   ```

2. **Start the frontend:**
   ```bash
   # From project root
   npm run dev
   # or directly: cd apps/web && vite
   ```

3. **Access your application:**
   - Frontend: `http://lit.local`
   - API: `http://api.lit.local` (if using separate API host)

### Environment Configuration

The frontend is configured to communicate with the API. You can:

1. **Use relative URLs** (default):
   - API calls will go to `/api/` on the same domain
   - Works with: `http://lit.local/api/`

2. **Use absolute URLs** (for separate API host):
   - Set `VITE_API_BASE_URL=http://api.lit.local`
   - API calls will go to: `http://api.lit.local/api/`

## 📁 Important Notes

### Document Root Directory
- **Web Server Root**: `D:/Claude/Litigation_Reports/apps/web/public/`
- This contains: `index.html`, built assets, images, etc.
- **NOT** the `src/` directory (that's source code, not public files)

### API Location
- **API Server Root**: `D:/Claude/Litigation_Reports/apps/api/`
- Main entry point: `api-server.php`
- Routes are defined in: `src/routes.php`

### Build Process
When you run `npm run build`, the built files go to:
- `apps/web/public/assets/` (for development builds)
- `apps/web/dist/` (for production builds)

## 🔍 Troubleshooting

### If frontend doesn't load:
1. Check that document root points to `/apps/web/public/`
2. Ensure `index.html` exists in the document root
3. Check browser console for errors

### If API calls fail:
1. Verify API server is running on port 8000
2. Check that CORS is properly configured
3. Look at API server logs for errors

### If assets don't load:
1. Check that `assets/` directory exists in document root
2. Verify file permissions are correct
3. Check browser network tab for 404 errors

## 📞 Quick Setup Commands

```bash
# 1. Add to hosts file (run as administrator)
notepad C:\Windows\System32\drivers\etc\hosts
# Add: 127.0.0.1 litigation.local

# 2. Create WAMP virtual host configuration
# Edit: C:\wamp64\bin\apache\apache2.4.XX\conf\extra\httpd-vhosts.conf

# 3. Start development servers
php -S localhost:8000 apps/api/api-server.php
npm run dev

# 4. Access: http://lit.local
```

---

**Document Root for WAMP Virtual Host:**
`D:/Claude/Litigation_Reports/apps/web/public/`

**API Root (if separate host):**
`D:/Claude/Litigation_Reports/apps/api/`
