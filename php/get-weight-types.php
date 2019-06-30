<?php
include 'db.php';
$results = $c->query("SELECT * FROM weight_types");
$weightTypes = [];
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		array_push($weightTypes, $row);
	}
}
echo json_encode($weightTypes);
