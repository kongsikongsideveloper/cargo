<?php
include 'db.php';
$weightTypeID = intval($_POST["id"]);
$results = $c->query("SELECT * FROM weight_types WHERE id=" . $weightTypeID);
if ($results && $results->num_rows > 0) {
	$row = $results->fetch_assoc();
	echo json_encode($row);
} else {
	echo -1;
}
