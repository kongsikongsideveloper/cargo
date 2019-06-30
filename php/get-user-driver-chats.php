<?php
include 'db.php';
$userID = $_POST["user_id"];
$driverID = $_POST["driver_id"];
$results = $c->query("SELECT * FROM user_driver_chat_pairs WHERE user_id='" . $userID . "' AND driver_id='" . $driverID . "'");
$messages = [];
if ($results && $results->num_rows > 0) {
	$row = $results->fetch_assoc();
	$chatPairID = intval($row["id"]);
	$results = $c->query("SELECT * FROM user_driver_chats WHERE chat_pair_id=" . $chatPairID . "");
	if ($results && $results->num_rows > 0) {
		while ($row = $results->fetch_assoc()) {
			array_push($messages, $row);
		}
	}
}
echo json_encode($messages);
