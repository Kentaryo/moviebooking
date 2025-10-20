<?php
// ✅ Allow requests from your React app
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// ✅ Database connection
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "movie_db";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
  echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
  exit;
}

// ✅ Decode JSON data from the frontend
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["title"])) {
  echo json_encode(["error" => "Invalid input"]);
  exit;
}

// ✅ Escape input values
$title = $conn->real_escape_string($data["title"]);
$director = $conn->real_escape_string($data["director"]);
$year = (int)$data["year"];
$price = (float)$data["price"];
$available_seats = (int)$data["available_seats"];

// ✅ Insert into database
$sql = "INSERT INTO movies (title, director, year, price, available_seats)
        VALUES ('$title', '$director', $year, $price, $available_seats)";

if ($conn->query($sql)) {
  echo json_encode(["success" => "Movie added successfully!"]);
} else {
  echo json_encode(["error" => "Failed to add movie: " . $conn->error]);
}

$conn->close();
?>
