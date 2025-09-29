-- Create the hearing_lawyers relationship table
-- Run this SQL in your database to enable lawyer multi-select functionality

CREATE TABLE IF NOT EXISTS `hearing_lawyers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hearing_id` int(11) NOT NULL,
  `lawyer_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_hearing_lawyer` (`hearing_id`, `lawyer_id`),
  KEY `idx_hearing_id` (`hearing_id`),
  KEY `idx_lawyer_id` (`lawyer_id`),
  CONSTRAINT `fk_hearing_lawyers_hearing` FOREIGN KEY (`hearing_id`) REFERENCES `hearings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_hearing_lawyers_lawyer` FOREIGN KEY (`lawyer_id`) REFERENCES `lawyers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;