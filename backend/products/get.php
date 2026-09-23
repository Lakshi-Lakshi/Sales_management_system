<?php

include "../config/db.php";

$sql = "SELECT 
            products.id,
            products.product_name,
            categories.category_name,
            products.price,
            products.quantity
        FROM products
        LEFT JOIN categories
        ON products.category_id = categories.id
        ORDER BY products.id DESC";

$result = $conn->query($sql);

$products = [];

while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

header("Content-Type: application/json");

echo json_encode([
    "success" => true,
    "products" => $products
]);

$conn->close();

?>