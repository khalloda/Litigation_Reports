# 🗄️ Database Overview - Litigation Management System

## 📊 **Database Systems**

### **Primary Database: MySQL 9.1.0**

| Component | Details | Evidence |
|-----------|---------|----------|
| **Database Engine** | MySQL 9.1.0 | `database/config/database.php:L22` |
| **Connection Method** | PDO with prepared statements | `database/config/database.php:L23-L28` |
| **Character Set** | UTF-8 (utf8mb4) | `database/litigation_database.sql:L7-L9` |
| **Collation** | utf8mb4_unicode_ci | `database/litigation_database.sql:L7-L9` |
| **Storage Engine** | InnoDB | `database/litigation_database.sql:L38` |

### **Database Configuration**

| Setting | Value | Purpose | Evidence |
|---------|-------|---------|----------|
| **Host** | localhost | Database server location | `database/config/database.php:L9` |
| **Port** | 3306 | MySQL default port | `database/config/database.php:L9` |
| **Database Name** | litigation_db | Primary database | `database/litigation_database.sql:L12-L16` |
| **Charset** | utf8mb4 | Full UTF-8 support for Arabic | `database/config/database.php:L13` |
| **Connection Pooling** | PDO with error handling | Database connection management | `database/config/database.php:L23-L28` |

### **Connection Management**

| Component | Implementation | Evidence |
|-----------|----------------|----------|
| **Connection Class** | Singleton pattern | `database/config/database.php:L16-L52` |
| **Error Handling** | PDO exceptions | `database/config/database.php:L29-L31` |
| **Connection Options** | PDO attributes for security | `database/config/database.php:L23-L28` |
| **Transaction Support** | Begin/Commit/Rollback | `database/config/database.php:L109-L125` |

## 🔧 **Database Client & ORM**

### **Database Abstraction Layer**

| Component | Technology | Role | Evidence |
|-----------|------------|------|----------|
| **Database Client** | PDO (PHP Data Objects) | Database abstraction | `database/config/database.php:L23` |
| **ORM Pattern** | Custom DatabaseHelper class | Query abstraction | `database/config/database.php:L55-L184` |
| **Query Builder** | Prepared statements | SQL injection prevention | `database/config/database.php:L67-L72` |

### **Database Helper Methods**

| Method | Purpose | Evidence |
|--------|---------|----------|
| `query()` | Execute query and return statement | `database/config/database.php:L67-L72` |
| `queryOne()` | Execute query and return single row | `database/config/database.php:L77-L80` |
| `queryAll()` | Execute query and return all rows | `database/config/database.php:L85-L88` |
| `insert()` | Execute insert and return last ID | `database/config/database.php:L93-L96` |
| `execute()` | Execute update/delete and return affected rows | `database/config/database.php:L101-L104` |
| `beginTransaction()` | Start database transaction | `database/config/database.php:L109-L111` |
| `commit()` | Commit database transaction | `database/config/database.php:L116-L118` |
| `rollback()` | Rollback database transaction | `database/config/database.php:L123-L125` |

## 📁 **Migration & Schema Management**

### **Migration Strategy**

| Component | Purpose | Evidence |
|-----------|---------|----------|
| **Schema File** | Complete database structure | `database/litigation_database.sql` |
| **Step-by-Step Migration** | Incremental schema updates | `database/migrations/step_by_step_migration.sql` |
| **Feature Migrations** | Specific feature additions | `database/migrations/add_missing_features.sql` |
| **Document Table Migration** | Document management schema | `database/migrations/create_documents_table.sql` |

### **Migration Files**

| File | Purpose | Evidence |
|------|---------|----------|
| `litigation_database.sql` | Complete database schema (566+ lines) | `database/litigation_database.sql` |
| `step_by_step_migration.sql` | Incremental migration steps | `database/migrations/step_by_step_migration.sql` |
| `add_missing_features.sql` | Additional feature migrations | `database/migrations/add_missing_features.sql` |
| `create_documents_table.sql` | Document management schema | `database/migrations/create_documents_table.sql` |
| `update_database_for_new_features.sql` | Feature updates | `database/migrations/update_database_for_new_features.sql` |

### **Seeding Strategy**

| Component | Purpose | Evidence |
|-----------|---------|----------|
| **Data Migration** | Access database to MySQL | `database/migrate_data.php` |
| **Simple Migration** | Basic data setup | `database/migrate_simple.php` |
| **Setup Scripts** | Database initialization | `database/setup.php`, `database/setup_simple.php` |

## 🔐 **Database Security**

### **Connection Security**

| Security Feature | Implementation | Evidence |
|------------------|----------------|----------|
| **Prepared Statements** | PDO prepared statements | `database/config/database.php:L23-L28` |
| **SQL Injection Prevention** | Parameterized queries | `database/config/database.php:L67-L72` |
| **Error Handling** | Secure error messages | `database/config/database.php:L29-L31` |
| **Connection Validation** | Connection testing | `database/config/database.php:L187-L192` |

### **Data Protection**

| Feature | Implementation | Evidence |
|---------|----------------|----------|
| **Password Hashing** | bcrypt with salt | `backend/config/config.php:L28` |
| **Session Management** | Secure session handling | `backend/config/config.php:L30-L32` |
| **Input Validation** | Server-side validation | `backend/src/Core/Validator.php` |
| **Output Encoding** | XSS prevention | `backend/src/Core/Response.php` |

