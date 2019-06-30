<?php
include 'db.php';
$chatPairID = intval($_POST["chat_pair_id"]);
$results = $c->query("SELECT * FROM user_driver_chats WHERE chat_pair_id=" . $chatPairID . " ORDER BY id DESC LIMIT 1");
if ($results && $results->num_rows > 0) {
	$row = $results->fetch_assoc();
	echo json_encode($row);
} else {
	echo -1;
}
