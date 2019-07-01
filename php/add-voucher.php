<?php
include 'db.php';
$code = $_POST["code"];
$discount = intval($_POST["discount"]);
$c->query("INSERT INTO vouchers (code, discount) VALUES ('" . $code . "', " . $discount . ")");