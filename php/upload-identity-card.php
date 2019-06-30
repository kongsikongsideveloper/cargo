<?php
include 'db.php';
$userId = $_POST["user_id"];
$fileName = $_POST["file_name"];
move_uploaded_file($_FILES["file"]["tmp_name"], "../userdata/imgs/" . $fileName);
$url = "http://103.103.175.239/kongsi/userdata/imgs/" . $fileName;
$c->query("UPDATE users SET identity_card_img='" . $url . "' WHERE id='" . $userId . "'");