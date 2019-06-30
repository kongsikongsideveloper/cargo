<?php
include 'db.php';
$orderID = $_POST["order_id"];
$userId = $_POST["user_id"];
$driverId = $_POST["driver_id"];
$rating = intval($_POST["rating"]);
$comment = $_POST["comment"];
$c->query("INSERT INTO ratings (id, order_id, user_id, driver_id, rating, comment, date) VALUES ('" . uniqid() . "', '" . $orderID . "', '" . $userId . "', '" . $driverId . "', " . $rating . ", '" . $comment . "', " . round(microtime(true)*1000) . ")");
