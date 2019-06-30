<?php
include 'db.php';
$userId = $_POST["user_id"];
$fileName = $_POST["file_name"];
$amount = intval($_POST["amount"]);
$fileURL = "http://103.103.175.239/kongsi/userdata/imgs/" . $fileName;
move_uploaded_file($_FILES["file"]["tmp_name"], "../userdata/imgs/" . $fileName);
$results = $c->query("SELECT * FROM pending_top_up WHERE user_id='" . $userId . "'");
if ($results && $results->num_rows > 0) {
    return;
}
$c->query("INSERT INTO pending_funds (id, user_id, proof_img, date, amount) VALUES ('" . uniqid() . "', '" . $userId . "', '" . $fileURL . "', " . round(microtime(true)*1000) . ", " . $amount . ")");
