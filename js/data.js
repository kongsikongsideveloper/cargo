var topups = [];

$(document).ready(function() {
    getTopUps();
});

function getTopUps() {
    topups = [];
    $("#topups").find("*").remove();
    showProgress("Memuat daftar transaksi top up data");
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-data-topups.php',
        dataType: 'text',
        cache: false,
        success: function(response) {
            var topupsJSON = JSON.parse(response);
            displayTopup(0, topupsJSON);
        }
    });
}

function displayTopup(i, topupsJSON) {
    if (i == topupsJSON.length) {
        setTopUpClickListener();
        hideProgress();
        return;
    }
    var topupJSON = topupsJSON[i];
    var topup = {
        id: topupJSON["id"],
        userID: topupJSON["user_id"],
        phone: topupJSON["phone"],
        amount: topupJSON["amount"],
        nominal: topupJSON["nominal"],
        senderName: topupJSON["sender_name"],
        senderBank: topupJSON["sender_bank"],
        senderAccountNumber: topupJSON["sender_account_number"],
        receiverBankName: topupJSON["receiver_bank_name"],
        proofImg: topupJSON["proof_img"],
        date: topupJSON["date"],
        status: topupJSON["status"]
    };
    topups.push(topup);
    var buyerID = topup["userID"];
    var fd = new FormData();
    fd.append("id", buyerID);
    $.ajax({
        type: 'POST',
        url: PHP_PATH+'get-user-info.php',
        data: fd,
        processData: false,
        contentType: false,
        cache: false,
        success: function(response) {
            var userInfo = JSON.parse(response);
            var buyerName = userInfo["first_name"]+" "+userInfo["last_name"];
            var date = new Date(parseInt(topup["date"]));
            var status = "";
            if (topup["status"] == "pending") {
                status = "Menunggu konfirmasi";
            } else if (topup["status"] == "completed") {
                status = "Selesai";
            } else if (topup["status"] == "cancel") {
                status = "Dibatalkan";
            }
            $("#topups").append("" +
                "<tr>" +
                "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>" + (i+1) + "</div></td>" +
                "<td>" + buyerName + "</td>" +
                "<td>Rp" + formatMoney(parseInt(topup["amount"])) + ",-</td>" +
                "<td>" + date.customFormat("#DD#/#MM#/#YYYY# #hh#:#mm#:#ss#") + "</td>" +
                "<td>" + status + "</td>" +
                "<td><a class='view-order link'>Lihat</a></td>" +
                "<td><a class='delete-order link'>Hapus</a></td>" +
                "</tr>"
            );
            i++;
            displayTopup(i, topupsJSON);
        }
    });
}

function setTopUpClickListener() {
    $(".view-order").unbind().on("click", function() {
        var td = $(this).parent();
        var tr = td.parent();
        var index = $("#topups").children().index(tr);
        var topup = topups[index];
        var buyerID = topup["userID"];
        showProgress("Memuat");
        var fd = new FormData();
        fd.append("id", buyerID);
        $.ajax({
            type: 'POST',
            url: PHP_PATH+'get-user-info.php',
            data: fd,
            processData: false,
            contentType: false,
            cache: false,
            success: function(response) {
                var userInfo = JSON.parse(response);
                var buyerName = userInfo["first_name"]+" "+userInfo["last_name"];
                $("#view-topup-buyer-name").val(buyerName);
                $("#view-topup-buyer-phone").val(topup["phone"]);
                $("#view-topup-amount").val("Rp"+formatMoney(parseInt(topup["amount"]))+",-");
                $("#view-topup-nominal").val("Rp"+formatMoney(parseInt(topup["nominal"]))+",-");
                $("#view-topup-sender-name").val(topup["senderName"]);
                $("#view-topup-sender-bank").val(topup["senderBank"]);
                $("#view-topup-sender-account").val(topup["senderAccountNumber"]);
                $("#view-topup-receiver-bank").val(topup["receiverBankName"]);
                var proofImgURL = "http://"+HOST+"/userdata/images/"+topup["proofImg"];
                $("#view-topup-proof-img").attr("src", proofImgURL);
                $("#view-topup-proof-img-zoom").unbind().on("click", function() {
                    $("#zoom-img").attr("src", proofImgURL);
                    $("#zoom-img-container").css("display", "flex");
                });
                var date = new Date(parseInt(topup["date"]));
                $("#view-topup-date").val(date.customFormat("#DD#/#MM#/#YYYY# #hh#:#mm#:#ss#"));
                $("#verify-paid").unbind().on("click", function() {
                    $("#confirm-msg").html("Apakah Anda yakin sudah mentransfer ke nomor pembeli sesuai jumlah yang diminta?");
                    $("#confirm-ok").html("Ya").unbind().on("click", function() {
                        $("#confirm-container").fadeOut(300);
                        showProgress("Memverifikasi pembelian");
                        var fd2 = new FormData();
                        fd2.append("id", topup["id"]);
                        $.ajax({
                            type: 'POST',
                            url: PHP_PATH+'verify-pending-data-topup.php',
                            data: fd2,
                            processData: false,
                            contentType: false,
                            cache: false,
                            success: function(response) {
                                var notification = {
                                    "app_id": "b7699770-1386-42b2-8e6a-06e81cbf1c48",
                                    "contents": {
                                        "en": "Mohon cek jumlah paket data Anda"
                                    },
                                    "include_player_ids": [userInfo["one_signal_id"]],
                                    "headings": {"en": "Pulsa Anda sudah diisi"},
                                    "data": {"en": {"type": "data_top_up_finished", "top_up_id": topup["id"]}}
                                };
                                $.ajax({
                                    type: 'POST',
                                    url: 'https://onesignal.com/api/v1/notifications',
                                    data: JSON.stringify(notification),
                                    dataType: 'json',
                                    contentType: 'application/json; charset=utf-8',
                                    success: function(response) {
                                        hideProgress();
                                        show("Pembelian diverifikasi");
                                        $("#view-topup-container").fadeOut(300);
                                        getTopUps();
                                    }
                                });
                            }
                        });
                    });
                    $("#confirm-cancel").html("Tidak").unbind().on("click", function() {
                        $("#confirm-container").fadeOut(300);
                    });
                    $("#confirm-title").html("Verifikasi");
                    $("#confirm-container").css("display", "flex").hide().fadeIn(300);
                });
                $("#view-topup-ok").html("OK").unbind().on("click", function() {
                    $("#view-topup-container").fadeOut(300);
                });
                hideProgress();
                $("#view-topup-container").css("display", "flex").hide().fadeIn(300);
            }
        });
    });
}

function closeViewTopupDialog() {
    $("#view-topup-container").fadeOut(300);
}

function closeZoomImg() {
    $("#zoom-img-container").fadeOut(300);
}