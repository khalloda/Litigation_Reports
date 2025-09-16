<?php
/**
 * Simple Data Migration Script
 * Migrates data from Access CSV exports to MySQL database
 */

echo "=== Data Migration Script ===\n\n";

// Load local configuration
$config = require_once 'config.local.php';

try {
    // Connect to database
    echo "1. Connecting to database...\n";
    $pdo = new PDO(
        'mysql:host=' . $config['host'] . ';dbname=' . $config['database'] . ';charset=utf8mb4',
        $config['username'],
        $config['password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    echo "   ✓ Connected successfully\n\n";
    
    // Check CSV directory
    $csvDir = __DIR__ . '/../Original_Access_File/Tables/';
    echo "2. Checking CSV directory...\n";
    
    if (!is_dir($csvDir)) {
        echo "   ❌ CSV directory not found: $csvDir\n";
        echo "   Please ensure the Original_Access_File/Tables directory exists.\n";
        exit(1);
    }
    
    echo "   ✓ CSV directory found: $csvDir\n\n";
    
    // List available CSV files
    echo "3. Available CSV files:\n";
    $csvFiles = glob($csvDir . '*.csv');
    foreach ($csvFiles as $file) {
        $filename = basename($file);
        echo "   - $filename\n";
    }
    echo "\n";
    
    // Start migration
    echo "4. Starting data migration...\n";
    $pdo->beginTransaction();
    
    $totalImported = 0;
    $filesProcessed = 0;
    
    // Migrate clients
    $clientsFile = $csvDir . 'العملاء.csv';
    if (file_exists($clientsFile)) {
        echo "   Migrating clients from العملاء.csv...\n";
        $data = readCsvFile($clientsFile);
        $count = 0;
        
        foreach ($data as $row) {
            if ($count === 0) {
                $count++;
                continue; // Skip header
            }
            
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO clients (
                        id, client_name_ar, client_name_en, client_type, 
                        cash_pro_bono, status, logo, contact_lawyer, 
                        client_start_date, client_end_date
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                    client_name_ar = VALUES(client_name_ar),
                    client_name_en = VALUES(client_name_en),
                    status = VALUES(status)
                ");
                
                $stmt->execute([
                    $row[0] ?? null, // ID_client
                    $row[3] ?? '',   // العميل (Arabic name)
                    $row[1] ?? null, // Client_en
                    'company',       // Default to company
                    $row[4] ?? 'cash', // Cash/probono
                    $row[5] ?? 'active', // Status
                    $row[6] ?? null, // logo
                    $row[9] ?? null, // contactLawyer
                    parseDate($row[10] ?? null), // clientStart
                    parseDate($row[11] ?? null)  // clientEnd
                ]);
                
                $count++;
                
            } catch (Exception $e) {
                echo "     ⚠ Warning: Error importing client row: " . $e->getMessage() . "\n";
            }
        }
        
        echo "     ✓ Imported " . ($count - 1) . " clients\n";
        $totalImported += ($count - 1);
        $filesProcessed++;
    }
    
    // Migrate lawyers
    $lawyersFile = $csvDir . 'المحامين.csv';
    if (file_exists($lawyersFile)) {
        echo "   Migrating lawyers from المحامين.csv...\n";
        $data = readCsvFile($lawyersFile);
        $count = 0;
        
        foreach ($data as $row) {
            if ($count === 0) {
                $count++;
                continue; // Skip header
            }
            
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO lawyers (
                        lawyer_name_ar, lawyer_name_en, lawyer_email, is_active
                    ) VALUES (?, ?, ?, ?)
                ");
                
                $stmt->execute([
                    trim($row[0] ?? ''), // lawyer_name
                    $row[2] ?? null,     // Lawyer_EN
                    $row[1] ?? null,     // lawyer_email
                    true                 // is_active
                ]);
                
                $count++;
                
            } catch (Exception $e) {
                echo "     ⚠ Warning: Error importing lawyer row: " . $e->getMessage() . "\n";
            }
        }
        
        echo "     ✓ Imported " . ($count - 1) . " lawyers\n";
        $totalImported += ($count - 1);
        $filesProcessed++;
    }
    
    // Migrate cases (sample - first 100 records)
    $casesFile = $csvDir . 'الدعاوى.csv';
    if (file_exists($casesFile)) {
        echo "   Migrating cases from الدعاوى.csv (first 100 records)...\n";
        $data = readCsvFile($casesFile);
        $count = 0;
        $maxRecords = 100; // Limit for testing
        
        foreach ($data as $row) {
            if ($count === 0 || $count > $maxRecords) {
                $count++;
                continue; // Skip header or limit records
            }
            
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO cases (
                        client_id, matter_id, matter_ar, matter_en, client_capacity,
                        opponent_capacity, matter_subject, matter_status, matter_category,
                        matter_degree, matter_importance, matter_start_date, matter_end_date,
                        circuit_secretary, matter_asked_amount, matter_judged_amount,
                        client_branch, matter_shelf, court_floor, court_hall,
                        secretary_room, matter_court, matter_circuit, matter_destination,
                        matter_select, matter_partner, matter_notes1, matter_notes2,
                        lawyer_a, lawyer_b, matter_evaluation, financial_allocation,
                        work_team_id, contract_id
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                
                $stmt->execute([
                    $row[0] ?? null,  // clientID
                    $row[1] ?? null,  // matterID
                    $row[2] ?? null,  // matterAR
                    $row[3] ?? null,  // matterEN
                    $row[4] ?? null,  // client&Cap
                    $row[5] ?? null,  // opponent&Cap
                    $row[6] ?? null,  // matterSubject
                    $row[7] ?? null,  // matterStatus
                    $row[8] ?? null,  // matterCategory
                    $row[9] ?? null,  // matterDegree
                    $row[10] ?? null, // matterImportance
                    parseDate($row[12] ?? null), // matterStartDate
                    parseDate($row[31] ?? null), // matterEndDate
                    $row[13] ?? null, // circuitSecretary
                    parseDecimal($row[14] ?? null), // matterAskedAmount
                    parseDecimal($row[15] ?? null), // matterJudgedAmount
                    $row[16] ?? null, // clientBranch
                    $row[17] ?? null, // matterShelf
                    $row[18] ?? null, // courtFloor
                    $row[19] ?? null, // courtHall
                    $row[20] ?? null, // secretaryRoom
                    $row[21] ?? null, // matterCourt
                    $row[22] ?? null, // matterCircut
                    $row[23] ?? null, // matterDistination
                    $row[24] ?? null, // matterSelect
                    $row[25] ?? null, // matterPartner
                    $row[26] ?? null, // matterNotes1
                    $row[11] ?? null, // matterNotes2
                    $row[27] ?? null, // lawyerA
                    $row[28] ?? null, // lawyerB
                    $row[29] ?? null, // matteEvaluation
                    $row[32] ?? null, // المخصص المالي
                    $row[33] ?? null, // فريق العمل
                    $row[36] ?? null  // contractID
                ]);
                
                $count++;
                
            } catch (Exception $e) {
                echo "     ⚠ Warning: Error importing case row: " . $e->getMessage() . "\n";
            }
        }
        
        echo "     ✓ Imported " . ($count - 1) . " cases\n";
        $totalImported += ($count - 1);
        $filesProcessed++;
    }
    
    // Commit transaction
    $pdo->commit();
    
    echo "\n";
    echo "=== MIGRATION COMPLETED SUCCESSFULLY ===\n";
    echo "Files processed: $filesProcessed\n";
    echo "Total records imported: $totalImported\n";
    echo "\n";
    echo "Next steps:\n";
    echo "1. Run: php test.php (to verify the data)\n";
    echo "2. Check your database for imported data\n";
    echo "3. Continue with application development\n";
    
} catch (Exception $e) {
    if (isset($pdo)) {
        $pdo->rollback();
    }
    echo "❌ Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}

/**
 * Read CSV file and return array of rows
 */
function readCsvFile($filename) {
    $data = [];
    
    if (($handle = fopen($filename, 'r')) !== FALSE) {
        while (($row = fgetcsv($handle, 1000, ',')) !== FALSE) {
            $data[] = $row;
        }
        fclose($handle);
    }
    
    return $data;
}

/**
 * Parse date from various formats
 */
function parseDate($dateString) {
    if (empty($dateString)) {
        return null;
    }
    
    // Handle Access date format
    if (preg_match('/^\d{1,2}\/\d{1,2}\/\d{4}/', $dateString)) {
        $date = DateTime::createFromFormat('d/m/Y', $dateString);
        if ($date) {
            return $date->format('Y-m-d');
        }
    }
    
    // Handle other common formats
    try {
        $date = new DateTime($dateString);
        return $date->format('Y-m-d');
    } catch (Exception $e) {
        return null;
    }
}

/**
 * Parse decimal number
 */
function parseDecimal($value) {
    if (empty($value)) {
        return null;
    }
    
    // Remove any non-numeric characters except decimal point and minus
    $value = preg_replace('/[^\d.-]/', '', $value);
    
    return is_numeric($value) ? (float)$value : null;
}
?>
