<?php

include "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Only POST method is allowed";
    exit;
}

$id = $_POST["id"] ?? "";
$supplierId = $_POST["supplier"] ?? "";
$productId = $_POST["purchaseProduct"] ?? "";
$quantity = $_POST["purchaseQuantity"] ?? "";
$purchaseDate = $_POST["purchaseDate"] ?? "";

if (empty($id) || empty($supplierId) || empty($productId) || empty($quantity)) {
    echo "Purchase ID, supplier, product and quantity are required";
    exit;
}

$quantity = (int)$quantity;

if ($quantity <= 0) {
    echo "Quantity must be greater than 0";
    exit;
}

if (empty($purchaseDate)) {
    $purchaseDate = date("Y-m-d");
}

$conn->begin_transaction();

try {

    // Get old purchase details
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

    $oldPurchase = $result->fetch_assoc();

    $oldProductId = (int)$oldPurchase["product_id"];
    $oldQuantity = (int)$oldPurchase["quantity"];

    $stmt->close();

    // Remove old purchase quantity from old product stock
    $sql = "UPDATE products
            SET quantity = quantity - ?
            WHERE id = ?
            AND quantity >= ?";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "iii",
        $oldQuantity,
        $oldProductId,
        $oldQuantity
    );

    if (!$stmt->execute() || $stmt->affected_rows === 0) {
        throw new Exception("Failed to restore previous purchase stock");
    }

    $stmt->close();

    // Get new product
    $sql = "SELECT id, quantity
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

    // Add new purchase quantity
    $newQuantity = $currentQuantity + $quantity;

    $sql = "UPDATE products
            SET quantity = ?
            WHERE id = ?";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "ii",
        $newQuantity,
        $productId
    );

    if (!$stmt->execute()) {
        throw new Exception("Failed to update product stock");
    }

    $stmt->close();

    // Update purchase
    $sql = "UPDATE purchases
            SET supplier_id = ?,
                product_id = ?,
                quantity = ?,
                purchase_date = ?
            WHERE id = ?";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "iiisi",
        $supplierId,
        $productId,
        $quantity,
        $purchaseDate,
        $id
    );

    if (!$stmt->execute()) {
        throw new Exception("Failed to update purchase");
    }

    $stmt->close();

    // Update inventory
    $sql = "INSERT INTO inventory
            (product_id, available_quantity, stock_level)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
            available_quantity = VALUES(available_quantity),
            stock_level = VALUES(stock_level)";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "iii",
        $productId,
        $newQuantity,
        $newQuantity
    );

    if (!$stmt->execute()) {
        throw new Exception("Failed to update inventory");
    }

    $stmt->close();

    // Update old product inventory if product changed
    if ($oldProductId != $productId) {

        $sql = "SELECT quantity
                FROM products
                WHERE id = ?";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $oldProductId);
        $stmt->execute();

        $result = $stmt->get_result();
        $oldProduct = $result->fetch_assoc();

        $stmt->close();

        if ($oldProduct) {

            $oldProductQuantity = (int)$oldProduct["quantity"];

            $sql = "UPDATE inventory
                    SET available_quantity = ?,
                        stock_level = ?
                    WHERE product_id = ?";

            $stmt = $conn->prepare($sql);

            $stmt->bind_param(
                "iii",
                $oldProductQuantity,
                $oldProductQuantity,
                $oldProductId
            );

            $stmt->execute();

            $stmt->close();
        }
    }

    $conn->commit();

    echo "Purchase updated successfully";

} catch (Exception $e) {

    $conn->rollback();

    echo "Update failed: " . $e->getMessage();
}

$conn->close();

?>