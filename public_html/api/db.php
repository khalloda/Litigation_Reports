<?php
/**
 * Database Connection for Production
 * Uses MySQLi for better performance and security
 */

require_once __DIR__ . '/_bootstrap.php';

class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        $this->connect();
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function connect() {
        // Database configuration
        $host = '127.0.0.1';
        $dbname = 'litigation_db';
        $username = 'root';
        $password = '1234';
        $charset = 'utf8mb4';
        
        // For production (cPanel), these would be different
        if (isset($_ENV['DB_HOST'])) {
            $host = $_ENV['DB_HOST'];
            $dbname = $_ENV['DB_NAME'];
            $username = $_ENV['DB_USER'];
            $password = $_ENV['DB_PASS'];
        }
        
        $dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
        
        try {
            $this->connection = new PDO($dsn, $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
            ]);
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Database connection failed'
            ]);
            exit();
        }
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public function fetch($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetch();
        } catch (PDOException $e) {
            error_log("Database query failed: " . $e->getMessage());
            throw new Exception("Database query failed");
        }
    }
    
    public function fetchAll($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Database query failed: " . $e->getMessage());
            throw new Exception("Database query failed");
        }
    }
    
    public function execute($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            return $stmt->execute($params);
        } catch (PDOException $e) {
            error_log("Database query failed: " . $e->getMessage());
            throw new Exception("Database query failed");
        }
    }
    
    public function lastInsertId() {
        return $this->connection->lastInsertId();
    }
    
    public function paginate($sql, $params = [], $page = 1, $limit = 20) {
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
}
?>
