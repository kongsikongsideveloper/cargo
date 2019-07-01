var referrals = [];

$(document).ready(function() {
    getReferrals();
});

function getReferrals() {
    referrals = [];
    $("#referrals").find("*").remove();
    showProgress("Memuat daftar referral");
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-referrals.php',
        dataType: 'text',
        cache: false,
        success: function(response) {
            var referralsJSON = JSON.parse(response);
            for (var i=0; i<referralsJSON.length; i++) {
                let number = i+1;
                var referral = referralsJSON[i];
                referrals.push(referral);
                var userID = referral["user_id"];
                var fd = new FormData();
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
                        $("#referrals").append("" +
                            "<tr>" +
                            "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>"+number+"</div></td>" +
                            "<td>"+userInfo["first_name"].trim()+" "+userInfo["last_name"].trim()+"</td>" +
                            "<td>"+referral["code"].trim()+"</td>" +
                            "<td><a class='edit-order link'>Ubah</a></td>" +
                            "</tr>"
                        );
                        setReferralClickListener();
                        /*$("#edit-referral-name").val(userInfo["first_name"].trim()+" "+userInfo["last_name"].trim());
                        $("#edit-referral-code").val(referral["code"].trim());
                        $("#edit-referral-ok").unbind().on("click", function() {
                            var referralCode = $("#edit-referral-code").val().trim();
                            if (referralCode == "") {
                                show("Mohon masukkan kode referral");
                                return;
                            }
                        });*/
                    }
                });
            }
            hideProgress();
        }
    });
}

function setReferralClickListener() {
    $(".edit-referral").unbind().on("click", function() {
        var tr = $(this).parent().parent();
        var index = $("#referrals").children().index(tr);
        var referral = referrals[index];
        showProgress("Memuat info referral");
        var userID = referral["user_id"];
        var fd = new FormData();
        fd.append("id", userID);
        $.ajax({
            type: 'POST',
            url: PHP_PATH + 'get-user-info.php',
            data: fd,
            processData: false,
            contentType: false,
            cache: false,
            success: function (response) {
                var userInfo = JSON.parse(response);
                $("#edit-referral-code").val(userInfo["referral"]);
                $("#edit-referral-ok").unbind().on("click", function() {
                    var code = $("#edit-referral-code").val().trim();
                    if (code == "") {
                        show("Mohon masukkan kode referral");
                        return;
                    }

                });
                hideProgress();
            }
        });
    });
}

function closeEditReferralDialog() {
    $("#edit-referral-container").fadeOut(300);
}