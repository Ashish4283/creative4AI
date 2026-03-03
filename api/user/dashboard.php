<?php
require_once '../db-config.php';
require_once '../auth-guard.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // 1. Authenticate user via JWT
    $userPayload = authenticate_request();
    $userId = (int)$userPayload['id'];
    
    // Initialize stats
    $stats = [];
    
    // Total workflows owned by this user
    $wfCountStmt = $pdo->prepare("SELECT COUNT(*) FROM workflows WHERE user_id = :user_id");
    $wfCountStmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
    $wfCountStmt->execute();
    $stats['total_workflows'] = (int)$wfCountStmt->fetchColumn();
    
    // Total App Users who interacted with this user's workflows
    try {
        $appUserCountStmt = $pdo->prepare("SELECT COUNT(*) FROM app_users WHERE saas_user_id = :user_id");
        $appUserCountStmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $appUserCountStmt->execute();
        $stats['total_app_users'] = (int)$appUserCountStmt->fetchColumn();
    } catch (PDOException $e) {
        $stats['total_app_users'] = 0; 
    }

    // Fetch user basic info + monetization metrics
    $userStmt = $pdo->prepare("SELECT name, email, role, subscription_tier, usage_balance FROM users WHERE id = :user_id");
    $userStmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
    $userStmt->execute();
    $userData = $userStmt->fetch(PDO::FETCH_ASSOC);

    // Recent Workflows (Owned or Assigned)
    // Join with users to get the name of the person assigned to the workflow
    $wfQuery = "SELECT w.id, w.name, w.updated_at, w.assigned_to, u.name as assigned_name 
                FROM workflows w 
                LEFT JOIN users u ON w.assigned_to = u.id
                WHERE w.user_id = :user_id OR w.assigned_to = :user_id 
                ORDER BY w.updated_at DESC LIMIT 5";
    $wfStmt = $pdo->prepare($wfQuery);
    $wfStmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
    $wfStmt->execute();
    $recentWorkflows = $wfStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => [
            "user" => $userData,
            "stats" => $stats,
            "recent_workflows" => $recentWorkflows
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    error_log("User Dashboard Error: " . $e->getMessage());
    echo json_encode(["status" => "error", "message" => "Could not fetch user dashboard metrics."]);
}
?>
