<?php

include "../config/db.php";

$username = "storemanager";
$password = "manager123";

$hashedPassword = password_hash(
    $password,
    PASSWORD_DEFAULT
);

$sql = "UPDATE users
        SET password = ?, role = 'store_manager'
        WHERE username = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "ss",
    $hashedPassword,
    $username
);

if ($stmt->execute()) {

    echo "Store manager password updated successfully";

} else {

    echo "Failed to update password";

}

$stmt->close();
$conn->close();

?>