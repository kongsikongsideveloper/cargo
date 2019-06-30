var currentProfilePicture = "";
var drivers = [];
var currentDriver;
var currentDriverName;
var adminID;
var adminName;
var currentReferralCode;
var currentPhone;
var currentEmail;
var currentProfilePictureURL = null;
var currentProfilePictureFile = null;

$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: PHP_PATH + 'get-admin-id.php',
        dataType: 'text',
        cache: false,
        success: function (response) {
            adminID = response;
            console.log("Admin ID: "+adminID);
            $("#message").keypress(function (e) {
                if (e.which == 13) {
                    sendMessage($("#message").val());
                    return false;
                }
            });
            firebase.database().ref("admins/"+adminID+"/new_message").on("value", function(snapshot) {
                var newMessage = parseInt(snapshot.val());
                console.log("New message: "+newMessage);
                if (newMessage == 1) {
                    // New message received
                    console.log("New message received");
                    var updates = {};
                    updates["admins/"+adminID+"/new_message"] = 0;
                    firebase.database().ref().update(updates);
                    firebase.database().ref("admins/"+adminID+"/new_message_content").once("value").then(function(snapshot) {
                        var message = snapshot.val();
                        console.log("New message content: "+message);
                        firebase.database().ref("admins/"+adminID+"/new_message_sender_id").once("value").then(function(snapshot) {
                            var senderID = snapshot.val();
                            console.log("Sender ID: "+senderID);

                            var fd3 = new FormData();
                            fd3.append("id", senderID);
                            $.ajax({
                                type: 'POST',
                                url: PHP_PATH+'get-driver-info.php',
                                data: fd3,
                                processData: false,
                                contentType: false,
                                cache: false,
                                success: function(response) {
                                    var driverInfo = JSON.parse(response);
                                    var senderName = driverInfo["first_name"]+" "+driverInfo["last_name"];
                                    $("#messages").append("" +
                                        "<div style='position: relative; width: 100%; height: 60px;'>"+
                                        "<div style='position: absolute; top: 0; right: 0; margin-left: 10px; margin-right: 10px; display: flex; flex-flow: column nowrap;'>" +
                                        "<div style='color: #888888; font-size: 14px;'>" + senderName + "</div>" +
                                        "<div style='margin-top: -8px; color: black; font-size: 16px;'>" + message + "</div>" +
                                        "</div>"+
                                        "</div>");
                                    $("#messages").scrollTop($("#messages").prop("scrollHeight"));
                                }
                            });
                        });
                    });
                }
            });
        }
    });
    getDrivers();
});

function sendMessage(message) {
    $("#message").val("");
    var updates = {};
    updates["drivers/" + currentDriver["id"] + "/new_message_content"] = message;
    firebase.database().ref().update(updates);

    updates = {};
    updates["drivers/" + currentDriver["id"] + "/new_message_admin_id"] = adminID;
    firebase.database().ref().update(updates);

    updates = {};
    updates["drivers/" + currentDriver["id"] + "/new_message"] = 1;
    firebase.database().ref().update(updates);

    var fd2 = new FormData();
    fd2.append("id", adminID);
    $.ajax({
        type: 'POST',
        url: PHP_PATH+'get-admin-info.php',
        data: fd2,
        processData: false,
        contentType: false,
        cache: false,
        success: function(response) {
            var adminInfo = JSON.parse(response);
            var adminName = adminInfo["first_name"]+" "+adminInfo["last_name"];
            var fd = new FormData();
            fd.append("message", message);
            fd.append("admin_id", adminID);
            fd.append("user_id", currentDriver["id"]);
            fd.append("sender", 1);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'send-admin-message.php',
                data: fd,
                contentType: false,
                processData: false,
                cache: false,
                success: function(a) {
                    $("#messages").append("" +
                        "<div style='margin-left: 10px; margin-right: 10px; display: flex; flex-flow: column nowrap;'>" +
                        "<div style='color: #888888; font-size: 14px;'>" + adminName + "</div>" +
                        "<div style='margin-top: -8px; color: black; font-size: 16px;'>" + message + "</div>" +
                        "</div>");
                    $("#messages").scrollTop($("#messages").prop("scrollHeight"));
                }
            });
        }
    });
}

