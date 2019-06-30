<?php
include 'db.php';
$driverId = $_POST["id"];
$results = $c->query("SELECT * FROM drivers WHERE id='" . $driverId . "'");
if ($results && $results->num_rows > 0) {
	$row = $results->fetch_assoc();
	echo json_encode($row);
} else {
	echo -1;
}