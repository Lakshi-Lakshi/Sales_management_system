<?php

include "../config/db.php";


// ==========================================
// CHECK REQUEST METHOD
// ==========================================

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    echo "Only POST method is allowed";

    exit;
}


// ==========================================
// GET FORM DATA
// ==========================================

$customer_id = $_POST["customer_id"] ?? "";
$product_id  = $_POST["product_id"] ?? "";
$quantity    = $_POST["quantity"] ?? "";
$price       = $_POST["price"] ?? "";
$total       = $_POST["total"] ?? "";


// ==========================================
// CHECK REQUIRED FIELDS
// ==========================================

if (
    $customer_id === "" ||
    $product_id === "" ||
    $quantity === "" ||
    $price === "" ||
    $total === ""
) {

    echo "All sale fields are required";

    exit;
}


// ==========================================
// CONVERT VALUES
// ==========================================

$customer_id = (int)$customer_id;

$product_id = (int)$product_id;

$quantity = (int)$quantity;

$price = (float)$price;

$total = (float)$total;


// ==========================================
// VALIDATE QUANTITY
// ==========================================

if ($quantity <= 0) {

    echo "Quantity must be greater than 0";

    exit;
}


// ==========================================
// VALIDATE PRICE
// ==========================================

if ($price < 0) {

    echo "Price cannot be negative";

    exit;
}


// ==========================================
// VALIDATE TOTAL
// ==========================================

if ($total < 0) {

    echo "Total cannot be negative";

    exit;
}


// ==========================================
// GET PRODUCT STOCK
// ==========================================

$stockSql = "
    SELECT product_name, quantity
    FROM products
    WHERE id = ?
";


$stockStmt = $conn->prepare($stockSql);


if (!$stockStmt) {

    echo "Stock query failed: " . $conn->error;

    exit;
}


$stockStmt->bind_param(
    "i",
    $product_id
);


$stockStmt->execute();


$stockResult =
    $stockStmt->get_result();


// ==========================================
// CHECK PRODUCT EXISTS
// ==========================================

if ($stockResult->num_rows === 0) {

    echo "Product not found";

    $stockStmt->close();

    $conn->close();

    exit;
}


// ==========================================
// GET PRODUCT DATA
// ==========================================

$product =
    $stockResult->fetch_assoc();


$productName =
    $product["product_name"];


$currentStock =
    (int)$product["quantity"];


$stockStmt->close();


// ==========================================
// CHECK AVAILABLE STOCK
// ==========================================

if ($quantity > $currentStock) {

    echo "Only " .
         $currentStock .
         " items are available";

    $conn->close();

    exit;
}


// ==========================================
// START TRANSACTION
// ==========================================

$conn->begin_transaction();


try {


    // ==========================================
    // INSERT SALE
    // ==========================================

    $sql = "
        INSERT INTO sales
        (
            customer_id,
            product_id,
            quantity,
            price,
            total
        )
        VALUES (?, ?, ?, ?, ?)
    ";


    $stmt =
        $conn->prepare($sql);


    if (!$stmt) {

        throw new Exception(
            "Sale prepare failed: " .
            $conn->error
        );
    }


    $stmt->bind_param(
        "iiidd",
        $customer_id,
        $product_id,
        $quantity,
        $price,
        $total
    );


    if (!$stmt->execute()) {

        throw new Exception(
            "Sale insert failed: " .
            $stmt->error
        );
    }


    // Get new sale ID

    $sale_id =
        $stmt->insert_id;


    $stmt->close();


    // ==========================================
    // CALCULATE NEW STOCK
    // ==========================================

    $newStock =
        $currentStock - $quantity;


    // ==========================================
    // UPDATE PRODUCT STOCK
    // ==========================================

    $updateSql = "
        UPDATE products
        SET quantity = ?
        WHERE id = ?
    ";


    $updateStmt =
        $conn->prepare($updateSql);


    if (!$updateStmt) {

        throw new Exception(
            "Product update prepare failed: " .
            $conn->error
        );
    }


    $updateStmt->bind_param(
        "ii",
        $newStock,
        $product_id
    );


    if (!$updateStmt->execute()) {

        throw new Exception(
            "Product stock update failed: " .
            $updateStmt->error
        );
    }


    $updateStmt->close();


    // ==========================================
    // UPDATE INVENTORY
    // ==========================================

    $inventorySql = "
        UPDATE inventory
        SET
            available_quantity = ?,
            stock_level = ?
        WHERE product_id = ?
    ";


    $inventoryStmt =
        $conn->prepare($inventorySql);


    if (!$inventoryStmt) {

        throw new Exception(
            "Inventory prepare failed: " .
            $conn->error
        );
    }


    $inventoryStmt->bind_param(
        "iii",
        $newStock,
        $newStock,
        $product_id
    );


    if (!$inventoryStmt->execute()) {

        throw new Exception(
            "Inventory update failed: " .
            $inventoryStmt->error
        );
    }


    $inventoryStmt->close();


    // ==========================================
    // CREATE INVOICE
    // ==========================================

    $invoiceSql = "
        INSERT INTO invoices
        (
            sale_id,
            product_details,
            quantity,
            price,
            total
        )
        VALUES (?, ?, ?, ?, ?)
    ";


    $invoiceStmt =
        $conn->prepare($invoiceSql);


    if (!$invoiceStmt) {

        throw new Exception(
            "Invoice prepare failed: " .
            $conn->error
        );
    }


    $invoiceStmt->bind_param(
        "isidd",
        $sale_id,
        $productName,
        $quantity,
        $price,
        $total
    );


    if (!$invoiceStmt->execute()) {

        throw new Exception(
            "Invoice insert failed: " .
            $invoiceStmt->error
        );
    }


    $invoiceStmt->close();


    // ==========================================
    // COMMIT TRANSACTION
    // ==========================================

    $conn->commit();


    echo "Sale recorded successfully";


} catch (Exception $e) {


    // ==========================================
    // ROLLBACK IF ERROR
    // ==========================================

    $conn->rollback();


    echo $e->getMessage();

}


// ==========================================
// CLOSE DATABASE
// ==========================================

$conn->close();

?>