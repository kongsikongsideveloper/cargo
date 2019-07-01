<?php
include 'db.php';
$results = $c->query("SELECT * FROM vouchers");
$vouchers = [];
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		array_push($vouchers, $row);
	}
}
echo json_encode($vouchers);
