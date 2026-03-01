<?php
// api/db-config.php

// 1. Configure CORS
$allowed_origins = getenv('ALLOWED_ORIGINS') ? explode(',', getenv('ALLOWED_ORIGINS')) : ['*']; // Allow all by default if not set, but restrict in prod
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array('*', $allowed_origins) || in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . ($origin ?: '*'));
} else {
    header("Access-Control-Allow-Origin: null"); // Prevent unauthorized access
}

header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Max-Age: 86400"); // Cache preflight request for 1 day

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 2. Load .env file manually if it exists (since getenv() often fails in shared hosting)
function loadEnv($path) {
    if (!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value, " \t\n\r\0\x0B\"'");
        if (!getenv($name)) {
            putenv("{$name}={$value}");
        }
    }
}
loadEnv(__DIR__ . '/../.env');

// 3. Database Credentials
$host = getenv('DB_HOST') ?: "127.0.0.1";
$db   = getenv('DB_NAME') ?: "u879603724_creative4ai";
$user = getenv('DB_USER') ?: "u879603724_creative4ai_us";
// Try both common password keys - No hardcoded fallback for security
$pass = getenv('DB_PASS') ?: getenv('DB_PASSWORD');

if (!$pass) {
    error_log("Security Error: Database password not found in environment.");
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Server configuration error."]);
    exit;
}

// 3. PDO Connection Setup
$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false, // Very important for security against SQL Injection
    PDO::ATTR_STRINGIFY_FETCHES  => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    error_log("Database Connection Error: " . $e->getMessage()); // Log error instead of exposing it
    echo json_encode(["status" => "error", "message" => "Database connection failed."]);
    exit;
}
?>