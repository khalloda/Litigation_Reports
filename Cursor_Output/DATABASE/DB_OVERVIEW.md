# Database Overview

## 📊 Database Systems Summary

The Litigation Management System uses **MySQL 9.1.0** as its primary and only database system, with UTF-8mb4 character set for full Arabic language support.

**Database Type:** Relational (SQL)  
**Primary Database:** MySQL 9.1.0  
**Character Set:** UTF-8mb4  
**Collation:** utf8mb4_unicode_ci  
**Storage Engine:** InnoDB

---

## 🗄️ Database Inventory

### Primary Database

| Property | Value | Evidence |
|----------|-------|----------|
| **DBMS** | MySQL | `README.md:L149` |
| **Version** | 9.1.0 | `README.md:L149` |
| **Database Name** | `litigation_db` | `database/litigation_database.sql:L12`, `backend/config/config.php:L18` |
| **Character Set** | UTF-8mb4 | `database/litigation_database.sql:L13` |
| **Collation** | utf8mb4_unicode_ci | `database/litigation_database.sql:L14` |
| **Storage Engine** | InnoDB | `database/litigation_database.sql:L38` |
| **Tables** | 21 tables | `database/litigation_database.sql` (grep analysis) |

**Schema Definition:**

```sql
CREATE DATABASE IF NOT EXISTS litigation_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

**Evidence:** `database/litigation_database.sql:L12-L14`

---

### Backup/Fallback Database

| Property | Value | Evidence |
|----------|-------|----------|
| **DBMS** | SQLite | `database/litigation.db` |
| **Purpose** | Local development fallback | `database/setup_sqlite.php`, `backend/config/database_sqlite.php` |
| **Status** | Secondary (not primary) | File presence |

**SQLite Usage:**
- **Development:** Optional local database for testing
- **Production:** Not used (MySQL only)
- **Evidence:** `database/setup_sqlite.php`, `database/litigation.db` file exists

---

## 🔌 Database Connection

### Connection Method

**Technology:** PHP Data Objects (PDO)  
**Driver:** `pdo_mysql`  
**Connection Type:** Persistent connections (connection pooling)

**Connection String (Development):**

```php
$dsn = "mysql:host=localhost;port=3306;dbname=litigation_db;charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
    PDO::ATTR_PERSISTENT => true  // Connection pooling
];
$pdo = new PDO($dsn, $user, $pass, $options);
```

**Evidence:** `backend/config/database.php:L14-L24`

---

### Connection Configuration

**Development:**

| Parameter | Value | Evidence |
|-----------|-------|----------|
| **Host** | `localhost` | `backend/config/config.php:L16` |
| **Port** | `3306` | `backend/config/config.php:L17` |
| **Database** | `litigation_db` | `backend/config/config.php:L18` |
| **Username** | `root` | `backend/config/config.php:L19` |
| **Password** | `1234` | `backend/config/config.php:L20` |
| **Charset** | `utf8mb4` | `backend/config/config.php:L21` |
| **Collation** | `utf8mb4_unicode_ci` | `backend/config/config.php:L22` |

**Production:**

| Parameter | Value | Evidence |
|-----------|-------|----------|
| **Host** | `localhost` | `backend/config/config.production.php:L11` |
| **Database** | `your_database_name` (to be configured) | `backend/config/config.production.php:L12` |
| **Username** | `your_database_user` (to be configured) | `backend/config/config.production.php:L13` |
| **Password** | `***masked***` (to be configured) | `backend/config/config.production.php:L14` |

**Evidence:** `backend/config/config.production.php:L11-L15`

---

### Connection Pool Settings

**PDO Configuration:**

```php
PDO::ATTR_PERSISTENT => true  // Enable persistent connections
```

**Implications:**
- ✅ Connection reuse across requests
- ✅ Reduced connection overhead
- ⚠️ Limited by MySQL `max_connections` setting

**Max Connections (GoDaddy Shared Hosting):**
- **Assumption:** ~50-100 concurrent connections
- **Evidence:** Standard shared hosting limits
- **How to Verify:** `SHOW VARIABLES LIKE 'max_connections';` in MySQL

**Evidence:** `backend/config/database.php:L21`

---

### Timezone Configuration

**Database Timezone:**

```php
$this->connection->exec("SET time_zone = '+03:00'");
```

**Timezone:** UTC+3 (Riyadh/Cairo time)  
**Applied:** Per connection initialization  
**Evidence:** `backend/config/database.php:L27`

---

## 🔧 Database Client & ORM

### ORM / Database Abstraction

**Status:** ❌ **No ORM Detected**

**Custom Database Class:**
- **File:** `backend/config/database.php`
- **Type:** Lightweight wrapper around PDO
- **Pattern:** Active Record-like (but custom)
- **Evidence:** `backend/config/database.php:L1-L231`

**Database Class Features:**

| Feature | Method | Purpose | Evidence |
|---------|--------|---------|----------|
| **Query Execution** | `query($sql, $params)` | Execute prepared statement | Lines 46-55 |
| **Fetch One** | `fetch($sql, $params)` | Fetch single row | Lines 57-60 |
| **Fetch All** | `fetchAll($sql, $params)` | Fetch all rows | Lines 62-65 |
| **Insert** | `insert($table, $data)` | Insert record | Lines 67-75 |
| **Update** | `update($table, $data, $where)` | Update record | Lines 77-89 |
| **Delete** | `delete($table, $where)` | Delete record | Lines 91-95 |
| **Transactions** | `beginTransaction()`, `commit()`, `rollback()` | Transaction support | Lines 97-107 |
| **Pagination** | `paginate($sql, $params, $page, $limit)` | Server-side pagination | Lines 143-174 |
| **Search** | `search($table, $columns, $searchTerm)` | Search across columns | Lines 176-195 |
| **Arabic Search** | `searchArabic($table, $columns, $term)` | Arabic-aware search | Lines 197-216 |

**Evidence:** `backend/config/database.php:L46-L216`

---

### Model Layer

**Model Files:**

| Model | File | Represents | Evidence |
|-------|------|------------|----------|
| **User** | `backend/src/Models/User.php` | System users | Directory listing |
| **Client** | `backend/src/Models/Client.php` | Law firm clients | Directory listing |
| **Case** | `backend/src/Models/Case.php` | Legal cases | Directory listing |
| **Hearing** | `backend/src/Models/Hearing.php` | Court hearings | Directory listing |
| **Invoice** | `backend/src/Models/Invoice.php` | Invoices | Directory listing |
| **Lawyer** | `backend/src/Models/Lawyer.php` | Lawyers | Directory listing |
| **Document** | `backend/src/Models/Document.php` | Documents | Directory listing |

**Evidence:** `backend/src/Models/` directory (7 model files)

**Model Pattern:** Static methods for data access (no traditional ORM inheritance)

---

## 🗂️ Schema Management

### Migration System

**Migration Tool:** ❌ **No Automated Migration Framework**

**Manual Migrations:**
- SQL files in `database/migrations/` directory
- Executed manually via MySQL client or PHP scripts

**Migration Files:**

| File | Purpose | Evidence |
|------|---------|----------|
| `add_missing_features.sql` | Add new features to schema | `database/migrations/add_missing_features.sql` |
| `add_missing_features_compatible.sql` | Compatible feature additions | `database/migrations/add_missing_features_compatible.sql` |
| `create_documents_table.sql` | Create documents table | `database/migrations/create_documents_table.sql` |
| `update_database_for_new_features.sql` | Schema updates | `database/migrations/update_database_for_new_features.sql` |
| `step_by_step_migration.sql` | Incremental migration | `database/migrations/step_by_step_migration.sql` |

**Evidence:** `database/migrations/` directory

**Backend Migration:**

| File | Purpose | Evidence |
|------|---------|----------|
| `001_add_lawyer_relationships.sql` | Lawyer relationships | `backend/migrations/001_add_lawyer_relationships.sql` |

**Recommendation:** Implement automated migration tool (e.g., Phinx, Laravel migrations standalone)

---

### Seeding Strategy

**Seed Files:**

| File | Purpose | Evidence |
|------|---------|----------|
| `database/setup_users.php` | Create initial users | `database/setup_users.php` |
| `database/setup.php` | Complete database setup | `database/setup.php` |
| `database/setup_simple.php` | Simplified setup | `database/setup_simple.php` |
| `database/migrate_data.php` | Data migration from Access | `database/migrate_data.php` |

**Evidence:** `database/` directory

**User Seeding:** Includes system administrator and sample users  
**Data Seeding:** Migration from Access database (6,388 cases, 308 clients, etc.)

---

## 🔐 Database Security

### Authentication

**MySQL Authentication:**
- **Method:** Username/password
- **Development:** `root` / `1234` (weak)
- **Production:** `***masked***` (to be configured)

**Evidence:** `backend/config/config.php:L19-L20`

### SQL Injection Prevention

**Protection Method:** Prepared Statements (PDO parameterized queries)

**Example:**

```php
public function query($sql, $params = []) {
    $stmt = $this->connection->prepare($sql);  // Prepare
    $stmt->execute($params);                   // Bind & execute
    return $stmt;
}
```

**Evidence:** `backend/config/database.php:L46-L55`

**Security Status:** ✅ **Fully Protected** (all queries use prepared statements)

### Access Control

**Database-Level Permissions:**
- **Development:** Full access (root user)
- **Production:** Limited to specific database (assumed)

**Application-Level Access Control:**
- **Implemented:** Yes (role-based permissions in application)
- **Evidence:** `backend/config/config.php:L82-L98` (USER_ROLES)

---

## 📈 Database Performance

### Indexing Strategy

**Indexes Detected:**

| Table | Index Type | Columns | Purpose | Evidence |
|-------|------------|---------|---------|----------|
| **users** | INDEX | `username` | Login lookup | `database/litigation_database.sql:L35` |
| **users** | INDEX | `email` | Email lookup | `database/litigation_database.sql:L36` |
| **users** | INDEX | `role` | Role filtering | `database/litigation_database.sql:L37` |
| **clients** | INDEX | `status` | Active client filtering | `database/litigation_database.sql:L69` |
| **cases** | INDEX | `client_id` | Foreign key lookup | Implied |
| **hearings** | INDEX | `case_id` | Foreign key lookup | Implied |
| **invoices** | INDEX | `invoice_number` | Unique invoice lookup | `database/litigation_database.sql:L239` |

**Evidence:** `database/litigation_database.sql` (INDEX statements)

**Indexing Coverage:** ✅ **Good** (Primary keys, foreign keys, frequently queried columns)

---

### Query Caching

**Application-Level Caching:**

| Feature | Status | Evidence |
|---------|--------|----------|
| **File-based cache** | ✅ Enabled | `backend/config/config.php:L52-L54` |
| **Cache path** | `backend/cache/` | `backend/config/config.php:L53` |
| **Cache lifetime** | 3600 seconds (1 hour) | `backend/config/config.php:L54` |
| **Query cache** | ✅ Enabled (production) | `backend/config/config.production.php:L79-L81` |
| **Query cache lifetime** | 300 seconds (5 minutes) | `backend/config/config.production.php:L80` |

**MySQL Query Cache:** Deprecated in MySQL 8.0+, not available in MySQL 9.1

**Evidence:** `backend/config/config.production.php:L79-L81`

---

### Pagination

**Server-Side Pagination:**

```php
public function paginate($sql, $params = [], $page = 1, $limit = 20) {
    // Get total count
    $countSql = "SELECT COUNT(*) as total FROM ({$sql}) as count_query";
    $total = $this->fetch($countSql, $params)['total'];
    
    // Calculate offset
    $offset = ($page - 1) * $limit;
    
    // Add LIMIT and OFFSET
    $paginatedSql = $sql . " LIMIT {$limit} OFFSET {$offset}";
    $data = $this->fetchAll($paginatedSql, $params);
    
    return [
        'data' => $data,
        'pagination' => [...]
    ];
}
```

**Default Page Size:** 20 records  
**Max Page Size:** 100 records  
**Evidence:** `backend/config/database.php:L143-L174`, `backend/config/config.php:L48-L49`

---

## 🌍 Multi-Language Support

### UTF-8mb4 Configuration

**Character Set:** UTF-8mb4 (full Unicode support, including emojis)  
**Collation:** utf8mb4_unicode_ci (case-insensitive, accent-insensitive)

**Database-Level:**

```sql
CREATE DATABASE litigation_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

