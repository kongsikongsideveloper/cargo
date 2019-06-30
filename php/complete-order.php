<?php
include 'db.php';
$orderID = $_POST["order_id"];
$c->query("UPDATE orders SET status='done' WHERE id='" . $orderID . "'");
