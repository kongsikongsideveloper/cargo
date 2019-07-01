<?php
include 'db.php';
$id = intval($_POST["id"]);
$code = $_POST["code"];
$discount = intval($_POST["discount"]);
$c->query("UPDATE vouchers SET code='" . $code . "', discount=" . $discount . " WHERE id=" . $id);