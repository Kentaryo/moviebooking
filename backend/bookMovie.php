<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$conn = new mysqli("localhost", "root", "", "movie_db");
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed"]);
    exit;
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!is_array($data)) {
    echo json_encode(["error" => "Invalid JSON"]);
    exit;
}

$movie_id = isset($data["movie_id"]) ? (int)$data["movie_id"] : 0;
$name = isset($data["name"]) ? $conn->real_escape_string($data["name"]) : "Guest";
$seats_booked = isset($data["seats_booked"]) ? (int)$data["seats_booked"] : 1;
$payment_method = isset($data["payment_method"]) ? $conn->real_escape_string($data["payment_method"]) : "Cash";

if ($movie_id <= 0) {
    echo json_encode(["error" => "Invalid movie ID"]);
    exit;
}

$result = $conn->query("SELECT * FROM movies WHERE id = $movie_id");
if (!$result || $result->num_rows === 0) {
    echo json_encode(["error" => "Movie not found"]);
    exit;
}

$movie = $result->fetch_assoc();
if ($movie["available_seats"] < $seats_booked) {
    echo json_encode(["error" => "Not enough seats available"]);
    exit;
}

$newSeats = $movie["available_seats"] - $seats_booked;
$conn->query("UPDATE movies SET available_seats = $newSeats WHERE id = $movie_id");

$sql = "INSERT INTO bookings (movie_id, name, seats_booked, payment_method, created_at)
        VALUES ($movie_id, '$name', $seats_booked, '$payment_method', NOW())";

if ($conn->query($sql)) {
    echo json_encode(["success" => "Booking successful"]);
} else {
    echo json_encode(["error" => "Booking failed"]);
}

$conn->close();
