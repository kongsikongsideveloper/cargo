<?php
include 'db.php';
$userId = $_POST["user_id"];
$c->query("DELETE FROM orders WHERE user_id='" . $userId . "' AND status='waiting'");