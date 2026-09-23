<?php

include "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Only POST method is allowed";
    exit;
}

$id = $_POST["id"] ?? "";

if (empty($id)) {
    echo "Product ID is required";
    exit;
}

$conn->begin_transaction();

try {

    $inventory_sql = "DELETE FROM inventory WHERE product_id = ?";

    $inventory_stmt = $conn->prepare($inventory_sql);
    $inventory_stmt->bind_param("i", $id);
    $inventory_stmt->execute();

    $product_sql = "DELETE FROM products WHERE id = ?";

    $product_stmt = $conn->prepare($product_sql);
    $product_stmt->bind_param("i", $id);
    $product_stmt->execute();

    if ($product_stmt->affected_rows === 0) {
        throw new Exception("Product not found");
    }

    $conn->commit();

    echo "Product deleted successfully";

    $inventory_stmt->close();
    $product_stmt->close();

} catch (Exception $e) {

    $conn->rollback();

    echo "Failed to delete product: " . $e->getMessage();
}

$conn->close();

?>