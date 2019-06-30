<?php
include 'db.php';
$fromId = $_POST["user_id"];
$toId = $_POST["to"];
$amount = intval($_POST["amount"]);
$c->query("INSERT INTO fund_transfers (id, from_id, to_id, amount, date, status) VALUES ('" . uniqid() . "', '" . $fromId . "', '" . $toId . "', " . $amount . ", " . round(microtime(true)*1000) . ", 'pending')");