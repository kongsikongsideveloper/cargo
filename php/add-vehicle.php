<?php
include 'db.php';
$name = $_POST["name"];
$pricePerKM = floatval($_POST["price_per_km"]);
$c->query("INSERT INTO vehicles (name, price_per_km) VALUES ('" . $name . "', " . $pricePerKM . ")");