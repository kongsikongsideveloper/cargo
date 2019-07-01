var orders;
var map = null;
var platform;
var mapTypes;

$(document).ready(function () {
    getOrders();
    platform = new H.service.Platform({
        'app_id': HERE_APP_ID,
        'app_code': HERE_APP_CODE
    });
    mapTypes = platform.createDefaultLayers();
});

function getOrders() {
    $("#orders").find("*").remove();
    orders = [];
    showProgress("Memuat daftar pesanan");
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-orders.php',
        dataType: 'text',
        cache: false,
        success: function(response) {
            var ordersJSON = JSON.parse(response);
            for (var i=0; i<ordersJSON.length; i++) {
                let number = i+1;
                let orderJSON = ordersJSON[i];
                var order = {
                    id: orderJSON["id"],
                    buyerID: orderJSON["user_id"],
                    driverID: orderJSON["driver_id"],
                    fromLat: orderJSON["from_lat"],
                    fromLng: orderJSON["from_lng"],
                    toLat: orderJSON["to_lat"],
                    toLng: orderJSON["to_lng"],
                    truckType: orderJSON["truck_type"],
                    senderName: orderJSON["sender_name"],
                    senderPhone: orderJSON["sender_phone"],
                    receiverName: orderJSON["receiver_name"],
                    receiverPhone: orderJSON["receiver_phone"],
                    paidBySender: orderJSON["paid_by_sender"],
                    orderDate: orderJSON["order_date"],
                    itemData: orderJSON["item_data"],
                    itemType: orderJSON["item_type"],
                    weightType: orderJSON["weight_type"],
                    imgURL: orderJSON["img_url"],
                    userNote: orderJSON["user_note"],
                    extraService: orderJSON["extra_service"],
                    extraHelp: orderJSON["extra_help"],
                    voucherCode: orderJSON["voucher_code"],
                    distance: orderJSON["distance"],
                    price: orderJSON["price"],
                    locBenchmarkFrom: orderJSON["loc_benchmark_from"],
                    locBenchmarkTo: orderJSON["loc_benchmark_to"],
                    paymentMethod: orderJSON["payment_method"],
                    containerName: orderJSON["container_name"],
                    status: orderJSON["status"]
                };
                orders.push(order);
                let fd = new FormData();
                fd.append("id", orderJSON["user_id"]);
                $.ajax({
                    type: 'POST',
                    url: PHP_PATH+'get-user-info.php',
                    data: fd,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: function(response) {
                        var userInfo = JSON.parse(response);
                        var userPhone = userInfo["phone"];
                        let fd = new FormData();
                        fd.append("id", orderJSON["driver_id"]);
                        $.ajax({
                            type: 'POST',
                            url: PHP_PATH+'get-driver-info.php',
                            data: fd,
                            processData: false,
                            contentType: false,
                            cache: false,
                            success: function(response) {
                                var driverInfo = JSON.parse(response);
                                var driverPhone = driverInfo["phone"];
                                var orderDate = new Date(parseInt(orderJSON["order_date"]));
                                $("#orders").append("" +
                                    "<tr>" +
                                    "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>" + number + "</div></td>" +
                                    "<td>" + userPhone + " &#8594; " + driverPhone + "</td>" +
                                    "<td>" + orderDate.customFormat("#DD#/#MM#/#YYYY# #hh#:#mm#:#ss#") + "</td>" +
                                    "<td><a class='view-order link'>Lihat</a></td>" +
                                    "<td><a class='delete-order link'>Hapus</a></td>" +
                                    "</tr>"
                                );
                                setOrderClickListener();
                            }
                        });
                    }
                });
            }
            hideProgress();
        }
    });
}

