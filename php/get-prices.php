<?php
include 'db.php';
$prices = [];
$results = $c->query("SELECT * FROM prices");
if ($results && $results->num_rows > 0) {
    while ($row = $results->fetch_assoc()) {
        array_push($prices, $row);
    }
}
echo json_encode($prices);