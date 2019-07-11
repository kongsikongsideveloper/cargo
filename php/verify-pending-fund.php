<?php
include 'db.php';
$id = $_POST["id"];
$c->query("UPDATE pending_funds SET status='completed' WHERE id='" . $id . "'");
$row = $c->query("SELECT * FROM pending_funds WHERE id='" . $id . "'")->fetch_assoc();
$userID = $row["user_id"];
$amount = intval($row["amount"]);

$results = $c->query("SELECT * FROM balance WHERE user_id='" . $userID . "'");
if ($results && $results->num_rows > 0) {
    $balance = intval($results->fetch_assoc()["balance"]);
    $balance += $amount;
    $c->query("UPDATE balance SET balance=" . $balance . " WHERE user_id='" . $userID . "'");
} else {
    $c->query("INSERT INTO balance (user_id, balance) VALUES ('" . $userID . "', " . $amount . ")");
}