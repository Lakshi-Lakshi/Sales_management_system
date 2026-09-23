<?php

include "../config/db.php";

$sql = "SELECT
            purchases.id,
            purchases.supplier_id,
            suppliers.supplier_name,
            purchases.product_id,
            products.product_name,
            purchases.quantity,
            purchases.purchase_date
        FROM purchases
        LEFT JOIN suppliers
            ON purchases.supplier_id = suppliers.id
        INNER JOIN products
            ON purchases.product_id = products.id
        ORDER BY purchases.id DESC";

$result = $conn->query($sql);

$purchases = [];

if ($result) {

    while ($row = $result->fetch_assoc()) {
        $purchases[] = $row;
    }

    header("Content-Type: application/json");

    echo json_encode($purchases);

} else {

    header("Content-Type: application/json");

    echo json_encode([
        "error" => "Failed to retrieve purchases"
    ]);
}

$conn->close();

?>