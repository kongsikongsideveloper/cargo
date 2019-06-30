<?php
include 'db.php';
$driverID = $_POST["driver_id"];
$results = $c->query("SELECT * FROM user_driver_chat_pairs WHERE driver_id='" . $driverID . "'");
$chatPairs = [];
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		array_push($chatPairs, $row);
	}
}
echo json_encode($chatPairs);
