<?php
include 'db.php';
$userID = $_POST["user_id"];
$results = $c->query("SELECT * FROM orders WHERE user_id='" . $userID . "'");
echo $results->num_rows;
