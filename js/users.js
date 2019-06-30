var currentProfilePicture = "";
var users = [];
var currentUser;
var currentUserName;
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
                                url: PHP_PATH+'get-user-info.php',
                                data: fd3,
                                processData: false,
                                contentType: false,
                                cache: false,
                                success: function(response) {
                                    var userInfo = JSON.parse(response);
                                    var senderName = userInfo["first_name"]+" "+userInfo["last_name"];
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
    getUsers();
});

function sendMessage(message) {
    $("#message").val("");
    var updates = {};
    updates["users/" + currentUser["id"] + "/new_message_content"] = message;
    firebase.database().ref().update(updates);

    updates = {};
    updates["users/" + currentUser["id"] + "/new_message_admin_id"] = adminID;
    firebase.database().ref().update(updates);

    updates = {};
    updates["users/" + currentUser["id"] + "/new_message"] = 1;
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
            fd.append("user_id", currentUser["id"]);
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

function getUsers() {
    $("#users").find("*").remove();
    users = [];
    showProgress("Memuat pengguna");
    // Get users
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-users.php',
        dataType: 'text',
        cache: false,
        success: function(response) {
            console.log("Response: "+response);
            var usersJSON = JSON.parse(response);
            for (var i=0; i<usersJSON.length; i++) {
                var userJSON = usersJSON[i];
                var user = {
                    id: userJSON["id"],
                    email: userJSON["email"],
                    pin: userJSON["pin"],
                    phone: userJSON["phone"],
                    first_name: userJSON["first_name"],
                    last_name: userJSON["last_name"],
                    profile_picture_url: userJSON["profile_picture_url"],
                    one_signal_id: userJSON["one_signal_id"],
                    confirmed: userJSON["confirmed"],
                    position: userJSON["position"],
                    latitude: userJSON["latitude"],
                    longitude: userJSON["longitude"],
                    address: userJSON["address"],
                    register_date: userJSON["register_date"],
                    referral: userJSON["referral"],
                    current_order_id: userJSON["current_order_id"],
                    identity_card_img: userJSON["identity_card_img"],
                    verified: userJSON["verified"]
                };
                users.push(user);
                $("#users").append("" +
                    "<tr>" +
                    "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>" + (i+1) + "</div></td>" +
                    "<td>" + user["first_name"]+ " " + user["last_name"] + "</td>" +
                    "<td>" + user["email"] + "</td>" +
                    "<td>" + user["pin"] + "</td>" +
                    "<td><a class='send-message link'>Kirim</a></td>" +
                    "<td><a class='edit-user link'>Ubah</a></td>" +
                    "<td><a class='delete-user link'>Hapus</a></td>" +
                    "</tr>"
                );
            }
            setUserClickListener();
            hideProgress();
        }
    });
}

