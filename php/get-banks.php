<?php
include 'db.php';
$results = $c->query("SELECT * FROM banks");
$banks = [];
if ($results && $results->num_rows > 0) {
    while ($row = $results->fetch_assoc()) {
        array_push($banks, $row);
    }
}
echo json_encode($banks);