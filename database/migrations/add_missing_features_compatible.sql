-- ============================================
-- Add Missing Features to Existing Database
-- Compatible with all MySQL versions
-- ============================================

-- 1. Add missing columns to users table for enhanced profile management
-- Use safer approach without IF NOT EXISTS for older MySQL versions

-- Check and add phone column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'phone');
SET @sql = IF(@col_exists = 0,
    'ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL AFTER email',
    'SELECT "Column phone already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add title column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'title');
SET @sql = IF(@col_exists = 0,
    'ALTER TABLE users ADD COLUMN title VARCHAR(100) NULL AFTER phone',
    'SELECT "Column title already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add bio column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'bio');
SET @sql = IF(@col_exists = 0,
    'ALTER TABLE users ADD COLUMN bio TEXT NULL AFTER title',
    'SELECT "Column bio already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add language_preference column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'language_preference');
SET @sql = IF(@col_exists = 0,
    'ALTER TABLE users ADD COLUMN language_preference ENUM(''ar'', ''en'') DEFAULT ''ar'' AFTER bio',
    'SELECT "Column language_preference already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add profile_image column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'profile_image');
SET @sql = IF(@col_exists = 0,
    'ALTER TABLE users ADD COLUMN profile_image VARCHAR(255) NULL AFTER language_preference',
    'SELECT "Column profile_image already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. Backup existing documents table and create new one
-- Check if documents table exists and rename it
SET @table_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'documents');

-- Rename existing documents table to backup if it exists
SET @sql = IF(@table_exists > 0,
    'RENAME TABLE documents TO documents_old_backup',
    'SELECT "No existing documents table to backup" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create new documents table with proper structure for document management
CREATE TABLE documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    document_type ENUM(
        'contract',
        'evidence',
        'correspondence',
        'legal_memo',
        'court_filing',
        'power_of_attorney',
        'settlement',
        'judgment',
        'appeal',
        'expert_report',
        'financial_document',
        'identification',
        'other'
    ) NOT NULL DEFAULT 'other',
    entity_type ENUM('client', 'case', 'hearing', 'invoice', 'general') NULL,
    entity_id INT NULL,
    folder_id INT NULL,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by INT NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    tags TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign keys
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT,

    -- Indexes
    INDEX idx_document_type (document_type),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_created_at (created_at),
    INDEX idx_title (title),
    INDEX idx_is_public (is_public),
    INDEX idx_folder (folder_id),

    -- Full text search
    FULLTEXT INDEX ft_search (title, description, tags)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create document folders table
DROP TABLE IF EXISTS document_folders;
CREATE TABLE document_folders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    parent_id INT NULL,
    path VARCHAR(500) NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (parent_id) REFERENCES document_folders(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,

    INDEX idx_parent (parent_id),
    INDEX idx_path (path)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign key for folder_id after creating folders table
ALTER TABLE documents
ADD FOREIGN KEY (folder_id) REFERENCES document_folders(id) ON DELETE SET NULL;

-- 4. Create document access log for audit trail
DROP TABLE IF EXISTS document_access_log;
CREATE TABLE document_access_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    document_id INT NOT NULL,
    user_id INT NOT NULL,
    action ENUM('view', 'download', 'edit', 'delete') NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,

    INDEX idx_document (document_id),
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Create document versions table for version control
DROP TABLE IF EXISTS document_versions;
CREATE TABLE document_versions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    document_id INT NOT NULL,
    version_number INT NOT NULL DEFAULT 1,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by INT NOT NULL,
    change_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT,

    UNIQUE KEY unique_version (document_id, version_number),
    INDEX idx_document (document_id),
    INDEX idx_version (version_number),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Insert default document folders
INSERT IGNORE INTO document_folders (name, parent_id, path, created_by) VALUES
('العقود', NULL, '/contracts', 1),
('الأدلة', NULL, '/evidence', 1),
('المراسلات', NULL, '/correspondence', 1),
('المذكرات القانونية', NULL, '/legal-memos', 1),
('مرافعات المحكمة', NULL, '/court-filings', 1),
('التوكيلات', NULL, '/power-of-attorney', 1),
('التسويات', NULL, '/settlements', 1),
('الأحكام', NULL, '/judgments', 1),
('الاستئنافات', NULL, '/appeals', 1),
('تقارير الخبراء', NULL, '/expert-reports', 1),
('المستندات المالية', NULL, '/financial-documents', 1),
('الهويات', NULL, '/identification', 1),
('متنوعة', NULL, '/misc', 1);

-- 7. Add missing system settings for our new features
INSERT IGNORE INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('company_name', 'مكتب المحاماة', 'string', 'Company name in English'),
('company_name_ar', 'مكتب المحاماة', 'string', 'Company name in Arabic'),
('company_email', '', 'string', 'Company email address'),
('company_phone', '', 'string', 'Company phone number'),
('company_address', '', 'string', 'Company address in English'),
('company_address_ar', '', 'string', 'Company address in Arabic'),
('timezone', 'Asia/Riyadh', 'string', 'System timezone'),
('date_format', 'DD/MM/YYYY', 'string', 'Default date format'),
('currency_symbol', 'ج.م', 'string', 'Currency symbol'),
('tax_rate', '14', 'number', 'Default tax rate percentage'),
('max_file_size', '10', 'number', 'Maximum file upload size in MB'),
('allowed_file_types', 'pdf,doc,docx,jpg,png,gif', 'string', 'Allowed file types for upload'),
('session_timeout', '60', 'number', 'Session timeout in minutes'),
('sms_notifications', 'false', 'boolean', 'Enable SMS notifications'),
('reminder_days_before_hearing', '3', 'number', 'Days before hearing to send reminder'),
('reminder_days_overdue_invoice', '7', 'number', 'Days after invoice due to send overdue reminder'),
('password_expiry_days', '90', 'number', 'Password expiry in days'),
('max_login_attempts', '5', 'number', 'Maximum login attempts before lockout'),
('require_2fa', 'false', 'boolean', 'Require two-factor authentication');

-- 8. Update user_sessions table structure if needed
-- Add missing columns to user_sessions
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user_sessions' AND COLUMN_NAME = 'ip_address');
SET @sql = IF(@col_exists = 0,
    'ALTER TABLE user_sessions ADD COLUMN ip_address VARCHAR(45) AFTER user_id',
    'SELECT "Column ip_address already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user_sessions' AND COLUMN_NAME = 'user_agent');
SET @sql = IF(@col_exists = 0,
    'ALTER TABLE user_sessions ADD COLUMN user_agent TEXT AFTER ip_address',
    'SELECT "Column user_agent already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user_sessions' AND COLUMN_NAME = 'is_active');
SET @sql = IF(@col_exists = 0,
    'ALTER TABLE user_sessions ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER user_agent',
    'SELECT "Column is_active already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 9. Add indexes for better performance
-- Check and add indexes safely
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND INDEX_NAME = 'idx_users_language');
SET @sql = IF(@index_exists = 0,
    'ALTER TABLE users ADD INDEX idx_users_language (language_preference)',
    'SELECT "Index idx_users_language already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND INDEX_NAME = 'idx_users_phone');
SET @sql = IF(@index_exists = 0,
    'ALTER TABLE users ADD INDEX idx_users_phone (phone)',
    'SELECT "Index idx_users_phone already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 10. Add triggers for document logging
DELIMITER //

DROP TRIGGER IF EXISTS documents_after_insert//
CREATE TRIGGER documents_after_insert
AFTER INSERT ON documents
FOR EACH ROW
BEGIN
    INSERT INTO document_access_log (document_id, user_id, action, created_at)
    VALUES (NEW.id, NEW.uploaded_by, 'view', NOW());
END//

DROP TRIGGER IF EXISTS documents_after_update//
CREATE TRIGGER documents_after_update
AFTER UPDATE ON documents
FOR EACH ROW
BEGIN
    INSERT INTO document_access_log (document_id, user_id, action, created_at)
    VALUES (NEW.id, NEW.uploaded_by, 'edit', NOW());
END//

DELIMITER ;

-- ============================================
-- Migration Complete
-- ============================================

-- Show what was created
SHOW TABLES LIKE '%document%';

-- Verify users table columns
DESCRIBE users;

-- Show some new settings
SELECT setting_key, setting_value FROM system_settings
WHERE setting_key IN ('company_name', 'max_file_size', 'timezone')
ORDER BY setting_key;