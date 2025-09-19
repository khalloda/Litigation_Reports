-- ============================================
-- Database Migration for New Features
-- Document Management + Profile Management
-- ============================================

-- 1. Add new columns to users table for enhanced profile management
ALTER TABLE users
ADD COLUMN IF NOT EXISTS arabic_name VARCHAR(255) NULL AFTER name,
ADD COLUMN IF NOT EXISTS phone VARCHAR(20) NULL AFTER email,
ADD COLUMN IF NOT EXISTS title VARCHAR(100) NULL AFTER phone,
ADD COLUMN IF NOT EXISTS bio TEXT NULL AFTER title,
ADD COLUMN IF NOT EXISTS language_preference ENUM('ar', 'en') DEFAULT 'ar' AFTER bio,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL AFTER language_preference,
ADD COLUMN IF NOT EXISTS profile_image VARCHAR(255) NULL AFTER last_login;

-- Add indexes for better performance
ALTER TABLE users
ADD INDEX IF NOT EXISTS idx_users_language (language_preference),
ADD INDEX IF NOT EXISTS idx_users_last_login (last_login),
ADD INDEX IF NOT EXISTS idx_users_arabic_name (arabic_name);

-- 2. Create documents table
CREATE TABLE IF NOT EXISTS documents (
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

    -- Full text search
    FULLTEXT INDEX ft_search (title, description, tags)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create document folders table for organization
CREATE TABLE IF NOT EXISTS document_folders (
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

-- 4. Add folder_id to documents table (after creating folders table)
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS folder_id INT NULL AFTER entity_id;

-- Add foreign key for folder_id if it doesn't exist
SET @folder_fk_exists = (
    SELECT COUNT(*)
    FROM information_schema.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'documents'
    AND COLUMN_NAME = 'folder_id'
    AND REFERENCED_TABLE_NAME = 'document_folders'
);

SET @sql = IF(@folder_fk_exists = 0,
    'ALTER TABLE documents ADD FOREIGN KEY (folder_id) REFERENCES document_folders(id) ON DELETE SET NULL',
    'SELECT "Foreign key already exists" AS message');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index for folder_id
ALTER TABLE documents ADD INDEX IF NOT EXISTS idx_folder (folder_id);

-- 5. Create document access log for audit trail
CREATE TABLE IF NOT EXISTS document_access_log (
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

-- 6. Create document versions table for version control
CREATE TABLE IF NOT EXISTS document_versions (
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

-- 7. Insert default document folders (only if they don't exist)
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

-- 8. Create additional indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_full_search ON documents(title, document_type, entity_type);
CREATE INDEX IF NOT EXISTS idx_documents_date_range ON documents(created_at, updated_at);

-- 9. Create system settings table for general settings
CREATE TABLE IF NOT EXISTS system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Insert default system settings
INSERT IGNORE INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('company_name', 'مكتب المحاماة', 'string', 'Company name in English'),
('company_name_ar', 'مكتب المحاماة', 'string', 'Company name in Arabic'),
('company_email', '', 'string', 'Company email address'),
('company_phone', '', 'string', 'Company phone number'),
('default_language', 'ar', 'string', 'Default system language'),
('timezone', 'Asia/Riyadh', 'string', 'System timezone'),
('currency', 'EGP', 'string', 'Default currency'),
('tax_rate', '14', 'number', 'Default tax rate percentage'),
('max_file_size', '10', 'number', 'Maximum file upload size in MB'),
('session_timeout', '60', 'number', 'Session timeout in minutes'),
('email_notifications', 'true', 'boolean', 'Enable email notifications'),
('sms_notifications', 'false', 'boolean', 'Enable SMS notifications');

-- 11. Create user sessions table for better session management
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_user (user_id),
    INDEX idx_token (session_token),
    INDEX idx_expires (expires_at),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Add triggers for document logging (check if they exist first)
DELIMITER //

-- Check if trigger exists and create if not
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

-- 13. Create uploads directory if it doesn't exist (to be run by the application)
-- This will be handled by the PHP application when needed

-- ============================================
-- End of Migration Script
-- ============================================

-- Show tables to verify migration
SHOW TABLES;

-- Show document-related tables structure
DESCRIBE documents;
DESCRIBE document_folders;
DESCRIBE document_access_log;
DESCRIBE document_versions;
DESCRIBE system_settings;

-- Show updated users table
DESCRIBE users;