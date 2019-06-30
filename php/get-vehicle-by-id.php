<?php
include 'db.php';
$vehicleID = intval($_POST["vehicle-id"]);
$results = $c->query("SELECT * FROM vehicles WHERE id=" . $vehicleID);
$row = $results->fetch_assoc();
echo json_encode($row);