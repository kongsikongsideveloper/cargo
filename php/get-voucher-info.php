<?php
include 'db.php';
$voucherCode = $_POST["voucher_code"];
$results = $c->query("SELECT * FROM vouchers WHERE code='" . $voucherCode . "'");
if ($results && $results->fetch_assoc()) {
	$row = $results->fetch_assoc();
	echo json_encode($row);
} else {
	echo -1;
}