## 📊 **Database Performance**

### **Indexing Strategy**

| Table | Indexes | Purpose | Evidence |
|-------|---------|---------|----------|
| **users** | username, email, role | Authentication and authorization | `database/litigation_database.sql:L35-L37` |
| **clients** | status, cash_pro_bono, contact_lawyer | Client filtering and lookup | `database/litigation_database.sql:L69-L71` |
| **cases** | client_id, matter_id, matter_status, matter_category | Case management and filtering | `database/litigation_database.sql:L140-L147` |
| **hearings** | case_id, hearing_date, hearing_type | Hearing scheduling and lookup | `database/litigation_database.sql:L200-L205` |

### **Query Optimization**

| Optimization | Implementation | Evidence |
|--------------|----------------|----------|
| **Foreign Key Constraints** | Referential integrity | `database/litigation_database.sql:L138-L139` |
| **Composite Indexes** | Multi-column queries | `database/litigation_database.sql:L140-L147` |
| **Query Caching** | Application-level caching | `backend/config/config.php:L52-L54` |
| **Connection Pooling** | PDO connection management | `database/config/database.php:L16-L52` |

## 🔄 **Backup & Recovery**

### **Backup Strategy**

| Component | Implementation | Evidence |
|-----------|----------------|----------|
| **Database Backup** | mysqldump command | `database/config/database.php:L148-L163` |
| **Backup Naming** | Timestamp-based naming | `database/config/database.php:L149-L151` |
| **Backup Location** | Configurable backup directory | `database/config/database.php:L148-L163` |
| **Backup Validation** | Return code checking | `database/config/database.php:L157-L162` |

### **Recovery Process**

| Component | Implementation | Evidence |
|-----------|----------------|----------|
| **Database Restore** | mysql command | `database/config/database.php:L168-L183` |
| **File Validation** | Backup file existence check | `database/config/database.php:L169-L171` |
| **Restore Validation** | Return code checking | `database/config/database.php:L176-L180` |
| **Error Handling** | Exception-based error handling | `database/config/database.php:L169-L171` |

## 🌐 **Environment Configuration**

### **Development Environment**

| Setting | Value | Purpose | Evidence |
|---------|-------|---------|----------|
| **Host** | localhost | Local development | `database/config.local.php` |
| **Database** | litigation_db | Development database | `database/config.local.php` |
| **Charset** | utf8mb4 | Arabic support | `database/config/database.php:L13` |
| **Debug Mode** | Enabled | Development debugging | `backend/config/config.php:L12` |

### **Production Environment**

| Setting | Value | Purpose | Evidence |
|---------|-------|---------|----------|
| **Host** | Production server | Live environment | `backend/config/config.production.php` |
| **Database** | Production database | Live data | `backend/config/config.production.php` |
| **Charset** | utf8mb4 | Arabic support | `database/config/database.php:L13` |
| **Debug Mode** | Disabled | Production security | `backend/config/config.php:L12` |

## 📈 **Data Volume & Statistics**

### **Current Data Volume**

| Entity | Count | Status | Evidence |
|--------|-------|--------|----------|
| **Clients** | 308 | Migrated from Access | `README.md:L91` |
| **Lawyers** | 38 | Active profiles | `README.md:L92` |
| **Cases** | 6,388+ | Legal matters | `README.md:L139` |
| **Hearings** | 20,000+ | Court proceedings | `README.md:L140` |
| **Invoices** | 540+ | Financial records | `README.md:L141` |
| **Users** | 1+ | System administrator | `README.md:L93` |

### **Database Growth Projections**

| Metric | Current | Projected | Notes |
|--------|---------|-----------|-------|
| **Total Records** | 27,000+ | 100,000+ | Business growth |
| **Database Size** | ~50MB | ~200MB | With documents |
| **Query Performance** | <2s | <2s | With optimization |
| **Concurrent Users** | 10+ | 50+ | Scalability target |

## 🔧 **Database Maintenance**

### **Regular Maintenance Tasks**

| Task | Frequency | Purpose | Evidence |
|------|-----------|---------|----------|
| **Backup** | Daily | Data protection | `database/config/database.php:L148-L163` |
| **Index Optimization** | Weekly | Query performance | `database/litigation_database.sql:L35-L147` |
| **Log Cleanup** | Monthly | Storage management | `backend/config/config.php:L57-L59` |
| **Schema Updates** | As needed | Feature additions | `database/migrations/` |

### **Monitoring & Health Checks**

| Component | Purpose | Evidence |
|-----------|---------|----------|
| **Connection Testing** | Database connectivity | `database/config/database.php:L187-L192` |
| **Query Logging** | Performance monitoring | `backend/config/config.php:L189` |
| **Error Logging** | Issue tracking | `backend/config/config.php:L57-L59` |
| **Health Endpoints** | System monitoring | `backend/api/ping.php` |

---

**Evidence Summary**: `database/config/database.php:L1-L194`, `database/litigation_database.sql:L1-L566`, `database/migrations/`, `backend/config/config.php:L16-L22`, `README.md:L91-L93`
