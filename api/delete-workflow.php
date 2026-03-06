<?php
require_once 'db-config.php';
require_once 'auth-guard.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Authenticate via JWT
$authPayload = authenticate_request();
$userId = $authPayload['id'];
$userRole = $authPayload['role'];

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed. Use DELETE."]);
    exit;
}

$id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);

if (!$id) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing or invalid workflow ID"]);
    exit;
}

try {
    // 1. Admins/Super Admins can delete anything.
    // 2. Others can delete if they own it or are a cluster manager for it.
    
    $whereClause = "";
    $params = [':id' => $id];

    if ($userRole === 'admin' || $userRole === 'super_admin') {
        $whereClause = "WHERE id = :id";
    } else {
        $whereClause = "WHERE id = :id AND (user_id = :user_id OR cluster_id IN (
            SELECT cluster_id FROM cluster_members WHERE user_id = :uid2 AND role = 'manager'
        ))";
        $params[':user_id'] = $userId;
        $params[':uid2'] = $userId;
    }

    // First check if it exists and user has permission
    $checkStmt = $pdo->prepare("SELECT id FROM workflows $whereClause");
    $checkStmt->execute($params);
    if (!$checkStmt->fetch()) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Access denied or workflow not found."]);
        exit;
    }

    // Perform deletion
    $delStmt = $pdo->prepare("DELETE FROM workflows $whereClause");
    $delStmt->execute($params);

    // Also delete history records if any
    $histStmt = $pdo->prepare("DELETE FROM workflow_history WHERE workflow_id = ?");
    $histStmt->execute([$id]);

    echo json_encode(["status" => "success", "message" => "Workflow deleted successfully"]);

} catch (Exception $e) {
    http_response_code(500);
    error_log("Delete Workflow Error: " . $e->getMessage());
    echo json_encode(["status" => "error", "message" => "Could not delete workflow."]);
}
?>
