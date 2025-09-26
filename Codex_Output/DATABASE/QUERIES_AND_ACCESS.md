# 🔍 Database Queries and Access Patterns

## 📊 **Query Architecture Overview**

The **Litigation Management System** uses a **custom ORM pattern** built on top of PDO with prepared statements for security. The system implements a **DatabaseHelper class** that provides abstraction over raw SQL queries while maintaining performance and security.

### **Database Access Pattern**

| Component | Technology | Purpose | Evidence |
|-----------|------------|---------|----------|
| **Database Layer** | PDO with prepared statements | SQL injection prevention | `database/config/database.php:L23-L28` |
| **ORM Pattern** | Custom DatabaseHelper class | Query abstraction | `database/config/database.php:L55-L184` |
| **Model Layer** | Static methods in model classes | Business logic encapsulation | `backend/src/Models/` |
| **Controller Layer** | Model method calls | Request handling | `backend/src/Controllers/` |

## 🏗️ **Database Helper Methods**

### **Core Query Methods**

| Method | Purpose | Implementation | Evidence |
|--------|---------|----------------|----------|
| `query()` | Execute query and return statement | Prepared statement execution | `database/config/database.php:L67-L72` |
| `queryOne()` | Execute query and return single row | Single row fetch | `database/config/database.php:L77-L80` |
| `queryAll()` | Execute query and return all rows | Multiple row fetch | `database/config/database.php:L85-L88` |
| `insert()` | Execute insert and return last ID | Insert with ID return | `database/config/database.php:L93-L96` |
| `execute()` | Execute update/delete and return affected rows | Update/delete operations | `database/config/database.php:L101-L104` |

### **Transaction Methods**

| Method | Purpose | Implementation | Evidence |
|--------|---------|----------------|----------|
| `beginTransaction()` | Start database transaction | PDO transaction start | `database/config/database.php:L109-L111` |
| `commit()` | Commit database transaction | PDO transaction commit | `database/config/database.php:L116-L118` |
| `rollback()` | Rollback database transaction | PDO transaction rollback | `database/config/database.php:L123-L125` |

## 👤 **User Management Queries**

### **Authentication Queries**

| Query Type | SQL Pattern | Purpose | Evidence |
|------------|-------------|---------|----------|
| **User Login** | `SELECT * FROM users WHERE email = :email` | Email-based authentication | `backend/src/Models/User.php:L27` |
| **User by ID** | `SELECT * FROM users WHERE id = :id` | User profile retrieval | `backend/src/Models/User.php:L13` |
| **Password Reset** | `SELECT * FROM users WHERE password_reset_token = :token` | Token-based password reset | `backend/src/Models/User.php:L41` |

### **User CRUD Operations**

| Operation | SQL Pattern | Purpose | Evidence |
|-----------|-------------|---------|----------|
| **Create User** | `INSERT INTO users (username, email, password_hash, ...) VALUES (?, ?, ?, ...)` | User registration | `backend/src/Models/User.php:L44` |
| **Update User** | `UPDATE users SET ... WHERE id = :id` | User profile updates | `backend/src/Models/User.php:L80` |
| **Delete User** | `DELETE FROM users WHERE id = :id` | User account deletion | `backend/src/Models/User.php:L100` |
| **List Users** | `SELECT * FROM users ORDER BY created_at DESC LIMIT :limit OFFSET :offset` | User listing with pagination | `backend/src/Models/User.php:L60` |

### **Session Management Queries**

| Query Type | SQL Pattern | Purpose | Evidence |
|------------|-------------|---------|----------|
| **Create Session** | `INSERT INTO user_sessions (id, user_id, expires_at) VALUES (?, ?, ?)` | Session creation | `backend/src/Core/Auth.php` |
| **Validate Session** | `SELECT * FROM user_sessions WHERE id = :id AND expires_at > NOW()` | Session validation | `backend/src/Core/Auth.php` |
| **Delete Session** | `DELETE FROM user_sessions WHERE id = :id` | Session cleanup | `backend/src/Core/Auth.php` |

## 🏢 **Client Management Queries**

### **Client CRUD Operations**

