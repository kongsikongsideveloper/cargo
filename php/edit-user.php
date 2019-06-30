<?php
include 'db.php';
$userId = $_POST["id"];
$firstName = $_POST["first_name"];
$lastName = $_POST["last_name"];
$phone = $_POST["phone"];
$phoneChanged = intval($_POST["phone_changed"]);
$email = $_POST["email"];
$emailChanged = intval($_POST["email_changed"]);
$pin = $_POST["pin"];
$confirmed = intval($_POST["confirmed"]);
$address = $_POST["address"];
$referral = $_POST["referral"];
$referralChanged = intval($_POST["referral_changed"]);
$verified = intval($_POST["verified"]);
$currentProfilePictureURL = $_POST["profile_picture_url"];
// Check if referral exists
if ($referralChanged == 1) {
    $results = $c->query("SELECT * FROM users WHERE referral='" . $referral . "'");
    if ($results && $results->num_rows > 0) {
        // Referral exists
        echo -1;
        return;
    }
}
// Check if phone exists
if ($phoneChanged == 1) {
    $results = $c->query("SELECT * FROM users WHERE phone='" . $phone . "'");
    if ($results && $results->num_rows > 0) {
        // Phone exists
        echo -2;
        return;
    }
}
// Check if email exists
if ($emailChanged == 1) {
    $results = $c->query("SELECT * FROM users WHERE email='" . $email . "'");
    if ($results && $results->num_rows > 0) {
        // Email exists
        echo -3;
        return;
    }
}
$c->query("UPDATE users SET first_name='" . $firstName . "', last_name='" . $lastName . "', phone='" . $phone . "', email='" . $email . "', pin='" . $pin . "', confirmed=" . $confirmed . ", address='" . $address . "', referral='" . $referral . "', verified=" . $verified . ", profile_picture_url='" . $currentProfilePictureURL . "' WHERE id='" . $userId . "'");
echo 0;