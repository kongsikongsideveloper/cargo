var banks = [];
var bankIcon = null;
var bankIconChanged = false;

$(document).ready(function() {
    getBanks();
});

function getBanks() {
    banks = [];
    $("#banks").find("*").remove();
    showProgress("Memuat daftar bank");
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-banks.php',
        dataType: 'text',
        cache: false,
        success: function(response) {
            var banksJSON = JSON.parse(response);
            for (let i=0; i<banksJSON.length; i++) {
                let bankJSON = banksJSON[i];
                let iconURL = "http://"+HOST+"/userdata/images/"+bankJSON["icon"];
                let bank = {
                    'id': bankJSON["id"],
                    'name': bankJSON["name"],
                    'icon': bankJSON["icon"],
                    'account_number': bankJSON["account_number"]
                };
                $.ajax({
                    url: iconURL,
                    type: 'HEAD',
                    success: function(response) {
                        $("#banks").append(""+
                            "<tr>"+
                            "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>"+(i+1)+"</div></td>"+
                            "<td>"+bankJSON["name"]+"</td>"+
                            "<td><img src='"+iconURL+"' width='30px' height='20px'></td>"+
                            "<td>"+bankJSON["account_number"]+"</td>"+
                            "<td><a class='edit-bank link'>Ubah</a></td>"+
                            "<td><a class='delete-bank link'>Hapus</a></td>"+
                            "</tr>");
                        banks.push(bank);
                        setBankClickListener();
                    },
                    error: function() {
                        iconURL = "http://"+HOST+"/img/white.png";
                        $("#banks").append(""+
                            "<tr>"+
                            "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>"+(i+1)+"</div></td>"+
                            "<td>"+bankJSON["name"]+"</td>"+
                            "<td><img src='"+iconURL+"' width='30px' height='30px'></td>"+
                            "<td>"+bankJSON["account_number"]+"</td>"+
                            "<td><a class='edit-bank link'>Ubah</a></td>"+
                            "<td><a class='delete-bank link'>Hapus</a></td>"+
                            "</tr>");
                        banks.push(bank);
                        setBankClickListener();
                    }
                });
            }
            hideProgress();
        }
    });
}

function setBankClickListener() {
    $(".edit-bank").unbind().on("click", function() {
        var td = $(this).parent();
        var tr = td.parent();
        var index = $("#banks").children().index(tr);
        var bank = banks[index];
        bankIconChanged = false;
        $("#edit-bank-title").html("Ubah Info Nomor Rekening");
        $("#edit-bank-name").val(bank["name"]);
        $("#edit-bank-account").val(bank["account_number"]);
        $("#edit-bank-ok").html("Ubah").unbind().on("click", function() {
            var name = $("#edit-bank-name").val().trim();
            var accountNumber = $("#edit-bank-account").val().trim();
            if (name == "") {
                show("Mohon masukkan nama bank");
                return;
            }
            if (accountNumber == "") {
                show("Mohon masukkan nomor rekening");
                return;
            }
            showProgress("Mengubah info nomor rekening");
            if (bankIconChanged) {
                var iconFileName = generateUUID()+".jpg";
                let fd = new FormData();
                fd.append("file", bankIcon);
                fd.append("file_name", iconFileName);
                $.ajax({
                    type: 'POST',
                    url: PHP_PATH+'upload-image.php',
                    data: fd,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: function(response) {
                        editBank(bank["id"], name, iconFileName, accountNumber);
                    }
                });
            } else {
                editBank(bank["id"], name, bank["icon"], accountNumber);
            }
        });
        $("#edit-bank-container").css("display", "flex").hide().fadeIn(300);
    });
    $(".delete-bank").unbind().on("click", function() {
        var td = $(this).parent();
        var tr = td.parent();
        var index = $("#banks").children().index(tr);
        var bank = banks[index];
        $("#confirm-title").html("Hapus Nomor Rekening");
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus nomor rekening ini?");
        $("#confirm-ok").unbind().on("click", function() {
            $("#confirm-container").fadeOut(300);
            showProgress("Menghapus nomor rekening");
            var fd = new FormData();
            fd.append("id", bank["id"]);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'delete-bank.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    show("Bank dihapus");
                    getBanks();
                }
            });
        });
        $("#confirm-cancel").unbind().on("click", function() {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
    });
}

function editBank(id, name, icon, accountNumber) {
    var fd = new FormData();
    fd.append("id", id);
    fd.append("name", name);
    fd.append("icon", icon);
    fd.append("account_number", accountNumber);
    $.ajax({
        type: 'POST',
        url: PHP_PATH+'edit-bank.php',
        data: fd,
        processData: false,
        contentType: false,
        cache: false,
        success: function(response) {
            $("#edit-bank-container").fadeOut(300);
            show("Info bank diubah");
            getBanks();
        }
    });
}

function addAccount() {
    $("#edit-bank-name").val("");
    $("#edit-bank-account").val("");
    bankIcon = null;
    $("#edit-bank-ok").unbind().on("click", function() {
        var name = $("#edit-bank-name").val().trim();
        var accountNumber = $("#edit-bank-account").val().trim();
        if (name == "") {
            show("Mohon masukkan nama bank");
            return;
        }
        if (accountNumber == "") {
            show("Mohon masukkan nomor rekening");
            return;
        }
        showProgress("Menambah nomor rekening untuk pembayaran");
        if (bankIcon != null) {
            var iconFileName = generateUUID()+".jpg";
            let fd = new FormData();
            fd.append("file", bankIcon);
            fd.append("file_name", iconFileName);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'upload-image.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    addBank(name, iconFileName, accountNumber);
                }
            });
        } else {
            addBank(name, 'white.png', accountNumber);
        }
    });
    $("#edit-bank-container").css("display", "flex").hide().fadeIn(300);
}

function addBank(name, iconFileName, accountNumber) {
    var fd = new FormData();
    fd.append("name", name);
    fd.append("icon", iconFileName);
    fd.append("account_number", accountNumber);
    $.ajax({
        type: 'POST',
        url: PHP_PATH+'add-bank.php',
        data: fd,
        processData: false,
        contentType: false,
        cache: false,
        success: function(response) {
            $("#edit-bank-container").fadeOut(300);
            show("Bank ditambahkan");
            getBanks();
        }
    });
}

function changeBankIcon() {
    $("#select-bank-icon").on("change", function() {
        bankIcon = $(this).prop("files")[0];
        bankIconChanged = true;
        var fr = new FileReader();
        fr.onload = function() {
        };
        fr.readAsDataURL(bankIcon);
    }).click();
}

function closeEditBankDialog() {
    $("#edit-bank-container").fadeOut(300);
}