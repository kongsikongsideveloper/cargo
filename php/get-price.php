<?php
include 'db.php';
$name = $_POST["name"];
$results = $c->query("SELECT * FROM prices WHERE name='" . $name . "'");
if ($results && $results->num_rows > 0) {
	$row = $results->fetch_assoc();
	echo json_encode($row);
} else {
	echo -1;
}
