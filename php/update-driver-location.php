<?php
include 'db.php';
$lat = doubleval($_POST["lat"]);
$lng = doubleval($_POST["lng"]);
$driverId = $_POST["user_id"];
$c->query("UPDATE drivers SET latitude=" . $lat . ", longitude=" . $lng . " WHERE id='" . $driverId . "'");
