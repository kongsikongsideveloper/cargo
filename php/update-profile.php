<?php
include 'db.php';
$userId = $_POST["user_id"];
$firstName = $_POST["first_name"];
$lastName = $_POST["last_name"];
$phone = $_POST["phone"];
$address = $_POST["address"];
$referral = $_POST["referral"];
$profilePictureURL = $_POST["profile_picture_url"];
$c->query("UPDATE users SET first_name='" . $firstName . "', last_name='" . $lastName . "', phone='" . $phone . "', address='" . $address . "', referral='" . $referral . "', profile_picture_url='" . $profilePictureURL . "' WHERE id='" . $userId . "'");
echo 0;
