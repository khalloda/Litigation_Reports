<?php
/**
 * Local Database Configuration
 * Customize these settings for your environment
 */

// Database credentials - UPDATE THESE FOR YOUR ENVIRONMENT
$mysql_host = 'localhost';
$mysql_username = 'root';
$mysql_password = '1234'; // Enter your MySQL password here
$mysql_database = 'litigation_db';

// You can also set these as environment variables:
// export MYSQL_HOST=localhost
// export MYSQL_USERNAME=root
// export MYSQL_PASSWORD=your_password
// export MYSQL_DATABASE=litigation_db

// Override with environment variables if set
$mysql_host = getenv('MYSQL_HOST') ?: $mysql_host;
$mysql_username = getenv('MYSQL_USERNAME') ?: $mysql_username;
$mysql_password = getenv('MYSQL_PASSWORD') ?: $mysql_password;
$mysql_database = getenv('MYSQL_DATABASE') ?: $mysql_database;

// Export for use in other scripts
return [
    'host' => $mysql_host,
    'username' => $mysql_username,
    'password' => $mysql_password,
    'database' => $mysql_database
];
?>