| Operation | SQL Pattern | Purpose | Evidence |
|-----------|-------------|---------|----------|
| **Get All Clients** | `SELECT * FROM clients ORDER BY client_name_ar ASC` | Client listing | `backend/src/Models/Client.php` |
| **Get Client by ID** | `SELECT * FROM clients WHERE id = :id` | Client details | `backend/src/Models/Client.php` |
| **Create Client** | `INSERT INTO clients (client_name_ar, client_name_en, ...) VALUES (?, ?, ...)` | Client registration | `backend/src/Models/Client.php` |
| **Update Client** | `UPDATE clients SET ... WHERE id = :id` | Client updates | `backend/src/Models/Client.php` |
| **Delete Client** | `DELETE FROM clients WHERE id = :id` | Client deletion | `backend/src/Models/Client.php` |

### **Client Filtering Queries**

| Filter Type | SQL Pattern | Purpose | Evidence |
|-------------|-------------|---------|----------|
| **By Status** | `SELECT * FROM clients WHERE status = :status` | Active/inactive clients | `backend/src/Models/Client.php` |
| **By Type** | `SELECT * FROM clients WHERE client_type = :type` | Individual/company clients | `backend/src/Models/Client.php` |
| **By Payment Type** | `SELECT * FROM clients WHERE cash_pro_bono = :type` | Cash/pro bono clients | `backend/src/Models/Client.php` |
| **By Contact Lawyer** | `SELECT * FROM clients WHERE contact_lawyer = :lawyer` | Lawyer-specific clients | `backend/src/Models/Client.php` |

## ⚖️ **Case Management Queries**

### **Case CRUD Operations**

| Operation | SQL Pattern | Purpose | Evidence |
|-----------|-------------|---------|----------|
| **Get All Cases** | `SELECT * FROM cases ORDER BY matter_start_date DESC` | Case listing | `backend/src/Models/Case.php:L34` |
| **Get Case by ID** | `SELECT * FROM cases WHERE id = :id` | Case details | `backend/src/Models/Case.php:L13` |
| **Create Case** | `INSERT INTO cases (client_id, matter_ar, matter_en, ...) VALUES (?, ?, ?, ...)` | Case creation | `backend/src/Models/Case.php:L80` |
| **Update Case** | `UPDATE cases SET ... WHERE id = :id` | Case updates | `backend/src/Models/Case.php:L100` |
| **Delete Case** | `DELETE FROM cases WHERE id = :id` | Case deletion | `backend/src/Models/Case.php:L120` |

### **Case Relationship Queries**

| Query Type | SQL Pattern | Purpose | Evidence |
|------------|-------------|---------|----------|
| **Case with Client** | `SELECT c.*, cl.client_name_ar, cl.client_name_en FROM cases c JOIN clients cl ON c.client_id = cl.id WHERE c.id = :id` | Case with client info | `backend/src/Models/Case.php:L17-L18` |
| **Case with Lawyers** | `SELECT * FROM lawyers WHERE name = :name` | Lawyer information for cases | `backend/src/Models/Case.php:L21-L28` |
| **Cases by Client** | `SELECT * FROM cases WHERE client_id = :client_id` | Client's cases | `backend/src/Models/Case.php:L46-L49` |

### **Case Filtering Queries**

| Filter Type | SQL Pattern | Purpose | Evidence |
|-------------|-------------|---------|----------|
| **By Status** | `SELECT * FROM cases WHERE matter_status = :status` | Status-based filtering | `backend/src/Models/Case.php:L41-L44` |
| **By Category** | `SELECT * FROM cases WHERE matter_category = :category` | Category-based filtering | `backend/src/Models/Case.php` |
| **By Court** | `SELECT * FROM cases WHERE matter_court = :court` | Court-based filtering | `backend/src/Models/Case.php` |
| **By Date Range** | `SELECT * FROM cases WHERE matter_start_date BETWEEN :start AND :end` | Date range filtering | `backend/src/Models/Case.php` |

## 🏛️ **Hearing Management Queries**

### **Hearing CRUD Operations**

| Operation | SQL Pattern | Purpose | Evidence |
|-----------|-------------|---------|----------|
| **Get All Hearings** | `SELECT * FROM hearings ORDER BY hearing_date DESC` | Hearing listing | `backend/src/Models/Hearing.php` |
| **Get Hearing by ID** | `SELECT * FROM hearings WHERE id = :id` | Hearing details | `backend/src/Models/Hearing.php` |
| **Create Hearing** | `INSERT INTO hearings (case_id, hearing_date, hearing_decision, ...) VALUES (?, ?, ?, ...)` | Hearing creation | `backend/src/Models/Hearing.php` |
| **Update Hearing** | `UPDATE hearings SET ... WHERE id = :id` | Hearing updates | `backend/src/Models/Hearing.php` |
| **Delete Hearing** | `DELETE FROM hearings WHERE id = :id` | Hearing deletion | `backend/src/Models/Hearing.php` |

