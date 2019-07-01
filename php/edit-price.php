<?php
include 'db.php';
$id = intval($_POST["id"]);
$price = intval($_POST["price"]);
$c->query("UPDATE prices SET price=" . $price . " WHERE id=" . $id);