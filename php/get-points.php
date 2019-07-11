<?php
include 'db.php';
$userId = $_POST["user_id"];
$results = $c->query("SELECT * FROM orders WHERE driver_id='" . $userId . "' AND status='done'");
$points = 0;
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		$points += $row["driver_points"];
	}
}
echo $points;
