<?php
include 'db.php';
$results = $c->query("SELECT * FROM notifications");
$notifications = [];
if ($results && $results->num_rows > 0) {
    while ($row = $results->fetch_assoc()) {
        array_push($notifications, $row);
    }
}
echo json_encode($notifications);