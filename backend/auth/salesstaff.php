<?php

include "../config/db.php";

$username = "salesstaff";
$password = "sales123";

$hashedPassword = password_hash(
    $password,
    PASSWORD_DEFAULT
);

$sql = "UPDATE users
        SET password = ?, role = 'sales_staff'
        WHERE username = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "ss",
    $hashedPassword,
    $username
);

if ($stmt->execute()) {

    echo "Sales staff password updated successfully";

} else {

    echo "Failed to update password";

}

$stmt->close();
$conn->close();

?>