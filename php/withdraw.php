<?php
include 'db.php';
$userId = $_POST["user_id"];
$amount = intval($_POST["amount"]);
$date = round(microtime(true)*1000);
$c->query("INSERT INTO pending_withdraw (id, user_id, amount, date, status) VALUES ('" . uniqid() . "', '" . $userId . "', " . $amount . ", " . $date . ", 'pending')");