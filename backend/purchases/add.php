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

$supplierId = $_POST["supplier_id"] ?? "";
$productId = $_POST["product_id"] ?? "";
$quantity = $_POST["quantity"] ?? "";
$purchaseDate = $_POST["purchase_date"] ?? "";


// ==========================================
// CHECK REQUIRED FIELDS
// ==========================================

if (
    $supplierId === "" ||
    $productId === "" ||
    $quantity === ""
) {

    echo "Supplier, product and quantity are required";

    exit;
}


// ==========================================
// CONVERT VALUES
// ==========================================

$supplierId = (int)$supplierId;

$productId = (int)$productId;

$quantity = (int)$quantity;


// ==========================================
// VALIDATE QUANTITY
// ==========================================

if ($quantity <= 0) {

    echo "Quantity must be greater than 0";

    exit;
}


// ==========================================
// PURCHASE DATE
// ==========================================

if ($purchaseDate === "") {

    $purchaseDate = date("Y-m-d");
}


// ==========================================
// START TRANSACTION
// ==========================================

$conn->begin_transaction();


try {


    // ==========================================
    // CHECK PRODUCT
    // ==========================================

    $sql = "
        SELECT id, quantity
        FROM products
        WHERE id = ?
        FOR UPDATE
    ";


    $stmt =
        $conn->prepare($sql);


    if (!$stmt) {

        throw new Exception(
            "Product query failed: " .
            $conn->error
        );
    }


    $stmt->bind_param(
        "i",
        $productId
    );


    $stmt->execute();


    $result =
        $stmt->get_result();


    if ($result->num_rows === 0) {

        throw new Exception(
            "Product not found"
        );
    }


    $product =
        $result->fetch_assoc();


    $currentQuantity =
        (int)$product["quantity"];


    $stmt->close();


    // ==========================================
    // INSERT PURCHASE
    // ==========================================

    $sql = "
        INSERT INTO purchases
        (
            supplier_id,
            product_id,
            quantity,
            purchase_date
        )
        VALUES (?, ?, ?, ?)
    ";


    $stmt =
        $conn->prepare($sql);


    if (!$stmt) {

        throw new Exception(
            "Purchase prepare failed: " .
            $conn->error
        );
    }


    $stmt->bind_param(
        "iiis",
        $supplierId,
        $productId,
        $quantity,
        $purchaseDate
    );


    if (!$stmt->execute()) {

        throw new Exception(
            "Failed to save purchase: " .
            $stmt->error
        );
    }


    $stmt->close();


    // ==========================================
    // CALCULATE NEW STOCK
    // ==========================================

    $newQuantity =
        $currentQuantity + $quantity;


    // ==========================================
    // UPDATE PRODUCT STOCK
    // ==========================================

    $sql = "
        UPDATE products
        SET quantity = ?
        WHERE id = ?
    ";


    $stmt =
        $conn->prepare($sql);


    if (!$stmt) {

        throw new Exception(
            "Product update failed: " .
            $conn->error
        );
    }


    $stmt->bind_param(
        "ii",
        $newQuantity,
        $productId
    );


    if (!$stmt->execute()) {

        throw new Exception(
            "Failed to update product stock: " .
            $stmt->error
        );
    }


    $stmt->close();


    // ==========================================
    // UPDATE INVENTORY
    // ==========================================

    $sql = "
        INSERT INTO inventory
        (
            product_id,
            available_quantity,
            stock_level
        )
        VALUES (?, ?, ?)

        ON DUPLICATE KEY UPDATE

        available_quantity = VALUES(available_quantity),

        stock_level = VALUES(stock_level)
    ";


    $stmt =
        $conn->prepare($sql);


    if (!$stmt) {

        throw new Exception(
            "Inventory prepare failed: " .
            $conn->error
        );
    }


    $stmt->bind_param(
        "iii",
        $productId,
        $newQuantity,
        $newQuantity
    );


    if (!$stmt->execute()) {

        throw new Exception(
            "Failed to update inventory: " .
            $stmt->error
        );
    }


    $stmt->close();


    // ==========================================
    // COMMIT
    // ==========================================

    $conn->commit();


    echo "Purchase added successfully";


} catch (Exception $e) {


    // ==========================================
    // ROLLBACK
    // ==========================================

    $conn->rollback();


    echo "Purchase failed: " .
         $e->getMessage();
}


// ==========================================
// CLOSE DATABASE
// ==========================================

$conn->close();

?>