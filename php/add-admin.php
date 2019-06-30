<?php
/* SIGNUP FOR ADMIN BACKEND */
include 'db.php';
$email = $_POST["email"];
$password = $_POST["password"];
$firstName = $_POST["first_name"];
$lastName = $_POST["last_name"];
$verified = intval($_POST["verified"]);
$results = $c->query("SELECT * FROM admins WHERE email='" . $email . "'");
if ($results && $results->num_rows > 0) {
    echo -1;
    return;
}
$c->query("INSERT INTO admins (id, email, password, first_name, last_name, verified) VALUES ('" . uniqid() . "', '" . $email . "', '" . $password . "', '" . $firstName . "', '" . $lastName . "', " . $verified . ")");
$adminID = mysqli_insert_id($c);
echo $adminID;