### **Hearing Relationship Queries**

| Query Type | SQL Pattern | Purpose | Evidence |
|------------|-------------|---------|----------|
| **Hearing with Case** | `SELECT h.*, c.matter_ar, c.matter_en FROM hearings h JOIN cases c ON h.case_id = c.id WHERE h.id = :id` | Hearing with case info | `backend/src/Models/Hearing.php` |
| **Hearings by Case** | `SELECT * FROM hearings WHERE case_id = :case_id ORDER BY hearing_date` | Case hearing history | `backend/src/Models/Hearing.php` |
| **Upcoming Hearings** | `SELECT * FROM hearings WHERE hearing_date >= CURDATE() ORDER BY hearing_date` | Future hearings | `backend/src/Models/Hearing.php` |

### **Hearing Filtering Queries**

| Filter Type | SQL Pattern | Purpose | Evidence |
|-------------|-------------|---------|----------|
| **By Date Range** | `SELECT * FROM hearings WHERE hearing_date BETWEEN :start AND :end` | Date range filtering | `backend/src/Models/Hearing.php` |
| **By Result** | `SELECT * FROM hearings WHERE hearing_result = :result` | Result-based filtering | `backend/src/Models/Hearing.php` |
| **By Type** | `SELECT * FROM hearings WHERE hearing_type = :type` | Type-based filtering | `backend/src/Models/Hearing.php` |

## 💰 **Invoice Management Queries**

### **Invoice CRUD Operations**

| Operation | SQL Pattern | Purpose | Evidence |
|-----------|-------------|---------|----------|
| **Get All Invoices** | `SELECT * FROM invoices ORDER BY invoice_date DESC` | Invoice listing | `backend/src/Models/Invoice.php` |
| **Get Invoice by ID** | `SELECT * FROM invoices WHERE id = :id` | Invoice details | `backend/src/Models/Invoice.php` |
| **Create Invoice** | `INSERT INTO invoices (invoice_number, invoice_date, amount, ...) VALUES (?, ?, ?, ...)` | Invoice creation | `backend/src/Models/Invoice.php` |
| **Update Invoice** | `UPDATE invoices SET ... WHERE id = :id` | Invoice updates | `backend/src/Models/Invoice.php` |
| **Delete Invoice** | `DELETE FROM invoices WHERE id = :id` | Invoice deletion | `backend/src/Models/Invoice.php` |

### **Invoice Financial Queries**

| Query Type | SQL Pattern | Purpose | Evidence |
|------------|-------------|---------|----------|
| **Invoice Totals** | `SELECT SUM(amount) as total, COUNT(*) as count FROM invoices WHERE invoice_status = :status` | Financial summaries | `backend/src/Models/Invoice.php` |
| **Outstanding Invoices** | `SELECT * FROM invoices WHERE invoice_status IN ('sent', 'overdue')` | Payment tracking | `backend/src/Models/Invoice.php` |
| **Paid Invoices** | `SELECT * FROM invoices WHERE invoice_status = 'paid'` | Payment history | `backend/src/Models/Invoice.php` |

### **Invoice Filtering Queries**

| Filter Type | SQL Pattern | Purpose | Evidence |
|-------------|-------------|---------|----------|
| **By Status** | `SELECT * FROM invoices WHERE invoice_status = :status` | Status-based filtering | `backend/src/Models/Invoice.php` |
| **By Date Range** | `SELECT * FROM invoices WHERE invoice_date BETWEEN :start AND :end` | Date range filtering | `backend/src/Models/Invoice.php` |
| **By Currency** | `SELECT * FROM invoices WHERE currency = :currency` | Currency-based filtering | `backend/src/Models/Invoice.php` |

## 📄 **Document Management Queries**

### **Document CRUD Operations**

| Operation | SQL Pattern | Purpose | Evidence |
|-----------|-------------|---------|----------|
| **Get All Documents** | `SELECT * FROM documents ORDER BY document_date DESC` | Document listing | `backend/src/Models/Document.php` |
| **Get Document by ID** | `SELECT * FROM documents WHERE id = :id` | Document details | `backend/src/Models/Document.php` |
| **Create Document** | `INSERT INTO documents (client_id, document_serial, document_description, ...) VALUES (?, ?, ?, ...)` | Document creation | `backend/src/Models/Document.php` |
| **Update Document** | `UPDATE documents SET ... WHERE id = :id` | Document updates | `backend/src/Models/Document.php` |
| **Delete Document** | `DELETE FROM documents WHERE id = :id` | Document deletion | `backend/src/Models/Document.php` |

