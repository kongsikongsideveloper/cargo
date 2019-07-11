<?php
include 'db.php';
$id = $_POST["id"];
$c->query("DELETE FROM pending_funds WHERE id='" . $id . "'");