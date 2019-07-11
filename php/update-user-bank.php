<?php
include 'db.php';
$userID = $_POST["user_id"];
$bankName = $_POST["bank_name"];
$accountNumber = $_POST["account_number"];
$c->query("UPDATE user_banks SET bank_name='" . $bankName . "', account_number='" . $accountNumber . "' WHERE user_id='" . $userID . "'");