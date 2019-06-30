<?php
include 'db.php';
$myUserID = $_POST["my-user-id"];
$opponentUserID = $_POST["opponent-user-id"];
$messages = [];
$results = $c->query("SELECT * FROM messages WHERE sender_id='" . $myUserID . "' AND receiver_id='" . $opponentUserID . "'");
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		array_push($messages, $row);
	}
}
$results = $c->query("SELECT * FROM messages WHERE sender_id='" . $opponentUserID . "' AND receiver_id='" . $myUserID . "'");
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		array_push($messages, $row);
	}
}
echo json_encode($messages);