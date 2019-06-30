var currentActiveConnections = 0;
var currentMaximumConnections = 1;
var currentProfilePicture = "";
var admins = [];

$(document).ready(function() {
    getAdmins();
});

function getAdmins() {
    $("#admins").find("*").remove();
    admins = [];
    showProgress("Memuat admin");
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-admins.php',
        dataType: 'text',
        cache: false,
        success: function(response) {
            console.log("Response: "+response);
            var adminsJSON = JSON.parse(response);
            for (var i=0; i<adminsJSON.length; i++) {
                var adminJSON = adminsJSON[i];
                var admin = {
                    id: adminJSON["id"],
                    email: adminJSON["email"],
                    password: adminJSON["password"],
                    firstName: adminJSON["first_name"],
                    lastName: adminJSON["last_name"],
                    verified: adminJSON["verified"]
                };
                admins.push(admin);
                $("#admins").append(""+
                    "<tr>"+
                    "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>"+(i+1)+"</div></td>"+
                    "<td>"+admin["email"]+"</td>"+
                    "<td>"+admin["password"]+"</td>"+
                    "<td><a class='edit-admin link'>Ubah</a></td>"+
                    "<td><a class='delete-admin link'>Hapus</a></td>"+
                    "</tr>"
                );
            }
            hideProgress();
            setAdminClickListener();
        }
    });
}

function setAdminClickListener() {
    $(".edit-admin").unbind().on("click", function() {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var admin = admins[index];
        $("#edit-admin-title").html("Ubah Admin");
        $("#edit-admin-email").val(admin["email"]);
        $("#edit-admin-password").val(admin["password"]);
        $("#edit-admin-first-name").val(admin["firstName"]);
        $("#edit-admin-last-name").val(admin["lastName"]);
        var verified = admin["verified"];
        if (verified == 0) {
            $("#verify-no").prop("checked", true);
            $("#verify-yes").prop("checked", false);
        } else if (verified == 1) {
            $("#verify-no").prop("checked", false);
            $("#verify-yes").prop("checked", true);
        }
        $("#edit-admin-container").css("display", "flex").hide().fadeIn(300);
        $("#edit-admin-ok").html("Ubah").unbind().on("click", function() {
            var email = $("#edit-admin-email").val().trim();
            var password = $("#edit-admin-password").val().trim();
            var firstName = $("#edit-admin-first-name").val().trim();
            var lastName = $("#edit-admin-last-name").val().trim();
            if (email == "") {
                show("Mohon masukkan email");
                return;
            }
            if (password == "") {
                show("Mohon masukkan kata sandi");
                return;
            }
            if (firstName == "" && lastName == "") {
                show("Mohon masukkan nama");
                return;
            }
            var verified = 1;
            if ($("#verify-no").prop("checked") == true) {
                verified = 0;
            }
            showProgress("Mengubah informasi admin");
            var fd = new FormData();
            fd.append("id", admin["id"]);
            fd.append("password", password);
            fd.append("email", email);
            fd.append("first_name", firstName);
            fd.append("last_name", lastName);
            fd.append("verified", verified);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'edit-admin.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(a) {
                    $("#edit-admin-container").fadeOut(300);
                    hideProgress();
                    var response = a;
                    console.log("Response: "+response);
                    if (response == 0) {
                        for (var i=0; i<admins.length; i++) {
                            if (admins[i]["id"] == admin["id"]) {
                                admins[i]['email'] = email;
                                admins[i]['password'] = password;
                                admins[i]['first_name'] = firstName;
                                admins[i]['last_name'] = lastName;
                                admins[i]['verified'] = verified;
                                break;
                            }
                        }
                        getAdmins();
                    } else if (response == -1) {
                        show("Nama admin sudah digunakan");
                    } else if (response == -2) {
                        show("Nomor HP sudah digunakan");
                    } else if (response == -3) {
                        show("Email sudah digunakan");
                    } else {
                        show("Kesalahan: "+response);
                    }
                }
            });
        });
    });
    $(".delete-admin").unbind().on("click", function() {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var admin = admins[index];
        $("#confirm-title").html("Hapus Admin");
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus admin ini?");
        $("#confirm-ok").unbind().on("click", function() {
            $("#confirm-container").hide();
            if (admins.length == 1) {
                show("Tidak bisa menghapus admin. Minimal harus ada 1 admin yang terdaftar.");
                return;
            }
            showProgress("Menghapus admin");
            $.ajax({
                type: 'GET',
                url: PHP_PATH+'delete-admin.php',
                data: {'id': admin["id"]},
                dataType: 'text',
                cache: false,
                success: function(a) {
                    show("Admin berhasil dihapus");
                    getAdmins();
                }
            });
        });
        $("#confirm-cancel").unbind().on("click", function() {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
    });
}

function addAdmin() {
    currentActiveConnections = 0;
    currentMaximumConnections = 1;
    currentProfilePicture = "img/profile-picture.jpg";
    $("#edit-admin-title").html("Tambah Admin");
    $("#edit-admin-email").val("");
    $("#edit-admin-password").val("");
    $("#edit-admin-first-name").val("");
    $("#edit-admin-last-name").val("");
    $("#verify-yes").prop("checked", true);
    $("#verify-no").prop("checked", false);
    $("#edit-admin-container").css("display", "flex").hide().fadeIn(300);
    $("#edit-admin-ok").html("Tambah").unbind().on("click", function() {
        var email = $("#edit-admin-email").val().trim();
        var password = $("#edit-admin-password").val().trim();
        var firstName = $("#edit-admin-first-name").val().trim();
        var lastName = $("#edit-admin-last-name").val().trim();
        if (email == "") {
            show("Mohon masukkan email");
            return;
        }
        if (password == "") {
            show("Mohon masukkan kata sandi");
            return;
        }
        if (firstName == "") {
            show("Mohon masukkan nama depan");
            return;
        }
        if (lastName == "") {
            show("Mohon masukkan nama belakang");
            return;
        }
        var verified = 1;
        if ($("#verify-no").prop("checked") == true) {
            verified = 0;
        }
        showProgress("Membuat admin");
        var fd = new FormData();
        fd.append("email", email);
        fd.append("password", password);
        fd.append("first_name", firstName);
        fd.append("last_name", lastName);
        fd.append("verified", verified);
        $.ajax({
            type: 'POST',
            url: PHP_PATH+'add-admin.php',
            data: fd,
            contentType: false,
            processData: false,
            cache: false,
            success: function(a) {
                var responseCode = parseInt(a);
                if (responseCode == -1) {
                    show("Email sudah digunakan");
                    hideProgress();
                } else {
                    $("#edit-admin-container").fadeOut(300);
                    getAdmins();
                }
            }
        });
    });
}

function closeEditAdminDialog() {
    $("#edit-admin-container").fadeOut(300);
}