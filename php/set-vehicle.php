<?php
include 'db.php';
$driverID = $_POST["driver_id"];
$vehicleID = intval($_POST["vehicle_id"]);
$c->query("UPDATE drivers SET vehicle=" . $vehicleID . " WHERE id='" . $driverID . "'");
