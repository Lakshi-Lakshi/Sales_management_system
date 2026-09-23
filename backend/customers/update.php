<?php

include "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Only POST method is allowed";
    exit;
}

$id = $_POST["id"] ?? "";
$customerName = $_POST["customerName"] ?? "";
$phone = $_POST["phone"] ?? "";
$email = $_POST["email"] ?? "";
$address = $_POST["address"] ?? "";

if (empty($id) || empty($customerName)) {
    echo "Customer ID and customer name are required";
    exit;
}

$sql = "UPDATE customers
        SET customer_name = ?,
            phone = ?,
            email = ?,
            address = ?
        WHERE id = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "ssssi",
    $customerName,
    $phone,
    $email,
    $address,
    $id
);

if ($stmt->execute()) {

    if ($stmt->affected_rows > 0) {
        echo "Customer updated successfully";
    } else {
        echo "No customer was updated";
    }

} else {

    echo "Failed to update customer: " . $stmt->error;
}

$stmt->close();
$conn->close();

?>