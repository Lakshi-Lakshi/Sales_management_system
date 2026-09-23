<?php

include "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Only POST method is allowed";
    exit;
}

$id = $_POST["id"] ?? "";
$supplierName = $_POST["supplierName"] ?? "";
$phone = $_POST["phone"] ?? "";
$email = $_POST["email"] ?? "";
$address = $_POST["address"] ?? "";

if (empty($id) || empty($supplierName)) {
    echo "Supplier ID and supplier name are required";
    exit;
}

$sql = "UPDATE suppliers
        SET supplier_name = ?,
            phone = ?,
            email = ?,
            address = ?
        WHERE id = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "ssssi",
    $supplierName,
    $phone,
    $email,
    $address,
    $id
);

if ($stmt->execute()) {

    if ($stmt->affected_rows > 0) {
        echo "Supplier updated successfully";
    } else {
        echo "No supplier was updated";
    }

} else {

    echo "Failed to update supplier: " . $stmt->error;
}

$stmt->close();
$conn->close();

?>