<?php
include 'db.php';
$userID = $_POST["user_id"];
$driverID = $_POST["driver_id"];
$c->query("UPDATE users SET current_driver_id='" . $driverID . "' WHERE id='" . $userID . "'");
$results = $c->query("SELECT * FROM users WHERE id='" . $userID . "'");
if ($results && $results->num_rows > 0) {
	$row = $results->fetch_assoc();
	$currentOrderID = $row["current_order_id"];
	$c->query("UPDATE orders SET driver_id='" . $driverID . "' WHERE id='" . $currentOrderID . "'");
}
