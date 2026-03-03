<?php
// api/analytics/usage.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../db-config.php';
require_once '../auth-guard.php';

$payload = authenticate_request();
$userId = $payload['id'];

try {
    // 1. Get User Usage & Tier
    $stmt = $pdo->prepare("SELECT usage_balance, subscription_tier FROM users WHERE id = :uid");
    $stmt->execute([':uid' => $userId]);
    $user = $stmt->fetch();

    $maxUsage = ($user['subscription_tier'] === 'enterprise') ? 5000 : (($user['subscription_tier'] === 'pro') ? 1000 : 100);
    $usagePercent = round(($user['usage_balance'] / $maxUsage) * 100, 1);

    // 2. Get Recent System interactions (Execution Logs)
    $stmt = $pdo->prepare("
        SELECT status, created_at, duration 
        FROM execution_logs 
        WHERE user_id = :uid 
        ORDER BY created_at DESC 
        LIMIT 5
    ");
    $stmt->execute([':uid' => $userId]);
    $logs = $stmt->fetchAll();

    // 3. Stats for Insights
    $stmt = $pdo->prepare("
        SELECT 
            COUNT(*) as total_executions,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as success_count,
            AVG(CAST(SUBSTRING_INDEX(duration, 's', 1) AS DECIMAL(10,2))) as avg_latency
        FROM execution_logs 
        WHERE user_id = :uid
    ");
    $stmt->execute([':uid' => $userId]);
    $stats = $stmt->fetch();

    echo json_encode([
        "status" => "success",
        "data" => [
            "usage_meter" => [
                "current" => (int)$user['usage_balance'],
                "max" => $maxUsage,
                "percent" => $usagePercent,
                "tier" => $user['subscription_tier']
            ],
            "recent_interactions" => $logs,
            "global_stats" => $stats
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
