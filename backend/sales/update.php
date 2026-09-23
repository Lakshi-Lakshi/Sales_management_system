<?php

include "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Only POST method is allowed";
    exit;
}

$id = $_POST["id"] ?? "";
$customerId = $_POST["customer"] ?? "";
$productId = $_POST["product"] ?? "";
$quantity = $_POST["saleQuantity"] ?? "";

if (empty($id) || empty($customerId) || empty($productId) || empty($quantity)) {
    echo "Sale ID, customer, product and quantity are required";
    exit;
}

$quantity = (int)$quantity;

if ($quantity <= 0) {
    echo "Quantity must be greater than 0";
    exit;
}

$conn->begin_transaction();

try {

    // Get old sale details
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

    $oldSale = $result->fetch_assoc();

    $oldProductId = (int)$oldSale["product_id"];
    $oldQuantity = (int)$oldSale["quantity"];

    $stmt->close();

    // Restore old stock
    $sql = "UPDATE products
            SET quantity = quantity + ?
            WHERE id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $oldQuantity, $oldProductId);
    $stmt->execute();
    $stmt->close();

    // Get new product details
    $sql = "SELECT product_name, price, quantity
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

    $productName = $product["product_name"];
    $price = (float)$product["price"];
    $availableQuantity = (int)$product["quantity"];

    $stmt->close();

    // Check new stock
    if ($quantity > $availableQuantity) {
        throw new Exception(
            "Insufficient stock. Available quantity: " . $availableQuantity
        );
    }

    // Calculate new total
    $total = $quantity * $price;

    // Update sale
    $sql = "UPDATE sales
            SET customer_id = ?,
                product_id = ?,
                quantity = ?,
                price = ?,
                total = ?
            WHERE id = ?";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "iiiddi",
        $customerId,
        $productId,
        $quantity,
        $price,
        $total,
        $id
    );

    if (!$stmt->execute()) {
        throw new Exception("Failed to update sale");
    }

    $stmt->close();

    // Reduce new product stock
    $newQuantity = $availableQuantity - $quantity;

    $sql = "UPDATE products
            SET quantity = ?
            WHERE id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $newQuantity, $productId);

    if (!$stmt->execute()) {
        throw new Exception("Failed to update product stock");
    }

    $stmt->close();

    // Update inventory for new product
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

    // Update invoice
    $sql = "UPDATE invoices
            SET product_details = ?,
                quantity = ?,
                price = ?,
                total = ?
            WHERE sale_id = ?";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "sid di",
        $productName,
        $quantity,
        $price,
        $total,
        $id
    );

    // Re-prepare correctly because bind types must match exactly
    $stmt->close();

    $sql = "UPDATE invoices
            SET product_details = ?,
                quantity = ?,
                price = ?,
                total = ?
            WHERE sale_id = ?";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "sid di",
        $productName,
        $quantity,
        $price,
        $total,
        $id
    );

    if (!$stmt->execute()) {
        throw new Exception("Failed to update invoice");
    }

    $stmt->close();

    $conn->commit();

    echo "Sale updated successfully";

} catch (Exception $e) {

    $conn->rollback();

    echo "Update failed: " . $e->getMessage();
}

$conn->close();

?>