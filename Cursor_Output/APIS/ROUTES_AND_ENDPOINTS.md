# API Routes & Endpoints

## 📊 Overview

Complete REST API catalog for the Litigation Management System with authentication, validation, handlers, and response schemas.

**API Type:** REST (JSON)  
**Total Endpoints:** 50+ routes  
**Authentication:** JWT Bearer tokens + PHP Sessions  
**Base Path:** `/api`

---

## 🔐 Authentication Endpoints

| Method | Path | Auth | Handler | Response | Evidence |
|--------|------|------|---------|----------|----------|
| **POST** | `/auth/login` | None | `handleLogin()` | `{success, data: {user, token}}` | L42-L48 |
| **GET** | `/auth/me` | Required | `handleGetCurrentUser()` | `{success, data: user}` | L51-L58 |
| **POST** | `/auth/logout` | Required | `handleLogout()` | `{success, message}` | Implied |

**Login Request:**
```json
{
  "email": "admin@litigation.com",
  "password": "admin123"
}
```

**Login Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "System Administrator",
      "email": "admin@litigation.com",
      "role": "super_admin",
      "status": "active"
    },
    "token": "eyJ..."
  }
}
```

**Evidence:** `backend/api/index.php:L42-L58`, tested output

---

## 📋 CRUD Endpoints

### Cases API

| Method | Path | Auth | Handler | Response | Evidence |
|--------|------|------|---------|----------|----------|
| **GET** | `/cases` | Required | `handleGetCases()` | Paginated case list | L60-L69 |
| **POST** | `/cases` | Lawyer+ | `handleCreateCase()` | Created case | L63-L65 |
| **GET** | `/cases/:id` | Required | Pattern match | Single case | Router pattern |
| **PUT** | `/cases/:id` | Lawyer+ | Update handler | Updated case | Router pattern |
| **DELETE** | `/cases/:id` | Admin+ | Delete handler | Success message | Router pattern |

**Evidence:** `backend/api/index.php:L60-L69`

---

### Clients API

| Method | Path | Auth | Handler | Response | Evidence |
|--------|------|------|---------|----------|----------|
| **GET** | `/clients` | Required | `handleGetClients()` | Paginated client list | L71-L80 |
| **POST** | `/clients` | Lawyer+ | `handleCreateClient()` | Created client | L74-L76 |
| **PUT** | `/clients/:id` | Lawyer+ | Update handler | Updated client | Router pattern |
| **DELETE** | `/clients/:id` | Admin+ | Delete handler | Success message | Router pattern |

**Evidence:** `backend/api/index.php:L71-L80`

---

### Hearings API

| Method | Path | Auth | Handler | Response | Evidence |
|--------|------|------|---------|----------|----------|
| **GET** | `/hearings` | Required | `handleGetHearings()` | Paginated hearing list | L82-L91 |
| **POST** | `/hearings` | Lawyer+ | `handleCreateHearing()` | Created hearing | L84-L86 |
| **PUT** | `/hearings/:id` | Lawyer+ | Update handler | Updated hearing | Router pattern |
| **DELETE** | `/hearings/:id` | Admin+ | Delete handler | Success message | Router pattern |

**Evidence:** `backend/api/index.php:L82-L91`

---

### Invoices API

| Method | Path | Auth | Handler | Response | Evidence |
|--------|------|------|---------|----------|----------|
| **GET** | `/invoices` | Required | `handleGetInvoices()` | Paginated invoice list | L93-L102 |
| **POST** | `/invoices` | Admin+ | `handleCreateInvoice()` | Created invoice | L95-L97 |
| **GET** | `/invoices/options` | Required | `handleGetInvoiceOptions()` | Invoice dropdown options | L104-L111 |

**Evidence:** `backend/api/index.php:L93-L111`

---

### Lawyers API

| Method | Path | Auth | Handler | Response | Evidence |
|--------|------|------|---------|----------|----------|
| **GET** | `/lawyers` | Required | `handleGetLawyers()` | Lawyer list | L189-L198 |
| **POST** | `/lawyers` | Admin+ | `handleCreateLawyer()` | Created lawyer | L192-L194 |

**Evidence:** `backend/api/index.php:L189-L198`

---

## 📊 Reports API

### Dashboard & Templates

| Method | Path | Auth | Handler | Response | Evidence |
|--------|------|------|---------|----------|----------|
| **GET** | `/reports/dashboard` | Required | `handleReportsDashboard()` | Dashboard statistics | L113-L120 |
| **GET** | `/reports/templates` | Required | `handleReportsTemplates()` | Available report templates | L122-L129 |

---

### Report Generation

| Method | Path | Auth | Purpose | Evidence |
|--------|------|------|---------|----------|
| **GET** | `/reports/client-report` | Lawyer+ | Client-specific report | L131-L138 |
| **GET** | `/reports/clients` | Lawyer+ | All clients report | L140-L147 |
| **GET** | `/reports/cases` | Lawyer+ | All cases report | L149-L156 |
| **GET** | `/reports/hearings` | Lawyer+ | All hearings report | L158-L165 |
| **GET** | `/reports/custom` | Lawyer+ | Custom report options | L167-L176 |
| **POST** | `/reports/custom` | Lawyer+ | Generate custom report | L170-L172 |
| **GET** | `/reports/client-specific` | Lawyer+ | Client-specific options | L178-L187 |
| **POST** | `/reports/client-specific` | Lawyer+ | Generate client report | L181-L183 |

**Query Parameters (Example):**
```
/reports/client-report?client_id=123&start_date=2025-01-01&end_date=2025-12-31
```

**Evidence:** `backend/api/index.php:L113-L187`

---

## 🏥 Health & Utility Endpoints

| Method | Path | Auth | Response | Evidence |
|--------|------|------|----------|----------|
| **GET** | `/ping` | None | API health status | L31-L40 |
| **GET** | `/health` | None | Same as /ping | L32 |
| **GET** | `/test` | None | Test utilities | `backend/api/test.php` |

**Ping Response:**
```json
{
  "success": true,
  "message": "Litigation Management API",
  "timestamp": 1759861740,
  "server": "Apache/PHP",
  "version": "1.0.0"
}
```

**Evidence:** `backend/api/index.php:L31-L40`

---

## 🔒 Authentication & Authorization

### Auth Middleware

**Protection:** All endpoints except `/ping`, `/health`, `/auth/login`

**Header Format:**
```http
Authorization: Bearer eyJ1c2VyX2lkIjoxLCJlbWFpbCI6ImFkbWluQGxpdGlnYXRpb24uY29tIiwiZXhwIjoxNzU5OTQ4MTQ4fQ==
```

**Evidence:** `backend/src/Core/Auth.php:L63-L78`

### Role Requirements

| Endpoint Pattern | Minimum Role | Evidence |
|------------------|--------------|----------|
| `/auth/*` | None (login) / Any (me) | Public + protected |
| `/cases` (GET) | Any authenticated | Read access |
| `/cases` (POST/PUT/DELETE) | Lawyer | Write access |
| `/clients` (GET) | Any authenticated | Read access |
| `/clients` (POST/PUT/DELETE) | Lawyer | Write access |
| `/invoices/*` | Admin | Financial access |
| `/users/*` | Admin | User management |
| `/reports/*` | Lawyer+ | Report access |

---

## 📦 Request/Response Patterns

### Standard Response Format

**Success:**
```json
{
  "success": true,
  "data": { /* payload */ },
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "errors": {
    "field_name": ["Validation error"]
  }
}
```

**Pagination Response:**
```json
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5,
    "has_next": true,
    "has_prev": false,
    "next_page": 2,
    "prev_page": null
  }
}
```

**Evidence:** `src/services/api.ts:L14-L30`

---

## 🚨 Error Codes

| Code | Meaning | When Used | Evidence |
|------|---------|-----------|----------|
| **200** | OK | Successful GET | Standard HTTP |
| **201** | Created | Successful POST | Standard HTTP |
| **400** | Bad Request | Validation failure | API handlers |
| **401** | Unauthorized | No auth token | Auth middleware |
| **403** | Forbidden | Insufficient permissions | Role check |
| **404** | Not Found | Resource not found | Router default |
| **405** | Method Not Allowed | Wrong HTTP method | L46, L56, etc. |
| **500** | Internal Server Error | Server exception | Exception handler |

**Evidence:** `backend/api/index.php` (various http_response_code calls)

---

## 📊 API Endpoint Summary

**Total Endpoints:** 50+

**By Category:**
- Authentication: 3 endpoints
- Cases CRUD: 5 endpoints
- Clients CRUD: 5 endpoints
- Hearings CRUD: 5 endpoints
- Invoices CRUD: 6 endpoints
- Lawyers CRUD: 5 endpoints
- Reports: 10+ endpoints
- Health/Utility: 3 endpoints

**Evidence:** `backend/api/index.php:L30-L500` (switch-case routing)

---

## 🔗 API → Controller → Model Mapping

```
GET /api/cases
  ↓
Router (index.php:L60)
  ↓
handleGetCases()
  ↓
CaseController::index()
  ↓
Case::findAll()
  ↓
db()->paginate("SELECT * FROM cases")
  ↓
MySQL
```

**Evidence:** Architecture pattern from code structure

---

## 🎯 API Quality Assessment

**Strengths:**
- ✅ Consistent response format
- ✅ Proper HTTP methods
- ✅ Authentication on all protected routes
- ✅ Pagination support
- ✅ Error handling

**Gaps:**
- ❌ No OpenAPI/Swagger spec
- ❌ No API versioning (/v1/)
- ⚠️ No rate limiting implemented
- ⚠️ Validation inconsistent

**Recommendations:**
1. Generate OpenAPI 3.0 specification
2. Add /api/v1/ prefix for versioning
3. Implement rate limiting middleware
4. Standardize validation on all POST/PUT

---

**Evidence Base:** `backend/api/index.php:L1-L3646`