function getMessages() {
    $("#messages").find("*").remove();
    var fd = new FormData();
    fd.append("admin_id", adminID);
    fd.append("user_id", currentUser["id"]);
    firebase.database().ref("users/"+currentUser["id"]+"/name").once("value").then(function(snapshot) {
        currentUserName = snapshot.val();
        firebase.database().ref("admins/"+adminID+"/name").once("value").then(function(snapshot) {
            adminName = snapshot.val();
            console.log("User name: "+currentUserName+", admin name: "+adminName);
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
                                        "<div style='color: #888888; font-size: 14px;'>" + currentUserName + "</div>" +
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

function setUserClickListener() {
    $(".send-message").unbind().on("click", function () {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var user = users[index];
        currentUser = user;
        $("#user-name").html(user["first_name"]+" "+user["last_name"]);
        $("#user-email").html(user["email"]);
        if (user["profile_picture_url"].trim() != "") {
            $.get(user["profile_picture_url"].trim()).done(function() {
                $("#user-profile-picture").attr("src", user["profile_picture_url"].trim());
            }).fail(function() {
                $("#user-profile-picture").attr("src", "img/profile-picture.jpg");
            });
        } else {
            $("#user-profile-picture").attr("src", "img/profile-picture.jpg");
        }
        $("#chat-container").css("display", "flex").hide().fadeIn(100);
        $("#message").val("");
        getMessages();
    });
    $(".edit-user").unbind().on("click", function () {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var user = users[index];
        currentProfilePictureURL = user["profile_picture_url"];
        $("#edit-user-title").html("Ubah Informasi Pengguna");
        $("#edit-user-first-name").val(user["first_name"]);
        $("#edit-user-last-name").val(user["last_name"]);
        $("#edit-user-phone").val(user["phone"]);
        currentPhone = user["phone"];
        $("#edit-user-email").val(user["email"]);
        currentEmail = user["email"];
        $("#edit-user-pin").val(user["pin"]);
        var confirmed = parseInt(user["confirmed"]);
        if (confirmed == 1) {
            $("#confirmed-yes").prop("checked", true);
            $("#confirmed-no").prop("checked", false);
        } else if (confirmed == 0) {
            $("#confirmed-yes").prop("checked", false);
            $("#confirmed-no").prop("checked", true);
        }
        $("#edit-user-address").val(user["address"]);
        $("#edit-user-referral").val(user["referral"]);
        currentReferralCode = user["referral"];
        if (user["profile_picture_url"].trim() != "") {
            $.get(user["profile_picture_url"]).done(function () {
                $("#edit-user-profile-picture").attr("src", user["profile_picture_url"]);
            }).fail(function () {
                $("#edit-user-profile-picture").attr("src", "img/profile-picture.jpg");
            });
        } else {
            $("#edit-user-profile-picture").attr("src", "img/profile-picture.jpg");
        }
        if (user["identity_card_img"].trim() != "") {
            $.get(user["identity_card_img"]).done(function() {
                $("#edit-user-identity-card-img").attr("src", user["identity_card_img"]);
            }).fail(function() {
                $("#edit-user-identity-card-img").attr("src", "img/profile-picture.jpg");
            });
        } else {
            $("#edit-user-identity-card-img").attr("src", "img/profile-picture.jpg");
        }
        var verified = parseInt(user["verified"]);
        if (verified == 0) {
            $("#verified-yes").prop("checked", false);
            $("#verified-no").prop("checked", true);
        } else if (verified == 1) {
            $("#verified-yes").prop("checked", true);
            $("#verified-no").prop("checked", false);
        }
        $("#edit-user-container").css("display", "flex");
        $("#edit-user-ok").html("Ubah").unbind().on("click", function () {
            var firstName = $("#edit-user-first-name").val().trim();
            var lastName = $("#edit-user-last-name").val().trim();
            var phone = $("#edit-user-phone").val().trim();
            var email = $("#edit-user-email").val().trim();
            var pin = $("#edit-user-pin").val().trim();
            var confirmed = 0;
            if ($("#confirmed-yes").prop("checked") == true) {
                confirmed = 1;
            }
            var address = $("#edit-user-address").val().trim();
            var referral = $("#edit-user-referral").val().trim();
            var verified = 0;
            if ($("#verified-yes").prop("checked") == true) {
                verified = 1;
            }
            var position = user["position"];
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
            showProgress("Mengubah informasi pengguna");
            if (currentProfilePictureFile == null) {
                editUser(user, firstName, lastName, phone, phoneChanged, email, emailChanged, pin, confirmed, address, referral, referralChanged, verified);
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
                        editUser(user, firstName, lastName, phone, phoneChanged, email, emailChanged, pin, confirmed, address, referral, referralChanged, verified);
                    }
                });
            }
        });
    });
    $(".delete-user").unbind().on("click", function () {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var user = users[index];
        $("#confirm-title").html("Hapus Pengguna");
        $("#close-confirm").unbind().on("click", function () {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus pengguna ini?");
        $("#confirm-ok").unbind().on("click", function () {
            $("#confirm-container").hide();
            showProgress("Menghapus pengguna");
            $.ajax({
                type: 'GET',
                url: PHP_PATH + 'delete-user.php',
                data: {'id': user["id"]},
                dataType: 'text',
                cache: false,
                success: function (a) {
                    firebase.database().ref("users/" + user["id"]).remove();
                    hideProgress();
                    getUsers();
                }
            });
        });
        $("#confirm-cancel").unbind().on("click", function () {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
    });
}

function editUser(user, firstName, lastName, phone, phoneChanged, email, emailChanged, pin, confirmed, address, referral, referralChanged, verified) {
    var fd = new FormData();
    fd.append("id", user["id"]);
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
        url: PHP_PATH+'edit-user.php',
        data: fd,
        contentType: false,
        processData: false,
        cache: false,
        success: function(response) {
            var responseCode = parseInt(response);
            if (responseCode == 0) {
                $("#edit-user-container").fadeOut(300);
                getUsers();
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

function addUser() {
    currentProfilePicture = "img/profile-picture.jpg";
    $("#edit-user-title").html("Tambah Pengguna");
    $("#edit-user-first-name").val("");
    $("#edit-user-last-name").val("");
    $("#edit-user-phone").val("");
    $("#edit-user-email").val("");
    $("#edit-user-pin").val("");
    $("#edit-user-address").val("");
    $("#edit-user-referral").val("");
    $("#edit-user-profile-picture").attr("src", "img/profile-picture.jpg");
    $("#edit-user-identity-card-img").attr("src", "img/profile-picture.jpg");
    $("#edit-user-container").css("display", "flex").hide().fadeIn(300);
    $("#edit-user-ok").html("Tambah").unbind().on("click", function () {
        var firstName = $("#edit-user-first-name").val().trim();
        var lastName = $("#edit-user-last-name").val().trim();
        var phone = $("#edit-user-phone").val().trim();
        var email = $("#edit-user-email").val().trim();
        var pin = $("#edit-user-pin").val().trim();
        var address = $("#edit-user-address").val().trim();
        var referral = $("#edit-user-referral").val().trim();
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
        showProgress("Menambah pengguna");
        if (currentProfilePictureFile == null) {
            addUser2(email, phone, pin, firstName, lastName, address, referral);
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
                    addUser2(email, phone, pin, firstName, lastName, address, referral);
                }
            });
        }
    });
}

function addUser2(email, phone, pin, firstName, lastName, address, referral) {
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
        url: PHP_PATH+'add-user.php',
        data: fd,
        processData: false,
        contentType: false,
        cache: false,
        success: function(response) {
            var responseCode = parseInt(response);
            if (responseCode == 0) {
                $("#edit-user-container").fadeOut(300);
                getUsers();
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

function closeEditUserDialog() {
    $("#edit-user-container").fadeOut(300);
}

function generateRandomUsername() {
    var userName = generateRandomID(14);
    $("#edit-user-username").val(userName);
}

function selectProfilePicture() {
    $("#edit-user-select-profile-picture").on("change", function () {
        var fr = new FileReader();
        fr.onload = function () {
            $("#edit-user-profile-picture").attr("src", fr.result);
        };
        fr.readAsDataURL($(this).prop("files")[0]);
    });
    $("#edit-user-select-profile-picture").click();
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
            $("#edit-user-profile-picture").attr("src", fr.result);
        };
        fr.readAsDataURL(file);
    }).click();
}

function generateRandomReferral() {
    $("#edit-user-referral").val(generateRandomID(8));
}