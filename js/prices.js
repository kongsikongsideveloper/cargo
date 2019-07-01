var pricesJSON;
var prices = [];

$(document).ready(function() {
    getPrices();
});

function getPrices() {
    prices = [];
    $("#prices").find("*").remove();
    showProgress("Memuat daftar harga");
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-prices.php',
        dataType: 'text',
        cache: false,
        success: function(response) {
            pricesJSON = JSON.parse(response);
            for (var i=0; i<pricesJSON.length; i++) {
                var priceJSON = pricesJSON[i];
                var price = {
                    "id": priceJSON["id"],
                    "name": priceJSON["name"],
                    "price": priceJSON["price"]
                };
                prices.push(price);
            }
            $("#prices").append("" +
                "<tr>" +
                "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>1</div></td>" +
                "<td>Bongkar muat barang</td>" +
                "<td>Rp"+formatMoney(parseInt(getPrice("unload_service")))+",-</td>" +
                "<td><a class='edit-order link'>Ubah</a></td>" +
                "</tr>"
            );
            hideProgress();
            setPriceClickListener();
        }
    });
}

function setPriceClickListener() {
    $(".edit-order").unbind().on("click", function() {
        var td = $(this).parent();
        var tr = td.parent();
        var index = $("#prices").children().index(tr);
        var price = prices[index];
        $("#edit-price-price").val(parseInt(price["price"]));
        $("#edit-price-title").html("Ubah Harga");
        $("#edit-price-ok").unbind().on("click", function() {
            var priceText = $("#edit-price-price").val().trim();
            if (priceText == "") {
                show("Mohon masukkan harga");
                return;
            }
            var priceInt = parseInt(priceText);
            if (priceInt == 0) {
                show("Mohon masukkan harga di atas 0");
                return;
            }
            showProgress("Mengubah info harga");
            var fd = new FormData();
            fd.append("id", price["id"]);
            fd.append("price", priceInt);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'edit-price.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    $("#edit-price-container").fadeOut(300);
                    show("Harga diubah");
                    getPrices();
                }
            });
        });
        $("#edit-price-container").css("display", "flex").hide().fadeIn(300);
    });
}

function getPrice(name) { // eg: unload_service
    for (var i=0; i<pricesJSON.length; i++) {
        var priceJSON = pricesJSON[i];
        if (priceJSON["name"].trim() == name.trim()) {
            return parseInt(priceJSON["price"]);
        }
    }
    return 0;
}

function closeEditPriceDialog() {
    $("#edit-price-container").fadeOut(300);
}