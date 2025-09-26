# 🛠️ **CRUD API Examples** - Litigation Management System

## 📋 **Overview**

This document provides ready-to-use curl examples for all CRUD operations in the Litigation Management System.

**Base URL:** `http://lit.local:8080/api`
**Authentication:** Bearer Token (obtain via login)

---

## 🔐 **Authentication**

### Login

```bash
curl -X POST "http://lit.local:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@litigation.com",
    "password": "admin123"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "your-auth-token-here"
  }
}
```

---

## 🏛️ **Hearings CRUD**

### Get Options

```bash
curl "http://lit.local:8080/api/hearings/options" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Hearing

```bash
curl -X POST "http://lit.local:8080/api/hearings" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "case_id": "1702",
    "hearing_date": "2025-09-25T10:00",
    "hearing_type": "initial",
    "hearing_result": "pending",
    "hearing_duration": "1h",
    "hearing_decision": "Test hearing decision",
    "court_notes": "Court notes here",
    "lawyer_notes": "Lawyer notes here",
    "expert_notes": "Expert notes here",
    "next_hearing": "2025-10-15T10:00",
    "short_decision": "Brief decision"
  }'
```

### Update Hearing

```bash
curl -X PUT "http://lit.local:8080/api/hearings/5" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "case_id": "1702",
    "hearing_date": "2025-09-25T14:00",
    "hearing_type": "procedural",
    "hearing_result": "won",
    "hearing_duration": "2h",
    "hearing_decision": "Updated decision"
  }'
```

### Delete Hearing

```bash
curl -X DELETE "http://lit.local:8080/api/hearings/5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get All Hearings

```bash
curl "http://lit.local:8080/api/hearings?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ⚖️ **Cases CRUD**

### Get Options

```bash
curl "http://lit.local:8080/api/cases/options" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Case

```bash
curl -X POST "http://lit.local:8080/api/cases" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "315",
    "matter_ar": "قضية تجريبية جديدة",
    "matter_en": "New Test Case",
    "matter_status": "active",
    "matter_importance": "medium",
    "matter_court": "محكمة القاهرة الابتدائية",
    "matter_category": "civil",
    "matter_start_date": "2025-09-23",
    "client_capacity": "مدعي",
    "opponent_capacity": "مدعي عليه",
    "matter_subject": "موضوع القضية"
  }'
```

### Update Case

```bash
curl -X PUT "http://lit.local:8080/api/cases/1708" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "315",
    "matter_ar": "قضية محدثة",
    "matter_status": "closed",
    "matter_importance": "high"
  }'
```

### Delete Case

```bash
curl -X DELETE "http://lit.local:8080/api/cases/1708" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get All Cases

```bash
curl "http://lit.local:8080/api/cases?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 👥 **Clients CRUD**

### Get Options

```bash
curl "http://lit.local:8080/api/clients/options" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Client

```bash
curl -X POST "http://lit.local:8080/api/clients" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "client_name_ar": "عميل تجريبي جديد",
    "client_name_en": "New Test Client",
    "client_type": "company",
    "status": "active",
    "cash_pro_bono": "cash",
    "email": "test@example.com",
    "phone": "+20123456789",
    "address_ar": "عنوان باللغة العربية",
    "address_en": "Address in English",
    "notes_ar": "ملاحظات باللغة العربية",
    "client_start_date": "2025-09-23"
  }'
```

### Update Client

```bash
curl -X PUT "http://lit.local:8080/api/clients/315" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "client_name_ar": "عميل محدث",
    "client_name_en": "Updated Client",
    "status": "inactive",
    "email": "updated@example.com"
  }'
```

### Delete Client

```bash
curl -X DELETE "http://lit.local:8080/api/clients/315" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get All Clients

```bash
curl "http://lit.local:8080/api/clients?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 💰 **Invoices CRUD**

### Create Invoice

```bash
curl -X POST "http://lit.local:8080/api/invoices" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "invoice_number": "INV-2025-0001",
    "contract_id": "CTR-001",
    "client_id": "315",
    "case_id": "1708",
    "invoice_date": "2025-09-23",
    "amount": 5000.00,
    "currency": "EGP",
    "usd_amount": 250.00,
    "invoice_details": "تفاصيل الفاتورة",
    "invoice_status": "draft",
    "invoice_type": "service",
    "has_vat": true,
    "payment_date": "2025-10-23",
    "report_generated": false
  }'
```

### Get All Invoices

```bash
curl "http://lit.local:8080/api/invoices?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 👨‍💼 **Lawyers CRUD** (Already Working)

### Get All Lawyers

```bash
curl "http://lit.local:8080/api/lawyers?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Lawyer

```bash
curl -X POST "http://lit.local:8080/api/lawyers" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lawyer_name_ar": "محامي جديد",
    "lawyer_name_en": "New Lawyer",
    "lawyer_email": "lawyer@litigation.com",
    "is_active": true
  }'
```

---

## 📄 **Documents CRUD** (Already Working)

### Get All Documents

```bash
curl "http://lit.local:8080/api/documents?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 **Reports (Already Working)**

### Get Dashboard Data

```bash
curl "http://lit.local:8080/api/reports/dashboard" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Clients Report

```bash
curl "http://lit.local:8080/api/reports/clients" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Cases Report

```bash
curl "http://lit.local:8080/api/reports/cases" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Hearings Report

```bash
curl "http://lit.local:8080/api/reports/hearings" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔍 **Filtering Examples**

### Filter Hearings by Date Range

```bash
curl "http://lit.local:8080/api/hearings?date_from=2025-09-01&date_to=2025-09-30&hearing_type=initial" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Filter Cases by Status

```bash
curl "http://lit.local:8080/api/cases?matter_status=active&matter_category=civil" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Search Clients

```bash
curl "http://lit.local:8080/api/clients?search=شركة&status=active" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🚨 **Error Handling Examples**

### Validation Error (422)

```bash
# Missing required fields
curl -X POST "http://lit.local:8080/api/hearings" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "case_id": "",
    "hearing_date": ""
  }'

# Response:
{
  "error": "Validation failed",
  "errors": {
    "case_id": "Case ID is required",
    "hearing_date": "Hearing date is required"
  }
}
```

### Not Found Error (404)

```bash
curl -X DELETE "http://lit.local:8080/api/hearings/99999" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Response:
{
  "error": "Hearing not found"
}
```

### Referential Integrity Error (422)

```bash
# Trying to delete client with cases
curl -X DELETE "http://lit.local:8080/api/clients/1" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Response:
{
  "error": "Cannot delete client with existing cases",
  "message": "Please delete all cases for this client first"
}
```

---

## ✅ **Success Response Format**

All successful responses follow this format:

```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}
```

For paginated responses:

```json
{
  "success": true,
  "data": {
    "data": [...],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 25,
      "total_pages": 3,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

---

## 🛡️ **Security Notes**

1. **Always include Authorization header** with valid Bearer token
2. **Use HTTPS in production** (currently using HTTP for local development)
3. **Validate all input data** on both client and server sides
4. **Check for SQL injection** protection in all queries
5. **Rate limiting** should be implemented for production use

---

## 🧪 **Testing Tips**

1. **Test with invalid data** to ensure proper validation
2. **Test referential integrity** (deleting items with dependencies)
3. **Test pagination** with different page sizes
4. **Test filtering and searching** with various parameters
5. **Monitor response times** for performance optimization

---

**📝 Generated by:** CRUD Implementation Team
**📅 Last Updated:** 2025-09-23
**🔧 Version:** 1.0.0
