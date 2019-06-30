<?php
include 'db.php';
$orderID = $_POST["order_id"];
$userID = $_POST["user_id"];
$driverID = $_POST["driver_id"];
$c->query("UPDATE users SET current_order_id='" . $orderID . "' WHERE id='" . $userID . "'");
$c->query("UPDATE drivers SET current_order_id='" . $orderID . "' WHERE id='" . $driverID . "'");