function getDrivers() {
    $("#drivers").find("*").remove();
    drivers = [];
    showProgress("Memuat driver");
    // Get drivers
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-drivers.php',
        dataType: 'text',
        cache: false,
        success: function(response) {
            console.log("Response: "+response);
            var driversJSON = JSON.parse(response);
            for (var i=0; i<driversJSON.length; i++) {
                var driverJSON = driversJSON[i];
                var driver = {
                    id: driverJSON["id"],
                    email: driverJSON["email"],
                    pin: driverJSON["pin"],
                    phone: driverJSON["phone"],
                    first_name: driverJSON["first_name"],
                    last_name: driverJSON["last_name"],
                    profile_picture_url: driverJSON["profile_picture_url"],
                    one_signal_id: driverJSON["one_signal_id"],
                    confirmed: driverJSON["confirmed"],
                    position: driverJSON["position"],
                    latitude: driverJSON["latitude"],
                    longitude: driverJSON["longitude"],
                    address: driverJSON["address"],
                    register_date: driverJSON["register_date"],
                    referral: driverJSON["referral"],
                    current_order_id: driverJSON["current_order_id"],
                    identity_card_img: driverJSON["identity_card_img"],
                    verified: driverJSON["verified"]
                };
                drivers.push(driver);
                $("#drivers").append("" +
                    "<tr>" +
                    "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>" + (i+1) + "</div></td>" +
                    "<td>" + driver["first_name"]+ " " + driver["last_name"] + "</td>" +
                    "<td>" + driver["email"] + "</td>" +
                    "<td>" + driver["pin"] + "</td>" +
                    "<td><a class='send-message link'>Kirim</a></td>" +
                    "<td><a class='edit-driver link'>Ubah</a></td>" +
                    "<td><a class='delete-driver link'>Hapus</a></td>" +
                    "</tr>"
                );
            }
            setDriverClickListener();
            hideProgress();
        }
    });
}

function getMessages() {
    $("#messages").find("*").remove();
    var fd = new FormData();
    fd.append("admin_id", adminID);
    fd.append("user_id", currentDriver["id"]);
    firebase.database().ref("drivers/"+currentDriver["id"]+"/name").once("value").then(function(snapshot) {
        currentDriverName = snapshot.val();
        firebase.database().ref("admins/"+adminID+"/name").once("value").then(function(snapshot) {
            adminName = snapshot.val();
            console.log("User name: "+currentDriverName+", admin name: "+adminName);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'get-admin-messages.php',
                data: fd,
                contentType: false,
                processData: false,
                cache: false,
                success: function(response) {
                    console.log("Response: "+response);
                    var messagesJSON = JSON.parse(response);
                    for (var i=0; i<messagesJSON.length; i++) {
                        var messageJSON = messagesJSON[i];
                        var message = messageJSON["message"];
                        var sender = messageJSON["sender"]; //1 = admin, 2 = user
                        if (sender == 1) { //admin
                            $("#messages").append("" +
                                "<div style='margin-left: 10px; margin-right: 10px; display: flex; flex-flow: column nowrap;'>" +
                                "<div style='color: #888888; font-size: 14px;'>" + adminName + "</div>" +
                                "<div style='margin-top: -8px; color: black; font-size: 16px;'>" + message + "</div>" +
                                "</div>");
                            $("#messages").scrollTop($("#messages").prop("scrollHeight"));
                        } else if (sender == 2) { //user
                            $("#messages").append("" +
                                "<div style='position: relative; width: 100%; height: 60px;'>"+
                                "<div style='position: absolute; top: 0; right: 0; margin-left: 10px; margin-right: 10px; display: flex; flex-flow: column nowrap;'>" +
                                "<div style='color: #888888; font-size: 14px;'>" + currentDriverName + "</div>" +
                                "<div style='margin-top: -8px; color: black; font-size: 16px;'>" + message + "</div>" +
                                "</div>"+
                                "</div>");
                            $("#messages").scrollTop($("#messages").prop("scrollHeight"));
                        }
                    }
                }
            });
        });
    });
}

