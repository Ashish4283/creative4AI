<?php
require_once '../db-config.php';
require_once '../auth-guard.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $userPayload = authenticate_request();
    $userId = (int)$userPayload['id'];
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
        throw new Exception("Invalid payload");
    }

    $updates = [];
    $params = [':id' => $userId];

    if (isset($data['name'])) {
        $updates[] = "name = :name";
        $params[':name'] = trim($data['name']);
    }

    if (isset($data['avatar_url'])) {
        $updates[] = "avatar_url = :avatar";
        $params[':avatar'] = $data['avatar_url'];
    }

    if (isset($data['notification_prefs'])) {
        $updates[] = "notification_prefs = :notif";
        $params[':notif'] = json_encode($data['notification_prefs']);
    }

    if (isset($data['builder_prefs'])) {
        $updates[] = "builder_prefs = :builder";
        $params[':builder'] = json_encode($data['builder_prefs']);
    }
    
    if (isset($data['api_key'])) {
        $updates[] = "api_key = :api_key";
        $params[':api_key'] = $data['api_key'];
    }

    if (empty($updates)) {
        throw new Exception("Nothing to update");
    }

    $sql = "UPDATE users SET " . implode(", ", $updates) . " WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    echo json_encode([
        "status" => "success",
        "message" => "System configuration synchronized."
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
