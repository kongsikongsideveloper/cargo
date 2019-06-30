<?php
include 'db.php';
$results = $c->query("SELECT * FROM pending_top_up");
$topups = [];
if ($results && $results->num_rows > 0) {
    while ($row = $results->fetch_assoc()) {
        array_push($topups, $row);
    }
}
echo json_encode($topups);