<?php
include 'db.php';
$userID = $_POST["user_id"];
$oneSignalID = $_POST["one_signal_id"];
$c->query("UPDATE users SET one_signal_id='" . $oneSignalID . "' WHERE id='" . $userID . "'");
