<?php
include 'db.php';
$bankID = intval($_POST["id"]);
$c->query("DELETE FROM banks WHERE id=" . $bankID);