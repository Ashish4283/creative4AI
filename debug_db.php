<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: text/plain");

echo "Checking environment...\n";
echo "PHP Version: " . phpversion() . "\n";
echo "Current Directory: " . __DIR__ . "\n";

$envPath = __DIR__ . '/.env';
echo "Checking .env at $envPath: " . (file_exists($envPath) ? "EXISTS" : "MISSING") . "\n";

if (file_exists($envPath)) {
    echo "Content of .env (first 10 chars): " . substr(file_get_contents($envPath), 0, 10) . "...\n";
}

require_once 'api/db-config.php';

echo "\nDatabase Connection Check:\n";
if (isset($pdo)) {
    echo "PDO Object: OK\n";
    try {
        $stmt = $pdo->query("SELECT 1");
        echo "Simple Query: OK\n";
    } catch (Exception $e) {
        echo "Query Failed: " . $e->getMessage() . "\n";
    }
} else {
    echo "PDO Object: MISSING (check db-config.php errors)\n";
}
?>
