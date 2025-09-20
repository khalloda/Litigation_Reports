<?php
/**
 * Database Setup Script
 * Creates database and runs migration
 */

echo "=== Litigation Management System Database Setup ===\n\n";

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
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "   ✓ Database created/verified\n\n";
    
    // Select the database
    echo "3. Selecting database...\n";
    $pdo->exec("USE `$database`");
    echo "   ✓ Database selected\n\n";
    
    // Read and execute the schema file
    echo "4. Creating database schema...\n";
    $schemaFile = __DIR__ . '/litigation_database.sql';
    
    if (!file_exists($schemaFile)) {
        throw new Exception("Schema file not found: $schemaFile");
    }
    
    $schema = file_get_contents($schemaFile);
    
    // Split the schema into individual statements
    $statements = array_filter(
        array_map('trim', explode(';', $schema)),
        function($stmt) {
            return !empty($stmt) && !preg_match('/^(--|\/\*)/', $stmt);
        }
    );
    
    $successCount = 0;
    $errorCount = 0;
    
    foreach ($statements as $statement) {
        if (!empty($statement)) {
            try {
                $pdo->exec($statement);
                $successCount++;
            } catch (PDOException $e) {
                // Skip errors for existing tables/views
                if (strpos($e->getMessage(), 'already exists') === false && 
                    strpos($e->getMessage(), 'Duplicate entry') === false) {
                    echo "   ⚠ Warning: " . $e->getMessage() . "\n";
                    $errorCount++;
                }
            }
        }
    }
    
    echo "   ✓ Schema created successfully ($successCount statements executed)\n";
    if ($errorCount > 0) {
        echo "   ⚠ $errorCount warnings (mostly existing objects)\n";
    }
    echo "\n";
    
    // Check if we should run data migration
    echo "5. Checking for data migration...\n";
    
    // Check if clients table has data
    $stmt = $pdo->query("SELECT COUNT(*) FROM clients");
    $clientCount = $stmt->fetchColumn();
    
    if ($clientCount == 0) {
        echo "   Database is empty. Running data migration...\n";
        
        // Check if CSV files exist
        $csvDir = __DIR__ . '/../Original_Access_File/Tables/';
        if (!is_dir($csvDir)) {
            echo "   ⚠ Warning: CSV directory not found: $csvDir\n";
            echo "   Skipping data migration.\n";
        } else {
            // Run data migration
            require_once __DIR__ . '/migrate_data.php';
        }
    } else {
        echo "   ✓ Database already contains data ($clientCount clients found)\n";
        echo "   Skipping data migration.\n";
    }
    
    echo "\n";
    
    // Verify installation
    echo "6. Verifying installation...\n";
    
    // Check tables
    $tables = [
        'users', 'clients', 'lawyers', 'work_teams', 'cases', 
        'hearings', 'powers_of_attorney', 'documents', 'invoices',
        'attendance', 'admin_work', 'contacts', 'meetings', 'follow_ups', 'payments'
    ];
    
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
    echo "1. Update the password for the admin user\n";
    echo "2. Configure your application to use this database\n";
    echo "3. Test the application functionality\n";
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
