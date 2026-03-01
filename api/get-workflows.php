<?php
// By centralizing the DB connection, you only need to update credentials in one place.
require_once 'db-config.php';
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
  $userId = filter_var($_GET["user_id"] ?? 1, FILTER_VALIDATE_INT);
  if ($userId === false) {
      http_response_code(400);
      echo json_encode(["status" => "error", "message" => "Invalid user_id."]);
      exit;
  }
  
  $page = filter_var($_GET['page'] ?? 1, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]]);
  $limit = filter_var($_GET['limit'] ?? 50, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1, "max_range" => 100]]);
  
  $page = $page ?: 1;
  $limit = $limit ?: 50;
  $offset = ($page - 1) * $limit;

  $stmt = $pdo->prepare("SELECT id, name, builder_json, updated_at FROM workflows WHERE user_id = :user_id ORDER BY updated_at DESC LIMIT :limit OFFSET :offset");
  
  // PDO needs params bound as integers for LIMIT/OFFSET
  $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
  $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
  $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
  $stmt->execute();
  
  $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

  foreach ($rows as &$r) {
    $r["builder_json"] = json_decode($r["builder_json"], true);
  }
  
  // Optional: Get total count for pagination metadata
  $countStmt = $pdo->prepare("SELECT COUNT(*) FROM workflows WHERE user_id = :user_id");
  $countStmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
  $countStmt->execute();
  $total = $countStmt->fetchColumn();

  echo json_encode([
      "status" => "success",
      "data" => $rows,
      "pagination" => [
          "page" => $page,
          "limit" => $limit,
          "total" => (int)$total,
          "total_pages" => ceil($total / $limit)
      ]
  ]);
} catch (Exception $e) {
  http_response_code(500);
  error_log("Get Workflows Error: " . $e->getMessage()); // Log error for debugging
  echo json_encode(["status" => "error", "message" => "Could not retrieve workflows."]);
}
?>