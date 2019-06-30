<?php
include 'db.php';
$driverID = $_POST["user_id"];
$oneSignalID = $_POST["one_signal_id"];
$c->query("UPDATE drivers SET one_signal_id='" . $oneSignalID . "' WHERE id='" . $driverID . "'");
