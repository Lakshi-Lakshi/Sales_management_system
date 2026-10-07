<?php

// ===============================
// DATABASE CONNECTION
// ===============================

include "../config/db.php";


// ===============================
// RESPONSE HEADER
// ===============================

header("Content-Type: application/json");


// ===============================
// SQL QUERY
// ===============================

$sql = "

    SELECT

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

    ORDER BY invoices.id DESC

";


// ===============================
// EXECUTE QUERY
// ===============================

$result = $conn->query($sql);


// ===============================
// CHECK RESULT
// ===============================

if (!$result) {

    echo json_encode([

        "success" => false,

        "error" => $conn->error

    ]);

    $conn->close();

    exit;

}


// ===============================
// STORE INVOICES
// ===============================

$invoices = [];


while ($row = $result->fetch_assoc()) {

    $invoices[] = $row;

}


// ===============================
// RETURN JSON
// ===============================

echo json_encode(
    $invoices
);


// ===============================
// CLOSE DATABASE
// ===============================

$conn->close();

?>

