<?php
include 'db.php';
$keyword = $_POST["keyword"];
$results = $c->query("SELECT * FROM users WHERE name LIKE '%" . $keyword . "%' OR phone LIKE '%" . $keyword . "%'");
$users = [];
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		array_push($users, $row);
	}
}
echo json_encode($users);