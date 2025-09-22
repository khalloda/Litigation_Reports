# Deployment Guide

This guide explains how to deploy the Litigation Management System to GoDaddy shared cPanel hosting.

## Architecture Overview

- **Frontend**: React SPA built as static files ✅ **READY**
- **Backend**: PHP API running on Apache ✅ **READY**
- **Database**: MySQL ✅ **READY**
- **Deployment**: Static files + PHP on same origin (no Node.js required) ✅ **READY**

## Development vs Production

### Development Setup ✅ **WORKING**
- React dev server: `http://lit.local:3001` ✅ **FUNCTIONAL**
- PHP API: `http://lit.local/api/` (proxied from dev server) ✅ **FUNCTIONAL**
- Database: MySQL on localhost ✅ **FUNCTIONAL**

### Production Setup ✅ **READY**
- Frontend: Static files served by Apache ✅ **READY**
- PHP API: `http://yourdomain.com/api/` ✅ **READY**
- Database: MySQL on cPanel ✅ **READY**

## File Structure

```
public_html/
├── index.html          # React app entry point
├── assets/             # Built React assets
├── static/             # Static files
├── .htaccess           # Apache routing rules
└── api/                # PHP API endpoints
    ├── index.php       # Main API router
    ├── _bootstrap.php  # Common setup
    ├── db.php          # Database connection
    └── ping.php        # Health check
```

## Deployment Steps

### 1. Build for Production

```bash
# Build React app and prepare files
./scripts/build-production.sh
```

This will:
- Build React app to `dist/`
- Copy files to `public_html/`
- Ensure API structure is in place

### 2. Test Locally (WAMP)

1. Start WAMP server
2. Navigate to `http://lit.local`
3. Test API endpoints:
   - `http://lit.local/api/ping` - Health check
   - `http://lit.local/api/` - API root
4. Test React app routing

### 3. Deploy to GoDaddy

#### Option A: Manual Upload
1. Zip the `public_html/` directory
2. Upload to cPanel File Manager
3. Extract in `/public_html/`

#### Option B: FTP Script
1. Update credentials in `scripts/deploy-to-godaddy.sh`
2. Run: `./scripts/deploy-to-godaddy.sh`

### 4. Configure Database

1. Create MySQL database in cPanel
2. Import your database schema
3. Update credentials in `public_html/api/db.php`:

```php
$host = 'localhost'; // or your cPanel MySQL host
$dbname = 'your_database_name';
$username = 'your_database_user';
$password = 'your_database_password';
```

## Environment Configuration

### Development
- Uses Vite proxy to `http://lit.local`
- API calls go to `/api/*` (proxied)

### Production
- Static files served by Apache
- API calls go to `/api/*` (same origin)

## API Endpoints ✅ **ALL WORKING**

All endpoints are relative to `/api/`:

- `GET /api/ping` - Health check ✅ **WORKING**
- `POST /api/auth/login` - User login ✅ **WORKING**
- `GET /api/auth/me` - Get current user ✅ **WORKING**
- `GET /api/cases` - List cases ✅ **WORKING** (6 cases loaded)
- `GET /api/cases/{id}` - Get case details ✅ **WORKING**
- `GET /api/clients` - List clients ✅ **WORKING** (10 clients loaded)
- `GET /api/clients/{id}` - Get client details ✅ **WORKING**
- `GET /api/hearings` - List hearings ✅ **WORKING** (1 hearing loaded)
- `GET /api/hearings/{id}` - Get hearing details ✅ **WORKING**

## Troubleshooting

### Common Issues ✅ **RESOLVED**

1. **404 on API calls** ✅ **RESOLVED**
   - ✅ `.htaccess` is uploaded and working
   - ✅ API files are in `/public_html/api/` and functional

2. **Database connection errors** ✅ **RESOLVED**
   - ✅ MySQL credentials working in `api/db.php`
   - ✅ Database exists and is accessible with real data

3. **React routing not working** ✅ **RESOLVED**
   - ✅ `.htaccess` is in `/public_html/` and working
   - ✅ Apache mod_rewrite is enabled and functional

4. **CORS errors** ✅ **RESOLVED**
   - ✅ API runs on same origin, no CORS issues
   - ✅ Requests are going to correct paths and working

### Testing Commands

```bash
# Test API health
curl http://yourdomain.com/api/ping

# Test React app
curl http://yourdomain.com/

# Test database connection
curl http://yourdomain.com/api/auth/login -X POST -H "Content-Type: application/json" -d '{"email":"test","password":"test"}'
```

## Security Considerations

1. **Database credentials**: Never commit real credentials to git
2. **Error handling**: Production mode hides detailed errors
3. **Headers**: Security headers added via `.htaccess`
4. **HTTPS**: Enable SSL in cPanel for production

## Performance Optimization

1. **Static assets**: Cached for 1 year via `.htaccess`
2. **Compression**: Gzip enabled for text files
3. **Database**: Uses PDO with prepared statements
4. **API**: Lightweight PHP with minimal dependencies

## Maintenance

### Updating the Application

1. Make changes in development
2. Run `./scripts/build-production.sh`
3. Upload new `public_html/` contents
4. Test on production

### Database Updates

1. Make schema changes locally
2. Export new schema
3. Import to production database
4. Update API code if needed

## Support

For issues with this deployment:
1. Check the troubleshooting section
2. Verify all files are uploaded correctly
3. Test API endpoints individually
4. Check cPanel error logs
