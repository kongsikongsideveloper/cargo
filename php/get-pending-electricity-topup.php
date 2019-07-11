<?php
include 'db.php';
$userID = $_POST["user_id"];
$results = $c->query("SELECT * FROM pending_electricity_top_up WHERE user_id='" . $userID . "'");
$funds = [];
if ($results && $results->num_rows > 0) {
    while ($row = $results->fetch_assoc()) {
        array_push($funds, $row);
    }
}
echo json_encode($funds);
