<?php
include 'db.php';
$results = $c->query("SELECT * FROM pending_funds");
$funds = [];
if ($results && $results->num_rows > 0) {
    while ($row = $results->fetch_assoc()) {
        array_push($funds, $row);
    }
}
echo json_encode($funds);