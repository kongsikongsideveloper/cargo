<?php
include 'db.php';
$phone = $_POST["phone"];
$results = $c->query("SELECT * FROM users WHERE phone='" . $phone . "'");
if ($results && $results->num_rows > 0) {
	$row = $results->fetch_assoc();
	echo json_encode($row);
} else {
	$results = $c->query("SELECT * FROM drivers WHERE phone='" . $phone . "'");
	if ($results && $results->num_rows > 0) {
		$row = $results->fetch_assoc();
		echo json_encode($row);
	} else {
		echo -1;
	}
}
