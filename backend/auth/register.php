<?php

include "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Only POST method is allowed";
    exit;
}

$username = $_POST["username"] ?? "";
$password = $_POST["password"] ?? "";
$role = $_POST["role"] ?? "sales_staff";

if (empty($username) || empty($password)) {
    echo "Username and password are required";
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";

$stmt = $conn->prepare($sql);

$stmt->bind_param("sss", $username, $hashedPassword, $role);

if ($stmt->execute()) {
    echo "User registered successfully";
} else {
    echo "Registration failed: " . $conn->error;
}

$stmt->close();
$conn->close();

?>