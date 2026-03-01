<?php
require_once 'db-config.php';
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
// Limit payload size to 2MB (or whatever is appropriate for a huge builder JSON)
$max_size = 2 * 1024 * 1024;
if (isset($_SERVER['CONTENT_LENGTH']) && $_SERVER['CONTENT_LENGTH'] > $max_size) {
    http_response_code(413);
    echo json_encode(["status" => "error", "message" => "Payload too large. Maximum size is 2MB."]);
    exit;
}

try {
  $rawInput = file_get_contents("php://input");
  $data = json_decode($rawInput, true);

  if (json_last_error() !== JSON_ERROR_NONE || !isset($data["builder_json"])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid JSON payload"]);
    exit;
  }

  $userId = filter_var($data["user_id"] ?? 1, FILTER_VALIDATE_INT);
  if ($userId === false) {
      http_response_code(400);
      echo json_encode(["status" => "error", "message" => "Invalid user_id."]);
      exit;
  }

  $name = htmlspecialchars(strip_tags($data["name"] ?? "Untitled Workflow"), ENT_QUOTES, 'UTF-8');
  $builderJsonString = json_encode($data["builder_json"]);

  if (isset($data['id']) && !empty($data['id'])) {
      $id = filter_var($data['id'], FILTER_VALIDATE_INT);
      
      $stmt = $pdo->prepare(
        "UPDATE workflows SET name = :name, builder_json = :builder_json, updated_at = NOW() WHERE id = :id AND user_id = :user_id"
      );
      $stmt->bindValue(':name', $name, PDO::PARAM_STR);
      $stmt->bindValue(':builder_json', $builderJsonString, PDO::PARAM_STR);
      $stmt->bindValue(':id', $id, PDO::PARAM_INT);
      $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
      $stmt->execute();

      if ($stmt->rowCount() === 0) {
        // Might be not changed, or not found. So check existence to distinguish 404 from 200 (no rules changed)
        $check = $pdo->prepare("SELECT id FROM workflows WHERE id = :id AND user_id = :user_id");
        $check->execute([':id' => $id, ':user_id' => $userId]);
        if (!$check->fetchColumn()) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Workflow not found or not owned by user."]);
            exit;
        }
      }

      echo json_encode(["status" => "success", "id" => $id]);
  } else {
      $stmt = $pdo->prepare(
        "INSERT INTO workflows (user_id, name, builder_json) VALUES (:user_id, :name, :builder_json)"
      );
      $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
      $stmt->bindValue(':name', $name, PDO::PARAM_STR);
      $stmt->bindValue(':builder_json', $builderJsonString, PDO::PARAM_STR);
      $stmt->execute();
      
      echo json_encode(["status" => "success", "id" => $pdo->lastInsertId()]);
  }
} catch (Exception $e) {
  http_response_code(500);
  error_log("Save Workflow Error: " . $e->getMessage());
  echo json_encode(["status" => "error", "message" => "Could not save the workflow."]);
}
?>