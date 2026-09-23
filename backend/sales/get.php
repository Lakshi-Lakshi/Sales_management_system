<?php

include "../config/db.php";

$sql = "SELECT 
            sales.id,
            sales.customer_id,
            customers.customer_name,
            sales.product_id,
            products.product_name,
            sales.quantity,
            sales.price,
            sales.total,
            sales.sale_date
        FROM sales
        LEFT JOIN customers
            ON sales.customer_id = customers.id
        INNER JOIN products
            ON sales.product_id = products.id
        ORDER BY sales.id DESC";

$result = $conn->query($sql);

$sales = [];

if ($result) {

    while ($row = $result->fetch_assoc()) {
        $sales[] = $row;
    }

    header("Content-Type: application/json");
    echo json_encode($sales);

} else {

    header("Content-Type: application/json");

    echo json_encode([
        "error" => "Failed to retrieve sales"
    ]);
}

$conn->close();

?>