-- =====================================================
-- Litigation Management System Database Schema
-- Based on Access Database Analysis
-- =====================================================

-- Set charset and collation for Arabic support
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET COLLATION_CONNECTION = 'utf8mb4_unicode_ci';

-- Create database
CREATE DATABASE IF NOT EXISTS litigation_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE litigation_db;

-- =====================================================
-- USER MANAGEMENT TABLES
-- =====================================================

-- Users table for authentication
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User sessions table
CREATE TABLE user_sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id INT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- MAIN BUSINESS TABLES
-- =====================================================

-- Clients table (العملاء)
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_cash_pro_bono (cash_pro_bono),
    INDEX idx_contact_lawyer (contact_lawyer)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lawyers table (المحامين)
CREATE TABLE lawyers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lawyer_name_ar VARCHAR(100) NOT NULL,
    lawyer_name_en VARCHAR(100),
    lawyer_email VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (lawyer_email),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Work teams table (فريق العمل)
CREATE TABLE work_teams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    team_name_ar VARCHAR(200) NOT NULL,
    team_description TEXT,
    team_code VARCHAR(10),
    team_leader VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_team_code (team_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cases/Matters table (الدعاوى)
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
    FOREIGN KEY (work_team_id) REFERENCES work_teams(id) ON DELETE SET NULL,
    INDEX idx_client_id (client_id),
    INDEX idx_matter_id (matter_id),
    INDEX idx_matter_status (matter_status),
    INDEX idx_matter_category (matter_category),
    INDEX idx_matter_court (matter_court),
    INDEX idx_lawyer_a (lawyer_a),
    INDEX idx_lawyer_b (lawyer_b),
    INDEX idx_work_team_id (work_team_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Hearings table (الجلسات)
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
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
    INDEX idx_case_id (case_id),
    INDEX idx_hearing_date (hearing_date),
    INDEX idx_next_hearing (next_hearing),
    INDEX idx_hearing_result (hearing_result)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Powers of Attorney table (التوكيلات)
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
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    INDEX idx_client_id (client_id),
    INDEX idx_power_number (power_number),
    INDEX idx_issue_date (issue_date),
    INDEX idx_location (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Documents table (المستندات)
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
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    INDEX idx_client_id (client_id),
    INDEX idx_document_serial (document_serial),
    INDEX idx_case_number (case_number),
    INDEX idx_document_date (document_date),
    INDEX idx_location (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Invoices table (الفواتير)
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_invoice_number (invoice_number),
    INDEX idx_invoice_date (invoice_date),
    INDEX idx_invoice_status (invoice_status),
    INDEX idx_contract_id (contract_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lawyer shares for invoices
CREATE TABLE lawyer_invoice_shares (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_id INT NOT NULL,
    lawyer_name VARCHAR(100) NOT NULL,
    share_percentage DECIMAL(5,2) NOT NULL,
    share_amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    INDEX idx_invoice_id (invoice_id),
    INDEX idx_lawyer_name (lawyer_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Attendance table (Attendance)
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lawyer_name VARCHAR(100) NOT NULL,
    attendance_date DATE NOT NULL,
    attendance_situation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_lawyer_name (lawyer_name),
    INDEX idx_attendance_date (attendance_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin work table
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_lawyer_name (lawyer_name),
    INDEX idx_work_date (work_date),
    INDEX idx_work_status (work_status),
    INDEX idx_priority (priority),
    INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contacts table
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_full_name (full_name),
    INDEX idx_email (email_address),
    INDEX idx_job_title (job_title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Meetings table (اجتماع)
CREATE TABLE meetings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    meeting_date DATE NOT NULL,
    meeting_time TIME,
    meeting_subject VARCHAR(300),
    meeting_location VARCHAR(200),
    meeting_notes TEXT,
    meeting_status ENUM('scheduled', 'completed', 'cancelled', 'postponed') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_meeting_date (meeting_date),
    INDEX idx_meeting_status (meeting_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Meeting attendance
CREATE TABLE meeting_attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    meeting_id INT NOT NULL,
    attendee_name VARCHAR(100) NOT NULL,
    attendee_role VARCHAR(100),
    attendance_status ENUM('present', 'absent', 'excused') DEFAULT 'present',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE,
    INDEX idx_meeting_id (meeting_id),
    INDEX idx_attendee_name (attendee_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Follow-up table
CREATE TABLE follow_ups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    case_id INT,
    client_id INT,
    follow_up_type ENUM('case', 'client', 'general') NOT NULL,
    follow_up_date DATE NOT NULL,
    follow_up_description TEXT,
    assigned_to VARCHAR(100),
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    due_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    INDEX idx_case_id (case_id),
    INDEX idx_client_id (client_id),
    INDEX idx_follow_up_date (follow_up_date),
    INDEX idx_status (status),
    INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payments table (السداد)
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    invoice_id INT,
    payment_date DATE NOT NULL,
    payment_amount DECIMAL(15,2) NOT NULL,
    currency ENUM('EGP', 'USD', 'EUR') DEFAULT 'EGP',
    payment_method ENUM('cash', 'bank_transfer', 'check', 'credit_card') DEFAULT 'bank_transfer',
    payment_reference VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
    INDEX idx_client_id (client_id),
    INDEX idx_invoice_id (invoice_id),
    INDEX idx_payment_date (payment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SYSTEM TABLES
-- =====================================================

-- System settings
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit log
CREATE TABLE audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_table_name (table_name),
    INDEX idx_record_id (record_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- File attachments
CREATE TABLE file_attachments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    related_table VARCHAR(100) NOT NULL,
    related_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100),
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_related (related_table, related_id),
    INDEX idx_uploaded_by (uploaded_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Insert default admin user
INSERT INTO users (username, email, password_hash, full_name_ar, full_name_en, role) VALUES
('admin', 'admin@litigation.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'مدير النظام', 'System Administrator', 'super_admin');

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name_ar', 'نظام إدارة القضايا القانونية', 'string', 'اسم الموقع باللغة العربية'),
('site_name_en', 'Litigation Management System', 'string', 'اسم الموقع باللغة الإنجليزية'),
('default_language', 'ar', 'string', 'اللغة الافتراضية'),
('currency_default', 'EGP', 'string', 'العملة الافتراضية'),
('records_per_page', '25', 'number', 'عدد السجلات في كل صفحة'),
('backup_enabled', 'true', 'boolean', 'تفعيل النسخ الاحتياطي'),
('email_notifications', 'true', 'boolean', 'تفعيل الإشعارات بالبريد الإلكتروني');

-- =====================================================
-- CREATE VIEWS FOR COMMON QUERIES
-- =====================================================

-- Active cases view
CREATE VIEW v_active_cases AS
SELECT 
    c.id,
    c.matter_id,
    c.matter_ar,
    c.matter_en,
    c.matter_status,
    c.matter_category,
    c.matter_importance,
    c.matter_start_date,
    c.matter_court,
    c.lawyer_a,
    c.lawyer_b,
    cl.client_name_ar,
    cl.client_name_en,
    cl.status as client_status,
    wt.team_name_ar as work_team
FROM cases c
JOIN clients cl ON c.client_id = cl.id
LEFT JOIN work_teams wt ON c.work_team_id = wt.id
WHERE c.matter_status NOT IN ('finished', 'closed', 'cancelled')
AND cl.status = 'active';

-- Recent hearings view
CREATE VIEW v_recent_hearings AS
SELECT 
    h.id,
    h.hearing_date,
    h.hearing_decision,
    h.hearing_result,
    h.next_hearing,
    c.matter_ar,
    c.matter_court,
    c.lawyer_a,
    c.lawyer_b,
    cl.client_name_ar
FROM hearings h
JOIN cases c ON h.case_id = c.id
JOIN clients cl ON c.client_id = cl.id
WHERE h.hearing_date >= CURDATE() - INTERVAL 30 DAY
ORDER BY h.hearing_date DESC;

-- Outstanding invoices view
CREATE VIEW v_outstanding_invoices AS
SELECT 
    i.id,
    i.invoice_number,
    i.invoice_date,
    i.amount,
    i.currency,
    i.invoice_status,
    i.contract_id,
    c.matter_ar,
    cl.client_name_ar
FROM invoices i
LEFT JOIN cases c ON i.contract_id = c.contract_id
LEFT JOIN clients cl ON c.client_id = cl.id
WHERE i.invoice_status IN ('sent', 'overdue')
ORDER BY i.invoice_date ASC;

-- =====================================================
-- CREATE STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure to get case statistics
CREATE PROCEDURE GetCaseStatistics()
BEGIN
    SELECT 
        COUNT(*) as total_cases,
        SUM(CASE WHEN matter_status = 'active' THEN 1 ELSE 0 END) as active_cases,
        SUM(CASE WHEN matter_status = 'finished' THEN 1 ELSE 0 END) as finished_cases,
        SUM(CASE WHEN matter_status = 'pending' THEN 1 ELSE 0 END) as pending_cases
    FROM cases;
END //

-- Procedure to get lawyer workload
CREATE PROCEDURE GetLawyerWorkload(IN lawyer_name VARCHAR(100))
BEGIN
    SELECT 
        COUNT(*) as total_cases,
        SUM(CASE WHEN matter_status = 'active' THEN 1 ELSE 0 END) as active_cases,
        SUM(CASE WHEN matter_status = 'pending' THEN 1 ELSE 0 END) as pending_cases
    FROM cases 
    WHERE lawyer_a = lawyer_name OR lawyer_b = lawyer_name;
END //

DELIMITER ;

-- =====================================================
-- CREATE TRIGGERS FOR AUDIT LOGGING
-- =====================================================

DELIMITER //

-- Trigger for clients table
CREATE TRIGGER clients_audit_insert
AFTER INSERT ON clients
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (user_id, action, table_name, record_id, new_values)
    VALUES (NULL, 'INSERT', 'clients', NEW.id, JSON_OBJECT(
        'client_name_ar', NEW.client_name_ar,
        'client_name_en', NEW.client_name_en,
        'status', NEW.status
    ));
END //

CREATE TRIGGER clients_audit_update
AFTER UPDATE ON clients
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (NULL, 'UPDATE', 'clients', NEW.id, 
        JSON_OBJECT(
            'client_name_ar', OLD.client_name_ar,
            'client_name_en', OLD.client_name_en,
            'status', OLD.status
        ),
        JSON_OBJECT(
            'client_name_ar', NEW.client_name_ar,
            'client_name_en', NEW.client_name_en,
            'status', NEW.status
        )
    );
END //

DELIMITER ;

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional indexes for better performance
CREATE INDEX idx_cases_matter_start_date ON cases(matter_start_date);
CREATE INDEX idx_cases_matter_end_date ON cases(matter_end_date);
CREATE INDEX idx_hearings_next_hearing ON hearings(next_hearing);
CREATE INDEX idx_invoices_payment_date ON invoices(payment_date);
CREATE INDEX idx_clients_created_at ON clients(created_at);
CREATE INDEX idx_cases_created_at ON cases(created_at);

-- =====================================================
-- GRANT PERMISSIONS (Adjust as needed for your environment)
-- =====================================================

-- Create application user (adjust username and password as needed)
-- CREATE USER 'litigation_app'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON litigation_db.* TO 'litigation_app'@'localhost';
-- FLUSH PRIVILEGES;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
