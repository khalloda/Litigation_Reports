<?php
/**
 * User Table Setup Script
 * 
 * Creates the users table and default users for the litigation management system.
 */

// Include configuration
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../src/Models/User.php';

try {
    echo "Setting up users table...\n";
    
    // Create users table
    User::createTable();
    echo "✓ Users table created successfully\n";
    
    // Create default users
    User::createDefaultUsers();
    echo "✓ Default users created successfully\n";
    
    echo "\nDefault users created:\n";
    echo "- Super Admin: admin@litigation.com / admin123\n";
    echo "- Lawyer: lawyer@litigation.com / lawyer123\n";
    echo "- Staff: staff@litigation.com / staff123\n";
    
    echo "\nSetup completed successfully!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
