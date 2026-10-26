<?php

include "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Only POST method is allowed";
    exit;
}

$product_name = trim($_POST["product_name"] ?? "");
$category_id = $_POST["category_id"] ?? "";
$price = $_POST["price"] ?? "";
$quantity = $_POST["quantity"] ?? "";

// Validate required fields
if (
    $product_name === "" ||
    $category_id === "" ||
    $price === "" ||
    $quantity === ""
) {
    echo "All fields are required";
    exit;
}

// Validate numeric values
if (
    !is_numeric($category_id) ||
    !is_numeric($price) ||
    !is_numeric($quantity)
) {
    echo "Invalid input values";
    exit;
}

$category_id = (int)$category_id;
$price = (float)$price;
$quantity = (int)$quantity;

// Validate values
if ($category_id <= 0) {
    echo "Please select a valid category";
    exit;
}

if ($price < 0 || $quantity < 0) {
    echo "Price and quantity cannot be negative";
    exit;
}

// Check duplicate product name
$check_sql = "SELECT id
              FROM products
              WHERE LOWER(TRIM(product_name)) = LOWER(?)";

$check_stmt = $conn->prepare($check_sql);
$check_stmt->bind_param("s", $product_name);
$check_stmt->execute();

$result = $check_stmt->get_result();

if ($result->num_rows > 0) {
    echo "This product already exists";
    $check_stmt->close();
    $conn->close();
    exit;
}

$check_stmt->close();

// Insert product
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

    // Insert initial inventory record
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

    if ($inventory_stmt->execute()) {
        echo "Product added successfully";
    } else {
        echo "Product added, but inventory creation failed";
    }

    $inventory_stmt->close();

} else {
    echo "Failed to add product";
}

$stmt->close();
$conn->close();

?>
