<?php
include 'db.php';
$phone = $_POST["phone"];
$results = $c->query("SELECT * FROM users WHERE phone LIKE '%" . $phone . "%'");
if ($results && $results->num_rows > 0) {
	echo 0;
} else {
	echo -1;
}
