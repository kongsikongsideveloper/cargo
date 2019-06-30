<?php
include 'db.php';
$id = intval($_POST["id"]);
$name = $_POST["name"];
$pricePerKM = floatval($_POST["price"]);
$c->query("UPDATE vehicles SET name='" . $name . "', price_per_km=" . $pricePerKM . " WHERE id=" . $id);