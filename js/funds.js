var topups = [];

$(document).ready(function() {
    getTopUps();
});

function getTopUps() {
    topups = [];
    $("#topups").find("*").remove();
    showProgress("Memuat daftar transaksi top up");
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-pending-funds.php',
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
    var topup = topupsJSON[i];
    topups.push(topup);
    var buyerID = topup["user_id"];
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
            var senderName = topup["sender_name"];
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
                "<td>" + senderName + "</td>" +
                "<td>Rp" + formatMoney(parseInt(topup["amount"])) + ",-</td>" +
                "<td>" + date.customFormat("#DD#/#MM#/#YYYY# #hh#:#mm#:#ss#") + "</td>" +
                "<td>" + status + "</td>" +
                "<td><a class='view-fund link'>Lihat</a></td>" +
                "<td><a class='delete-fund link'>Hapus</a></td>" +
                "</tr>"
            );
            i++;
            displayTopup(i, topupsJSON);
        }
    });
}

function setTopUpClickListener() {
    $(".view-fund").unbind().on("click", function() {
        var td = $(this).parent();
        var tr = td.parent();
        var index = $("#topups").children().index(tr);
        var topup = topups[index];
        var buyerID = topup["user_id"];
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
                var senderName = topup["sender_name"];
                $("#view-topup-buyer-name").val(senderName);
                $("#view-topup-buyer-phone").val(topup["phone"]);
                $("#view-topup-amount").val("Rp"+formatMoney(parseInt(topup["amount"]))+",-");
                $("#view-topup-sender-name").val(topup["sender_name"]);
                $("#view-topup-sender-bank").val(topup["sender_bank"]);
                $("#view-topup-sender-account").val(topup["sender_account_number"]);
                $("#view-topup-receiver-bank").val(topup["receiver_bank_name"]);
                var proofImgURL = "http://"+HOST+"/userdata/images/"+topup["proof_img"];
                $("#view-topup-proof-img").attr("src", proofImgURL);
                $("#view-topup-proof-img-zoom").unbind().on("click", function() {
                    $("#zoom-img").attr("src", proofImgURL);
                    $("#zoom-img-container").css("display", "flex");
                });
                var date = new Date(parseInt(topup["date"]));
                $("#view-topup-date").val(date.customFormat("#DD#/#MM#/#YYYY# #hh#:#mm#:#ss#"));
                $("#verify-paid").unbind().on("click", function() {
                    if (topup["status"].trim() != "completed") {
                        $("#confirm-msg").html("Apakah Anda yakin sudah mentransfer ke nomor pembeli sesuai jumlah yang diminta?");
                        $("#confirm-ok").html("Ya").unbind().on("click", function () {
                            $("#confirm-container").fadeOut(300);
                            showProgress("Memverifikasi pembelian");
                            var fd2 = new FormData();
                            fd2.append("id", topup["id"]);
                            $.ajax({
                                type: 'POST',
                                url: PHP_PATH + 'verify-pending-fund.php',
                                data: fd2,
                                processData: false,
                                contentType: false,
                                cache: false,
                                success: function (response) {
                                    var notification = {
                                        "app_id": "b7699770-1386-42b2-8e6a-06e81cbf1c48",
                                        "contents": {
                                            "en": "Mohon cek jumlah pulsa Anda"
                                        },
                                        "include_player_ids": [userInfo["one_signal_id"]],
                                        "headings": {"en": "Saldo Anda berhasil ditambahkan"},
                                        "data": {"en": {"type": "fund_finished", "top_up_id": topup["id"]}}
                                    };
                                    $.ajax({
                                        type: 'POST',
                                        url: 'https://onesignal.com/api/v1/notifications',
                                        data: JSON.stringify(notification),
                                        dataType: 'json',
                                        contentType: 'application/json; charset=utf-8',
                                        success: function (response) {
                                            hideProgress();
                                            show("Pembelian diverifikasi");
                                            $("#view-topup-container").fadeOut(300);
                                            getTopUps();
                                        }
                                    });
                                }
                            });
                        });
                        $("#confirm-cancel").html("Tidak").unbind().on("click", function () {
                            $("#confirm-container").fadeOut(300);
                        });
                        $("#confirm-title").html("Verifikasi");
                        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
                    } else {
                        show("Pengisian saldo sudah diverifikasi");
                    }
                });
                $("#view-topup-ok").html("OK").unbind().on("click", function() {
                    $("#view-topup-container").fadeOut(300);
                });
                hideProgress();
                $("#view-topup-container").css("display", "flex").hide().fadeIn(300);
            }
        });
    });
    $(".delete-fund").unbind().on("click", function() {
        var td = $(this).parent();
        var tr = td.parent();
        var index = $("#topups").children().index(tr);
        var topup = topups[index];
        $("#confirm-title").html("Hapus");
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus informasi pengisian saldo berikut?");
        $("#confirm-ok").unbind().on("click", function() {
            $("#confirm-container").hide();
            showProgress("Menghapus info pengisian saldo");
            var fd = new FormData();
            fd.append("id", topup["id"]);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'delete-pending-fund.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    getTopUps();
                }
            });
        });
        $("#confirm-cancel").unbind().on("click", function() {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
    });
}

function closeViewTopupDialog() {
    $("#view-topup-container").fadeOut(300);
}

function closeZoomImg() {
    $("#zoom-img-container").fadeOut(300);
}