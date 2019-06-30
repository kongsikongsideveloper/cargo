<?php
session_id("kongsi");
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
$_SESSION["kongsi_logged_in"] = false;
$_SESSION["kongsi_user_id"] = "";
unset($_SESSION["kongsi_logged_in"]);
unset($_SESSION["kongsi_user_id"]);
session_destroy();