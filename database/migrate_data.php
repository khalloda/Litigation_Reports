<?php
/**
 * Data Migration Script
 * Migrates data from Access CSV exports to MySQL database
 */

require_once 'config/database.php';

class DataMigrator {
    private $pdo;
    private $csvDirectory;
    
    public function __construct($pdo, $csvDirectory = 'Original_Access_File/Tables/') {
        $this->pdo = $pdo;
        $this->csvDirectory = $csvDirectory;
    }
    
    /**
     * Run all migrations
     */
    public function migrateAll() {
        echo "Starting data migration...\n";
        
        try {
            // Start transaction
            $this->pdo->beginTransaction();
            
            // Migrate data in order (respecting foreign key constraints)
            $this->migrateClients();
            $this->migrateLawyers();
            $this->migrateWorkTeams();
            $this->migrateCases();
            $this->migrateHearings();
            $this->migratePowersOfAttorney();
            $this->migrateDocuments();
            $this->migrateInvoices();
            $this->migrateLawyerInvoiceShares();
            $this->migrateAttendance();
            $this->migrateAdminWork();
            $this->migrateContacts();
            $this->migrateMeetings();
            $this->migrateMeetingAttendance();
            $this->migrateFollowUps();
            $this->migratePayments();
            
            // Commit transaction
            $this->pdo->commit();
            echo "Data migration completed successfully!\n";
            
        } catch (Exception $e) {
            // Rollback transaction on error
            $this->pdo->rollBack();
            echo "Error during migration: " . $e->getMessage() . "\n";
            throw $e;
        }
    }
    
    /**
     * Migrate clients data
     */
    private function migrateClients() {
        echo "Migrating clients...\n";
        
        $csvFile = $this->csvDirectory . 'العملاء.csv';
        if (!file_exists($csvFile)) {
            echo "Warning: Clients CSV file not found: $csvFile\n";
            return;
        }
        
        $data = $this->readCsvFile($csvFile);
        $count = 0;
        
        foreach ($data as $row) {
            // Skip header row
            if ($count === 0) {
                $count++;
                continue;
            }
            
            try {
                $stmt = $this->pdo->prepare("
                    INSERT INTO clients (
                        id, client_name_ar, client_name_en, client_type, 
                        cash_pro_bono, status, logo, contact_lawyer, 
                        client_start_date, client_end_date
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                    $this->parseDate($row[10] ?? null), // clientStart
                    $this->parseDate($row[11] ?? null)  // clientEnd
                ]);
                
                $count++;
                
            } catch (Exception $e) {
                echo "Error inserting client row $count: " . $e->getMessage() . "\n";
                echo "Row data: " . json_encode($row) . "\n";
            }
        }
        
        echo "Migrated $count clients\n";
    }
    
