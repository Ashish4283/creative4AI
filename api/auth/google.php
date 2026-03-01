<?php
require_once '../db-config.php';
require_once '../auth-guard.php'; // We need generate_jwt from here, but wait, it's in login.php

// Duplicate generate_jwt here for now, or move it to auth-guard.php
function generate_jwt($payload) {
    $secret = getenv('JWT_SECRET') ?: 'SUPER_SECRET_FALLBACK_KEY_CHANGE_ME_IMMEDIATELY_123!';
    
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    
    $payload['iat'] = time();
    $payload['exp'] = time() + (24 * 60 * 60);
    
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode($payload)));
    
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $rawInput = file_get_contents("php://input");
    $data = json_decode($rawInput, true);

    if (json_last_error() !== JSON_ERROR_NONE || !isset($data["credential"])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing Google credential"]);
        exit;
    }

    $id_token = $data["credential"];

    // 1. Verify the token with Google's public endpoint
    // In a prod environment, use the official Google API Client Library for PHP.
    // For this example, we'll verify via Google's tokeninfo endpoint (fine for basic use, but SDK is better)
    $verify_url = "https://oauth2.googleapis.com/tokeninfo?id_token=" . $id_token;
    $response = file_get_contents($verify_url);
    $google_data = json_decode($response, true);

    if (!$google_data || isset($google_data['error'])) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid Google Token"]);
        exit;
    }

    // Check if the aud (Client ID) matches yours here if you want extra security
    // $client_id = "YOUR_CLIENT_ID.apps.googleusercontent.com";
    // if($google_data['aud'] !== $client_id) { ... }

    $email = $google_data['email'];
    $name = $google_data['name'];
    $google_id = $google_data['sub'];

    // 2. Check if user already exists
    $stmt = $pdo->prepare("SELECT id, name, email, role FROM users WHERE email = :email");
    $stmt->bindValue(':email', $email, PDO::PARAM_STR);
    $stmt->execute();
    $user = $stmt->fetch();

    if ($user) {
        // User exists, update their provider info just in case
        $updateStmt = $pdo->prepare("UPDATE users SET auth_provider = 'google', provider_id = :provider_id WHERE id = :id");
        $updateStmt->execute([':provider_id' => $google_id, ':id' => $user['id']]);
        
        $userId = $user['id'];
        $userRole = $user['role'];
    } else {
        // Create new user completely without a password
        $insertStmt = $pdo->prepare("INSERT INTO users (name, email, role, auth_provider, provider_id) VALUES (:name, :email, 'user', 'google', :provider_id)");
        $insertStmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':provider_id' => $google_id
        ]);
        
        $userId = $pdo->lastInsertId();
        $userRole = 'user';
    }

    // 3. Issue our own system JWT
    $token = generate_jwt([
        'id' => (int)$userId,
        'email' => $email,
        'role' => $userRole,
        'name' => $name
    ]);

    echo json_encode([
        "status" => "success", 
        "message" => "Google Login successful", 
        "data" => [
            "token" => $token,
            "user" => [
                "id" => (int)$userId,
                "name" => $name,
                "email" => $email,
                "role" => $userRole
            ]
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    error_log("Google Auth Error: " . $e->getMessage());
    echo json_encode(["status" => "error", "message" => "Could not process Google login."]);
}
?>
