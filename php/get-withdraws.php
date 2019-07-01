<?php
include 'db.php';
$results = $c->query("SELECT * FROM pending_withdraw");
$withdraws = [];
if ($results && $results->num_rows > 0) {
    while ($row = $results->fetch_assoc()) {
        array_push($withdraws, $row);
    }
}
echo json_encode($withdraws);