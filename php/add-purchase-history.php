<?php
include 'db.php';
$userID = $_POST["user_id"];
$amount = intval($_POST["amount"]);
$type = intval($_POST["type"]);
$date = intval($_POST["date"]);
$c->query("INSERT INTO purchase_history (id, user_id, amount, type, date) VALUES ('" . uniqid() . "', '" . $userID . "', " . $amount . ", " . $type . ", " . $date . ")");