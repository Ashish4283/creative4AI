<?php
// Run this script in your browser or terminal to test the connection
// Usage: php test_db_connection.php

$host = '127.0.0.1'; // Try '127.0.0.1' instead of 'localhost' to force IPv4
$db   = 'your_database_name'; // REPLACE THIS
$user = 'root';               // REPLACE THIS
$pass = '';                   // REPLACE THIS
$port = "3306";               // Default MySQL port
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

echo "Attempting connection to $host:$port for DB '$db'...\n";

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    echo "✅ SUCCESS: Connected to MySQL successfully!";
} catch (\PDOException $e) {
    echo "❌ ERROR: Connection failed.\n";
    echo "Message: " . $e->getMessage() . "\n";
    echo "Code: " . $e->getCode() . "\n";
    
    if ($e->getCode() == 2002) {
        echo "\nTip: This is often a network/socket error. Ensure MySQL is running and try changing 'localhost' to '127.0.0.1'.";
    }
}
?>