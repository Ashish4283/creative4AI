<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../db-config.php';
require_once '../auth-guard.php';

// Only admins can access this list
$payload = authenticate_request();
    $user_id = $payload['id'];
    $role = $payload['role'] ?? 'tech_user';
    $org_id = $payload['org_id'] ?? null;
    
    try {
        $query = "SELECT 
                u.id, 
                u.name, 
                u.email, 
                u.role, 
                u.created_at, 
                u.trial_ends_at, 
                u.manager_id,
                u.org_id,
                o.name as org_name,
                m.name as manager_name,
                (SELECT COUNT(*) FROM workflows WHERE user_id = u.id) as workflow_count,
                c.id as cluster_id,
                c.name as cluster_name
              FROM users u
              LEFT JOIN users m ON u.manager_id = m.id
              LEFT JOIN organizations o ON u.org_id = o.id
              LEFT JOIN cluster_members cm ON u.id = cm.user_id
              LEFT JOIN clusters c ON cm.cluster_id = c.id
              WHERE 1=1";

    $params = [];

    if ($role === 'super_admin') {
        // sees everyone
    } elseif ($role === 'admin') {
        // sees their own organization's users
        if ($org_id) {
            $query .= " AND u.org_id = ?";
            $params[] = $org_id;
        } else {
            // fallback: only see self and those they manage
            $query .= " AND (u.id = ? OR u.manager_id = ?)";
            $params[] = $user_id;
            $params[] = $user_id;
        }
    } elseif ($role === 'manager') {
        // sees people they manage directly OR people in their clusters
        $query .= " AND (u.id = ? OR u.manager_id = ? OR u.id IN (
            SELECT cm2.user_id FROM cluster_members cm1
            JOIN cluster_members cm2 ON cm1.cluster_id = cm2.cluster_id
            WHERE cm1.user_id = ?
        ))";
        $params[] = $user_id;
        $params[] = $user_id;
        $params[] = $user_id;
    } else {
        // others only see themselves
        $query .= " AND u.id = ?";
        $params[] = $user_id;
    }

    $query .= " ORDER BY u.created_at DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => $users
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Could not fetch users: " . $e->getMessage()
    ]);
}
?>
