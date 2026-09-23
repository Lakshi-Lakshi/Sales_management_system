<?php

include "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Only POST method is allowed";
    exit;
}

$product_name = $_POST["product_name"] ?? "";
$category_id = $_POST["category_id"] ?? "";
$price = $_POST["price"] ?? "";
$quantity = $_POST["quantity"] ?? "";

if (
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

$sql = "INSERT INTO products 
        (product_name, category_id, price, quantity)
        VALUES (?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "sidi",
    $product_name,
    $category_id,
    $price,
    $quantity
);

if ($stmt->execute()) {

    $product_id = $stmt->insert_id;

    $inventory_sql = "INSERT INTO inventory
                      (product_id, available_quantity, stock_level)
                      VALUES (?, ?, ?)";

    $inventory_stmt = $conn->prepare($inventory_sql);

    $inventory_stmt->bind_param(
        "iii",
        $product_id,
        $quantity,
        $quantity
    );

    $inventory_stmt->execute();

    echo "Product added successfully";

    $inventory_stmt->close();

} else {

    echo "Failed to add product: " . $conn->error;
}

$stmt->close();
$conn->close();

?>