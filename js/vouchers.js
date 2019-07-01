var vouchers = [];

$(document).ready(function() {
    getVouchers();
});

function getVouchers() {
    vouchers = [];
    $("#vouchers").find("*").remove();
    showProgress("Memuat daftar voucher");
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-vouchers.php',
        dataType: 'text',
        cache: false,
        success: function(response) {
            var vouchersJSON = JSON.parse(response);
            for (var i=0; i<vouchersJSON.length; i++) {
                var voucher = vouchersJSON[i];
                vouchers.push(voucher);
                let number = i+1;
                $("#vouchers").append("" +
                    "<tr>" +
                    "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>"+number+"</div></td>" +
                    "<td>"+voucher["code"].trim()+"</td>" +
                    "<td>Rp"+formatMoney(parseInt(voucher["discount"].trim()))+",-</td>" +
                    "<td><a class='edit-voucher link'>Ubah</a></td>" +
                    "<td><a class='delete-voucher link'>Hapus</a></td>" +
                    "</tr>"
                );
            }
            setVoucherClickListener();
            hideProgress();
        }
    });
}

function setVoucherClickListener() {
    $(".edit-voucher").unbind().on("click", function() {
        var td = $(this).parent();
        var tr = td.parent();
        var index = $("#vouchers").children().index(tr);
        var voucher = vouchers[index];
        $("#edit-voucher-code").val(voucher["code"]);
        $("#edit-voucher-discount").val(voucher["discount"]);
        $("#edit-voucher-title").val("Ubah Kode Voucher");
        $("#edit-voucher-ok").unbind().on("click", function() {
            var code = $("#edit-voucher-code").val().trim();
            if (code == "") {
                show("Mohon masukkan kode voucher");
                return;
            }
            var discountText = $("#edit-voucher-discount").val().trim();
            if (discountText == "") {
                show("Mohon masukkan jumlah diskon");
                return;
            }
            var discount = parseInt(discountText);
            showProgress("Mengubah kode voucher");
            var fd = new FormData();
            fd.append("id", voucher["id"]);
            fd.append("code", code);
            fd.append("discount", discount);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'edit-voucher.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    $("#edit-voucher-container").fadeOut(300);
                    show("Kode voucher diubah");
                    getVouchers();
                }
            });
        });
        $("#edit-voucher-container").css("display", "flex").hide().fadeIn(300);
    });
    $(".delete-voucher").unbind().on("click", function() {
        var td = $(this).parent();
        var tr = td.parent();
        var index = $("#vouchers").children().index(tr);
        var voucher = vouchers[index];
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus kode voucher ini?");
        $("#confirm-title").html("Hapus Kode Voucher");
        $("#confirm-ok").unbind().on("click", function() {
            showProgress("Menghapus kode voucher");
            var fd = new FormData();
            fd.append("id", voucher["id"]);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'delete-voucher.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    $("#confirm-container").fadeOut(300);
                    show("Kode voucher dihapus");
                    hideProgress();
                    getVouchers();
                }
            });
        });
        $("#confirm-cancel").unbind().on("click", function() {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
    });
}

function closeEditVoucherDialog() {
    $("#edit-voucher-container").fadeOut(300);
}

function addVoucherCode() {
    $("#edit-voucher-code").val("");
    $("#edit-voucher-discount").val("");
    $("#edit-voucher-title").val("Tambah Kode Voucher");
    $("#edit-voucher-ok").html("Tambah").unbind().on("click", function() {
        var code = $("#edit-voucher-code").val().trim();
        if (code == "") {
            show("Mohon masukkan kode voucher");
            return;
        }
        var discountText = $("#edit-voucher-discount").val().trim();
        if (discountText == "") {
            show("Mohon masukkan jumlah diskon");
            return;
        }
        var discount = parseInt(discountText);
        showProgress("Menambah kode voucher");
        var fd = new FormData();
        fd.append("code", code);
        fd.append("discount", discount);
        $.ajax({
            type: 'POST',
            url: PHP_PATH+'add-voucher.php',
            data: fd,
            processData: false,
            contentType: false,
            cache: false,
            success: function(response) {
                $("#edit-voucher-container").fadeOut(300);
                show("Kode voucher ditambahkan");
                hideProgress();
                getVouchers();
            }
        });
    });
    $("#edit-voucher-container").css("display", "flex").hide().fadeIn(300);
}