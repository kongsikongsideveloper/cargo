<?php
include 'db.php';
$phone = $_POST["phone"];
$results = $c->query("SELECT * FROM users WHERE phone='" . $phone . "'");
if ($results && $results->num_rows > 0) {
	echo 0;
} else {
	$results = $c->query("SELECT * FROM drivers WHERE phone='" . $phone . "'");
	if ($results && $results->num_rows > 0) {
		echo 0;
	} else {
		echo -1;
	}
}
