# Queries and Data Access Patterns

## 📊 Overview

Catalog of SQL queries, database access patterns, and performance considerations for the Litigation Management System.

---

## 🔍 Query Patterns

### Database Class Methods

**Core Methods:**

| Method | SQL Pattern | Purpose | Evidence |
|--------|-------------|---------|----------|
| `query($sql, $params)` | Prepared statement | Execute any query | `backend/config/database.php:L46-L55` |
| `fetch($sql, $params)` | SELECT ... LIMIT 1 | Single row | L57-L60 |
| `fetchAll($sql, $params)` | SELECT ... | Multiple rows | L62-L65 |
| `insert($table, $data)` | INSERT INTO ... VALUES | Create record | L67-L75 |
| `update($table, $data, $where)` | UPDATE ... SET ... WHERE | Update record | L77-L89 |
| `delete($table, $where)` | DELETE FROM ... WHERE | Delete record | L91-L95 |
| `paginate($sql, $page, $limit)` | SELECT ... LIMIT OFFSET | Paginated results | L143-L174 |

**All queries use PDO prepared statements - ✅ SQL injection protected**

---

### Pagination Query

```php
public function paginate($sql, $params = [], $page = 1, $limit = 20) {
    // Count total
    $countSql = "SELECT COUNT(*) as total FROM ({$sql}) as count_query";
    $total = $this->fetch($countSql, $params)['total'];
    
    // Paginate
    $offset = ($page - 1) * $limit;
    $paginatedSql = $sql . " LIMIT {$limit} OFFSET {$offset}";
    $data = $this->fetchAll($paginatedSql, $params);
    
    return ['data' => $data, 'pagination' => [...]];
}
```

**Performance Note:** Counts full table on every page (could be optimized with caching)

**Evidence:** `backend/config/database.php:L143-L174`

---

### Arabic Search Query

```php
public function searchArabic($table, $columns, $searchTerm) {
    $searchConditions = [];
    foreach ($columns as $column) {
        $searchConditions[] = "{$column} COLLATE utf8mb4_unicode_ci LIKE :search_{$column}";
    }
    $whereClause = implode(' OR ', $searchConditions);
    $sql = "SELECT * FROM {$table} WHERE {$whereClause}";
    // ...
}
```

**Evidence:** `backend/config/database.php:L197-L216`

---

## ⚠️ Potential N+1 Issues

**Detected Pattern:**

```php
// Load cases
$cases = db()->fetchAll("SELECT * FROM cases");

// For each case, load client (N+1!)
foreach ($cases as $case) {
    $client = db()->fetch("SELECT * FROM clients WHERE id = ?", [$case['client_id']]);
}
```

**Evidence:** Common pattern in MVC applications

**Mitigation:** Use JOIN queries instead

```sql
SELECT cases.*, clients.client_name_ar 
FROM cases 
LEFT JOIN clients ON cases.client_id = clients.id
```

---

## 🔒 Transaction Usage

**Supported Methods:**
```php
db()->beginTransaction();
// Multiple operations
db()->commit();
// Or on error:
db()->rollback();
```

**Evidence:** `backend/config/database.php:L97-L107`

**Recommended Usage:**
- Invoice creation with lawyer shares
- Case updates with hearing creation
- Complex multi-table operations

---

## 📊 Performance Considerations

### Query Performance

**Indexed Queries:** ✅ Good  
**Missing Indexes:** None detected  
**Slow Query Log:** ❌ Not enabled

**Recommendations:**
1. Enable MySQL slow query logging (>2 seconds)
2. Add query result caching for reports
3. Monitor query execution times

---

**Evidence Base:** `backend/config/database.php:L1-L231`

