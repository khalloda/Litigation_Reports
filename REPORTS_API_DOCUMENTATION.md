# Reports API Documentation

## Overview

This document describes the Reports API endpoints that power the "عرض" (View) buttons in the Reports dashboard. All endpoints have been tested and verified to work correctly.

## Base URL

```
http://lit.local:8080/api/reports
```

## Authentication

All endpoints require user authentication via session or token.

---

## 📊 Clients Report

### GET `/reports/clients`

Returns comprehensive client data with case statistics.

**Query Parameters:**

- `status` (optional): Filter by client status (`active`, `inactive`, `disabled`)
- `client_type` (optional): Filter by client type (`individual`, `company`, `government`)
- `date_from` (optional): Filter by creation date from (YYYY-MM-DD)
- `date_to` (optional): Filter by creation date to (YYYY-MM-DD)

**Response Example:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "client_name_ar": "ساري الدين وشركاه",
      "client_name_en": "Sarie Eldin & Partners",
      "client_type": "company",
      "status": "active",
      "email": null,
      "phone": null,
      "total_cases": 6,
      "active_cases": 6,
      "closed_cases": 0,
      "created_at": "2025-09-16 11:38:56"
    }
  ],
  "summary": {
    "total_clients": 312,
    "active_clients": 15,
    "inactive_clients": 297,
    "individual_clients": 50,
    "company_clients": 262
  },
  "filters": {},
  "available_columns": {
    "client_name_ar": "اسم العميل (عربي)",
    "client_name_en": "اسم العميل (إنجليزي)",
    "client_type": "نوع العميل",
    "status": "الحالة",
    "total_cases": "إجمالي القضايا",
    "active_cases": "القضايا النشطة",
    "closed_cases": "القضايا المغلقة"
  }
}
```

---

## ⚖️ Cases Report

### GET `/reports/cases`

Returns case data with client information and hearing counts.

**Query Parameters:**

- `status` (optional): Filter by case status (`active`, `closed`)
- `matter_category` (optional): Filter by case category (`civil`, `commercial`, etc.)
- `matter_importance` (optional): Filter by importance (`high`, `medium`, `low`)
- `date_from` (optional): Filter by creation date from (YYYY-MM-DD)
- `date_to` (optional): Filter by creation date to (YYYY-MM-DD)

**Response Example:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1707,
      "matter_id": "2025-0006",
      "matter_ar": "قضية تجريبية جديدة",
      "matter_en": "New Test Case",
      "matter_status": "active",
      "matter_category": "civil",
      "matter_importance": "medium",
      "matter_court": "محكمة النقض",
      "client_name_ar": "ساري الدين وشركاه",
      "client_name_en": "Sarie Eldin & Partners",
      "total_hearings": 1,
      "pending_hearings": 1,
      "won_hearings": 0,
      "created_at": "2025-09-16 22:15:50"
    }
  ],
  "summary": {
    "total_cases": 6,
    "active_cases": 6,
    "closed_cases": 0,
    "high_importance_cases": 0,
    "medium_importance_cases": 6,
    "low_importance_cases": 0
  },
  "available_columns": {
    "matter_ar": "موضوع القضية (عربي)",
    "matter_en": "موضوع القضية (إنجليزي)",
    "matter_court": "المحكمة",
    "matter_status": "الحالة",
    "client_name_ar": "اسم العميل"
  }
}
```

---

## 🏛️ Hearings Report

### GET `/reports/hearings`

Returns hearing data with case and client information.

**Query Parameters:**

- `hearing_result` (optional): Filter by hearing result (`pending`, `won`, `lost`, `postponed`)
- `hearing_type` (optional): Filter by hearing type (`initial`, `expert`, `final`)
- `date_from` (optional): Filter by hearing date from (YYYY-MM-DD)
- `date_to` (optional): Filter by hearing date to (YYYY-MM-DD)

**Response Example:**

```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "case_id": 1707,
      "hearing_date": "2025-09-22",
      "hearing_result": "pending",
      "hearing_type": "expert",
      "hearing_duration": "1hour",
      "matter_ar": "قضية تجريبية جديدة",
      "matter_court": "محكمة النقض",
      "client_name_ar": "ساري الدين وشركاه",
      "client_name_en": "Sarie Eldin & Partners",
      "created_at": "2025-09-20 10:16:10"
    }
  ],
  "summary": {
    "total_hearings": 2,
    "pending_hearings": 2,
    "won_hearings": 0,
    "lost_hearings": 0,
    "postponed_hearings": 0
  },
  "available_columns": {
    "hearing_date": "تاريخ الجلسة",
    "hearing_type": "نوع الجلسة",
    "hearing_result": "النتيجة",
    "matter_ar": "موضوع القضية",
    "client_name_ar": "اسم العميل"
  }
}
```

---

## ⚙️ Custom Reports

### GET `/reports/custom`

Returns available entities, columns, and filters for custom report building.

**Query Parameters:**

- `type` (optional): Entity type (`clients`, `cases`, `hearings`, `invoices`, `documents`)

**Response Example:**

```json
{
  "success": true,
  "data": {
    "available_entities": {
      "clients": "العملاء",
      "cases": "القضايا",
      "hearings": "الجلسات",
      "invoices": "الفواتير",
      "documents": "المستندات"
    },
    "available_columns": {
      "client_name_ar": "اسم العميل (عربي)",
      "client_name_en": "اسم العميل (إنجليزي)",
      "client_type": "نوع العميل",
      "status": "الحالة",
      "created_at": "تاريخ الإنشاء"
    },
    "available_filters": {
      "status": {
        "active": "نشط",
        "inactive": "غير نشط"
      },
      "client_type": {
        "individual": "فرد",
        "company": "شركة",
        "government": "حكومي"
      }
    }
  }
}
```

### POST `/reports/custom`

Generates a custom report based on specified parameters.

**Request Body:**

```json
{
  "entity": "clients",
  "columns": ["client_name_ar", "client_type", "status"],
  "filters": {
    "status": "active",
    "client_type": "company"
  },
  "date_range": {
    "from": "2025-01-01",
    "to": "2025-12-31"
  }
}
```

---

## Error Responses

All endpoints return consistent error responses:

**400 Bad Request:**

```json
{
  "success": false,
  "error": "Invalid parameters provided"
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "error": "Failed to generate [report_type] report"
}
```

---

## Implementation Notes

### Database Schema Compatibility

- Uses actual database column names (`matter_status` not `status`)
- Proper JOIN relationships between `clients`, `cases`, and `hearings` tables
- Handles Arabic and English field variations

### Performance Optimizations

- Efficient LEFT JOIN queries for related data
- Conditional WHERE clauses for filtering
- Summary statistics calculated in single queries
- Proper indexing on filterable columns

### Security Features

- Input parameter validation
- SQL injection protection via prepared statements
- User authentication requirement
- Error message sanitization

---

## Testing

All endpoints have been verified with:

- ✅ Manual curl testing (200 OK responses)
- ✅ Frontend integration testing (data display in UI)
- ✅ E2E Playwright testing (complete user flow)
- ✅ Error handling verification (no 404 errors)

## Fix Summary

**Original Issue:**
Reports "عرض" (View) buttons were returning 404 errors for `/api/reports/clients`, `/api/reports/cases`, `/api/reports/hearings`, and `/api/reports/custom`.

**Root Causes Fixed:**

1. Missing backend route handlers
2. Incorrect database column references
3. SQL query syntax errors

**Result:**
All report endpoints now return successful responses with comprehensive data and proper error handling.