function setDriverClickListener() {
    $(".send-message").unbind().on("click", function () {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var driver = drivers[index];
        currentDriver = driver;
        $("#driver-name").html(driver["first_name"]+" "+driver["last_name"]);
        $("#driver-email").html(driver["email"]);
        if (driver["profile_picture_url"].trim() != "") {
            $.get(driver["profile_picture_url"].trim()).done(function() {
                $("#driver-profile-picture").attr("src", driver["profile_picture_url"].trim());
            }).fail(function() {
                $("#driver-profile-picture").attr("src", "img/profile-picture.jpg");
            });
        } else {
            $("#driver-profile-picture").attr("src", "img/profile-picture.jpg");
        }
        $("#chat-container").css("display", "flex").hide().fadeIn(100);
        $("#message").val("");
        getMessages();
    });
    $(".edit-driver").unbind().on("click", function () {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var driver = drivers[index];
        currentProfilePictureURL = driver["profile_picture_url"];
        $("#edit-driver-title").html("Ubah Informasi Driver");
        $("#edit-driver-first-name").val(driver["first_name"]);
        $("#edit-driver-last-name").val(driver["last_name"]);
        $("#edit-driver-phone").val(driver["phone"]);
        currentPhone = driver["phone"];
        $("#edit-driver-email").val(driver["email"]);
        currentEmail = driver["email"];
        $("#edit-driver-pin").val(driver["pin"]);
        var confirmed = parseInt(driver["confirmed"]);
        if (confirmed == 1) {
            $("#confirmed-yes").prop("checked", true);
            $("#confirmed-no").prop("checked", false);
        } else if (confirmed == 0) {
            $("#confirmed-yes").prop("checked", false);
            $("#confirmed-no").prop("checked", true);
        }
        $("#edit-driver-address").val(driver["address"]);
        $("#edit-driver-referral").val(driver["referral"]);
        currentReferralCode = driver["referral"];
        if (driver["profile_picture_url"].trim() != "") {
            $.get(driver["profile_picture_url"]).done(function () {
                $("#edit-driver-profile-picture").attr("src", driver["profile_picture_url"]);
            }).fail(function () {
                $("#edit-driver-profile-picture").attr("src", "img/profile-picture.jpg");
            });
        } else {
            $("#edit-driver-profile-picture").attr("src", "img/profile-picture.jpg");
        }
        if (driver["identity_card_img"].trim() != "") {
            $.get(driver["identity_card_img"]).done(function() {
                $("#edit-driver-identity-card-img").attr("src", driver["identity_card_img"]);
            }).fail(function() {
                $("#edit-driver-identity-card-img").attr("src", "img/profile-picture.jpg");
            });
        } else {
            $("#edit-driver-identity-card-img").attr("src", "img/profile-picture.jpg");
        }
        var verified = parseInt(driver["verified"]);
        if (verified == 0) {
            $("#verified-yes").prop("checked", false);
            $("#verified-no").prop("checked", true);
        } else if (verified == 1) {
            $("#verified-yes").prop("checked", true);
            $("#verified-no").prop("checked", false);
        }
        $("#edit-driver-container").css("display", "flex");
        $("#edit-driver-ok").html("Ubah").unbind().on("click", function () {
            var firstName = $("#edit-driver-first-name").val().trim();
            var lastName = $("#edit-driver-last-name").val().trim();
            var phone = $("#edit-driver-phone").val().trim();
            var email = $("#edit-driver-email").val().trim();
            var pin = $("#edit-driver-pin").val().trim();
            var confirmed = 0;
            if ($("#confirmed-yes").prop("checked") == true) {
                confirmed = 1;
            }
            var address = $("#edit-driver-address").val().trim();
            var referral = $("#edit-driver-referral").val().trim();
            var verified = 0;
            if ($("#verified-yes").prop("checked") == true) {
                verified = 1;
            }
            var position = driver["position"];
            if (firstName == "") {
                show("Mohon masukkan nama depan");
                return;
            }
            if (lastName == "") {
                show("Mohon masukkan nama belakang");
                return;
            }
            if (address == "") {
                show("Mohon masukkan alamat");
                return;
            }
            if (referral == "") {
                show("Mohon masukkan kode referral");
                return;
            }
            if (referral.length < 8) {
                show("Mohon masukkan kode referral sepanjang minimal 8 karakter");
                return;
            }
            var name = firstName+" "+lastName;
            if (email == "") {
                show("Mohon masukkan email");
                return;
            }
            if (pin == "") {
                show("Mohon masukkan kata sandi");
                return;
            }
            var referralChanged = 0;
            if (currentReferralCode != referral) {
                referralChanged = 1;
            }
            var phoneChanged = 0;
            if (currentPhone != phone) {
                phoneChanged = 1;
            }
            var emailChanged = 0;
            if (currentEmail != email) {
                emailChanged = 1;
            }
            showProgress("Mengubah informasi driver");
            if (currentProfilePictureFile == null) {
                editDriver(driver, firstName, lastName, phone, phoneChanged, email, emailChanged, pin, confirmed, address, referral, referralChanged, verified);
            } else {
                var pictureFileName = generateUUID()+".jpg";
                var fd = new FormData();
                fd.append("file_name", pictureFileName);
                fd.append("file", currentProfilePictureFile);
                $.ajax({
                    type: 'POST',
                    url: PHP_PATH+'upload-image.php',
                    data: fd,
                    contentType: false,
                    processData: false,
                    cache: false,
                    success: function(response) {
                        console.log("Response: "+response);
                        currentProfilePictureURL = "http://"+HOST+"/userdata/images/"+pictureFileName;
                        editDriver(driver, firstName, lastName, phone, phoneChanged, email, emailChanged, pin, confirmed, address, referral, referralChanged, verified);
                    }
                });
            }
        });
    });
    $(".delete-driver").unbind().on("click", function () {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var driver = drivers[index];
        $("#confirm-title").html("Hapus Driver");
        $("#close-confirm").unbind().on("click", function () {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus driver ini?");
        $("#confirm-ok").unbind().on("click", function () {
            $("#confirm-container").hide();
            showProgress("Menghapus driver");
            $.ajax({
                type: 'GET',
                url: PHP_PATH + 'delete-driver.php',
                data: {'id': driver["id"]},
                dataType: 'text',
                cache: false,
                success: function (a) {
                    firebase.database().ref("drivers/" + driver["id"]).remove();
                    hideProgress();
                    getDrivers();
                }
            });
        });
        $("#confirm-cancel").unbind().on("click", function () {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
    });
}

function editDriver(driver, firstName, lastName, phone, phoneChanged, email, emailChanged, pin, confirmed, address, referral, referralChanged, verified) {
    var fd = new FormData();
    fd.append("id", driver["id"]);
    fd.append("first_name", firstName);
    fd.append("last_name", lastName);
    fd.append("phone", phone);
    fd.append("phone_changed", phoneChanged);
    fd.append("email", email);
    fd.append("email_changed", emailChanged);
    fd.append("pin", pin);
    fd.append("confirmed", confirmed);
    fd.append("address", address);
    fd.append("referral", referral);
    fd.append("referral_changed", referralChanged);
    fd.append("verified", verified);
    fd.append("profile_picture_url", currentProfilePictureURL);
    $.ajax({
        type: 'POST',
        url: PHP_PATH+'edit-driver.php',
        data: fd,
        contentType: false,
        processData: false,
        cache: false,
        success: function(response) {
            var responseCode = parseInt(response);
            if (responseCode == 0) {
                $("#edit-driver-container").fadeOut(300);
                getDrivers();
            } else if (responseCode == -1) {
                show("Kode referral sudah digunakan")
                hideProgress();
            } else if (responseCode == -2) {
                show("Nomor HP sudah digunakan")
                hideProgress();
            } else if (responseCode == -3) {
                show("Email sudah digunakan")
                hideProgress();
            }
        }
    });
}

function addDriver() {
    currentProfilePicture = "img/profile-picture.jpg";
    $("#edit-driver-title").html("Tambah Driver");
    $("#edit-driver-first-name").val("");
    $("#edit-driver-last-name").val("");
    $("#edit-driver-phone").val("");
    $("#edit-driver-email").val("");
    $("#edit-driver-pin").val("");
    $("#edit-driver-address").val("");
    $("#edit-driver-referral").val("");
    $("#edit-driver-profile-picture").attr("src", "img/profile-picture.jpg");
    $("#edit-driver-identity-card-img").attr("src", "img/profile-picture.jpg");
    $("#edit-driver-container").css("display", "flex").hide().fadeIn(300);
    $("#edit-driver-ok").html("Tambah").unbind().on("click", function () {
        var firstName = $("#edit-driver-first-name").val().trim();
        var lastName = $("#edit-driver-last-name").val().trim();
        var phone = $("#edit-driver-phone").val().trim();
        var email = $("#edit-driver-email").val().trim();
        var pin = $("#edit-driver-pin").val().trim();
        var address = $("#edit-driver-address").val().trim();
        var referral = $("#edit-driver-referral").val().trim();
        if (firstName == "") {
            show("Mohon masukkan nama depan");
            return;
        }
        if (lastName == "") {
            show("Mohon masukkan nama belakang");
            return;
        }
        if (phone == "") {
            show("Mohon masukkan nomor HP");
            return;
        }
        if (email == "") {
            show("Mohon masukkan email");
            return;
        }
        if (pin == "") {
            show("Mohon masukkan kata sandi");
            return;
        }
        if (address == "") {
            show("Mohon masukkan alamat lengkap");
            return;
        }
        if (referral == "") {
            show("Mohon masukkan kode referral");
            return;
        }
        showProgress("Menambah driver");
        if (currentProfilePictureFile == null) {
            addDriver2(email, phone, pin, firstName, lastName, address, referral);
        } else {
            var pictureFileName = generateUUID()+".jpg";
            var fd = new FormData();
            fd.append("file_name", pictureFileName);
            fd.append("file", currentProfilePictureFile);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'upload-image.php',
                data: fd,
                contentType: false,
                processData: false,
                cache: false,
                success: function(response) {
                    console.log("Response: "+response);
                    currentProfilePictureURL = "http://"+HOST+"/userdata/images/"+pictureFileName;
                    addDriver2(email, phone, pin, firstName, lastName, address, referral);
                }
            });
        }
    });
}

function addDriver2(email, phone, pin, firstName, lastName, address, referral) {
    var fd = new FormData();
    fd.append("email", email);
    fd.append("phone", phone);
    fd.append("pin", pin);
    fd.append("first_name", firstName);
    fd.append("last_name", lastName);
    fd.append("profile_picture_url", currentProfilePictureURL);
    fd.append("confirmed", 1);
    fd.append("latitude", DEFAULT_LATITUDE);
    fd.append("longitude", DEFAULT_LONGITUDE);
    fd.append("address", address);
    fd.append("referral", referral);
    $.ajax({
        type: 'POST',
        url: PHP_PATH+'add-driver.php',
        data: fd,
        processData: false,
        contentType: false,
        cache: false,
        success: function(response) {
            var responseCode = parseInt(response);
            if (responseCode == 0) {
                $("#edit-driver-container").fadeOut(300);
                getDrivers();
            } else if (responseCode == -1) {
                hideProgress();
                show("Email sudah digunakan");
            } else if (responseCode == -2) {
                hideProgress();
                show("Nomor HP sudah digunakan");
            } else if (responseCode == -3) {
                hideProgress();
                show("Kode referral sudah digunakan, mohon hasilkan yang baru");
            }
        }
    });
}

function closeEditDriverDialog() {
    $("#edit-driver-container").fadeOut(300);
}

function generateRandomDrivername() {
    var driverName = generateRandomID(14);
    $("#edit-driver-username").val(driverName);
}

function selectProfilePicture() {
    $("#edit-driver-select-profile-picture").on("change", function () {
        var fr = new FileReader();
        fr.onload = function () {
            $("#edit-driver-profile-picture").attr("src", fr.result);
        };
        fr.readAsDataURL($(this).prop("files")[0]);
    });
    $("#edit-driver-select-profile-picture").click();
}

function closeSendMessageDialog() {
    $("#chat-container").hide();
}

function changeProfilePicture() {
    $("#change-profile-picture").on("change", function(e) {
        var file = e.target.files[0];
        currentProfilePictureFile = file;
        var fr = new FileReader();
        fr.onload = function() {
            $("#edit-driver-profile-picture").attr("src", fr.result);
        };
        fr.readAsDataURL(file);
    }).click();
}

function generateRandomReferral() {
    $("#edit-driver-referral").val(generateRandomID(8));
}