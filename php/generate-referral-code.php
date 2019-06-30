<?php
include 'db.php';
$length = intval($_POST["length"]);
while (true) {
	$chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	$randomCode = "";
	for ($i = 0; $i < $length; $i++) {
		$randomCode .= $chars[mt_rand(0, strlen($chars)-1)];
	}
	$results = $c->query("SELECT * FROM referral_codes WHERE code='" . $randomCode . "'");
	if ($results && $results->num_rows > 0) {
		continue;
	} else {
		echo $randomCode;
		return;
	}
}