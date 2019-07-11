<?php
include 'db.php';
$fromUserID = $_POST["from_user_id"];
$toPhone = $_POST["to_phone"];
$amount = intval($_POST["amount"]);
$toUserID = $c->query("SELECT * FROM users WHERE phone='" . $toPhone . "'")->fetch_assoc()["id"];
$senderBalance = intval($c->query("SELECT * FROM balance WHERE user_id='" . $fromUserID . "'")->fetch_assoc()["balance"]);
$receiverBalance = intval($c->query("SELECT * FROM balance WHERE user_id='" . $toUserID . "'")->fetch_assoc()["balance"]);
$senderBalance -= $amount;
$receiverBalance += $amount;
$c->query("UPDATE balance SET balance=" . $senderBalance . " WHERE user_id='" . $fromUserID . "'");
$c->query("UPDATE balance SET balance=" . $receiverBalance . " WHERE user_id='" . $toUserID . "'");

$c->query("INSERT INTO balance_history (user_id_1, user_id_2, amount, date, type) VALUES ('" . $fromUserID . "', '" . $toUserID . "', " . $amount . ", " . round(microtime(true)*1000) . ", 'transfer')");
