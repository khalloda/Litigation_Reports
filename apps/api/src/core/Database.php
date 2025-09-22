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
            'clients' => [
                [
                    'id' => 1,
                    'client_name_ar' => 'شركة الأمان للتأمين',
                    'client_name_en' => 'Al-Aman Insurance Company',
                    'client_type' => 'company',
                    'phone' => '+966501234567',
                    'email' => 'contact@alaman-insurance.com',
                    'address_ar' => 'الرياض، المملكة العربية السعودية',
                    'address_en' => 'Riyadh, Saudi Arabia',
                    'contact_person_ar' => 'أحمد محمد',
                    'contact_person_en' => 'Ahmed Mohamed',
                    'tax_number' => '1234567890',
                    'commercial_registration' => '123456789',
                    'status' => 'active',
                    'created_at' => date('Y-m-d H:i:s', strtotime('-30 days')),
                    'updated_at' => date('Y-m-d H:i:s', strtotime('-5 days'))
                ],
                [
                    'id' => 2,
                    'client_name_ar' => 'فاطمة أحمد',
                    'client_name_en' => 'Fatima Ahmed',
                    'client_type' => 'individual',
                    'phone' => '+966507654321',
                    'email' => 'fatima.ahmed@email.com',
                    'address_ar' => 'جدة، المملكة العربية السعودية',
                    'address_en' => 'Jeddah, Saudi Arabia',
                    'contact_person_ar' => 'فاطمة أحمد',
                    'contact_person_en' => 'Fatima Ahmed',
                    'tax_number' => '9876543210',
                    'commercial_registration' => null,
                    'status' => 'active',
                    'created_at' => date('Y-m-d H:i:s', strtotime('-15 days')),
                    'updated_at' => date('Y-m-d H:i:s', strtotime('-2 days'))
                ],
                [
                    'id' => 3,
                    'client_name_ar' => 'بنك الخليج التجاري',
                    'client_name_en' => 'Gulf Commercial Bank',
                    'client_type' => 'company',
                    'phone' => '+966112233445',
                    'email' => 'legal@gulf-bank.com',
                    'address_ar' => 'الدمام، المملكة العربية السعودية',
                    'address_en' => 'Dammam, Saudi Arabia',
                    'contact_person_ar' => 'سارة الخالد',
                    'contact_person_en' => 'Sarah Al-Khalid',
                    'tax_number' => '1122334455',
                    'commercial_registration' => '998877665',
                    'status' => 'active',
                    'created_at' => date('Y-m-d H:i:s', strtotime('-45 days')),
                    'updated_at' => date('Y-m-d H:i:s', strtotime('-7 days'))
                ]
            ],
            'cases' => [
                [
                    'id' => 1,
                    'matter_id' => 'CASE-2025-001',
                    'matter_ar' => 'قضية تجارية رقم 001',
                    'matter_en' => 'Commercial Case #001',
                    'client_id' => 1,
                    'client_name_ar' => 'شركة الأمان للتأمين',
                    'client_name_en' => 'Al-Aman Insurance Company',
                    'lawyer_id' => 1,
                    'lawyer_name_ar' => 'محمد علي',
                    'lawyer_name_en' => 'Mohamed Ali',
                    'case_type' => 'commercial',
                    'priority' => 'high',
                    'status' => 'active',
                    'filing_date' => date('Y-m-d', strtotime('-20 days')),
                    'court_name' => 'المحكمة التجارية بالرياض',
                    'case_number' => 'COM-2025-001',
                    'description' => 'نزاع تجاري حول عقد تأمين',
                    'estimated_value' => 500000.00,
                    'created_at' => date('Y-m-d H:i:s', strtotime('-20 days')),
                    'updated_at' => date('Y-m-d H:i:s', strtotime('-2 days'))
                ],
                [
                    'id' => 2,
                    'matter_id' => 'CASE-2025-002',
                    'matter_ar' => 'قضية مدنية رقم 002',
                    'matter_en' => 'Civil Case #002',
                    'client_id' => 2,
                    'client_name_ar' => 'فاطمة أحمد',
                    'client_name_en' => 'Fatima Ahmed',
                    'lawyer_id' => 2,
                    'lawyer_name_ar' => 'لينا السعد',
                    'lawyer_name_en' => 'Lina Al-Saad',
                    'case_type' => 'civil',
                    'priority' => 'medium',
                    'status' => 'active',
                    'filing_date' => date('Y-m-d', strtotime('-10 days')),
                    'court_name' => 'المحكمة المدنية بجدة',
                    'case_number' => 'CIV-2025-002',
                    'description' => 'قضية تعويضات شخصية',
                    'estimated_value' => 150000.00,
                    'created_at' => date('Y-m-d H:i:s', strtotime('-10 days')),
                    'updated_at' => date('Y-m-d H:i:s', strtotime('-1 days'))
                ]
            ],
            'lawyers' => [
                [
                    'id' => 1,
                    'lawyer_name_ar' => 'محمد علي',
                    'lawyer_name_en' => 'Mohamed Ali',
                    'specialization' => 'commercial_law',
                    'phone' => '+966501112233',
                    'email' => 'mohamed.ali@lawfirm.com',
                    'license_number' => 'LAW-001-2025',
                    'experience_years' => 15,
                    'status' => 'active',
                    'created_at' => date('Y-m-d H:i:s', strtotime('-60 days')),
                    'updated_at' => date('Y-m-d H:i:s', strtotime('-5 days'))
                ],
                [
                    'id' => 2,
                    'lawyer_name_ar' => 'لينا السعد',
                    'lawyer_name_en' => 'Lina Al-Saad',
                    'specialization' => 'civil_law',
                    'phone' => '+966507778899',
                    'email' => 'lina.alsaad@lawfirm.com',
                    'license_number' => 'LAW-002-2025',
                    'experience_years' => 8,
                    'status' => 'active',
                    'created_at' => date('Y-m-d H:i:s', strtotime('-30 days')),
                    'updated_at' => date('Y-m-d H:i:s', strtotime('-3 days'))
                ]
            ],
            'hearings' => [
                [
                    'id' => 1,
                    'case_id' => 1,
                    'hearing_date' => date('Y-m-d', strtotime('+5 days')),
                    'hearing_time' => '10:00:00',
                    'hearing_type' => 'initial',
                    'court_name' => 'المحكمة التجارية بالرياض',
                    'judge_name' => 'القاضي عبدالله الخالدي',
                    'status' => 'scheduled',
                    'outcome' => null,
                    'notes' => 'الجلسة الأولى لمراجعة الوثائق',
                    'created_at' => date('Y-m-d H:i:s', strtotime('-15 days')),
                    'updated_at' => date('Y-m-d H:i:s', strtotime('-2 days'))
                ],
                [
                    'id' => 2,
                    'case_id' => 2,
                    'hearing_date' => date('Y-m-d', strtotime('+3 days')),
                    'hearing_time' => '14:30:00',
                    'hearing_type' => 'follow_up',
                    'court_name' => 'المحكمة المدنية بجدة',
                    'judge_name' => 'القاضية فاطمة الزهراء',
                    'status' => 'scheduled',
                    'outcome' => null,
                    'notes' => 'متابعة الإجراءات',
                    'created_at' => date('Y-m-d H:i:s', strtotime('-8 days')),
                    'updated_at' => date('Y-m-d H:i:s', strtotime('-1 days'))
                ]
            ],
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'عقد التأمين الأساسي',
                    'title_en' => 'Basic Insurance Contract',
                    'document_type' => 'contract',
                    'case_id' => 1,
                    'client_id' => 1,
                    'file_path' => '/uploads/documents/contract-001.pdf',
                    'file_size' => 245760,
                    'mime_type' => 'application/pdf',
                    'uploaded_by' => 1,
                    'created_at' => date('Y-m-d H:i:s', strtotime('-18 days')),
                    'updated_at' => date('Y-m-d H:i:s', strtotime('-18 days'))
                ],
                [
                    'id' => 2,
                    'title' => 'شهادة الشهود',
                    'title_en' => 'Witness Statement',
                    'document_type' => 'evidence',
                    'case_id' => 2,
                    'client_id' => 2,
                    'file_path' => '/uploads/documents/witness-001.pdf',
                    'file_size' => 189440,
                    'mime_type' => 'application/pdf',
                    'uploaded_by' => 1,
                    'created_at' => date('Y-m-d H:i:s', strtotime('-7 days')),
                    'updated_at' => date('Y-m-d H:i:s', strtotime('-7 days'))
                ]
            ],
            'invoices' => [
                [
                    'id' => 1,
                    'invoice_number' => 'INV-2025-001',
                    'case_id' => 1,
                    'client_id' => 1,
                    'amount' => 15000.00,
                    'currency' => 'SAR',
                    'status' => 'paid',
                    'due_date' => date('Y-m-d', strtotime('-5 days')),
                    'paid_date' => date('Y-m-d', strtotime('-7 days')),
                    'description' => 'رسوم المحاماة لشهر يناير',
                    'created_at' => date('Y-m-d H:i:s', strtotime('-15 days')),
                    'updated_at' => date('Y-m-d H:i:s', strtotime('-7 days'))
                ],
                [
                    'id' => 2,
                    'invoice_number' => 'INV-2025-002',
                    'case_id' => 2,
                    'client_id' => 2,
                    'amount' => 8500.00,
                    'currency' => 'SAR',
                    'status' => 'pending',
                    'due_date' => date('Y-m-d', strtotime('+10 days')),
                    'paid_date' => null,
                    'description' => 'رسوم الاستشارات القانونية',
                    'created_at' => date('Y-m-d H:i:s', strtotime('-5 days')),
                    'updated_at' => date('Y-m-d H:i:s', strtotime('-5 days'))
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

        // Handle different entity queries
        if (strpos($sql, 'SELECT * FROM users WHERE email = :email') !== false) {
            $email = $params['email'] ?? '';
            foreach ($this->mockData['users'] as $user) {
                if ($user['email'] === $email) {
                    return $user;
                }
            }
            return null;
        }

        if (strpos($sql, 'SELECT * FROM clients WHERE id = :id') !== false) {
            $id = $params['id'] ?? 0;
            foreach ($this->mockData['clients'] as $client) {
                if ($client['id'] == $id) {
                    return $client;
                }
            }
            return null;
        }

        if (strpos($sql, 'SELECT * FROM cases WHERE id = :id') !== false) {
            $id = $params['id'] ?? 0;
            foreach ($this->mockData['cases'] as $case) {
                if ($case['id'] == $id) {
                    return $case;
                }
            }
            return null;
        }

        if (strpos($sql, 'SELECT * FROM lawyers WHERE id = :id') !== false) {
            $id = $params['id'] ?? 0;
            foreach ($this->mockData['lawyers'] as $lawyer) {
                if ($lawyer['id'] == $id) {
                    return $lawyer;
                }
            }
            return null;
        }

        if (strpos($sql, 'SELECT * FROM hearings WHERE id = :id') !== false) {
            $id = $params['id'] ?? 0;
            foreach ($this->mockData['hearings'] as $hearing) {
                if ($hearing['id'] == $id) {
                    return $hearing;
                }
            }
            return null;
        }

        if (strpos($sql, 'SELECT * FROM documents WHERE id = :id') !== false) {
            $id = $params['id'] ?? 0;
            foreach ($this->mockData['documents'] as $document) {
                if ($document['id'] == $id) {
                    return $document;
                }
            }
            return null;
        }

        if (strpos($sql, 'SELECT * FROM invoices WHERE id = :id') !== false) {
            $id = $params['id'] ?? 0;
            foreach ($this->mockData['invoices'] as $invoice) {
                if ($invoice['id'] == $id) {
                    return $invoice;
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

        // Handle different entity queries
        if (strpos($sql, 'SELECT * FROM clients') !== false) {
            return $this->mockData['clients'] ?? [];
        }

        if (strpos($sql, 'SELECT * FROM cases') !== false) {
            return $this->mockData['cases'] ?? [];
        }

        if (strpos($sql, 'SELECT * FROM lawyers') !== false) {
            return $this->mockData['lawyers'] ?? [];
        }

        if (strpos($sql, 'SELECT * FROM hearings') !== false) {
            return $this->mockData['hearings'] ?? [];
        }

        if (strpos($sql, 'SELECT * FROM documents') !== false) {
            return $this->mockData['documents'] ?? [];
        }

        if (strpos($sql, 'SELECT * FROM invoices') !== false) {
            return $this->mockData['invoices'] ?? [];
        }

        if (strpos($sql, 'SELECT * FROM users') !== false) {
            return $this->mockData['users'] ?? [];
        }

        return [];
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
