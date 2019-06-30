<?php
include 'db.php';
$id = intval($_POST["id"]);
$name = $_POST["name"];
$icon = $_POST["icon"];
$accountNumber = $_POST["account_number"];
$c->query("UPDATE banks SET name='" . $name . "', icon='" . $icon . "', account_number='" . $accountNumber . "' WHERE id=" . $id);