<?php
include 'db.php';
$email = $_POST["email"];
$phone = $_POST["phone"];
$pin = $_POST["pin"];
$firstName = $_POST["first_name"];
$lastName = $_POST["last_name"];
$profilePictureURL = $_POST["profile_picture_url"];
$confirmed = intval($_POST["confirmed"]);
$latitude = doubleval($_POST["latitude"]);
$longitude = doubleval($_POST["longitude"]);
$address = $_POST["address"];
$referral = $_POST["referral"];
// Check if email exists
$results = $c->query("SELECT * FROM users WHERE email='" . $email . "'");
if ($results && $results->num_rows > 0) {
    echo -1;
    return;
}
// Check if phone exists
$results = $c->query("SELECT * FROM users WHERE phone='" . $phone . "'");
if ($results && $results->num_rows > 0) {
    echo -2;
    return;
}
// Check if referral exists
$results = $c->query("SELECT * FROM users WHERE referral='" . $referral . "'");
if ($results && $results->num_rows > 0) {
    echo -3;
    return;
}
$c->query("INSERT INTO users (email, phone, pin, first_name, last_name, profile_picture_url, confirmed, latitude, longitude, address, referral) VALUES ('" . $email . "', '" . $phone . "', '" . $pin . "', '" . $firstName . "', '" . $lastName . "', '" . $profilePictureURL . "', " . $confirmed . ", " . $latitude . ", " . $longitude . ", '" . $address . "', '" . $referral . "')");
$userID = mysqli_insert_id($c);
echo $userID;