function setOrderClickListener() {
    $(".view-order").unbind().on("click", function () {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var order = orders[index];
        $("#view-order-sender-name").val(order["senderName"]);
        $("#view-order-sender-phone").val(order["senderPhone"]);
        $("#view-order-receiver-name").val(order["receiverName"]);
        $("#view-order-receiver-phone").val(order["receiverPhone"]);
        $.ajax({
            type: 'GET',
            url: 'https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox='+order["fromLat"]+","+order["fromLng"]+",250&mode=retrieveAddresses&maxresults=1&gen=9&app_id=1RAKrx8bxIcSEnS5gpgd&app_code=I72TwxesSjxY-Y9XoGqdKA",
            dataType: 'text',
            cache: false,
            success: function(response) {
                var address = JSON.parse(response)["Response"]["View"][0]["Result"][0]["Location"]["Address"]["Label"];
                $("#view-order-from").val(address);
            }
        });
        $.ajax({
            type: 'GET',
            url: 'https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox='+order["toLat"]+","+order["toLng"]+",250&mode=retrieveAddresses&maxresults=1&gen=9&app_id=1RAKrx8bxIcSEnS5gpgd&app_code=I72TwxesSjxY-Y9XoGqdKA",
            dataType: 'text',
            cache: false,
            success: function(response) {
                var address = JSON.parse(response)["Response"]["View"][0]["Result"][0]["Location"]["Address"]["Label"];
                $("#view-order-to").val(address);
            }
        });
        var fd = new FormData();
        fd.append("id", order["driverID"]);
        $.ajax({
            type: 'POST',
            url: PHP_PATH+'get-driver-info.php',
            data: fd,
            processData: false,
            contentType: false,
            cache: false,
            success: function(response) {
                var driverInfo = JSON.parse(response);
                $("#view-order-driver-name").val(driverInfo["first_name"].trim()+" "+driverInfo["last_name"].trim());
                $("#view-order-driver-phone").val(driverInfo["phone"].trim());
            }
        });
        var paidBySender = parseInt(order["paidBySender"]);
        if (paidBySender == 0) {
            $("#view-order-paid-by").val("Penerima");
        } else {
            $("#view-order-paid-by").val("Pengirim");
        }
        var itemType = parseInt($("#view-order-item-type").val().trim());
        if (itemType == 0) {
            $("#view-order-item-type").val("Barang kering");
        } else if (itemType == 1) {
            $("#view-order-item-type").val("Barang basah");
        } else if (itemType == 2) {
            $("#view-order-item-type").val("Barang mewah");
        } else if (itemType == 3) {
            $("#view-order-item-type").val("Lainnya");
        }
        $("#view-order-item-data").val(order["itemData"]);
        var fd2 = new FormData();
        fd2.append("id", parseInt(order["weightType"]));
        $.ajax({
            type: 'POST',
            url: PHP_PATH+'get-weight-type-info.php',
            data: fd2,
            processData: false,
            contentType: false,
            cache: false,
            success: function(response) {
                var weightTypeInfo = JSON.parse(response);
                $("#view-order-weight").val(weightTypeInfo["name"]+" (Rp"+formatMoney(parseInt(weightTypeInfo["price_per_kg"])+",-)"));
            }
        });
        var imgURL = order["imgURL"].trim();
        $.ajax({
            type: 'HEAD',
            url: imgURL,
            success: function(response) {
                $("#view-order-item-img").attr("src", imgURL);
            },
            error: function() {
                imgURL = "http://"+HOST+'/img/no_item.png';
                $("#view-order-item-img").attr("src", imgURL);
            }
        });
        $("#view-order-user-note").val(order["userNote"]);
        $("#view-order-extra-service").val(order["extraService"]);
        $("#view-order-extra-help").val(order["extraHelp"]);
        $("#view-order-voucher-code").val(order["voucherCode"]);
        $("#view-order-distance").val(order["distance"]+" KM");
        $("#view-order-price").val("Rp"+parseInt(order["price"])+",-");
        var vehicleID = parseInt(order["truckType"]);
        var fd3 = new FormData();
        fd3.append("vehicle-id", vehicleID);
        $.ajax({
            type: 'POST',
            url: PHP_PATH+'get-vehicle-info.php',
            data: fd3,
            processData: false,
            contentType: false,
            cache: false,
            success: function(response) {
                var vehicleInfo = JSON.parse(response);
                $("#view-order-vehicle").val(vehicleInfo["name"]);
            }
        });
        $("#view-order-ok").unbind().on("click", function () {
            $("#view-order-container").fadeOut(300);
        });
        $("#view-order-cancel").unbind().on("click", function() {
            $("#view-order-container").fadeOut(300);
        });
        $("#view-order-container").css("display", "flex").hide().fadeIn(300);
    });
    $(".delete-order").unbind().on("click", function () {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var order = orders[index];
        $("#confirm-title").html("Hapus Pesanan");
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus pemesanan ini?");
        $("#confirm-ok").unbind().on("click", function () {
            $("#confirm-container").hide();
            showProgress("Menghapus pemesanan");
            var fd = new FormData();
            fd.append("id", order["id"]);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'delete-order.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    show("Pesanan dihapus");
                    getOrders();
                }
            });
        });
        $("#confirm-cancel").unbind().on("click", function () {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
    });
}

function closeViewOrderDialog() {
    $("#view-order-container").fadeOut(300);
}

function closeEditOrderDialog() {
    $("#view-order-container").fadeOut(300);
}