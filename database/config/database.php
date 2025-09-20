<?php
/**
 * Database Configuration
 * Litigation Management System
 */

// Load local configuration
$localConfig = require_once __DIR__ . '/../config.local.php';
define('DB_HOST', $localConfig['host']);
define('DB_NAME', $localConfig['database']);
define('DB_USER', $localConfig['username']);
define('DB_PASS', $localConfig['password']);
define('DB_CHARSET', 'utf8mb4');

// Database connection class
class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $this->connection = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET
            ]);
        } catch (PDOException $e) {
            throw new Exception("Database connection failed: " . $e->getMessage());
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
    
    public function __clone() {
        throw new Exception("Cannot clone a singleton.");
    }
    
    public function __wakeup() {
        throw new Exception("Cannot unserialize a singleton.");
    }
}

// Helper functions for database operations
class DatabaseHelper {
    
    /**
     * Get database connection
     */
    public static function getConnection() {
        return Database::getInstance()->getConnection();
    }
    
    /**
     * Execute a query and return results
     */
    public static function query($sql, $params = []) {
        $pdo = self::getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }
    
    /**
     * Execute a query and return single row
     */
    public static function queryOne($sql, $params = []) {
        $stmt = self::query($sql, $params);
        return $stmt->fetch();
    }
    
    /**
     * Execute a query and return all rows
     */
    public static function queryAll($sql, $params = []) {
        $stmt = self::query($sql, $params);
        return $stmt->fetchAll();
    }
    
    /**
     * Execute an insert and return the last insert ID
     */
    public static function insert($sql, $params = []) {
        $stmt = self::query($sql, $params);
        return self::getConnection()->lastInsertId();
    }
    
    /**
     * Execute an update/delete and return affected rows
     */
    public static function execute($sql, $params = []) {
        $stmt = self::query($sql, $params);
        return $stmt->rowCount();
    }
    
    /**
     * Begin transaction
     */
    public static function beginTransaction() {
        return self::getConnection()->beginTransaction();
    }
    
    /**
     * Commit transaction
     */
    public static function commit() {
        return self::getConnection()->commit();
    }
    
    /**
     * Rollback transaction
     */
    public static function rollback() {
        return self::getConnection()->rollback();
    }
    
    /**
     * Check if table exists
     */
    public static function tableExists($tableName) {
        $sql = "SELECT COUNT(*) FROM information_schema.tables 
                WHERE table_schema = ? AND table_name = ?";
        $result = self::queryOne($sql, [DB_NAME, $tableName]);
        return $result['COUNT(*)'] > 0;
    }
    
    /**
     * Get table structure
     */
    public static function getTableStructure($tableName) {
        $sql = "DESCRIBE " . $tableName;
        return self::queryAll($sql);
    }
    
    /**
     * Backup database to SQL file
     */
    public static function backup($filename = null) {
        if ($filename === null) {
            $filename = 'backup_' . date('Y-m-d_H-i-s') . '.sql';
        }
        
        $command = "mysqldump -h " . DB_HOST . " -u " . DB_USER . 
                  (DB_PASS ? " -p" . DB_PASS : "") . " " . DB_NAME . " > " . $filename;
        
        exec($command, $output, $returnCode);
        
        if ($returnCode === 0) {
            return $filename;
        } else {
            throw new Exception("Database backup failed");
        }
    }
    
    /**
     * Restore database from SQL file
     */
    public static function restore($filename) {
        if (!file_exists($filename)) {
            throw new Exception("Backup file not found: " . $filename);
        }
        
        $command = "mysql -h " . DB_HOST . " -u " . DB_USER . 
                  (DB_PASS ? " -p" . DB_PASS : "") . " " . DB_NAME . " < " . $filename;
        
        exec($command, $output, $returnCode);
        
        if ($returnCode !== 0) {
            throw new Exception("Database restore failed");
        }
        
        return true;
    }
}

// Test database connection
try {
    $db = Database::getInstance();
    echo "Database connection successful!\n";
} catch (Exception $e) {
    echo "Database connection failed: " . $e->getMessage() . "\n";
}
?>