### **Document Relationship Queries**

| Query Type | SQL Pattern | Purpose | Evidence |
|------------|-------------|---------|----------|
| **Documents by Client** | `SELECT * FROM documents WHERE client_id = :client_id` | Client document history | `backend/src/Models/Document.php` |
| **Documents by Case** | `SELECT * FROM documents WHERE case_number = :case_number` | Case document history | `backend/src/Models/Document.php` |
| **Document with Client** | `SELECT d.*, c.client_name_ar, c.client_name_en FROM documents d JOIN clients c ON d.client_id = c.id WHERE d.id = :id` | Document with client info | `backend/src/Models/Document.php` |

## 🔍 **Search and Filtering Queries**

### **Global Search Queries**

| Search Type | SQL Pattern | Purpose | Evidence |
|-------------|-------------|---------|----------|
| **Client Search** | `SELECT * FROM clients WHERE client_name_ar LIKE :search OR client_name_en LIKE :search` | Client name search | `backend/src/Models/Client.php` |
| **Case Search** | `SELECT * FROM cases WHERE matter_ar LIKE :search OR matter_en LIKE :search` | Case description search | `backend/src/Models/Case.php` |
| **Document Search** | `SELECT * FROM documents WHERE document_description LIKE :search` | Document content search | `backend/src/Models/Document.php` |

### **Advanced Filtering Queries**

| Filter Type | SQL Pattern | Purpose | Evidence |
|-------------|-------------|---------|----------|
| **Multi-column Filter** | `SELECT * FROM cases WHERE matter_status = :status AND matter_category = :category AND matter_court = :court` | Complex filtering | `backend/src/Models/Case.php:L37-L49` |
| **Date Range Filter** | `SELECT * FROM hearings WHERE hearing_date BETWEEN :start_date AND :end_date` | Date range queries | `backend/src/Models/Hearing.php` |
| **Status-based Filter** | `SELECT * FROM invoices WHERE invoice_status IN (:status1, :status2, :status3)` | Multiple status filtering | `backend/src/Models/Invoice.php` |

## 📊 **Reporting and Analytics Queries**

### **Dashboard Queries**

| Query Type | SQL Pattern | Purpose | Evidence |
|------------|-------------|---------|----------|
| **Case Statistics** | `SELECT matter_status, COUNT(*) as count FROM cases GROUP BY matter_status` | Case status summary | `backend/src/Controllers/ReportController.php` |
| **Client Statistics** | `SELECT client_type, COUNT(*) as count FROM clients GROUP BY client_type` | Client type summary | `backend/src/Controllers/ReportController.php` |
| **Hearing Statistics** | `SELECT hearing_result, COUNT(*) as count FROM hearings GROUP BY hearing_result` | Hearing outcome summary | `backend/src/Controllers/ReportController.php` |
| **Financial Summary** | `SELECT invoice_status, SUM(amount) as total, COUNT(*) as count FROM invoices GROUP BY invoice_status` | Financial overview | `backend/src/Controllers/ReportController.php` |

### **Performance Queries**

| Query Type | SQL Pattern | Purpose | Evidence |
|------------|-------------|---------|----------|
| **Lawyer Performance** | `SELECT lawyer_a, COUNT(*) as case_count, AVG(matter_judged_amount) as avg_amount FROM cases GROUP BY lawyer_a` | Lawyer case statistics | `backend/src/Controllers/ReportController.php` |
| **Court Performance** | `SELECT matter_court, COUNT(*) as case_count, AVG(matter_judged_amount) as avg_amount FROM cases GROUP BY matter_court` | Court case statistics | `backend/src/Controllers/ReportController.php` |
| **Client Value** | `SELECT client_id, COUNT(*) as case_count, SUM(matter_asked_amount) as total_asked FROM cases GROUP BY client_id ORDER BY total_asked DESC` | Client value analysis | `backend/src/Controllers/ReportController.php` |

## 🔒 **Security and Validation Queries**

### **Input Validation Queries**

