<?php

include "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Only POST method is allowed";
    exit;
}

$id = $_POST["id"] ?? "";
$product_name = $_POST["product_name"] ?? "";
$category_id = $_POST["category_id"] ?? "";
$price = $_POST["price"] ?? "";
$quantity = $_POST["quantity"] ?? "";

if (
    empty($id) ||
    empty($product_name) ||
    empty($category_id) ||
    empty($price) ||
    $quantity === ""
) {
    echo "All fields are required";
    exit;
}

if ($price < 0 || $quantity < 0) {
    echo "Price and quantity cannot be negative";
    exit;
}

$sql = "UPDATE products
        SET product_name = ?,
            category_id = ?,
            price = ?,
            quantity = ?
        WHERE id = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "sidii",
    $product_name,
    $category_id,
    $price,
    $quantity,
    $id
);

if ($stmt->execute()) {

    $inventory_sql = "UPDATE inventory
                      SET available_quantity = ?,
                          stock_level = ?
                      WHERE product_id = ?";

    $inventory_stmt = $conn->prepare($inventory_sql);

    $inventory_stmt->bind_param(
        "iii",
        $quantity,
        $quantity,
        $id
    );

    $inventory_stmt->execute();

    echo "Product updated successfully";

    $inventory_stmt->close();

} else {

    echo "Failed to update product: " . $conn->error;
}

$stmt->close();
$conn->close();

?>