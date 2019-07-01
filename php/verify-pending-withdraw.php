<?php
include 'db.php';
$id = $_POST["id"];
$c->query("UPDATE pending_withdraw SET status='success' WHERE id='" . $id . "'");