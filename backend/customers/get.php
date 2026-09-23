<?php

include "../config/db.php";

$sql = "SELECT id, customer_name, phone, email, address, created_at
        FROM customers
        ORDER BY id DESC";

$result = $conn->query($sql);

$customers = [];

if ($result) {

    while ($row = $result->fetch_assoc()) {

        $customers[] = $row;

    }

    header("Content-Type: application/json");

    echo json_encode($customers);

} else {

    header("Content-Type: application/json");

    echo json_encode([
        "error" => "Failed to retrieve customers"
    ]);
}

$conn->close();

?>