    /**
     * Migrate lawyers data
     */
    private function migrateLawyers() {
        echo "Migrating lawyers...\n";
        
        $csvFile = $this->csvDirectory . 'المحامين.csv';
        if (!file_exists($csvFile)) {
            echo "Warning: Lawyers CSV file not found: $csvFile\n";
            return;
        }
        
        $data = $this->readCsvFile($csvFile);
        $count = 0;
        
        foreach ($data as $row) {
            if ($count === 0) {
                $count++;
                continue;
            }
            
            try {
                $stmt = $this->pdo->prepare("
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
                echo "Error inserting lawyer row $count: " . $e->getMessage() . "\n";
            }
        }
        
        echo "Migrated $count lawyers\n";
    }
    
    /**
     * Migrate work teams data
     */
    private function migrateWorkTeams() {
        echo "Migrating work teams...\n";
        
        $csvFile = $this->csvDirectory . 'فريق العمل.csv';
        if (!file_exists($csvFile)) {
            echo "Warning: Work teams CSV file not found: $csvFile\n";
            return;
        }
        
        $data = $this->readCsvFile($csvFile);
        $count = 0;
        
        foreach ($data as $row) {
            if ($count === 0) {
                $count++;
                continue;
            }
            
            try {
                $stmt = $this->pdo->prepare("
                    INSERT INTO work_teams (
                        id, team_name_ar, team_description, team_code, team_leader
                    ) VALUES (?, ?, ?, ?, ?)
                ");
                
                $stmt->execute([
                    $row[0] ?? null, // ID
                    $row[1] ?? '',   // فريق العمل
                    $row[2] ?? null, // الوصف
                    $row[3] ?? null, // Code
                    $row[4] ?? null  // المراجع
                ]);
                
                $count++;
                
            } catch (Exception $e) {
                echo "Error inserting work team row $count: " . $e->getMessage() . "\n";
            }
        }
        
        echo "Migrated $count work teams\n";
    }
    
    /**
     * Migrate cases data
     */
    private function migrateCases() {
        echo "Migrating cases...\n";
        
        $csvFile = $this->csvDirectory . 'الدعاوى.csv';
        if (!file_exists($csvFile)) {
            echo "Warning: Cases CSV file not found: $csvFile\n";
            return;
        }
        
        $data = $this->readCsvFile($csvFile);
        $count = 0;
        
        foreach ($data as $row) {
            if ($count === 0) {
                $count++;
                continue;
            }
            
            try {
                $stmt = $this->pdo->prepare("
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
                    $this->parseDate($row[12] ?? null), // matterStartDate
                    $this->parseDate($row[31] ?? null), // matterEndDate
                    $row[13] ?? null, // circuitSecretary
                    $this->parseDecimal($row[14] ?? null), // matterAskedAmount
                    $this->parseDecimal($row[15] ?? null), // matterJudgedAmount
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
                echo "Error inserting case row $count: " . $e->getMessage() . "\n";
            }
        }
        
        echo "Migrated $count cases\n";
    }
    
    /**
     * Migrate hearings data
     */
    private function migrateHearings() {
        echo "Migrating hearings...\n";
        
        $csvFile = $this->csvDirectory . 'الجلسات.csv';
        if (!file_exists($csvFile)) {
            echo "Warning: Hearings CSV file not found: $csvFile\n";
            return;
        }
        
        $data = $this->readCsvFile($csvFile);
        $count = 0;
        
        foreach ($data as $row) {
            if ($count === 0) {
                $count++;
                continue;
            }
            
            try {
                $stmt = $this->pdo->prepare("
                    INSERT INTO hearings (
                        id, case_id, hearing_date, hearing_decision, hearing_result,
                        last_decision, court_notes, lawyer_notes, expert_notes,
                        hearing_duration, hearing_type, next_hearing, short_decision
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                
                $stmt->execute([
                    $row[0] ?? null, // ID_hearings
                    $row[19] ?? null, // matterID
                    $this->parseDate($row[1] ?? null), // تاريخ الجلسة
                    $row[2] ?? null,  // قرار الجلسة
                    $row[3] ?? null,  // نتيجة الجلسة
                    $row[5] ?? null,  // lastDecision
                    $row[7] ?? null,  // ملاحظات المحكمة
                    $row[8] ?? null,  // ملاحظات المحامي
                    $row[9] ?? null,  // ملاحظات الخبير
                    $row[11] ?? null, // مدة الجلسة
                    $row[12] ?? null, // نوع الجلسة
                    $this->parseDate($row[18] ?? null), // nextHearing
                    $row[20] ?? null  // shortDecision
                ]);
                
                $count++;
                
            } catch (Exception $e) {
                echo "Error inserting hearing row $count: " . $e->getMessage() . "\n";
            }
        }
        
        echo "Migrated $count hearings\n";
    }
    
    /**
     * Migrate powers of attorney data
     */
    private function migratePowersOfAttorney() {
        echo "Migrating powers of attorney...\n";
        
        $csvFile = $this->csvDirectory . 'التوكيلات.csv';
        if (!file_exists($csvFile)) {
            echo "Warning: Powers of attorney CSV file not found: $csvFile\n";
            return;
        }
        
        $data = $this->readCsvFile($csvFile);
        $count = 0;
        
        foreach ($data as $row) {
            if ($count === 0) {
                $count++;
                continue;
            }
            
            try {
                $stmt = $this->pdo->prepare("
                    INSERT INTO powers_of_attorney (
                        client_id, serial_number, client_name, client_capacity,
                        power_number, power_letter, power_year, issuing_authority,
                        issue_date, assigned_lawyers, number_of_copies, notes, location
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                
                $stmt->execute([
                    $row[13] ?? null, // clientID
                    $row[0] ?? null,  // مسلسل
                    $row[1] ?? null,  // اسم الموكل
                    $row[2] ?? null,  // الصفة
                    $row[3] ?? null,  // رقم التوكيل
                    $row[4] ?? null,  // حرف
                    $row[5] ?? null,  // السنة
                    $row[6] ?? null,  // جهة الإصدار
                    $this->parseDate($row[7] ?? null), // تاريخ الإصدار
                    $row[8] ?? null,  // المحامون الصادر لهم التوكيل
                    $row[9] ?? 1,     // عدد النسخ
                    $row[10] ?? null, // ملاحظات
                    $row[14] ?? null  // مكان التوكيل
                ]);
                
                $count++;
                
            } catch (Exception $e) {
                echo "Error inserting power of attorney row $count: " . $e->getMessage() . "\n";
            }
        }
        
        echo "Migrated $count powers of attorney\n";
    }
    
    /**
     * Migrate documents data
     */
    private function migrateDocuments() {
        echo "Migrating documents...\n";
        
        $csvFile = $this->csvDirectory . 'المستندات.csv';
        if (!file_exists($csvFile)) {
            echo "Warning: Documents CSV file not found: $csvFile\n";
            return;
        }
        
        $data = $this->readCsvFile($csvFile);
        $count = 0;
        
        foreach ($data as $row) {
            if ($count === 0) {
                $count++;
                continue;
            }
            
            try {
                $stmt = $this->pdo->prepare("
                    INSERT INTO documents (
                        client_id, document_serial, case_number, document_description,
                        document_date, number_of_pages, deposit_date, responsible_lawyer,
                        notes, location
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                
                $stmt->execute([
                    $row[10] ?? null, // clientID
                    $row[0] ?? null,  // مسلسل المستند ID
                    $row[1] ?? null,  // رقم الدعوى
                    $row[3] ?? null,  // بيان المستند
                    $this->parseDate($row[4] ?? null), // تاريخ المستند
                    $row[5] ?? null,  // عدد الأوراق
                    $this->parseDate($row[6] ?? null), // تاريخ الإيداع
                    $row[7] ?? null,  // المحامي/الموظف المسئول
                    $row[9] ?? null,  // ملاحظات
                    $row[11] ?? null  // مكان المستندات
                ]);
                
                $count++;
                
            } catch (Exception $e) {
                echo "Error inserting document row $count: " . $e->getMessage() . "\n";
            }
        }
        
        echo "Migrated $count documents\n";
    }
    
    /**
     * Migrate invoices data
     */
    private function migrateInvoices() {
        echo "Migrating invoices...\n";
        
        $csvFile = $this->csvDirectory . 'الفواتير.csv';
        if (!file_exists($csvFile)) {
            echo "Warning: Invoices CSV file not found: $csvFile\n";
            return;
        }
        
        $data = $this->readCsvFile($csvFile);
        $count = 0;
        
        foreach ($data as $row) {
            if ($count === 0) {
                $count++;
                continue;
            }
            
            try {
                $stmt = $this->pdo->prepare("
                    INSERT INTO invoices (
                        invoice_number, contract_id, invoice_date, amount, currency,
                        usd_amount, invoice_details, invoice_status, invoice_type,
                        has_vat, payment_date, report_generated
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                
                $stmt->execute([
                    $row[0] ?? null,  // Inv-No
                    $row[1] ?? null,  // contractID
                    $this->parseDate($row[2] ?? null), // Inv-Date
                    $this->parseDecimal($row[3] ?? null), // Amount
                    $row[5] ?? 'EGP', // Currency
                    $this->parseDecimal($row[4] ?? null), // USD$
                    $row[6] ?? null,  // Inv-Details
                    $this->mapInvoiceStatus($row[7] ?? 'draft'), // Inv-Status
                    $this->mapInvoiceType($row[8] ?? 'service'), // Inv-Type
                    $row[9] == '1' ? true : false, // VAT?
                    $this->parseDate($row[10] ?? null), // Pay-Date
                    $row[11] == '1' ? true : false  // report
                ]);
                
                $count++;
                
            } catch (Exception $e) {
                echo "Error inserting invoice row $count: " . $e->getMessage() . "\n";
            }
        }
        
        echo "Migrated $count invoices\n";
    }
    
    /**
     * Migrate lawyer invoice shares
     */
    private function migrateLawyerInvoiceShares() {
        echo "Migrating lawyer invoice shares...\n";
        
        $csvFile = $this->csvDirectory . 'LawyerShare4Invoices.csv';
        if (!file_exists($csvFile)) {
            echo "Warning: Lawyer invoice shares CSV file not found: $csvFile\n";
            return;
        }
        
        $data = $this->readCsvFile($csvFile);
        $count = 0;
        
        foreach ($data as $row) {
            if ($count === 0) {
                $count++;
                continue;
            }
            
            try {
                $stmt = $this->pdo->prepare("
                    INSERT INTO lawyer_invoice_shares (
                        invoice_id, lawyer_name, share_percentage, share_amount
                    ) VALUES (?, ?, ?, ?)
                ");
                
                $stmt->execute([
                    $row[0] ?? null, // Invoice ID
                    $row[1] ?? null, // Lawyer name
                    $this->parseDecimal($row[2] ?? null), // Share percentage
                    $this->parseDecimal($row[3] ?? null)  // Share amount
                ]);
                
                $count++;
                
            } catch (Exception $e) {
                echo "Error inserting lawyer invoice share row $count: " . $e->getMessage() . "\n";
            }
        }
        
        echo "Migrated $count lawyer invoice shares\n";
    }
    
    /**
     * Migrate attendance data
     */
    private function migrateAttendance() {
        echo "Migrating attendance...\n";
        
        $csvFile = $this->csvDirectory . 'Attendance.csv';
        if (!file_exists($csvFile)) {
            echo "Warning: Attendance CSV file not found: $csvFile\n";
            return;
        }
        
        $data = $this->readCsvFile($csvFile);
        $count = 0;
        
        foreach ($data as $row) {
            if ($count === 0) {
                $count++;
                continue;
            }
            
            try {
                $stmt = $this->pdo->prepare("
                    INSERT INTO attendance (
                        lawyer_name, attendance_date, attendance_situation
                    ) VALUES (?, ?, ?)
                ");
                
                $stmt->execute([
                    $row[3] ?? null, // المحامي
                    $this->parseDate($row[1] ?? null), // AttDate
                    $row[2] ?? null  // AttSituation
                ]);
                
                $count++;
                
            } catch (Exception $e) {
                echo "Error inserting attendance row $count: " . $e->getMessage() . "\n";
            }
        }
        
        echo "Migrated $count attendance records\n";
    }
    
    /**
     * Migrate admin work data
     */
    private function migrateAdminWork() {
        echo "Migrating admin work...\n";
        
        $csvFile = $this->csvDirectory . 'admin work table.csv';
        if (!file_exists($csvFile)) {
            echo "Warning: Admin work CSV file not found: $csvFile\n";
            return;
        }
        
        $data = $this->readCsvFile($csvFile);
        $count = 0;
        
        foreach ($data as $row) {
            if ($count === 0) {
                $count++;
                continue;
            }
            
            try {
                $stmt = $this->pdo->prepare("
                    INSERT INTO admin_work (
                        lawyer_name, work_date, work_description, work_location,
                        work_status, priority, due_date, notes
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ");
                
                $stmt->execute([
                    $row[0] ?? null, // Lawyer name
                    $this->parseDate($row[1] ?? null), // Work date
                    $row[2] ?? null, // Work description
                    $row[3] ?? null, // Work location
                    'pending',       // Default status
                    'medium',        // Default priority
                    null,            // Due date
                    $row[4] ?? null  // Notes
                ]);
                
                $count++;
                
            } catch (Exception $e) {
                echo "Error inserting admin work row $count: " . $e->getMessage() . "\n";
            }
        }
        
        echo "Migrated $count admin work records\n";
    }
    
    /**
     * Migrate contacts data
     */
    private function migrateContacts() {
        echo "Migrating contacts...\n";
        
        $csvFile = $this->csvDirectory . 'Contacts.csv';
        if (!file_exists($csvFile)) {
            echo "Warning: Contacts CSV file not found: $csvFile\n";
            return;
        }
        
        $data = $this->readCsvFile($csvFile);
        $count = 0;
        
        foreach ($data as $row) {
            if ($count === 0) {
                $count++;
                continue;
            }
            
            try {
                $stmt = $this->pdo->prepare("
                    INSERT INTO contacts (
                        full_name, contact1, email_address, job_title,
                        business_phone, home_phone, mobile_phone, fax,
                        address, city, country, postal_code, notes
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                
                $stmt->execute([
                    $row[1] ?? null, // Full_name
                    $row[2] ?? null, // Contact1
                    $row[3] ?? null, // E-mail Address
                    $row[4] ?? null, // Job Title
                    $row[5] ?? null, // Business Phone
                    $row[6] ?? null, // Home Phone
                    $row[7] ?? null, // Mobile Phone
                    $row[8] ?? null, // Fax
                    $row[9] ?? null, // Address
                    $row[10] ?? null, // City
                    $row[11] ?? null, // Country
                    $row[12] ?? null, // Postal Code
                    $row[13] ?? null  // Notes
                ]);
                
                $count++;
                
            } catch (Exception $e) {
                echo "Error inserting contact row $count: " . $e->getMessage() . "\n";
            }
        }
        
        echo "Migrated $count contacts\n";
    }
    
    /**
     * Migrate meetings data
     */
    private function migrateMeetings() {
        echo "Migrating meetings...\n";
        
        $csvFile = $this->csvDirectory . 'اجتماع.csv';
        if (!file_exists($csvFile)) {
            echo "Warning: Meetings CSV file not found: $csvFile\n";
            return;
        }
        
        $data = $this->readCsvFile($csvFile);
        $count = 0;
        
        foreach ($data as $row) {
            if ($count === 0) {
                $count++;
                continue;
            }
            
            try {
                $stmt = $this->pdo->prepare("
                    INSERT INTO meetings (
                        meeting_date, meeting_time, meeting_subject,
                        meeting_location, meeting_notes, meeting_status
                    ) VALUES (?, ?, ?, ?, ?, ?)
                ");
                
                $stmt->execute([
                    $this->parseDate($row[0] ?? null), // Meeting date
                    $row[1] ?? null, // Meeting time
                    $row[2] ?? null, // Meeting subject
                    $row[3] ?? null, // Meeting location
                    $row[4] ?? null, // Meeting notes
                    'scheduled'       // Default status
                ]);
                
                $count++;
                
            } catch (Exception $e) {
                echo "Error inserting meeting row $count: " . $e->getMessage() . "\n";
            }
        }
        
        echo "Migrated $count meetings\n";
    }
    
    /**
     * Migrate meeting attendance data
     */
    private function migrateMeetingAttendance() {
        echo "Migrating meeting attendance...\n";
        
        $csvFile = $this->csvDirectory . 'meeting_attendance.csv';
        if (!file_exists($csvFile)) {
            echo "Warning: Meeting attendance CSV file not found: $csvFile\n";
            return;
        }
        
        $data = $this->readCsvFile($csvFile);
        $count = 0;
        
        foreach ($data as $row) {
            if ($count === 0) {
                $count++;
                continue;
            }
            
            try {
                $stmt = $this->pdo->prepare("
                    INSERT INTO meeting_attendance (
                        meeting_id, attendee_name, attendee_role,
                        attendance_status, notes
                    ) VALUES (?, ?, ?, ?, ?)
                ");
                
                $stmt->execute([
                    $row[0] ?? null, // Meeting ID
                    $row[1] ?? null, // Attendee name
                    $row[2] ?? null, // Attendee role
                    $row[3] ?? 'present', // Attendance status
                    $row[4] ?? null  // Notes
                ]);
                
                $count++;
                
            } catch (Exception $e) {
                echo "Error inserting meeting attendance row $count: " . $e->getMessage() . "\n";
            }
        }
        
        echo "Migrated $count meeting attendance records\n";
    }
    
    /**
     * Migrate follow-ups data
     */
    private function migrateFollowUps() {
        echo "Migrating follow-ups...\n";
        
        $csvFile = $this->csvDirectory . 'Follow-up.csv';
        if (!file_exists($csvFile)) {
            echo "Warning: Follow-ups CSV file not found: $csvFile\n";
            return;
        }
        
        $data = $this->readCsvFile($csvFile);
        $count = 0;
        
        foreach ($data as $row) {
            if ($count === 0) {
                $count++;
                continue;
            }
            
            try {
                $stmt = $this->pdo->prepare("
                    INSERT INTO follow_ups (
                        case_id, client_id, follow_up_type, follow_up_date,
                        follow_up_description, assigned_to, priority, status,
                        due_date, notes
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                
                $stmt->execute([
                    $row[0] ?? null, // Case ID
                    $row[1] ?? null, // Client ID
                    'case',          // Default type
                    $this->parseDate($row[2] ?? null), // Follow-up date
                    $row[3] ?? null, // Description
                    $row[4] ?? null, // Assigned to
                    'medium',        // Default priority
                    'pending',       // Default status
                    null,            // Due date
                    $row[5] ?? null  // Notes
                ]);
                
                $count++;
                
            } catch (Exception $e) {
                echo "Error inserting follow-up row $count: " . $e->getMessage() . "\n";
            }
        }
        
        echo "Migrated $count follow-ups\n";
    }
    
    /**
     * Migrate payments data
     */
    private function migratePayments() {
        echo "Migrating payments...\n";
        
        $csvFile = $this->csvDirectory . 'السداد.csv';
        if (!file_exists($csvFile)) {
            echo "Warning: Payments CSV file not found: $csvFile\n";
            return;
        }
        
        $data = $this->readCsvFile($csvFile);
        $count = 0;
        
        foreach ($data as $row) {
            if ($count === 0) {
                $count++;
                continue;
            }
            
            try {
                $stmt = $this->pdo->prepare("
                    INSERT INTO payments (
                        client_id, invoice_id, payment_date, payment_amount,
                        currency, payment_method, payment_reference, notes
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ");
                
                $stmt->execute([
                    $row[0] ?? null, // Client ID
                    $row[1] ?? null, // Invoice ID
                    $this->parseDate($row[2] ?? null), // Payment date
                    $this->parseDecimal($row[3] ?? null), // Payment amount
                    $row[4] ?? 'EGP', // Currency
                    'bank_transfer',  // Default method
                    $row[5] ?? null, // Payment reference
                    $row[6] ?? null  // Notes
                ]);
                
                $count++;
                
            } catch (Exception $e) {
                echo "Error inserting payment row $count: " . $e->getMessage() . "\n";
            }
        }
        
        echo "Migrated $count payments\n";
    }
    
    /**
     * Read CSV file and return array of rows
     */
    private function readCsvFile($filename) {
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
    private function parseDate($dateString) {
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
    private function parseDecimal($value) {
        if (empty($value)) {
            return null;
        }
        
        // Remove any non-numeric characters except decimal point and minus
        $value = preg_replace('/[^\d.-]/', '', $value);
        
        return is_numeric($value) ? (float)$value : null;
    }
    
    /**
     * Map invoice status
     */
    private function mapInvoiceStatus($status) {
        $statusMap = [
            'Paid' => 'paid',
            'Sent' => 'sent',
            'Overdue' => 'overdue',
            'Draft' => 'draft',
            'Cancelled' => 'cancelled'
        ];
        
        return $statusMap[$status] ?? 'draft';
    }
    
    /**
     * Map invoice type
     */
    private function mapInvoiceType($type) {
        $typeMap = [
            'Service' => 'service',
            'Expenses' => 'expenses',
            'Advance' => 'advance'
        ];
        
        return $typeMap[$type] ?? 'service';
    }
}

// Load local configuration
$config = require_once __DIR__ . '/config.local.php';

// Database configuration
try {
    $pdo = new PDO(
        'mysql:host=' . $config['host'] . ';dbname=' . $config['database'] . ';charset=utf8mb4',
        $config['username'],
        $config['password']
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create migrator and run migration
    $migrator = new DataMigrator($pdo);
    $migrator->migrateAll();
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
