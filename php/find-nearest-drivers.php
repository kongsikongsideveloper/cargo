<?php
include 'db.php';
$lat = doubleval($_POST["lat"]);
$lng = doubleval($_POST["lng"]);
$results = $c->query("SELECT *, SQRT(POW(69.1 * (latitude - " . $lat . "), 2) + POW(69.1 * (" . $lng . " - longitude) * COS(latitude / 57.3), 2)) AS distance FROM drivers HAVING distance < 25 ORDER BY distance");
$drivers = [];
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		array_push($drivers, $row);
	}
}
echo json_encode($drivers);