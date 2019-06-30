var vehicles = [];

$(document).ready(function() {
    getVehicles();
});

function getVehicles() {
    vehicles = [];
    $("#vehicles").find("*").remove();
    showProgress("Memuat daftar kendaraan");
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-vehicles.php',
        dataType: 'text',
        cache: false,
        success: function(response) {
            var vehiclesJSON = JSON.parse(response);
            for (var i=0; i<vehiclesJSON.length; i++) {
                var vehicleJSON = vehiclesJSON[i];
                var vehicle = {
                    id: vehicleJSON["id"],
                    name: vehicleJSON["name"],
                    pricePerKM: vehicleJSON["price_per_km"]
                };
                vehicles.push(vehicle);
                $("#vehicles").append("" +
                    "<tr>" +
                    "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>" + (i+1) + "</div></td>" +
                    "<td>" + vehicle["name"] + "</td>" +
                    "<td>" + vehicle["pricePerKM"] + "</td>" +
                    "<td><a class='edit-vehicle link'>Ubah</a></td>" +
                    "<td><a class='delete-vehicle link'>Hapus</a></td>" +
                    "</tr>"
                );
            }
            setVehicleClickListener();
            hideProgress();
        }
    });
}

function setVehicleClickListener() {
    $(".edit-vehicle").unbind().on("click", function() {
        var td = $(this).parent();
        var tr = td.parent();
        var index = $("#vehicles").children().index(tr);
        var vehicle = vehicles[index];
        $("#edit-vehicle-name").val(vehicle["name"]);
        $("#edit-vehicle-price").val(vehicle["pricePerKM"]);
        $("#edit-vehicle-title").html("Ubah Detail Kendaraan");
        $("#edit-vehicle-ok").html("Simpan").unbind().on("click", function() {
            var name = $("#edit-vehicle-name").val().trim();
            var tmpPrice = $("#edit-vehicle-price").val().trim();
            if (name == "") {
                show("Mohon masukkan nama kendaraan");
                return;
            }
            if (tmpPrice == "") {
                show("Mohon masukkan harga per KM");
                return;
            }
            var price = parseFloat(tmpPrice);
            showProgress("Menyimpan detail kendaraan");
            var fd = new FormData();
            fd.append("id", vehicle["id"]);
            fd.append("name", name);
            fd.append("price", price);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'edit-vehicle.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    $("#edit-vehicle-container").fadeOut(300);
                    hideProgress();
                    getVehicles();
                }
            });
        });
        $("#edit-vehicle-container").css("display", "flex").hide().fadeIn(300);
    });
    $(".delete-vehicle").unbind().on("click", function() {
        var td = $(this).parent();
        var tr = td.parent();
        var index = $("#vehicles").children().index(tr);
        var vehicle = vehicles[index];
        $("#confirm-title").html("Hapus Kendaraan");
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus kendaraan ini?");
        $("#confirm-ok").html("Ya").unbind().on("click", function() {
            showProgress("Menghapus kendaraan");
            var fd = new FormData();
            fd.append("id", vehicle["id"]);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'delete-vehicle.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    show("Kendaraan dihapus");
                    $("#confirm-container").fadeOut(300);
                    getVehicles();
                }
            });
        });
        $("#confirm-cancel").unbind().on("click", function() {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-container").css("display", "flex").hide().fadeIn(150);
    });
}

function addVehicle() {
    $("#edit-vehicle-name").val("");
    $("#edit-vehicle-price").val("");
    $("#edit-vehicle-title").html("Tambah Kendaraan");
    $("#edit-vehicle-ok").html("Tambah").unbind().on("click", function() {
        var name = $("#edit-vehicle-name").val().trim();
        var tmpPrice = $("#edit-vehicle-price").val().trim();
        if (name == "") {
            show("Mohon masukkan nama kendaraan");
            return;
        }
        if (tmpPrice == "") {
            show("Mohon masukkan harga per KM");
            return;
        }
        var price = parseFloat(tmpPrice);
        showProgress("Menambah kendaraan");
        var fd = new FormData();
        fd.append("name", name);
        fd.append("price_per_km", price);
        $.ajax({
            type: 'POST',
            url: PHP_PATH+'add-vehicle.php',
            data: fd,
            processData: false,
            contentType: false,
            cache: false,
            success: function(response) {
                $("#edit-vehicle-container").fadeOut(300);
                hideProgress();
                getVehicles();
            }
        });
    });
    $("#edit-vehicle-container").css("display", "flex").hide().fadeIn(300);
}

function closeEditVehicleDialog() {
    $("#edit-vehicle-container").fadeOut(300);
}