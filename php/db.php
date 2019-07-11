<?php
$c = new mysqli("localhost", "kongsi_admin", "HelloWorld123");
$c->select_db("kongsi_cargo");
if ($c->connect_error) {
   echo("Connection failed: " . $c->connect_error);

