<?php

include "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Only POST method is allowed";
    exit;
}

$id = $_POST["id"] ?? "";

if (empty($id)) {
    echo "Category ID is required";
    exit;
}

$sql = "DELETE FROM categories WHERE id = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param("i", $id);

if ($stmt->execute()) {

    if ($stmt->affected_rows > 0) {

        echo "Category deleted successfully";

    } else {

        echo "Category not found";
    }

} else {

    echo "Failed to delete category: " . $stmt->error;
}

$stmt->close();
$conn->close();

?>