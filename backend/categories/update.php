<?php

include "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Only POST method is allowed";
    exit;
}

$id = $_POST["id"] ?? "";
$categoryName = $_POST["categoryName"] ?? "";

if (empty($id) || empty($categoryName)) {
    echo "Category ID and name are required";
    exit;
}

$sql = "UPDATE categories
        SET category_name = ?
        WHERE id = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "si",
    $categoryName,
    $id
);

if ($stmt->execute()) {

    if ($stmt->affected_rows > 0) {

        echo "Category updated successfully";

    } else {

        echo "No category was updated";
    }

} else {

    echo "Failed to update category: " . $stmt->error;
}

$stmt->close();
$conn->close();

?>