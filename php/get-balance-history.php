<?php
include 'db.php';
$userID = $_POST["user_id"];
$results = $c->query("SELECT * FROM balance_history WHERE user_id_1='" . $userID . "' OR user_id_2='" . $userID . "'");
$history = [];
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		array_push($history, $row);
	}
}
echo json_encode($history);
