<?php
include 'db.php';
$orders = [];
$results = $c->query("SELECT * FROM orders");
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		array_push($orders, $row);
	}
}
echo json_encode($orders);
