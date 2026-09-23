<?php

include "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Only POST method is allowed";
    exit;
}

$supplierName = $_POST["supplier_name"] ?? "";
$phone = $_POST["phone"] ?? "";
$email = $_POST["email"] ?? "";
$address = $_POST["address"] ?? "";

if (empty($supplierName)) {
    echo "Supplier name is required";
    exit;
}

$sql = "INSERT INTO suppliers
        (supplier_name, phone, email, address)
        VALUES (?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "ssss",
    $supplierName,
    $phone,
    $email,
    $address
);

if ($stmt->execute()) {

    echo "Supplier added successfully";

} else {

    echo "Failed to add supplier: " . $stmt->error;

}

$stmt->close();
$conn->close();

?>