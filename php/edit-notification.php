<?php
include 'db.php';
$id = intval($_POST["id"]);
$title = $_POST["title"];
$description = $_POST["description"];
$img = $_POST["img"];
$c->query("UPDATE notifications SET title='" . $title . "', description='" . $description . "', img='" . $img . "' WHERE id=" . $id);