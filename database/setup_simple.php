<?php
/**
 * Simplified Database Setup Script
 * Creates database and tables without stored procedures/triggers
 */

echo "=== Litigation Management System - Simplified Database Setup ===\n\n";

// Load local configuration
$config = require_once 'config.local.php';
$host = $config['host'];
$username = $config['username'];
$password = $config['password'];
$database = $config['database'];

try {
    // Connect to MySQL server (without database)
    echo "1. Connecting to MySQL server...\n";
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    echo "   ✓ Connected successfully\n\n";
    
    // Create database if it doesn't exist
    echo "2. Creating database '$database'...\n";
    $pdo->exec("DROP DATABASE IF EXISTS `$database`");
    $pdo->exec("CREATE DATABASE `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "   ✓ Database created\n\n";
    
    // Select the database
    echo "3. Selecting database...\n";
    $pdo->exec("USE `$database`");
    echo "   ✓ Database selected\n\n";
    
    // Create tables one by one
    echo "4. Creating database tables...\n";
    
    // Users table
    $pdo->exec("
        CREATE TABLE users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name_ar VARCHAR(100) NOT NULL,
            full_name_en VARCHAR(100) NOT NULL,
            role ENUM('super_admin', 'admin', 'lawyer', 'staff') NOT NULL DEFAULT 'staff',
            is_active BOOLEAN DEFAULT TRUE,
            last_login TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "   ✓ Users table created\n";
    
    // User sessions table
    $pdo->exec("
        CREATE TABLE user_sessions (
            id VARCHAR(128) PRIMARY KEY,
            user_id INT NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "   ✓ User sessions table created\n";
    
    // Clients table
    $pdo->exec("
        CREATE TABLE clients (
            id INT PRIMARY KEY AUTO_INCREMENT,
            client_name_ar VARCHAR(200) NOT NULL,
            client_name_en VARCHAR(200),
            client_type ENUM('individual', 'company') DEFAULT 'company',
            cash_pro_bono ENUM('cash', 'probono') DEFAULT 'cash',
            status ENUM('active', 'disabled', 'inactive') DEFAULT 'active',
            logo VARCHAR(255),
            contact_lawyer VARCHAR(100),
            client_start_date DATE,
            client_end_date DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "   ✓ Clients table created\n";
    
    // Lawyers table
    $pdo->exec("
        CREATE TABLE lawyers (
            id INT PRIMARY KEY AUTO_INCREMENT,
            lawyer_name_ar VARCHAR(100) NOT NULL,
            lawyer_name_en VARCHAR(100),
            lawyer_email VARCHAR(100),
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "   ✓ Lawyers table created\n";
    
    // Work teams table
    $pdo->exec("
        CREATE TABLE work_teams (
            id INT PRIMARY KEY AUTO_INCREMENT,
            team_name_ar VARCHAR(200) NOT NULL,
            team_description TEXT,
            team_code VARCHAR(10),
            team_leader VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "   ✓ Work teams table created\n";
    
    // Cases table
    $pdo->exec("
        CREATE TABLE cases (
            id INT PRIMARY KEY AUTO_INCREMENT,
            client_id INT NOT NULL,
            matter_id VARCHAR(50) UNIQUE,
            matter_ar VARCHAR(500),
            matter_en VARCHAR(500),
            client_capacity VARCHAR(200),
            opponent_capacity VARCHAR(200),
            matter_subject TEXT,
            matter_status VARCHAR(100),
            matter_category VARCHAR(100),
            matter_degree VARCHAR(100),
            matter_importance VARCHAR(100),
            matter_start_date DATE,
            matter_end_date DATE,
            circuit_secretary VARCHAR(100),
            matter_asked_amount DECIMAL(15,2),
            matter_judged_amount DECIMAL(15,2),
            client_branch VARCHAR(100),
            matter_shelf VARCHAR(100),
            court_floor VARCHAR(100),
            court_hall VARCHAR(100),
            secretary_room VARCHAR(100),
            matter_court VARCHAR(200),
            matter_circuit VARCHAR(200),
            matter_destination VARCHAR(200),
            matter_select VARCHAR(100),
            matter_partner VARCHAR(100),
            matter_notes1 TEXT,
            matter_notes2 TEXT,
            lawyer_a VARCHAR(100),
            lawyer_b VARCHAR(100),
            matter_evaluation VARCHAR(100),
            financial_allocation VARCHAR(100),
            work_team_id INT,
            contract_id VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
            FOREIGN KEY (work_team_id) REFERENCES work_teams(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "   ✓ Cases table created\n";
    
    // Hearings table
    $pdo->exec("
        CREATE TABLE hearings (
            id INT PRIMARY KEY AUTO_INCREMENT,
            case_id INT NOT NULL,
            hearing_date DATE NOT NULL,
            hearing_decision TEXT,
            hearing_result ENUM('won', 'lost', 'postponed', 'pending') DEFAULT 'pending',
            last_decision TEXT,
            court_notes TEXT,
            lawyer_notes TEXT,
            expert_notes TEXT,
            hearing_duration VARCHAR(50),
            hearing_type VARCHAR(100),
            next_hearing DATE,
            short_decision TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "   ✓ Hearings table created\n";
    
    // Powers of Attorney table
    $pdo->exec("
        CREATE TABLE powers_of_attorney (
            id INT PRIMARY KEY AUTO_INCREMENT,
            client_id INT NOT NULL,
            serial_number VARCHAR(50),
            client_name VARCHAR(200),
            client_capacity VARCHAR(100),
            power_number VARCHAR(50),
            power_letter VARCHAR(10),
            power_year YEAR,
            issuing_authority VARCHAR(200),
            issue_date DATE,
            assigned_lawyers VARCHAR(300),
            number_of_copies INT DEFAULT 1,
            notes TEXT,
            location VARCHAR(200),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "   ✓ Powers of Attorney table created\n";
    
    // Documents table
    $pdo->exec("
        CREATE TABLE documents (
            id INT PRIMARY KEY AUTO_INCREMENT,
            client_id INT NOT NULL,
            document_serial VARCHAR(50),
            case_number VARCHAR(100),
            document_description TEXT,
            document_date DATE,
            number_of_pages INT,
            deposit_date DATE,
            responsible_lawyer VARCHAR(100),
            notes TEXT,
            location VARCHAR(200),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "   ✓ Documents table created\n";
    
    // Invoices table
    $pdo->exec("
        CREATE TABLE invoices (
            id INT PRIMARY KEY AUTO_INCREMENT,
            invoice_number VARCHAR(50) UNIQUE,
            contract_id VARCHAR(50),
            invoice_date DATE NOT NULL,
            amount DECIMAL(15,2) NOT NULL,
            currency ENUM('EGP', 'USD', 'EUR') DEFAULT 'EGP',
            usd_amount DECIMAL(15,2),
            invoice_details TEXT,
            invoice_status ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
            invoice_type ENUM('service', 'expenses', 'advance') DEFAULT 'service',
            has_vat BOOLEAN DEFAULT FALSE,
            payment_date DATE,
            report_generated BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "   ✓ Invoices table created\n";
    
    // Attendance table
    $pdo->exec("
        CREATE TABLE attendance (
            id INT PRIMARY KEY AUTO_INCREMENT,
            lawyer_name VARCHAR(100) NOT NULL,
            attendance_date DATE NOT NULL,
            attendance_situation TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "   ✓ Attendance table created\n";
    
    // Admin work table
    $pdo->exec("
        CREATE TABLE admin_work (
            id INT PRIMARY KEY AUTO_INCREMENT,
            lawyer_name VARCHAR(100) NOT NULL,
            work_date DATE NOT NULL,
            work_description TEXT,
            work_location VARCHAR(200),
            work_status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
            priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
            due_date DATE,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "   ✓ Admin work table created\n";
    
    // Contacts table
    $pdo->exec("
        CREATE TABLE contacts (
            id INT PRIMARY KEY AUTO_INCREMENT,
            full_name VARCHAR(200) NOT NULL,
            contact1 VARCHAR(100),
            email_address VARCHAR(200),
            job_title VARCHAR(200),
            business_phone VARCHAR(50),
            home_phone VARCHAR(50),
            mobile_phone VARCHAR(50),
            fax VARCHAR(50),
            address TEXT,
            city VARCHAR(100),
            country VARCHAR(100),
            postal_code VARCHAR(20),
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "   ✓ Contacts table created\n";
    
    // System settings table
    $pdo->exec("
        CREATE TABLE system_settings (
            id INT PRIMARY KEY AUTO_INCREMENT,
            setting_key VARCHAR(100) UNIQUE NOT NULL,
            setting_value TEXT,
            setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
            description TEXT,
            updated_by INT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "   ✓ System settings table created\n";
    
    echo "\n";
    
    // Insert default data
    echo "5. Inserting default data...\n";
    
    // Insert default admin user
    $adminPassword = password_hash('password', PASSWORD_DEFAULT);
    $pdo->exec("
        INSERT INTO users (username, email, password_hash, full_name_ar, full_name_en, role) VALUES
        ('admin', 'admin@litigation.com', '$adminPassword', 'مدير النظام', 'System Administrator', 'super_admin')
    ");
    echo "   ✓ Default admin user created\n";
    
    // Insert default system settings
    $pdo->exec("
        INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
        ('site_name_ar', 'نظام إدارة القضايا القانونية', 'string', 'اسم الموقع باللغة العربية'),
        ('site_name_en', 'Litigation Management System', 'string', 'اسم الموقع باللغة الإنجليزية'),
        ('default_language', 'ar', 'string', 'اللغة الافتراضية'),
        ('currency_default', 'EGP', 'string', 'العملة الافتراضية'),
        ('records_per_page', '25', 'number', 'عدد السجلات في كل صفحة'),
        ('backup_enabled', 'true', 'boolean', 'تفعيل النسخ الاحتياطي'),
        ('email_notifications', 'true', 'boolean', 'تفعيل الإشعارات بالبريد الإلكتروني')
    ");
    echo "   ✓ Default system settings created\n";
    
    echo "\n";
    
    // Create indexes for performance
    echo "6. Creating indexes...\n";
    $indexes = [
        "CREATE INDEX idx_username ON users(username)",
        "CREATE INDEX idx_email ON users(email)",
        "CREATE INDEX idx_role ON users(role)",
        "CREATE INDEX idx_client_status ON clients(status)",
        "CREATE INDEX idx_client_cash_pro_bono ON clients(cash_pro_bono)",
        "CREATE INDEX idx_case_client_id ON cases(client_id)",
        "CREATE INDEX idx_case_matter_id ON cases(matter_id)",
        "CREATE INDEX idx_case_status ON cases(matter_status)",
        "CREATE INDEX idx_case_court ON cases(matter_court)",
        "CREATE INDEX idx_hearing_case_id ON hearings(case_id)",
        "CREATE INDEX idx_hearing_date ON hearings(hearing_date)",
        "CREATE INDEX idx_invoice_number ON invoices(invoice_number)",
        "CREATE INDEX idx_invoice_status ON invoices(invoice_status)",
        "CREATE INDEX idx_attendance_lawyer ON attendance(lawyer_name)",
        "CREATE INDEX idx_attendance_date ON attendance(attendance_date)"
    ];
    
    foreach ($indexes as $index) {
        try {
            $pdo->exec($index);
        } catch (PDOException $e) {
            // Index might already exist, continue
        }
    }
    echo "   ✓ Indexes created\n";
    
    echo "\n";
    
    // Check if we should run data migration
    echo "7. Checking for data migration...\n";
    
    // Check if CSV files exist
    $csvDir = __DIR__ . '/../Original_Access_File/Tables/';
    if (!is_dir($csvDir)) {
        echo "   ⚠ Warning: CSV directory not found: $csvDir\n";
        echo "   Skipping data migration.\n";
    } else {
        echo "   CSV directory found. You can run data migration separately.\n";
        echo "   To migrate data, run: php migrate_data.php\n";
    }
    
    echo "\n";
    
    // Verify installation
    echo "8. Verifying installation...\n";
    
    // Check tables
    $tables = ['users', 'clients', 'lawyers', 'work_teams', 'cases', 'hearings', 'powers_of_attorney', 'documents', 'invoices', 'attendance', 'admin_work', 'contacts', 'system_settings'];
    
    $existingTables = [];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            $existingTables[] = $table;
        }
    }
    
    echo "   ✓ " . count($existingTables) . "/" . count($tables) . " tables created\n";
    
    // Check default admin user
    $stmt = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'super_admin'");
    $adminCount = $stmt->fetchColumn();
    echo "   ✓ $adminCount admin user(s) created\n";
    
    // Check system settings
    $stmt = $pdo->query("SELECT COUNT(*) FROM system_settings");
    $settingsCount = $stmt->fetchColumn();
    echo "   ✓ $settingsCount system settings configured\n";
    
    echo "\n";
    echo "=== SETUP COMPLETED SUCCESSFULLY ===\n";
    echo "\n";
    echo "Database Information:\n";
    echo "- Host: $host\n";
    echo "- Database: $database\n";
    echo "- Username: $username\n";
    echo "- Character Set: utf8mb4\n";
    echo "- Collation: utf8mb4_unicode_ci\n";
    echo "\n";
    echo "Default Admin Login:\n";
    echo "- Username: admin\n";
    echo "- Email: admin@litigation.com\n";
    echo "- Password: password\n";
    echo "\n";
    echo "Next Steps:\n";
    echo "1. Run: php test.php (to test the database)\n";
    echo "2. Run: php migrate_data.php (to import your CSV data)\n";
    echo "3. Update the password for the admin user\n";
    echo "4. Configure your application to use this database\n";
    echo "\n";
    
} catch (PDOException $e) {
    echo "❌ Database Error: " . $e->getMessage() . "\n";
    echo "\nTroubleshooting:\n";
    echo "1. Make sure MySQL is running\n";
    echo "2. Check your database credentials\n";
    echo "3. Ensure you have CREATE DATABASE privileges\n";
    exit(1);
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
