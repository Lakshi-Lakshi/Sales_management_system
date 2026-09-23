<?php

include "../config/db.php";

$sql = "SELECT id, category_name, created_at
        FROM categories
        ORDER BY id DESC";

$result = $conn->query($sql);

$categories = [];

if ($result) {

    while ($row = $result->fetch_assoc()) {

        $categories[] = $row;

    }

    echo json_encode($categories);

} else {

    echo json_encode([
        "error" => "Failed to retrieve categories"
    ]);
}

$conn->close();

?>