<?php

include "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Only POST method is allowed";
    exit;
}

$id = $_POST["id"] ?? "";

if (empty($id)) {
    echo "Sale ID is required";
    exit;
}

$conn->begin_transaction();

try {

    // Get sale details before deleting
    $sql = "SELECT product_id, quantity
            FROM sales
            WHERE id = ?
            FOR UPDATE";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("Sale not found");
    }

    $sale = $result->fetch_assoc();

    $productId = (int)$sale["product_id"];
    $quantity = (int)$sale["quantity"];

    $stmt->close();

    // Restore product stock
    $sql = "UPDATE products
            SET quantity = quantity + ?
            WHERE id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $quantity, $productId);

    if (!$stmt->execute()) {
        throw new Exception("Failed to restore product stock");
    }

    $stmt->close();

    // Update inventory
    $sql = "UPDATE inventory
            SET available_quantity = available_quantity + ?,
                stock_level = stock_level + ?
            WHERE product_id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iii", $quantity, $quantity, $productId);

    if (!$stmt->execute()) {
        throw new Exception("Failed to update inventory");
    }

    $stmt->close();

    // Delete invoice
    $sql = "DELETE FROM invoices WHERE sale_id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if (!$stmt->execute()) {
        throw new Exception("Failed to delete invoice");
    }

    $stmt->close();

    // Delete sale
    $sql = "DELETE FROM sales WHERE id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if (!$stmt->execute()) {
        throw new Exception("Failed to delete sale");
    }

    if ($stmt->affected_rows === 0) {
        throw new Exception("Sale not found");
    }

    $stmt->close();

    $conn->commit();

    echo "Sale deleted successfully";

} catch (Exception $e) {

    $conn->rollback();

    echo "Delete failed: " . $e->getMessage();
}

$conn->close();

?>