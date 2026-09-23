<?php

include "../config/db.php";

$sql = "SELECT id, supplier_name, phone, email, address, created_at
        FROM suppliers
        ORDER BY id DESC";

$result = $conn->query($sql);

$suppliers = [];

if ($result) {

    while ($row = $result->fetch_assoc()) {

        $suppliers[] = $row;

    }

    header("Content-Type: application/json");

    echo json_encode($suppliers);

} else {

    header("Content-Type: application/json");

    echo json_encode([
        "error" => "Failed to retrieve suppliers"
    ]);
}

$conn->close();

?>
