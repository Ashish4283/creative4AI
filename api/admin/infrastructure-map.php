<?php
// api/admin/infrastructure-map.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../db-config.php';
require_once '../auth-guard.php';

$payload = authenticate_request();
require_role($payload, ['manager', 'admin']); // super_admin bypassed by require_role

try {
    $role = $payload['role'];
    $org_id = $payload['org_id'] ?? null;
    $user_id = $payload['id'];

    // 1. Fetch Clusters
    $clustersQuery = "SELECT c.id, c.name, c.description, c.org_id, o.name as org_name 
                      FROM clusters c 
                      LEFT JOIN organizations o ON c.org_id = o.id";
    $clustersParams = [];

    if ($role === 'admin' && $org_id) {
        $clustersQuery = "SELECT c.id, c.name, c.description, c.org_id, o.name as org_name 
                          FROM clusters c 
                          LEFT JOIN organizations o ON c.org_id = o.id
                          WHERE c.org_id = ?";
        $clustersParams[] = $org_id;
    } elseif ($role === 'manager') {
        $clustersQuery = "SELECT c.id, c.name, c.description, c.org_id, o.name as org_name 
                          FROM clusters c 
                          JOIN cluster_members cm ON c.id = cm.cluster_id 
                          LEFT JOIN organizations o ON c.org_id = o.id
                          WHERE cm.user_id = ?";
        $clustersParams[] = $user_id;
    } else {
        $clustersQuery = "SELECT c.id, c.name, c.description, c.org_id, o.name as org_name 
                          FROM clusters c 
                          LEFT JOIN organizations o ON c.org_id = o.id";
    }

    $stmt = $pdo->prepare($clustersQuery);
    $stmt->execute($clustersParams);
    $clusters = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Fetch Workflows for these clusters
    $infrastructure = [];
    foreach ($clusters as $cluster) {
        $wfStmt = $pdo->prepare("SELECT id, name, description, status, updated_at FROM workflows WHERE cluster_id = ?");
        $wfStmt->execute([$cluster['id']]);
        $cluster['workflows'] = $wfStmt->fetchAll(PDO::FETCH_ASSOC);
        
        // 3. Fetch Team Members for these clusters
        $memStmt = $pdo->prepare("SELECT u.id, u.name, u.email, u.role FROM users u 
                                  JOIN cluster_members cm ON u.id = cm.user_id 
                                  WHERE cm.cluster_id = ?");
        $memStmt->execute([$cluster['id']]);
        $cluster['members'] = $memStmt->fetchAll(PDO::FETCH_ASSOC);
        
        $infrastructure[] = $cluster;
    }

    echo json_encode([
        "status" => "success",
        "data" => $infrastructure
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
