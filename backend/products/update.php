<?php

include "../config/db.php";


// ==========================================
// Only POST Method Allowed
// ==========================================

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    echo "Only POST method is allowed";
    exit;

}


// ==========================================
// Get Form Data
// ==========================================

$id =
    $_POST["id"] ?? "";

$product_name =
    trim($_POST["product_name"] ?? "");

$category_id =
    $_POST["category_id"] ?? "";

$price =
    $_POST["price"] ?? "";

$quantity =
    $_POST["quantity"] ?? "";


// ==========================================
// Required Field Validation
// ==========================================

if (
    $id === "" ||
    $product_name === "" ||
    $category_id === "" ||
    $price === "" ||
    $quantity === ""
) {

    echo "All fields are required";
    exit;

}


// ==========================================
// Validate ID
// ==========================================

if (!is_numeric($id)) {

    echo "Invalid product ID";
    exit;

}


// ==========================================
// Validate Price and Quantity
// ==========================================

if (
    $price < 0 ||
    $quantity < 0
) {

    echo "Price and quantity cannot be negative";
    exit;

}


// ==========================================
// Update Product
// ==========================================

$sql = "
    UPDATE products
    SET
        product_name = ?,
        category_id = ?,
        price = ?,
        quantity = ?
    WHERE id = ?
";


$stmt =
    $conn->prepare($sql);


if (!$stmt) {

    echo "Failed to prepare product update";
    exit;

}


$stmt->bind_param(
    "sidii",
    $product_name,
    $category_id,
    $price,
    $quantity,
    $id
);


// ==========================================
// Execute Product Update
// ==========================================

if ($stmt->execute()) {


    // ======================================
    // Update Inventory
    // ======================================

    $inventory_sql = "
        UPDATE inventory
        SET
            available_quantity = ?,
            stock_level = ?
        WHERE product_id = ?
    ";


    $inventory_stmt =
        $conn->prepare(
            $inventory_sql
        );


    if ($inventory_stmt) {


        $inventory_stmt->bind_param(
            "iii",
            $quantity,
            $quantity,
            $id
        );


        $inventory_stmt->execute();


        $inventory_stmt->close();

    }


    echo "Product updated successfully";

}

else {

    echo "Failed to update product: " .
         $stmt->error;

}


// ==========================================
// Close
// ==========================================

$stmt->close();

$conn->close();

?>