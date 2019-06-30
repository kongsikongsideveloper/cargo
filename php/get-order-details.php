<?php
include 'db.php';
$orderId = $_POST["order-id"];
$results = $c->query("SELECT * FROM orders WHERE id='" . $orderId . "'");
if ($results && $results->num_rows > 0) {
	$row = $results->fetch_assoc();
	echo json_encode($row);
} else {
	echo -1;
}