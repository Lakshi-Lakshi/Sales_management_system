<?php

include "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Only POST method is allowed";
    exit;
}

$category_name = $_POST["category_name"] ?? "";

if (empty($category_name)) {
    echo "Category name is required";
    exit;
}

$sql = "INSERT INTO categories (category_name) VALUES (?)";

$stmt = $conn->prepare($sql);

$stmt->bind_param("s", $category_name);

if ($stmt->execute()) {

    echo "Category added successfully";

} else {

    echo "Failed to add category: " . $stmt->error;
}

$stmt->close();
$conn->close();

?>