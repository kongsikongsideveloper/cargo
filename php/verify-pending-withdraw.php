<?php
include 'db.php';
$id = $_POST["id"];
$c->query("UPDATE pending_withdraw SET status='completed' WHERE id='" . $id . "'");
$row = $c->query("SELECT * FROM pending_withdraw WHERE id='" . $id . "'")->fetch_assoc();
$userID = $row["user_id"];
$amount = intval($row["amount"]);
$balance = intval($c->query("SELECT * FROM balance WHERE user_id='" . $userID . "'")->fetch_assoc()["balance"]);
$balance -= $amount;
$c->query("UPDATE balance SET balance=" . $balance . " WHERE user_id='" . $userID . "'");