-- Migration: Add Lawyer Relationship Tables
-- Purpose: Create relationship tables for linking lawyers to hearings, clients, and cases
-- Date: 2025-09-28
-- Version: 1.0

-- Create hearing_lawyers relationship table
CREATE TABLE IF NOT EXISTS hearing_lawyers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  hearing_id INT NOT NULL,
  lawyer_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Foreign key constraints
  FOREIGN KEY (hearing_id) REFERENCES hearings(id) ON DELETE CASCADE,
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE,

  -- Prevent duplicate relationships
  UNIQUE KEY unique_hearing_lawyer (hearing_id, lawyer_id),

  -- Indexes for performance
  INDEX idx_hearing_id (hearing_id),
  INDEX idx_lawyer_id (lawyer_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create client_lawyers relationship table
CREATE TABLE IF NOT EXISTS client_lawyers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  lawyer_id INT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE COMMENT 'Indicates if this is the primary lawyer for the client',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Foreign key constraints
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE,

  -- Prevent duplicate relationships
  UNIQUE KEY unique_client_lawyer (client_id, lawyer_id),

  -- Indexes for performance
  INDEX idx_client_id (client_id),
  INDEX idx_lawyer_id (lawyer_id),
  INDEX idx_is_primary (is_primary),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create case_lawyers relationship table
CREATE TABLE IF NOT EXISTS case_lawyers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  case_id INT NOT NULL,
  lawyer_id INT NOT NULL,
  role ENUM('primary', 'secondary', 'consultant') DEFAULT 'primary' COMMENT 'Role of lawyer in this case',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Foreign key constraints
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE,

  -- Allow multiple roles per lawyer per case, but unique lawyer-role combinations
  UNIQUE KEY unique_case_lawyer_role (case_id, lawyer_id, role),

  -- Indexes for performance
  INDEX idx_case_id (case_id),
  INDEX idx_lawyer_id (lawyer_id),
  INDEX idx_role (role),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data migration from existing text fields (if any exist)
-- Migrate existing contact_lawyer text field to client_lawyers table
INSERT IGNORE INTO client_lawyers (client_id, lawyer_id, is_primary, created_at)
SELECT
  c.id as client_id,
  l.id as lawyer_id,
  TRUE as is_primary,
  c.created_at
FROM clients c
JOIN lawyers l ON (
  TRIM(c.contact_lawyer) != ''
  AND c.contact_lawyer IS NOT NULL
  AND (
    l.lawyer_name_ar LIKE CONCAT('%', TRIM(c.contact_lawyer), '%')
    OR l.lawyer_name_en LIKE CONCAT('%', TRIM(c.contact_lawyer), '%')
  )
)
WHERE c.contact_lawyer IS NOT NULL
  AND TRIM(c.contact_lawyer) != '';

-- Migrate existing lawyer_a and lawyer_b fields from cases (if they exist in the database)
-- Note: These fields exist in the form but may not be in the database yet
-- This will be safe to run even if the columns don't exist
SET @sql = NULL;
SELECT GROUP_CONCAT(COLUMN_NAME) INTO @sql
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'cases'
  AND COLUMN_NAME IN ('lawyer_a', 'lawyer_b');

-- If lawyer_a column exists, migrate it
SELECT COUNT(*) INTO @column_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'cases'
  AND COLUMN_NAME = 'lawyer_a';

SET @sql = IF(@column_exists > 0,
  'INSERT IGNORE INTO case_lawyers (case_id, lawyer_id, role, created_at)
   SELECT
     ca.id as case_id,
     l.id as lawyer_id,
     ''primary'' as role,
     ca.created_at
   FROM cases ca
   JOIN lawyers l ON (
     TRIM(ca.lawyer_a) != ''''
     AND ca.lawyer_a IS NOT NULL
     AND (
       l.lawyer_name_ar LIKE CONCAT(''%'', TRIM(ca.lawyer_a), ''%'')
       OR l.lawyer_name_en LIKE CONCAT(''%'', TRIM(ca.lawyer_a), ''%'')
     )
   )
   WHERE ca.lawyer_a IS NOT NULL
     AND TRIM(ca.lawyer_a) != ''''',
  'SELECT 1');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- If lawyer_b column exists, migrate it
SELECT COUNT(*) INTO @column_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'cases'
  AND COLUMN_NAME = 'lawyer_b';

SET @sql = IF(@column_exists > 0,
  'INSERT IGNORE INTO case_lawyers (case_id, lawyer_id, role, created_at)
   SELECT
     ca.id as case_id,
     l.id as lawyer_id,
     ''secondary'' as role,
     ca.created_at
   FROM cases ca
   JOIN lawyers l ON (
     TRIM(ca.lawyer_b) != ''''
     AND ca.lawyer_b IS NOT NULL
     AND (
       l.lawyer_name_ar LIKE CONCAT(''%'', TRIM(ca.lawyer_b), ''%'')
       OR l.lawyer_name_en LIKE CONCAT(''%'', TRIM(ca.lawyer_b), ''%'')
     )
   )
   WHERE ca.lawyer_b IS NOT NULL
     AND TRIM(ca.lawyer_b) != ''''',
  'SELECT 1');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create triggers to maintain data consistency (optional, for future use)
-- These triggers ensure that when old text fields are updated, the relationship tables are also updated

DELIMITER $$

-- Trigger for client contact_lawyer updates
CREATE TRIGGER IF NOT EXISTS client_lawyer_sync_after_update
AFTER UPDATE ON clients
FOR EACH ROW
BEGIN
  -- Only sync if contact_lawyer field changed and we're not in migration mode
  IF OLD.contact_lawyer != NEW.contact_lawyer THEN
    -- Remove old relationships if contact_lawyer was cleared
    IF NEW.contact_lawyer IS NULL OR TRIM(NEW.contact_lawyer) = '' THEN
      DELETE FROM client_lawyers WHERE client_id = NEW.id AND is_primary = TRUE;
    ELSE
      -- Try to find matching lawyer and create relationship
      INSERT IGNORE INTO client_lawyers (client_id, lawyer_id, is_primary, created_at)
      SELECT
        NEW.id,
        l.id,
        TRUE,
        NOW()
      FROM lawyers l
      WHERE (
        l.lawyer_name_ar LIKE CONCAT('%', TRIM(NEW.contact_lawyer), '%')
        OR l.lawyer_name_en LIKE CONCAT('%', TRIM(NEW.contact_lawyer), '%')
      )
      LIMIT 1;
    END IF;
  END IF;
END$$

DELIMITER ;

-- Add comments to tables for documentation
ALTER TABLE hearing_lawyers COMMENT = 'Relationship table linking hearings to attending lawyers';
ALTER TABLE client_lawyers COMMENT = 'Relationship table linking clients to their lawyers';
ALTER TABLE case_lawyers COMMENT = 'Relationship table linking cases to associated lawyers with roles';

-- Migration completion log
INSERT INTO migration_log (migration_name, executed_at, description)
VALUES (
  '001_add_lawyer_relationships',
  NOW(),
  'Created relationship tables for hearing_lawyers, client_lawyers, and case_lawyers with data migration from existing text fields'
) ON DUPLICATE KEY UPDATE executed_at = NOW();

-- Create migration_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS migration_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  migration_name VARCHAR(255) UNIQUE NOT NULL,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description TEXT,

  INDEX idx_migration_name (migration_name),
  INDEX idx_executed_at (executed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verify migration success
SELECT
  'hearing_lawyers' as table_name,
  COUNT(*) as record_count
FROM hearing_lawyers
UNION ALL
SELECT
  'client_lawyers' as table_name,
  COUNT(*) as record_count
FROM client_lawyers
UNION ALL
SELECT
  'case_lawyers' as table_name,
  COUNT(*) as record_count
FROM case_lawyers;

-- Migration complete
SELECT 'Migration 001_add_lawyer_relationships completed successfully' as status;