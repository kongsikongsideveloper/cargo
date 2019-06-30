<?php
/* SIGNUP FOR MOBILE APP */
include 'db.php';
$userId = $_POST["user_id"];
$firstName = $_POST["first_name"];
$lastName = $_POST["last_name"];
$pin = $_POST["pin"];
$phone = $_POST["phone"];
$results = $c->query("SELECT * FROM users WHERE phone='" . $phone . "'");
if ($results && $results->num_rows > 0) {
    echo -2;
    return;
}
$c->query("INSERT INTO users (id, pin, phone, first_name, last_name) VALUES ('" . $userId . "', '" . $pin . "', '" . $phone . "', '" . $firstName . "', '" . $lastName . "')");
echo 0;