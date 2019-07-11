<?php
include 'db.php';
$phone = $_POST["phone"];
$results = $c->query("SELECT * FROM users WHERE phone='" . $phone . "'");
if ($results && $results->num_rows > 0) {
	echo 0;
} else {
	echo $phone;
}
