-- Verify and create hearing_lawyers table if it doesn't exist
-- This script ensures the table exists with the correct structure

-- Check if table exists and create it if not
CREATE TABLE IF NOT EXISTS `hearing_lawyers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hearing_id` int NOT NULL,
  `lawyer_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_hearing_lawyer` (`hearing_id`,`lawyer_id`),
  KEY `idx_hearing_id` (`hearing_id`),
  KEY `idx_lawyer_id` (`lawyer_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign key constraints if they don't exist
-- Note: These will fail silently if constraints already exist
ALTER TABLE `hearing_lawyers`
ADD CONSTRAINT `fk_hearing_lawyers_hearing` FOREIGN KEY (`hearing_id`) REFERENCES `hearings` (`id`) ON DELETE CASCADE;

ALTER TABLE `hearing_lawyers`
ADD CONSTRAINT `fk_hearing_lawyers_lawyer` FOREIGN KEY (`lawyer_id`) REFERENCES `lawyers` (`id`) ON DELETE CASCADE;

-- Verify the table structure
DESCRIBE `hearing_lawyers`;

-- Check if there are any existing records
SELECT COUNT(*) as total_records FROM `hearing_lawyers`;