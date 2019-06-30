<?php
session_id("kongsi");
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
$adminID = $_SESSION["kongsi_user_id"];
echo $adminID;