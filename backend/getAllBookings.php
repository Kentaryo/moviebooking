<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// ✅ Handle CORS preflight
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// ✅ Database connection
$conn = new mysqli("localhost", "root", "", "movie_db");
if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// ✅ Fetch all bookings + related movie info
$sql = "SELECT 
            b.id AS booking_id,
            b.name AS user_name,
            b.seats_booked,
            b.payment_method,
            b.created_at,
            m.title,
            m.director,
            m.year,
            m.price
        FROM bookings b
        INNER JOIN movies m ON b.movie_id = m.id
        ORDER BY b.created_at DESC";

$result = $conn->query($sql);

// ✅ Collect results
$bookings = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
}

// ✅ Send JSON response
echo json_encode($bookings, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

$conn->close();
?>
