<?php
include 'db.php';
/* FOR BACKEND */
$email = $_POST["email"];
$password = $_POST["password"];
$results = $c->query("SELECT * FROM admins WHERE email='" . $email . "'");
if ($results && $results->num_rows > 0) {
    $row = $results->fetch_assoc();
    if ($row["password"] != $password) {
        echo -2;
        return;
    }
    if ($row["verified"] != 1) {
        echo -3;
        return;
    }
    session_id("kongsi");
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    $_SESSION["kongsi_logged_in"] = true;
    $_SESSION["kongsi_user_id"] = $row["id"];
    echo 0;
} else {
    echo -1;
}