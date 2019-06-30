<?php
include 'db.php';
$phone = $_POST["phone"];
$c->query("UPDATE users SET confirmed=1 WHERE phone='" . $phone . "'");