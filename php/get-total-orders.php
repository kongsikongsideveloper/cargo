<?php
include 'db.php';
$userId = $_POST["user_id"];
$results = $c->query("SELECT * FROM orders WHERE driver_id='" . $userId . "' AND status='done'");
if ($results) {
	echo $results->num_rows;
} else {
	echo 0;
}
