<?php
include 'db.php';
$id = $_POST["id"];
$c->query("UPDATE pending_data_top_up SET status='completed' WHERE id='" . $id . "'");