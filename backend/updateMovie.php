<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "movie_db";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$id = $_GET["id"] ?? 0;
$data = json_decode(file_get_contents("php://input"), true);

$title = $data["title"] ?? "";
$director = $data["director"] ?? "";
$year = $data["year"] ?? 0;
$price = $data["price"] ?? 0;
$available_seats = $data["available_seats"] ?? 0;

if ($id == 0) {
    echo json_encode(["error" => "Missing movie ID"]);
    exit;
}

$stmt = $conn->prepare("UPDATE movies SET title=?, director=?, year=?, price=?, available_seats=? WHERE id=?");
$stmt->bind_param("ssidis", $title, $director, $year, $price, $available_seats, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => "Movie updated successfully!"]);
} else {
    echo json_encode(["error" => "Failed to update movie."]);
}

$stmt->close();
$conn->close();
?>
