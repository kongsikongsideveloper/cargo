<?php
include 'db.php';
$results = $c->query("SELECT * FROM drivers");
$drivers = [];
if ($results && $results->num_rows > 0) {
    while ($row = $results->fetch_assoc()) {
        array_push($drivers, $row);
    }
}
echo json_encode($drivers);