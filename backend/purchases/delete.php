<?php

include "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Only POST method is allowed";
    exit;
}

$id = $_POST["id"] ?? "";

if (empty($id)) {
    echo "Purchase ID is required";
    exit;
}

$conn->begin_transaction();

try {

    // Get purchase details
    $sql = "SELECT product_id, quantity
            FROM purchases
            WHERE id = ?
            FOR UPDATE";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("Purchase not found");
    }

    $purchase = $result->fetch_assoc();

    $productId = (int)$purchase["product_id"];
    $quantity = (int)$purchase["quantity"];

    $stmt->close();

    // Check current product stock
    $sql = "SELECT quantity
            FROM products
            WHERE id = ?
            FOR UPDATE";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $productId);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("Product not found");
    }

    $product = $result->fetch_assoc();

    $currentQuantity = (int)$product["quantity"];

    $stmt->close();

    // Prevent negative stock
    if ($currentQuantity < $quantity) {
        throw new Exception(
            "Cannot delete purchase because current stock is less than purchase quantity"
        );
    }

    // Reduce product stock
    $newQuantity = $currentQuantity - $quantity;

    $sql = "UPDATE products
            SET quantity = ?
            WHERE id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $newQuantity, $productId);

    if (!$stmt->execute()) {
        throw new Exception("Failed to update product stock");
    }

    $stmt->close();

    // Update inventory
    $sql = "UPDATE inventory
            SET available_quantity = ?,
                stock_level = ?
            WHERE product_id = ?";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "iii",
        $newQuantity,
        $newQuantity,
        $productId
    );

    if (!$stmt->execute()) {
        throw new Exception("Failed to update inventory");
    }

    $stmt->close();

    // Delete purchase
    $sql = "DELETE FROM purchases
            WHERE id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if (!$stmt->execute()) {
        throw new Exception("Failed to delete purchase");
    }

    if ($stmt->affected_rows === 0) {
        throw new Exception("Purchase not found");
    }

    $stmt->close();

    $conn->commit();

    echo "Purchase deleted successfully";

} catch (Exception $e) {

    $conn->rollback();

    echo "Delete failed: " . $e->getMessage();
}

$conn->close();

?>