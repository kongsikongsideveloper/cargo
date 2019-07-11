<?php
include 'db.php';
$driverID = $_POST["driver_id"];
$results = $c->query("SELECT * FROM ratings WHERE driver_id='" . $driverID . "'");
$totalRating = 0;
$totalRaters = 0;
if ($results && $results->num_rows > 0) {
	$totalRaters = $results->num_rows;
	while ($row = $results->fetch_assoc()) {
		$rating = intval($row["rating"]);
		$totalRating += $rating;
	}
	echo $totalRating/$totalRaters;
} else {
	echo 0;
}
