<?php

include "../config/db.php";

$type = $_GET["type"] ?? "";
$period = $_GET["period"] ?? "";
$startDate = $_GET["start_date"] ?? "";
$endDate = $_GET["end_date"] ?? "";

if (empty($type) || empty($period)) {

    http_response_code(400);

    echo json_encode([
        "message" => "Report type and period are required"
    ]);

    exit;
}

/*
|--------------------------------------------------------------------------
| Set date condition
|--------------------------------------------------------------------------
*/

$dateCondition = "";
$dateParams = [];
$dateTypes = "";

if ($period === "daily") {

    $dateCondition = "DATE(sale_date) = CURDATE()";

} elseif ($period === "weekly") {

    $dateCondition = "YEARWEEK(sale_date, 1) = YEARWEEK(CURDATE(), 1)";

} elseif ($period === "monthly") {

    $dateCondition = "YEAR(sale_date) = YEAR(CURDATE())
                      AND MONTH(sale_date) = MONTH(CURDATE())";

} elseif ($period === "custom") {

    if (empty($startDate) || empty($endDate)) {

        http_response_code(400);

        echo json_encode([
            "message" => "Start date and end date are required"
        ]);

        exit;
    }

    $dateCondition = "DATE(sale_date) BETWEEN ? AND ?";

    $dateParams = [$startDate, $endDate];
    $dateTypes = "ss";

} else {

    http_response_code(400);

    echo json_encode([
        "message" => "Invalid report period"
    ]);

    exit;
}

/*
|--------------------------------------------------------------------------
| Sales Report
|--------------------------------------------------------------------------
*/

if ($type === "sales" || $type === "summary") {

    $sql = "SELECT
                sales.id,
                customers.customer_name,
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
            WHERE $dateCondition
            ORDER BY sales.sale_date DESC";

    $stmt = $conn->prepare($sql);

    if (!empty($dateParams)) {
        $stmt->bind_param($dateTypes, ...$dateParams);
    }

    $stmt->execute();

    $result = $stmt->get_result();

    $records = [];

    while ($row = $result->fetch_assoc()) {
        $records[] = $row;
    }

    $stmt->close();

    /*
    |--------------------------------------------------------------------------
    | Sales Summary
    |--------------------------------------------------------------------------
    */

    $summarySql = "SELECT
                       COALESCE(SUM(total), 0) AS total_sales,
                       COALESCE(SUM(quantity), 0) AS items_sold
                   FROM sales
                   WHERE $dateCondition";

    $stmt = $conn->prepare($summarySql);

    if (!empty($dateParams)) {
        $stmt->bind_param($dateTypes, ...$dateParams);
    }

    $stmt->execute();

    $summaryResult = $stmt->get_result();

    $summary = $summaryResult->fetch_assoc();

    $stmt->close();

    /*
    |--------------------------------------------------------------------------
    | Purchase Summary
    |--------------------------------------------------------------------------
    */

    $purchaseCondition = str_replace(
        "sale_date",
        "purchase_date",
        $dateCondition
    );

    $purchaseSql = "SELECT
                        COALESCE(SUM(quantity), 0) AS items_purchased
                    FROM purchases
                    WHERE $purchaseCondition";

    $stmt = $conn->prepare($purchaseSql);

    if (!empty($dateParams)) {
        $stmt->bind_param($dateTypes, ...$dateParams);
    }

    $stmt->execute();

    $purchaseResult = $stmt->get_result();

    $purchaseSummary = $purchaseResult->fetch_assoc();

    $stmt->close();

    /*
    |--------------------------------------------------------------------------
    | Total Purchase Amount
    |--------------------------------------------------------------------------
    */

    $summary["total_purchases"] = 0;
    $summary["items_purchased"] = $purchaseSummary["items_purchased"] ?? 0;

    header("Content-Type: application/json");

    echo json_encode([
        "summary" => [
            "total_sales" => $summary["total_sales"] ?? 0,
            "total_purchases" => $summary["total_purchases"] ?? 0,
            "items_sold" => $summary["items_sold"] ?? 0,
            "items_purchased" => $summary["items_purchased"] ?? 0
        ],
        "records" => $records
    ]);

    $conn->close();

    exit;
}

/*
|--------------------------------------------------------------------------
| Purchase Report
|--------------------------------------------------------------------------
*/

if ($type === "purchases") {

    $sql = "SELECT
                purchases.id,
                suppliers.supplier_name,
                products.product_name,
                purchases.quantity,
                purchases.purchase_date
            FROM purchases
            LEFT JOIN suppliers
                ON purchases.supplier_id = suppliers.id
            INNER JOIN products
                ON purchases.product_id = products.id
            WHERE $dateCondition
            ORDER BY purchases.purchase_date DESC";

    $stmt = $conn->prepare($sql);

    if (!empty($dateParams)) {
        $stmt->bind_param($dateTypes, ...$dateParams);
    }

    $stmt->execute();

    $result = $stmt->get_result();

    $records = [];

    while ($row = $result->fetch_assoc()) {
        $records[] = $row;
    }

    $stmt->close();

    $totalQuantity = 0;

    foreach ($records as $record) {
        $totalQuantity += (int)$record["quantity"];
    }

    header("Content-Type: application/json");

    echo json_encode([
        "summary" => [
            "total_sales" => 0,
            "total_purchases" => 0,
            "items_sold" => 0,
            "items_purchased" => $totalQuantity
        ],
        "records" => $records
    ]);

    $conn->close();

    exit;
}

/*
|--------------------------------------------------------------------------
| Invalid Report Type
|--------------------------------------------------------------------------
*/

http_response_code(400);

header("Content-Type: application/json");

echo json_encode([
    "message" => "Invalid report type"
]);

$conn->close();

?>