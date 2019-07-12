<?php
include 'db.php';
$title = $_POST["title"];
$description = $_POST["description"];
$img = $_POST["img"];
$date = round(microtime(true)*1000);

$c->query("INSERT INTO notifications (title, description, img, date) VALUES ('" . $title . "', '" . $description . "', '" . $img . "', " . $date . ")");