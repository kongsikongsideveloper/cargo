<?php
include 'db.php';
$userID = $_POST["user_id"];
$driverID = $_POST["driver_id"];
$message = $_POST["message"];
$sender = intval($_POST["sender"]);
$results = $c->query("SELECT * FROM user_driver_chat_pairs WHERE user_id='" . $userID . "' AND driver_id='" . $driverID . "'");
$chatPairID = 0;
if ($results && $results->num_rows > 0) {
	$row = $results->fetch_assoc();
	$chatPairID = intval($row["id"]);
} else {
	$c->query("INSERT INTO user_driver_chat_pairs (user_id, driver_id) VALUES ('" . $userID . "', '" . $driverID . "')");
	$chatPairID = mysqli_insert_id($c);
}
$c->query("INSERT INTO user_driver_chats (chat_pair_id, message, sender, date) VALUES (" . $chatPairID . ", '" . $message . "', " . $sender . ", " . round(microtime(true)*1000) . ")");
