<?php
// ✅ Handle preflight (OPTIONS) requests first
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    http_response_code(200);
    exit;
}

// ✅ Set CORS headers for real requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// ✅ Database connection
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "movie_db";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// ✅ Read JSON input
$input = file_get_contents("php://input");
$data = json_decode($input);

if (!$data || !isset($data->name) || !isset($data->email) || !isset($data->password)) {
    echo json_encode(["success" => false, "error" => "Missing fields"]);
    exit;
}

$name = trim($data->name);
$email = trim($data->email);
$password = trim($data->password);

// ✅ Validate
if (empty($name) || empty($email) || empty($password)) {
    echo json_encode(["success" => false, "error" => "All fields required"]);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "error" => "Invalid email"]);
    exit;
}

// ✅ Check existing email
$check = $conn->prepare("SELECT id FROM users WHERE email=?");
$check->bind_param("s", $email);
$check->execute();
$result = $check->get_result();
if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "error" => "Email already registered"]);
    exit;
}

// ✅ Insert
$hashed = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $hashed);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User registered successfully"]);
} else {
    echo json_encode(["success" => false, "error" => "Registration failed"]);
}

$stmt->close();
$conn->close();
?>
