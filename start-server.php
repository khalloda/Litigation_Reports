<?php
/**
 * PHP Development Server Startup Script
 * 
 * Starts the PHP development server for the litigation management system.
 */

echo "Starting Litigation Management System API Server...\n";
echo "Server will be available at: http://localhost:8000\n";
echo "API endpoints will be available at: http://localhost:8000/api/\n";
echo "\nPress Ctrl+C to stop the server\n\n";

// Start the PHP development server
$command = "php -S localhost:8000 -t . api/index.php";
passthru($command);
