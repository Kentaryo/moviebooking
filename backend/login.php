<?php
// backend/api/login.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection (no external db.php)
$host = "localhost";
$user = "root"; // your MySQL username
$pass = ""; // your MySQL password
$dbname = "movie_db"; // change this to your database name

$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit;
}

// Read input from React
$input = json_decode(file_get_contents("php://input"), true);
$email = trim($input["email"] ?? "");
$password = trim($input["password"] ?? "");

// Validate fields
if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit;
}

// Check if user exists
$stmt = $conn->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

// Validate user credentials
if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // Compare entered password with hashed password in DB
    if (password_verify($password, $user["password"])) {
        echo json_encode([
            "success" => true,
            "message" => "Login successful!",
            "user" => [
                "id" => $user["id"],
                "name" => $user["name"],
                "email" => $user["email"]
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid password."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Email not found."]);
}

$stmt->close();
$conn->close();
?>
