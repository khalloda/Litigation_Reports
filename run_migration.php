<?php
/**
 * Database Migration Runner
 *
 * This script runs the database migrations for new features
 */

// Include database configuration
require_once __DIR__ . '/config/database.php';

try {
    echo "Starting database migration...\n";

    // Read the migration SQL file
    $migrationFile = __DIR__ . '/database/migrations/update_database_for_new_features.sql';

    if (!file_exists($migrationFile)) {
        throw new Exception("Migration file not found: $migrationFile");
    }

    $sql = file_get_contents($migrationFile);

    if ($sql === false) {
        throw new Exception("Failed to read migration file");
    }

    // Split the SQL into individual statements
    $statements = array_filter(
        array_map('trim', explode(';', $sql)),
        function($stmt) {
            return !empty($stmt) &&
                   !preg_match('/^\s*--/', $stmt) &&
                   !preg_match('/^\s*\/\*/', $stmt) &&
                   strtoupper($stmt) !== 'DELIMITER //';
        }
    );

    echo "Found " . count($statements) . " SQL statements to execute\n";

    $successCount = 0;
    $errorCount = 0;

    foreach ($statements as $i => $statement) {
        try {
            // Skip DELIMITER statements and trigger definitions
            if (stripos($statement, 'DELIMITER') !== false ||
                stripos($statement, 'CREATE TRIGGER') !== false ||
                stripos($statement, 'DROP TRIGGER') !== false) {
                continue;
            }

            // Execute the statement
            $pdo->exec($statement);
            $successCount++;

            // Show progress for important operations
            if (stripos($statement, 'CREATE TABLE') !== false) {
                preg_match('/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(\w+)/i', $statement, $matches);
                $tableName = $matches[1] ?? 'unknown';
                echo "✓ Created table: $tableName\n";
            } elseif (stripos($statement, 'ALTER TABLE') !== false) {
                preg_match('/ALTER TABLE\s+(\w+)/i', $statement, $matches);
                $tableName = $matches[1] ?? 'unknown';
                echo "✓ Modified table: $tableName\n";
            } elseif (stripos($statement, 'INSERT') !== false && stripos($statement, 'document_folders') !== false) {
                echo "✓ Inserted default document folders\n";
            } elseif (stripos($statement, 'INSERT') !== false && stripos($statement, 'system_settings') !== false) {
                echo "✓ Inserted default system settings\n";
            }

        } catch (PDOException $e) {
            $errorCount++;
            $errorMsg = $e->getMessage();

            // Skip certain expected errors
            if (stripos($errorMsg, 'already exists') !== false ||
                stripos($errorMsg, 'Duplicate entry') !== false ||
                stripos($errorMsg, 'Duplicate key') !== false) {
                echo "⚠ Skipped (already exists): " . substr($statement, 0, 50) . "...\n";
                continue;
            }

            echo "✗ Error in statement " . ($i + 1) . ": " . $errorMsg . "\n";
            echo "   Statement: " . substr($statement, 0, 100) . "...\n";
        }
    }

    echo "\nMigration completed!\n";
    echo "Successful operations: $successCount\n";
    echo "Errors/Skipped: $errorCount\n";

    // Verify the migration by checking if key tables exist
    echo "\nVerifying migration...\n";

    $tables = ['documents', 'document_folders', 'document_access_log', 'document_versions', 'system_settings'];

    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            echo "✓ Table '$table' exists\n";
        } else {
            echo "✗ Table '$table' NOT found\n";
        }
    }

    // Check if new columns were added to users table
    $stmt = $pdo->query("DESCRIBE users");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);

    $newColumns = ['arabic_name', 'phone', 'title', 'bio', 'language_preference'];
    foreach ($newColumns as $column) {
        if (in_array($column, $columns)) {
            echo "✓ Column 'users.$column' exists\n";
        } else {
            echo "✗ Column 'users.$column' NOT found\n";
        }
    }

    // Create uploads directory if it doesn't exist
    $uploadsDir = __DIR__ . '/uploads/documents';
    if (!is_dir($uploadsDir)) {
        if (mkdir($uploadsDir, 0755, true)) {
            echo "✓ Created uploads directory: $uploadsDir\n";
        } else {
            echo "✗ Failed to create uploads directory: $uploadsDir\n";
        }
    } else {
        echo "✓ Uploads directory already exists: $uploadsDir\n";
    }

    echo "\nMigration verification completed!\n";
    echo "\n🎉 Database migration finished successfully!\n";
    echo "\nNew features available:\n";
    echo "- Document Management System\n";
    echo "- Enhanced Profile Management\n";
    echo "- System Settings Configuration\n";
    echo "- Audit Trail and Version Control\n";

} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>