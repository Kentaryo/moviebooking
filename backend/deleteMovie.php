<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection
$conn = new mysqli("localhost", "root", "", "movie_db");
if ($conn->connect_error) {
  die(json_encode(["error" => "Database connection failed."]));
}

// Get POST data
$id = $_POST["id"] ?? null;

if (!$id) {
  echo json_encode(["error" => "Movie ID required"]);
  exit;
}

// Prevent SQL injection
$id = intval($id);

// Delete query
$sql = "DELETE FROM movies WHERE id = $id";

if ($conn->query($sql)) {
  echo json_encode(["success" => "Movie deleted successfully!"]);
} else {
  echo json_encode(["error" => "Delete failed: " . $conn->error]);
}

$conn->close();
?>
