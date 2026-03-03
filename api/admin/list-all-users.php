<?php
require_once '../db-config.php';

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

try {
    // Fetch all users with basic stats
    $query = "SELECT 
                u.id, 
                u.name, 
                u.email, 
                u.role, 
                u.created_at, 
                (SELECT COUNT(*) FROM workflows WHERE user_id = u.id) as workflow_count
              FROM users u
              ORDER BY u.created_at DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => $users,
        "debug" => [
            "count" => count($users),
            "db" => [
                "name" => get_env_var('DB_NAME'),
                "host" => get_env_var('DB_HOST')
            ]
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Could not fetch users: " . $e->getMessage()
    ]);
}
?>
