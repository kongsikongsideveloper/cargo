<?php
session_id("kongsi");
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
if (isset($_SESSION["kongsi_logged_in"]) && $_SESSION["kongsi_logged_in"] == true) {
	echo 0;
} else {
	echo -1;
}