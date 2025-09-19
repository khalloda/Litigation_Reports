<?php
/**
 * Document Directory Protection
 *
 * This file prevents direct access to the documents directory.
 * All document access should go through the API endpoints.
 */

http_response_code(403);
header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Access Denied</title>
    <meta charset="UTF-8">
</head>
<body>
    <h1>403 - Access Denied</h1>
    <p>Direct access to this directory is not allowed.</p>
    <p>Documents can only be accessed through the application's secure API endpoints.</p>
</body>
</html>