<?php
include 'db.php';
$userID = $_POST["user_id"];
$phone = $_POST["phone"];
$amount = intval($_POST["amount"]);
$nominal = intval($_POST["nominal"]);
$senderName = $_POST["sender_name"];
$senderBank = $_POST["sender_bank"];
$senderAccountNumber = $_POST["sender_account_number"];
$proofImgURL = $_POST["proof_img_url"];
$date = $_POST["date"];
$status = $_POST["status"];
$receiverBankName = $_POST["receiver_bank_name"];
$c->query("INSERT INTO pending_data_top_up (id, user_id, phone, amount, nominal, sender_name, sender_bank, sender_account_number, proof_img, date, status, receiver_bank_name) VALUES ('" . uniqid() . "', '" . $userID . "', '" . $phone . "', " . $amount . ", " . $nominal . ", '" . $senderName . "', '" . $senderBank . "', '" . $senderAccountNumber . "', '" . $proofImgURL . "', " . $date . ", '" . $status . "', '" . $receiverBankName . "')");