**Table-Level:**

```sql
CREATE TABLE clients (
    client_name_ar VARCHAR(200) NOT NULL,
    client_name_en VARCHAR(200),
    ...
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Connection-Level:**

```php
PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
```

**Evidence:**
- Database: `database/litigation_database.sql:L7-L9`
- Tables: `database/litigation_database.sql:L38`, L72, L85, etc.
- Connection: `backend/config/database.php:L20`

---

### Arabic Text Search

**Custom Arabic Search Method:**

```php
public function searchArabic($table, $columns, $searchTerm, $additionalWhere = '', $params = []) {
    $searchConditions = [];
    foreach ($columns as $column) {
        $searchConditions[] = "{$column} COLLATE utf8mb4_unicode_ci LIKE :search_{$column}";
    }
    // ...
}
```

**Features:**
- **Collation-aware:** Uses `COLLATE utf8mb4_unicode_ci` for proper Arabic matching
- **Wildcard search:** `LIKE` with `%term%` pattern
- **Multi-column:** Searches across multiple columns simultaneously

**Evidence:** `backend/config/database.php:L197-L216`

---

## 💾 Data Retention & Backup

### Backup Configuration

**Backup Settings (Production):**

| Setting | Value | Evidence |
|---------|-------|----------|
| **Backup Enabled** | ✅ Yes | `backend/config/config.production.php:L73` |
| **Backup Path** | `backend/backups/` | `backend/config/config.production.php:L74` |
| **Retention** | 30 days | `backend/config/config.production.php:L75` |
| **Schedule** | Daily | `backend/config/config.production.php:L76` |

**Evidence:** `backend/config/config.production.php:L73-L76`

**Backup Implementation:** Not detected (configuration only, no automation scripts found)

**Recommendation:** Implement automated backup script (mysqldump + cron)

---

### Database Dumps

**DB Dump Directory:**
- **Location:** `DB_DUMP/` (root directory)
- **Purpose:** Manual database exports
- **Evidence:** Repository structure listing

---

## 🔄 Data Migration Status

### Access Database Migration

**Source:** Microsoft Access Database  
**Target:** MySQL litigation_db

**Migration Progress:**

| Entity | Access Count | MySQL Count | Migration % | Evidence |
|--------|--------------|-------------|-------------|----------|
| **Clients** | ~308 | 247+ | 80% | `README.md:L162` |
| **Lawyers** | ~40 | 38+ | 95% | `README.md:L162` |
| **Cases** | ~6,388 | Partial | 10% | `README.md:L163` |
| **Hearings** | ~20,000 | Partial | 5% | `README.md:L164` |
| **Invoices** | ~540 | Partial | 20% | `README.md:L165` |

**Migration Scripts:**

| Script | Purpose | Evidence |
|--------|---------|----------|
| `migrate_data.php` | Full migration | `database/migrate_data.php` |
| `migrate_simple.php` | Simplified migration | `database/migrate_simple.php` |

**Status:** ⚠️ **Incomplete** (majority of data not yet migrated)

---

## 🔍 Database Monitoring

**Status:** ❌ **No Database Monitoring Detected**

**Missing Monitoring:**
- No slow query logging
- No performance metrics collection
- No connection pool monitoring
- No replication lag tracking (N/A for single server)

**Basic Checks Available:**
- **Connection test:** `database/test.php`
- **Table existence check:** `database/check_all_tables.php`
- **Structure verification:** `database/check_table_structure.php`

**Evidence:** Database check scripts in `database/` directory

---

## 📊 Database Statistics

**Table Count:** 21 tables

**Key Tables by Size (estimated):**

| Table | Estimated Rows | Purpose | Evidence |
|-------|----------------|---------|----------|
| **hearings** | 20,000+ (target) | Court hearings | `README.md:L164` |
| **cases** | 6,388+ (target) | Legal cases | `README.md:L163` |
| **invoices** | 540+ (target) | Invoices | `README.md:L165` |
| **clients** | 308+ (target) | Clients | `README.md:L162` |
| **lawyers** | 40+ (target) | Lawyers | `README.md:L162` |
| **users** | ~10 | System users | Estimated |

**Total Estimated Data Volume:** ~27,000 records (when migration complete)

---

## 🎯 Database Recommendations

### Immediate Actions

1. **Complete Data Migration**
   - Priority: High
   - Execute remaining migration scripts
   - Verify data integrity

2. **Implement Automated Migrations**
   - Add migration framework (Phinx or standalone Laravel migrations)
   - Version control schema changes

3. **Enable Slow Query Logging**
   ```sql
   SET GLOBAL slow_query_log = 'ON';
   SET GLOBAL long_query_time = 2;
   SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';
   ```

4. **Add Database Monitoring**
   - Query performance tracking
   - Connection pool utilization
   - Disk space alerts

5. **Implement Automated Backups**
   - Daily mysqldump exports
   - Off-site backup storage
   - Backup restoration testing

### Strategic Improvements

6. **Add Read Replicas** (for high traffic)
   - Separate read and write operations
   - Scale read-heavy workloads

7. **Implement Full-Text Search** (for better Arabic search)
   - MySQL FULLTEXT indexes
   - Or integrate Elasticsearch

8. **Add Connection Pooling** (for production)
   - Reduce connection overhead
   - Use MySQL Router or ProxySQL

---

## 📘 Database Documentation

**Schema Documentation:**
- **Primary:** `database/litigation_database.sql` (complete schema)
- **Setup Guide:** `database/SETUP_GUIDE.md`
- **README:** `database/README.md`

**API Documentation:**
- **CRUD Examples:** `CRUD_API_EXAMPLES.md`
- **Reports API:** `REPORTS_API_DOCUMENTATION.md`
- **Upload API:** `UPLOAD_API_DOCUMENTATION.md`

**Evidence:** Documentation files in root and `database/` directories

---

**End of Database Overview**

