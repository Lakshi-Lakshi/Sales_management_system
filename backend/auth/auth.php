<?php

session_start();

function requireLogin()
{
    if (!isset($_SESSION["user_id"])) {

        http_response_code(401);

        header("Content-Type: application/json");

        echo json_encode([
            "success" => false,
            "message" => "Please login first."
        ]);

        exit;
    }
}


function requireRole($allowedRoles)
{
    requireLogin();

    $userRole = $_SESSION["role"] ?? "";

    if (!in_array($userRole, $allowedRoles)) {

        http_response_code(403);

        header("Content-Type: application/json");

        echo json_encode([
            "success" => false,
            "message" => "Access denied. You do not have permission."
        ]);

        exit;
    }
}

?>
