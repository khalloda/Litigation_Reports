-- ============================================
-- Step-by-Step Migration (Run one section at a time)
-- ============================================

-- STEP 1: Add phone column to users table
-- Copy and run this first:
ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL AFTER email;

-- STEP 2: Add title column to users table
-- Copy and run this:
ALTER TABLE users ADD COLUMN title VARCHAR(100) NULL AFTER phone;

-- STEP 3: Add bio column to users table
-- Copy and run this:
ALTER TABLE users ADD COLUMN bio TEXT NULL AFTER title;

-- STEP 4: Add language_preference column to users table
-- Copy and run this:
ALTER TABLE users ADD COLUMN language_preference ENUM('ar', 'en') DEFAULT 'ar' AFTER bio;

-- STEP 5: Add profile_image column to users table
-- Copy and run this:
ALTER TABLE users ADD COLUMN profile_image VARCHAR(255) NULL AFTER language_preference;

-- STEP 6: Backup existing documents table (if exists)
-- Copy and run this:
RENAME TABLE documents TO documents_old_backup;

-- STEP 7: Create new documents table
-- Copy and run this:
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
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_document_type (document_type),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_created_at (created_at),
    INDEX idx_title (title),
    INDEX idx_is_public (is_public),
    FULLTEXT INDEX ft_search (title, description, tags)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- STEP 8: Create document folders table
-- Copy and run this:
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

-- STEP 9: Add foreign key for folder_id to documents
-- Copy and run this:
ALTER TABLE documents ADD FOREIGN KEY (folder_id) REFERENCES document_folders(id) ON DELETE SET NULL;

-- STEP 10: Create document access log table
-- Copy and run this:
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

-- STEP 11: Create document versions table
-- Copy and run this:
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

-- STEP 12: Insert default document folders
-- Copy and run this:
INSERT INTO document_folders (name, parent_id, path, created_by) VALUES
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

-- STEP 13: Add new system settings
-- Copy and run this:
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('company_name', 'مكتب المحاماة', 'string', 'Company name in English'),
('company_phone', '', 'string', 'Company phone number'),
('company_address', '', 'string', 'Company address in English'),
('timezone', 'Asia/Riyadh', 'string', 'System timezone'),
('max_file_size', '10', 'number', 'Maximum file upload size in MB'),
('session_timeout', '60', 'number', 'Session timeout in minutes');

-- STEP 14: Verify the migration
-- Copy and run this to check everything was created:
SHOW TABLES LIKE '%document%';
DESCRIBE users;
SELECT COUNT(*) as document_folders_count FROM document_folders;
SELECT setting_key, setting_value FROM system_settings WHERE setting_key LIKE 'company_%';