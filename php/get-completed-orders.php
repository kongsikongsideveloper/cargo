<?php
include 'db.php';
$driverId = $_POST["driver_id"];
$results = $c->query("SELECT * FROM orders WHERE driver_id='" . $driverId . "' AND status='done'");
$orders = [];
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		array_push($orders, $row);
	}
}
echo json_encode($orders);
