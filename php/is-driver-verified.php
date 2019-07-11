<?php
include 'db.php';
$driverId = $_POST["user_id"];
$results = $c->query("SELECT * FROM drivers WHERE id='" . $driverId . "'");
if ($results && $results->num_rows > 0) {
	$row = $results->fetch_assoc();
	echo $row["verified"];
} else {
	echo 0;
}
