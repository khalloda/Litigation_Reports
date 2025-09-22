<?php

/**
 * Database Connection for Production
 * Uses MySQLi for better performance and security
 */

class Database
{
    private static $instance = null;
    private $connection;
    private $isConnected = false;

    // Database configuration
    const DB_HOST = 'localhost';
    const DB_NAME = 'litigation_db';
    const DB_USER = 'root';
    const DB_PASS = '1234';
    const DB_CHARSET = 'utf8mb4';

    private function __construct()
    {
        $this->connect();
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function connect()
    {
        try {
            // Create MySQLi connection
            $this->connection = new mysqli(
                self::DB_HOST,
                self::DB_USER,
                self::DB_PASS,
                self::DB_NAME
            );

            // Check connection
            if ($this->connection->connect_error) {
                throw new Exception("Connection failed: " . $this->connection->connect_error);
            }

            // Set charset
            $this->connection->set_charset(self::DB_CHARSET);

            $this->isConnected = true;

            error_log("Database connected successfully to " . self::DB_NAME);

        } catch (Exception $e) {
            error_log("Database connection error: " . $e->getMessage());
            $this->isConnected = false;
            throw $e;
        }
    }

    public function getConnection()
    {
        if (!$this->isConnected) {
            $this->connect();
        }
        return $this->connection;
    }

    public function isConnected()
    {
        return $this->isConnected;
    }

    // Check if we're using real database or mock
    public function isRealDatabase()
    {
        return $this->isConnected && $this->connection !== null;
    }

    /**
     * Execute a SELECT query
     * @param string $sql SQL query
     * @param array $params Parameters for prepared statement
     * @return mysqli_result|bool
     */
    public function query($sql, $params = [])
    {
        if (!$this->isConnected) {
            $this->connect();
        }

        $stmt = $this->connection->prepare($sql);

        if ($stmt === false) {
            error_log("Query preparation failed: " . $this->connection->error);
            return false;
        }

        // Bind parameters if provided
        if (!empty($params)) {
            $types = '';
            $bindParams = [];

            foreach ($params as $param) {
                if (is_int($param)) {
                    $types .= 'i';
                } elseif (is_float($param)) {
                    $types .= 'd';
                } elseif (is_string($param)) {
                    $types .= 's';
                } else {
                    $types .= 's'; // Default to string
                }
                $bindParams[] = $param;
            }

            if (!empty($bindParams)) {
                $stmt->bind_param($types, ...$bindParams);
            }
        }

        if (!$stmt->execute()) {
            error_log("Query execution failed: " . $stmt->error);
            return false;
        }

        return $stmt->get_result();
    }

    /**
     * Fetch a single row
     * @param string $sql SQL query
     * @param array $params Parameters
     * @return array|null
     */
    public function fetch($sql, $params = [])
    {
        $result = $this->query($sql, $params);
        if ($result && $result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        return null;
    }

    /**
     * Fetch all rows
     * @param string $sql SQL query
     * @param array $params Parameters
     * @return array
     */
    public function fetchAll($sql, $params = [])
    {
        $result = $this->query($sql, $params);
        if ($result) {
            return $result->fetch_all(MYSQLI_ASSOC);
        }
        return [];
    }

    /**
     * Execute INSERT, UPDATE, DELETE queries
     * @param string $sql SQL query
     * @param array $params Parameters
     * @return bool
     */
    public function execute($sql, $params = [])
    {
        if (!$this->isConnected) {
            $this->connect();
        }

        $stmt = $this->connection->prepare($sql);

        if ($stmt === false) {
            error_log("Statement preparation failed: " . $this->connection->error);
            return false;
        }

        // Bind parameters if provided
        if (!empty($params)) {
            $types = '';
            $bindParams = [];

            foreach ($params as $param) {
                if (is_int($param)) {
                    $types .= 'i';
                } elseif (is_float($param)) {
                    $types .= 'd';
                } elseif (is_string($param)) {
                    $types .= 's';
                } else {
                    $types .= 's';
                }
                $bindParams[] = $param;
            }

            if (!empty($bindParams)) {
                $stmt->bind_param($types, ...$bindParams);
            }
        }

        $success = $stmt->execute();

        if (!$success) {
            error_log("Statement execution failed: " . $stmt->error);
        }

        return $success;
    }

    /**
     * Get last inserted ID
     * @return int
     */
    public function lastInsertId()
    {
        return $this->connection->insert_id;
    }

    /**
     * Escape string for safe SQL usage
     * @param string $string
     * @return string
     */
    public function escape($string)
    {
        return $this->connection->real_escape_string($string);
    }

    /**
     * Get affected rows count
     * @return int
     */
    public function affectedRows()
    {
        return $this->connection->affected_rows;
    }

    /**
     * Begin transaction
     */
    public function beginTransaction()
    {
        $this->connection->begin_transaction();
    }

    /**
     * Commit transaction
     */
    public function commit()
    {
        $this->connection->commit();
    }

    /**
     * Rollback transaction
     */
    public function rollback()
    {
        $this->connection->rollback();
    }

    /**
     * Close connection
     */
    public function close()
    {
        if ($this->connection) {
            $this->connection->close();
            $this->isConnected = false;
        }
    }
}
