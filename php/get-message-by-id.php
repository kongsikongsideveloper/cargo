<?php
include 'db.php';
$messageId = $_POST["message_id"];
$results = $c->query("SELECT * FROM messages WHERE id='" . $messageId . "'");
if ($results && $results->num_rows > 0) {
	$row = $results->fetch_assoc();
	echo json_encode($row);
} else {
	echo -1;
}