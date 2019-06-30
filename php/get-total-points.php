<?php
include 'db.php';
$userID = $_POST["user_id"];
$points = 0;
$results = $c->query("SELECT * FROM points WHERE user_id='" . $userID . "'");
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		$points += $row["points"];
	}
}
echo $points;