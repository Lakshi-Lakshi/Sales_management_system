<?php

include "../config/db.php";

header("Content-Type: application/json");


// ===============================
// TOTAL PRODUCTS
// ===============================

$productQuery = $conn->query(
    "SELECT COUNT(*) AS total FROM products"
);

$productData = $productQuery->fetch_assoc();

$totalProducts = $productData["total"];


// ===============================
// TOTAL CUSTOMERS
// ===============================

$customerQuery = $conn->query(
    "SELECT COUNT(*) AS total FROM customers"
);

$customerData = $customerQuery->fetch_assoc();

$totalCustomers = $customerData["total"];


// ===============================
// TOTAL SALES
// ===============================

$salesQuery = $conn->query(
    "SELECT COUNT(*) AS total FROM sales"
);

$salesData = $salesQuery->fetch_assoc();

$totalSales = $salesData["total"];


// ===============================
// LOW STOCK
// ===============================

// Products with quantity <= 10

$lowStockQuery = $conn->query(
    "SELECT COUNT(*) AS total
     FROM products
     WHERE quantity <= 10"
);

$lowStockData = $lowStockQuery->fetch_assoc();

$lowStock = $lowStockData["total"];


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


$recentSales = [];


while (
    $row = $recentSalesQuery->fetch_assoc()
) {

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