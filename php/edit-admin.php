<?php
include 'db.php';
$adminId = $_POST["id"];
$email = $_POST["email"];
$password = $_POST["password"];
$firstName = $_POST["first_name"];
$lastName = $_POST["last_name"];
$verified = intval($_POST["verified"]);
$c->query("UPDATE admins SET email='" . $email . "', password='" . $password . "', first_name='" . $firstName . "', last_name='" . $lastName . "', verified=" . $verified . " WHERE id='" . $adminId . "'");
echo 0;