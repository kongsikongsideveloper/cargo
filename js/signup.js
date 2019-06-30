$(document).ready(function() {
});

function signup() {
    var firstName = $("#first-name").val().trim();
    var lastName = $("#last-name").val().trim();
    var email = $("#email").val().trim();
    var password = $("#password").val().trim();
    if (firstName == "" && lastName == "") {
        show("Mohon masukkan nama");
        return;
    }
    if (email == "") {
        show("Mohon masukkan email");
        return;
    }
    if (password == "") {
        show("Mohon masukkan kata sandi");
        return;
    }
    showProgress("Sedang mendaftar");
    var fd = new FormData();
    fd.append("email", email);
    fd.append("password", password);
    fd.append("first_name", firstName);
    fd.append("last_name", lastName);
    fd.append("verified", "0");
    $.ajax({
        type: 'POST',
        url: PHP_PATH+'add-admin.php',
        data: fd,
        contentType: false,
        processData: false,
        cache: false,
        success: function(a) {
            var responseCode = parseInt(a);
            if (responseCode == 0) {
                hideProgress();
                $("#alert-title").html("Pendaftaran Sukses");
                $("#alert-msg").html("Akun Anda telah berhasil dibuat. Untuk mulai mengakses konten, tunggu hingga admin kami menyetujui pembuatan akun Anda.")
                $("#alert-ok").unbind().on("click", function() {
                    $("#alert-container").fadeOut(300);
                });
                $("#alert-container").css("display", "flex").hide().fadeIn(300);
            } else if (responseCode == -1) {
                show("Email sudah digunakan");
                hideProgress();
            }
        }
    });
}