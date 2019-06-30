<?php
include 'db.php';
$userId = $_POST["user_id"];
$results = $c->query("SELECT * FROM users WHERE id='" . $userId . "'");
if ($results && $results->fetch_assoc()) {
	$row = $results->fetch_assoc();
	$currentOrderID = $row["current_order_id"];
	if ($currentOrderID != "") {
		$c->query("UPDATE orders SET status='canceled' WHERE id='" . $currentOrderID . "'");
	}
}
$c->query("UPDATE users SET current_order_id='' WHERE id='" . $userId . "'");
