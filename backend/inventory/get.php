<?php

include "../config/db.php";

$sql = "SELECT
            inventory.id,
            inventory.product_id,
            products.product_name,
            categories.category_name,
            inventory.available_quantity,
            inventory.stock_level
        FROM inventory
        INNER JOIN products
            ON inventory.product_id = products.id
        LEFT JOIN categories
            ON products.category_id = categories.id
        ORDER BY inventory.id DESC";

$result = $conn->query($sql);

$inventory = [];

if ($result) {

    while ($row = $result->fetch_assoc()) {
        $inventory[] = $row;
    }

    header("Content-Type: application/json");

    echo json_encode($inventory);

} else {

    header("Content-Type: application/json");

    echo json_encode([
        "error" => "Failed to retrieve inventory"
    ]);
}

$conn->close();

?>