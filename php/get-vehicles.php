<?php
include 'db.php';
$results = $c->query("SELECT * FROM vehicles");
$vehicles = [];
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		array_push($vehicles, $row);
	}
}
echo json_encode($vehicles);