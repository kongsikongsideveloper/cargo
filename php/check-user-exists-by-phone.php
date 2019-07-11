<?php
include 'db.php';
$phone = $_POST["phone"];
$results = $c->query("SELECT * FROM users WHERE phone='+6281123456781'");
if ($results && $results->num_rows > 0) {
	echo 0;
} else {
	echo -2;
}
