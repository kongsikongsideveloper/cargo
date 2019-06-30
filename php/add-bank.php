<?php
include 'db.php';
$name = $_POST["name"];
$iconURL = $_POST["icon"];
$accountNumber = $_POST["account_number"];
$c->query("INSERT INTO banks (name, icon, account_number) VALUES ('" . $name . "', '" . $iconURL . "', '" . $accountNumber . "')");