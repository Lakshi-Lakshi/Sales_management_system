<?php

session_start();

include "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Only POST method is allowed";
    exit;
}

$username = $_POST["username"] ?? "";
$password = $_POST["password"] ?? "";

if (empty($username) || empty($password)) {
    echo "Username and password are required";
    exit;
}

$sql = "SELECT id, username, password, role FROM users WHERE username = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param("s", $username);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo "Invalid username or password";
    exit;
}

$user = $result->fetch_assoc();

if (password_verify($password, $user["password"])) {

    $_SESSION["user_id"] = $user["id"];
    $_SESSION["username"] = $user["username"];
    $_SESSION["role"] = $user["role"];

    echo "Login successful";

} else {

    echo "Invalid username or password";

}

$stmt->close();
$conn->close();

?>