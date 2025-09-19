<?php
/**
 * Database Configuration and Connection
 * 
 * This file handles database connection and provides a PDO instance.
 */

class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET . " COLLATE " . DB_COLLATION,
                PDO::ATTR_PERSISTENT => true
            ];
            
            $this->connection = new PDO($dsn, DB_USER, DB_PASS, $options);
            
            // Set timezone for database connection
            $this->connection->exec("SET time_zone = '+03:00'");
            
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw new Exception("Database connection failed");
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public function query($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("Database query failed: " . $e->getMessage());
            throw new Exception("Database query failed");
        }
    }
    
    public function fetch($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetch();
    }
    
    public function fetchAll($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetchAll();
    }
    
    public function insert($table, $data) {
        $columns = implode(',', array_keys($data));
        $placeholders = ':' . implode(', :', array_keys($data));
        
        $sql = "INSERT INTO {$table} ({$columns}) VALUES ({$placeholders})";
        
        $stmt = $this->query($sql, $data);
        return $this->connection->lastInsertId();
    }
    
    public function update($table, $data, $where, $whereParams = []) {
        $setClause = [];
        foreach (array_keys($data) as $column) {
            $setClause[] = "{$column} = :{$column}";
        }
        $setClause = implode(', ', $setClause);
        
        $sql = "UPDATE {$table} SET {$setClause} WHERE {$where}";
        
        $params = array_merge($data, $whereParams);
        $stmt = $this->query($sql, $params);
        return $stmt->rowCount();
    }
    
    public function delete($table, $where, $params = []) {
        $sql = "DELETE FROM {$table} WHERE {$where}";
        $stmt = $this->query($sql, $params);
        return $stmt->rowCount();
    }
    
    public function beginTransaction() {
        return $this->connection->beginTransaction();
    }
    
    public function commit() {
        return $this->connection->commit();
    }
    
    public function rollback() {
        return $this->connection->rollback();
    }
    
    public function lastInsertId() {
        return $this->connection->lastInsertId();
    }
    
    public function rowCount($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->rowCount();
    }
    
    // Helper method to check if table exists
    public function tableExists($tableName) {
        $sql = "SHOW TABLES LIKE :table";
        $stmt = $this->query($sql, ['table' => $tableName]);
        return $stmt->rowCount() > 0;
    }
    
    // Helper method to get table structure
    public function getTableStructure($tableName) {
        $sql = "DESCRIBE {$tableName}";
        return $this->fetchAll($sql);
    }
    
    // Helper method to get table indexes
    public function getTableIndexes($tableName) {
        $sql = "SHOW INDEX FROM {$tableName}";
        return $this->fetchAll($sql);
    }
    
    // Helper method to execute raw SQL
    public function execute($sql) {
        return $this->connection->exec($sql);
    }
    
    // Helper method for pagination
    public function paginate($sql, $params = [], $page = 1, $limit = DEFAULT_PAGE_SIZE) {
        // Get total count
        $countSql = "SELECT COUNT(*) as total FROM ({$sql}) as count_query";
        $totalResult = $this->fetch($countSql, $params);
        $total = $totalResult['total'];
        
        // Calculate offset
        $offset = ($page - 1) * $limit;
        
        // Add LIMIT and OFFSET to original query
        $paginatedSql = $sql . " LIMIT {$limit} OFFSET {$offset}";
        $data = $this->fetchAll($paginatedSql, $params);
        
        // Calculate pagination info
        $totalPages = ceil($total / $limit);
        $hasNext = $page < $totalPages;
        $hasPrev = $page > 1;
        
        return [
            'data' => $data,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => $total,
                'total_pages' => $totalPages,
                'has_next' => $hasNext,
                'has_prev' => $hasPrev,
                'next_page' => $hasNext ? $page + 1 : null,
                'prev_page' => $hasPrev ? $page - 1 : null
            ]
        ];
    }
    
    // Helper method for search with Arabic support
    public function search($table, $columns, $searchTerm, $additionalWhere = '', $params = []) {
        $searchConditions = [];
        $searchParams = [];
        
        foreach ($columns as $column) {
            $searchConditions[] = "{$column} LIKE :search_{$column}";
            $searchParams["search_{$column}"] = "%{$searchTerm}%";
        }
        
        $whereClause = implode(' OR ', $searchConditions);
        if ($additionalWhere) {
            $whereClause = "({$whereClause}) AND ({$additionalWhere})";
        }
        
        $sql = "SELECT * FROM {$table} WHERE {$whereClause}";
        $allParams = array_merge($searchParams, $params);
        
        return $this->fetchAll($sql, $allParams);
    }
    
    // Helper method for Arabic text search with proper collation
    public function searchArabic($table, $columns, $searchTerm, $additionalWhere = '', $params = []) {
        $searchConditions = [];
        $searchParams = [];
        
        foreach ($columns as $column) {
            $searchConditions[] = "{$column} COLLATE utf8mb4_unicode_ci LIKE :search_{$column}";
            $searchParams["search_{$column}"] = "%{$searchTerm}%";
        }
        
        $whereClause = implode(' OR ', $searchConditions);
        if ($additionalWhere) {
            $whereClause = "({$whereClause}) AND ({$additionalWhere})";
        }
        
        $sql = "SELECT * FROM {$table} WHERE {$whereClause}";
        $allParams = array_merge($searchParams, $params);
        
        return $this->fetchAll($sql, $allParams);
    }
}

// Global database instance
function db() {
    return Database::getInstance();
}

// Helper function to get database connection
function getDB() {
    return Database::getInstance()->getConnection();
}

// Create global PDO instance for backward compatibility
$pdo = Database::getInstance()->getConnection();
