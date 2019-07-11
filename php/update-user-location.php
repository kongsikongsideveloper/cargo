<?php
include 'db.php';
$lat = doubleval($_POST["lat"]);
$lng = doubleval($_POST["lng"]);
$userId = $_POST["user_id"];
$c->query("UPDATE users SET latitude=" . $lat . ", longitude=" . $lng . " WHERE id='" . $userId . "'");