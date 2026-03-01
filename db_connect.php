<?php
// db_connect.php - Include this file where you need database access

// Configuration - In production, use getenv() or a .env library
$db_host = '127.0.0.1';
$db_name = 'your_database_name';
$db_user = 'root';
$db_pass = '';
$db_charset = 'utf8mb4';

$dsn = "mysql:host=$db_host;dbname=$db_name;charset=$db_charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throw exceptions on errors
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Return arrays by default
    PDO::ATTR_EMULATE_PREPARES   => false,                  // Use real prepared statements (Security)
];

try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
} catch (\PDOException $e) {
    // Log the error internally
    error_log("Database Connection Error: " . $e->getMessage());
    
    // Return a generic error to the frontend (don't leak credentials)
    http_response_code(500);
    die(json_encode(["error" => "Internal Server Error: Database unavailable."]));
}
?>