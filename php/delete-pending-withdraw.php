<?php
include 'db.php';
$id = $_POST["id"];
$c->query("DELETE FROM pending_withdraw WHERE id='" . $id . "'");