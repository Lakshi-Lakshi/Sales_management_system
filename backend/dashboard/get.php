<?php

include "../config/db.php";

header("Content-Type: application/json");


// ===============================
// TOTAL PRODUCTS
// ===============================

$productQuery = $conn->query(
    "SELECT COUNT(*) AS total FROM products"
);

if (!$productQuery) {

    echo json_encode([
        "success" => false,
        "message" => "Products query failed: " . $conn->error
    ]);

    exit;
}

$productData = $productQuery->fetch_assoc();

$totalProducts = (int) $productData["total"];


// ===============================
// TOTAL CUSTOMERS
// ===============================

$customerQuery = $conn->query(
    "SELECT COUNT(*) AS total FROM customers"
);

if (!$customerQuery) {

    echo json_encode([
        "success" => false,
        "message" => "Customers query failed: " . $conn->error
    ]);

    exit;
}

$customerData = $customerQuery->fetch_assoc();

$totalCustomers = (int) $customerData["total"];


// ===============================
// TOTAL SALES
// ===============================

$salesQuery = $conn->query(
    "SELECT COUNT(*) AS total FROM sales"
);

if (!$salesQuery) {

    echo json_encode([
        "success" => false,
        "message" => "Sales query failed: " . $conn->error
    ]);

    exit;
}

$salesData = $salesQuery->fetch_assoc();

$totalSales = (int) $salesData["total"];


// ===============================
// LOW STOCK
// ===============================

$lowStockQuery = $conn->query(
    "SELECT COUNT(*) AS total
     FROM products
     WHERE quantity <= 5"
);

if (!$lowStockQuery) {

    echo json_encode([
        "success" => false,
        "message" => "Low stock query failed: " . $conn->error
    ]);

    exit;
}

$lowStockData = $lowStockQuery->fetch_assoc();

$lowStock = (int) $lowStockData["total"];


// ===============================
// RECENT SALES
// ===============================

$recentSalesQuery = $conn->query(
    "SELECT
        sales.id,
        customers.customer_name,
        products.product_name,
        sales.quantity,
        sales.total,
        sales.sale_date

     FROM sales

     LEFT JOIN customers
        ON sales.customer_id = customers.id

     INNER JOIN products
        ON sales.product_id = products.id

     ORDER BY sales.id DESC

     LIMIT 5"
);

if (!$recentSalesQuery) {

    echo json_encode([
        "success" => false,
        "message" => "Recent sales query failed: " . $conn->error
    ]);

    exit;
}


$recentSales = [];


while ($row = $recentSalesQuery->fetch_assoc()) {

    $recentSales[] = $row;

}


// ===============================
// SEND RESPONSE
// ===============================

echo json_encode([

    "success" => true,

    "totalProducts" => $totalProducts,

    "totalCustomers" => $totalCustomers,

    "totalSales" => $totalSales,

    "lowStock" => $lowStock,

    "recentSales" => $recentSales

]);


$conn->close();

?>
