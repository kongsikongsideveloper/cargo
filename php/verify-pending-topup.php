<?php
include 'db.php';
$id = $_POST["id"];
$c->query("UPDATE pending_top_up SET status='completed' WHERE id='" . $id . "'");