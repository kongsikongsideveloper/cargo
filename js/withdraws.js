var withdraws = [];

$(document).ready(function() {
    getWithdraws();
});

function getWithdraws() {
    withdraws = [];
    $("#withdraws").find("*").remove();
    showProgress("Memuat daftar harga");
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-withdraws.php',
        dataType: 'text',
        cache: false,
        success: function(response) {
            var withdrawsJSON = JSON.parse(response);
            for (var i=0; i<withdrawsJSON.length; i++) {
                var withdraw = withdrawsJSON[i];
                withdraws.push(withdraw);
            }
            displayWithdraw(0);
        }
    });
}

function displayWithdraw(looper) {
    if (looper >= withdraws.length) {
        hideProgress();
        return;
    }
    var withdraw = withdraws[looper];
    let userID = withdraw["user_id"];
    let fd = new FormData();
    fd.append("id", userID);
    $.ajax({
        type: 'POST',
        url: PHP_PATH+'get-user-info.php',
        data: fd,
        processData: false,
        contentType: false,
        cache: false,
        success: function(response) {
            var userInfo = JSON.parse(response);
            var date = new Date(parseInt(withdraw["date"]));
            var status = "Pending";
            if (withdraw["status"] == "pending") {
                status = "Pending";
            } else if (withdraw["status"] == "completed") {
                status = "Selesai";
            }
            $("#withdraws").append("" +
                "<tr>" +
                "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>"+(looper+1)+"</div></td>" +
                "<td>"+userInfo["first_name"].trim()+" "+userInfo["last_name"].trim()+"</td>" +
                "<td>Rp"+formatMoney(parseInt(withdraw["amount"]))+",-</td>" +
                "<td>"+date.customFormat("#DD#/#MM#/#YYYY# #hh#:#mm#:#ss#")+"</td>" +
                "<td>"+status+"</td>" +
                "<td><a class='edit-withdraw link'>Ubah</a></td>" +
                "<td><a class='delete-withdraw link'>Hapus</a></td>" +
                "</tr>"
            );
            setWithdrawClickListener();
            displayWithdraw(looper+1);
        }
    });
}

function setWithdrawClickListener() {
    $(".edit-withdraw").unbind().on("click", function() {
        var td = $(this).parent();
        var tr = td.parent();
        var index = $("#withdraws").children().index(tr);
        var withdraw = withdraws[index];
        showProgress("Memuat");
        var fd = new FormData();
        fd.append("id", withdraw["user_id"]);
        $.ajax({
            type: 'POST',
            url: PHP_PATH + 'get-user-info.php',
            data: fd,
            processData: false,
            contentType: false,
            cache: false,
            success: function (response) {
                var userInfo = JSON.parse(response);
                $("#edit-withdraw-price").val(withdraw["amount"]);
                var fd2 = new FormData();
                fd2.append("user_id", withdraw["user_id"]);
                $.ajax({
                    type: 'POST',
                    url: PHP_PATH+'get-user-bank.php',
                    data: fd2,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: function(response) {
                        var userBankInfo = JSON.parse(response);
                        $("#edit-withdraw-bank-type").val(userBankInfo["bank_name"]);
                        $("#edit-withdraw-account-number").val(userBankInfo["account_number"]);
                        $("#verify-transfered").unbind().on("click", function() {
                            if (withdraw["status"].trim() != "completed") {
                                $("#confirm-title").html("Verifikasi Penarikan");
                                $("#confirm-msg").html("Apakah Anda yakin sudah mentransfer sesuai jumlah yang diminta?");
                                $("#confirm-ok").unbind().on("click", function () {
                                    $("#confirm-container").hide();
                                    var fd = new FormData();
                                    fd.append("id", withdraw["id"]);
                                    showProgress("Memperbaharui info penarikan");
                                    $.ajax({
                                        type: 'POST',
                                        url: PHP_PATH + 'verify-pending-withdraw.php',
                                        data: fd,
                                        processData: false,
                                        contentType: false,
                                        cache: false,
                                        success: function (response) {
                                            var notification = {
                                                "app_id": "b7699770-1386-42b2-8e6a-06e81cbf1c48",
                                                "contents": {
                                                    "en": "Mohon cek jumlah saldo Anda"
                                                },
                                                "include_player_ids": [userInfo["one_signal_id"]],
                                                "headings": {"en": "Saldo yang Anda minta sudah ditarik"},
                                                "data": {
                                                    "en": {
                                                        "type": "withdraw_finished",
                                                        "withdraw_id": withdraw["id"]
                                                    }
                                                }
                                            };
                                            $.ajax({
                                                type: 'POST',
                                                url: 'https://onesignal.com/api/v1/notifications',
                                                data: JSON.stringify(notification),
                                                dataType: 'json',
                                                contentType: 'application/json; charset=utf-8',
                                                success: function (response) {
                                                    $("#edit-withdraw-container").fadeOut(300);
                                                    show("Info penarikan diubah");
                                                    getWithdraws();
                                                }
                                            });
                                        }
                                    });
                                });
                                $("#confirm-cancel").unbind().on("click", function () {
                                    $("#confirm-container").fadeOut(300);
                                });
                                $("#confirm-container").css("display", "flex").hide().fadeIn(300);
                            } else {
                                show("Saldo sudah ditarik ke rekening pengguna");
                            }
                        });
                        $("#edit-withdraw-container").css("display", "flex").hide().fadeIn(300);
                        hideProgress();
                    }
                });
            }
        });
    });
    $(".delete-withdraw").unbind().on("click", function() {
        var td = $(this).parent();
        var tr = td.parent();
        var index = $("#withdraws").children().index(tr);
        var withdraw = withdraws[index];
        $("#confirm-title").html("Hapus Info Penarikan");
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus info penarikan berikut?");
        $("#confirm-ok").unbind().on("click", function() {
            $("#confirm-container").hide();
            showProgress("Menghapus info penarikan");
            var fd = new FormData();
            fd.append("id", withdraw["id"]);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'delete-pending-withdraw.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    getWithdraws();
                }
            });
        });
        $("#confirm-cancel").unbind().on("click", function() {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
    });
}

function closeEditWithdrawDialog() {
    $("#edit-withdraw-container").fadeOut(300);
}