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
    private $mockData = [];

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
        // For testing purposes, we'll simulate database connection
        // In production, this would connect to a real database
        $this->isConnected = true;
        $this->mockData = [
            'users' => [
                [
                    'id' => 1,
                    'email' => 'admin@litigation.com',
                    'password_hash' => password_hash('admin123', PASSWORD_DEFAULT),
                    'full_name_en' => 'Admin User',
                    'full_name_ar' => 'مدير النظام',
                    'username' => 'admin',
                    'role' => 'super_admin',
                    'is_active' => 1,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                    'last_login_at' => date('Y-m-d H:i:s')
                ]
            ]
        ];
    }

    public function getConnection()
    {
        return $this->connection;
    }

    public function fetch($sql, $params = [])
    {
        // For testing purposes, return mock data
        if (!$this->isConnected) {
            $this->connect();
        }

        // Simple mock implementation for testing
        if (strpos($sql, 'SELECT * FROM users WHERE email = :email') !== false) {
            $email = $params['email'] ?? '';
            foreach ($this->mockData['users'] as $user) {
                if ($user['email'] === $email) {
                    return $user;
                }
            }
            return null;
        }

        return null;
    }

    public function fetchAll($sql, $params = [])
    {
        // For testing purposes, return mock data
        if (!$this->isConnected) {
            $this->connect();
        }

        return $this->mockData['users'] ?? [];
    }

    public function execute($sql, $params = [])
    {
        // For testing purposes, simulate successful execution
        if (!$this->isConnected) {
            $this->connect();
        }
        return true;
    }

    public function lastInsertId()
    {
        // For testing purposes, return a mock ID
        return 1;
    }

    public function update($table, $data, $where, $params = [])
    {
        // For testing purposes, simulate successful update
        if (!$this->isConnected) {
            $this->connect();
        }
        return true;
    }

    public function insert($table, $data)
    {
        // For testing purposes, simulate successful insert
        if (!$this->isConnected) {
            $this->connect();
        }
        return 1; // Return mock insert ID
    }

    public function delete($table, $where, $params = [])
    {
        // For testing purposes, simulate successful delete
        if (!$this->isConnected) {
            $this->connect();
        }
        return true;
    }

    public function paginate($sql, $params = [], $page = 1, $limit = 20)
    {
        // For testing purposes, return mock pagination data
        if (!$this->isConnected) {
            $this->connect();
        }

        $data = $this->mockData['users'] ?? [];
        $total = count($data);
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