| Validation Type | SQL Pattern | Purpose | Evidence |
|-----------------|-------------|---------|----------|
| **Email Uniqueness** | `SELECT COUNT(*) FROM users WHERE email = :email AND id != :id` | Email uniqueness check | `backend/src/Models/User.php` |
| **Username Uniqueness** | `SELECT COUNT(*) FROM users WHERE username = :username AND id != :id` | Username uniqueness check | `backend/src/Models/User.php` |
| **Matter ID Uniqueness** | `SELECT COUNT(*) FROM cases WHERE matter_id = :matter_id AND id != :id` | Matter ID uniqueness check | `backend/src/Models/Case.php` |

### **Access Control Queries**

| Query Type | SQL Pattern | Purpose | Evidence |
|------------|-------------|---------|----------|
| **User Permissions** | `SELECT role FROM users WHERE id = :id AND is_active = 1` | Role-based access control | `backend/src/Core/Auth.php` |
| **Session Validation** | `SELECT u.* FROM users u JOIN user_sessions s ON u.id = s.user_id WHERE s.id = :session_id AND s.expires_at > NOW()` | Session-based authentication | `backend/src/Core/Auth.php` |

## ⚡ **Performance Optimization Queries**

### **Indexed Queries**

| Query Type | Index Used | Purpose | Evidence |
|------------|------------|---------|----------|
| **User Lookup** | idx_username, idx_email | Fast user authentication | `database/litigation_database.sql:L35-L36` |
| **Case Filtering** | idx_matter_status, idx_matter_category | Fast case filtering | `database/litigation_database.sql:L142-L143` |
| **Hearing Scheduling** | idx_hearing_date, idx_next_hearing | Fast hearing queries | `database/litigation_database.sql:L169-L170` |
| **Invoice Status** | idx_invoice_status, idx_invoice_date | Fast invoice filtering | `database/litigation_database.sql:L241-L240` |

### **Pagination Queries**

| Query Type | SQL Pattern | Purpose | Evidence |
|------------|-------------|---------|----------|
| **Paginated Results** | `SELECT * FROM table ORDER BY created_at DESC LIMIT :limit OFFSET :offset` | Efficient pagination | `backend/src/Models/User.php:L60` |
| **Count Queries** | `SELECT COUNT(*) FROM table WHERE conditions` | Total count for pagination | `backend/src/Models/User.php:L70` |

## 🔄 **Transaction Patterns**

### **Multi-table Operations**

| Operation | Transaction Pattern | Purpose | Evidence |
|-----------|-------------------|---------|----------|
| **Case Creation** | Begin → Insert Case → Insert Hearings → Commit | Atomic case creation | `backend/src/Models/Case.php` |
| **Invoice Processing** | Begin → Insert Invoice → Insert Shares → Update Status → Commit | Atomic invoice processing | `backend/src/Models/Invoice.php` |
| **User Registration** | Begin → Insert User → Create Session → Commit | Atomic user registration | `backend/src/Models/User.php` |

### **Error Handling Patterns**

| Pattern | Implementation | Purpose | Evidence |
|---------|----------------|---------|----------|
| **Rollback on Error** | Try → Catch → Rollback → Throw | Data consistency | `database/config/database.php:L123-L125` |
| **Validation Before Transaction** | Validate → Begin → Execute → Commit | Prevent invalid data | `backend/src/Controllers/AuthController.php:L13-L20` |

## 📈 **Query Performance Analysis**

### **Potential N+1 Issues**

| Query Pattern | Risk Level | Mitigation | Evidence |
|---------------|------------|------------|----------|
| **Case with Client** | Medium | JOIN queries | `backend/src/Models/Case.php:L17-L18` |
| **Case with Lawyers** | High | Batch lawyer queries | `backend/src/Models/Case.php:L21-L28` |
| **Hearing with Case** | Medium | JOIN queries | `backend/src/Models/Hearing.php` |

### **Slow Query Risks**

| Query Type | Risk Factors | Optimization | Evidence |
|------------|--------------|--------------|----------|
| **Full Text Search** | LIKE queries on large tables | Full-text indexes | `backend/src/Models/Client.php` |
| **Date Range Queries** | Large date ranges | Date indexes | `database/litigation_database.sql:L169` |
| **Complex Joins** | Multiple table joins | Query optimization | `backend/src/Models/Case.php:L17-L18` |

---

**Evidence Summary**: `database/config/database.php:L55-L184`, `backend/src/Models/User.php:L1-L308`, `backend/src/Models/Case.php:L1-L229`, `backend/src/Controllers/AuthController.php:L1-L257`, `database/litigation_database.sql:L35-L147`
