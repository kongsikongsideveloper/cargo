<?php
include 'db.php';
$userID = $_POST["user_id"];
$proofImg = $_POST["proof_img"];
$date = intval($_POST["date"]);
$amount = intval($_POST["amount"]);
$senderName = $_POST["sender_name"];
$senderBank = $_POST["sender_bank"];
$senderAccountNumber = $_POST["sender_account_number"];
$receiverBankName = $_POST["receiver_bank_name"];
$status = $_POST["status"];
$c->query("INSERT INTO pending_funds (id, user_id, proof_img, date, amount, sender_name, sender_bank, sender_account_number, receiver_bank_name, status) VALUES ('" . uniqid() . "', '" . $userID . "', '" . $proofImg . "', " . round(microtime(true)*1000) . ", " . $amount . ", '" . $senderName . "', '" . $senderBank . "', '" . $senderAccountNumber . "', '" . $receiverBankName . "', '" . $status . "')");
