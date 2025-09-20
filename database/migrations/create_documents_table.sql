-- Create documents table
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

-- Create uploads directory structure table for better organization
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

-- Add folder_id to documents table
ALTER TABLE documents
ADD COLUMN folder_id INT NULL AFTER entity_id,
ADD FOREIGN KEY (folder_id) REFERENCES document_folders(id) ON DELETE SET NULL,
ADD INDEX idx_folder (folder_id);

-- Create document access log for audit trail
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

-- Create document versions table for version control
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

-- Insert default document folders
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

-- Create indexes for better performance
CREATE INDEX idx_documents_full_search ON documents(title, document_type, entity_type);
CREATE INDEX idx_documents_date_range ON documents(created_at, updated_at);

-- Add triggers for automatic logging
DELIMITER //

CREATE TRIGGER documents_after_insert
AFTER INSERT ON documents
FOR EACH ROW
BEGIN
    INSERT INTO document_access_log (document_id, user_id, action, created_at)
    VALUES (NEW.id, NEW.uploaded_by, 'view', NOW());
END//

CREATE TRIGGER documents_after_update
AFTER UPDATE ON documents
FOR EACH ROW
BEGIN
    INSERT INTO document_access_log (document_id, user_id, action, created_at)
    VALUES (NEW.id, NEW.uploaded_by, 'edit', NOW());
END//

DELIMITER ;