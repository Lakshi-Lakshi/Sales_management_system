<?php

include "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Only POST method is allowed";
    exit;
}

$customerName = $_POST["customer_name"] ?? "";
$phone = $_POST["phone"] ?? "";
$email = $_POST["email"] ?? "";
$address = $_POST["address"] ?? "";

if (empty($customerName)) {
    echo "Customer name is required";
    exit;
}

$sql = "INSERT INTO customers 
        (customer_name, phone, email, address)
        VALUES (?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "ssss",
    $customerName,
    $phone,
    $email,
    $address
);

if ($stmt->execute()) {

    echo "Customer added successfully";

} else {

    echo "Failed to add customer: " . $stmt->error;
}

$stmt->close();
$conn->close();

?>