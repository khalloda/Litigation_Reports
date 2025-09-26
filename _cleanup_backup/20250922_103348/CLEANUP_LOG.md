# Architecture Cleanup Log

**Date:** 2025-09-22 10:33:48
**Reason:** Multiple conflicting API and public directories causing maintenance issues

## Directories Removed

1. `/api` - Root API directory (unused Laravel-style backend)
2. `/public` - Root public directory (unused Laravel public folder)
3. `/public_html` - Redundant old setup directory

## Directories Kept

1. `/backend/api` - Working enhanced API with reports functionality
2. `/backend/public` - Current active public directory (Document Root)

## Current Active Setup

- **Document Root:** `d:/claude/litigation_reports/backend/public`
- **API Route:** `/api/*` → `backend/public/index.php` → `backend/api/index.php`
- **Frontend:** `backend/public/index.html` (React build output)

## Verification Commands

- Login: <http://lit.local:8080> (<admin@litigation.com> / admin123)
- API Health: <http://lit.local:8080/api/health>
- Client Report: <http://lit.local:8080/api/reports/client-report?client_id=1>

## Backup Location

All removed directories backed up to: `/d/claude/litigation_reports/_cleanup_backup/20250922_103348/`
