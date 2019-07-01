<?php
include 'db.php';
$referrals = [];
$results = $c->query("SELECT * FROM referral_codes");
if ($results && $results->num_rows > 0) {
    while ($row = $results->fetch_assoc()) {
        array_push($referrals, $row);
    }
}
echo json_encode($referrals);