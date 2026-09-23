<?php

include "../config/db.php";

$sql = "SELECT
            invoices.id,
            invoices.sale_id,
            invoices.product_details,
            invoices.quantity,
            invoices.price,
            invoices.total,
            invoices.invoice_date,
            sales.customer_id,
            customers.customer_name
        FROM invoices
        INNER JOIN sales
            ON invoices.sale_id = sales.id
        LEFT JOIN customers
            ON sales.customer_id = customers.id
        ORDER BY invoices.id DESC";

$result = $conn->query($sql);

$invoices = [];

if ($result) {

    while ($row = $result->fetch_assoc()) {
        $invoices[] = $row;
    }

    header("Content-Type: application/json");

    echo json_encode($invoices);

} else {

    header("Content-Type: application/json");

    echo json_encode([
        "error" => "Failed to retrieve invoices"
    ]);
}

$conn->close();

?>