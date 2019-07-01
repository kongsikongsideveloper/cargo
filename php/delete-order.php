<?php
include 'db.php';
$orderID = $_POST["id"];
$c->query("DELETE FROM orders WHERE id='" . $orderID . "'");