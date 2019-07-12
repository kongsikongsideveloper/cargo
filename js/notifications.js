var notifications = [];
var imgFile = null;
var imgChanged = false;
var currentImg;

$(document).ready(function() {
    getNotifications();
});

function getNotifications() {
    notifications = [];
    $("#notifications").find("*").remove();
    showProgress("Memuat notifikasi");
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-notifications.php',
        dataType: 'text',
        cache: false,
        success: function(response) {
            notifications = JSON.parse(response);
            for (var i=0; i<notifications.length; i++) {
                var notification = notifications[i];
                var date = new Date(parseInt(notification["date"]));
                $("#notifications").append("" +
                    "<tr>" +
                    "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>" + (i+1) + "</div></td>" +
                    "<td>" + notification["title"] + "</td>" +
                    "<td>" + notification["description"] + "</td>" +
                    "<td>" + date.customFormat("#DD#/#MM#/#YYYY# #hh#:#mm#:#ss#") + "</td>" +
                    "<td><a class='edit-notification link'>Edit</a></td>" +
                    "<td><a class='delete-notification link'>Hapus</a></td>" +
                    "</tr>"
                );
            }
            setNotificationClickListener();
            hideProgress();
        }
    });
}

function setNotificationClickListener() {
    $(".edit-notification").unbind().on("click", function() {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var notification = notifications[index];
        currentImg = notification["img"];
        imgChanged = false;
        imgFile = null;
        $("#edit-notification-dialog-title").html("Ubah Notifikasi");
        $("#edit-notification-title").val(notification["title"]);
        $("#edit-notification-content").val(notification["description"]);
        if (notification["img"].trim() != "") {
            $("#edit-notification-img").attr("src", "http://"+HOST+"/userdata/images/"+notification["img"]);
        } else {
            $("#edit-notification-img").attr("src", "img/no_img.png");
        }
        $("#edit-notification-ok").unbind().on("click", function() {
            var title = $("#edit-notification-title").val().trim();
            var content = $("#edit-notification-content").val().trim();
            if (title == "") {
                show("Mohon masukkan judul");
                return;
            }
            if (content == "") {
                show("Mohon masukkan konten");
                return;
            }
            showProgress("Menyimpan notifikasi");
            if (imgChanged && imgFile != null) {
                let fd = new FormData();
                var imgFileName = generateUUID()+".jpg";
                fd.append("file", imgFile);
                fd.append("file_name", imgFileName);
                $.ajax({
                    type: 'POST',
                    url: PHP_PATH+'upload-image.php',
                    data: fd,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: function(response) {
                        let fd = new FormData();
                        fd.append("id", notification["id"]);
                        fd.append("title", title);
                        fd.append("description", content);
                        fd.append("img", imgFileName);
                        $.ajax({
                            type: 'POST',
                            url: PHP_PATH+'edit-notification.php',
                            data: fd,
                            processData: false,
                            contentType: false,
                            cache: false,
                            success: function(response) {
                                $("#edit-notification-container").fadeOut(300);
                                getNotifications();
                            }
                        });
                    }
                });
            } else {
                var fd = new FormData();
                fd.append("id", notification["id"]);
                fd.append("title", title);
                fd.append("description", content);
                fd.append("img", currentImg);
                $.ajax({
                    type: 'POST',
                    url: PHP_PATH+'edit-notification.php',
                    data: fd,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: function(response) {
                        $("#edit-notification-container").fadeOut(300);
                        getNotifications();
                    }
                });
            }
        });
        $("#edit-notification-container").css("display", "flex").hide().fadeIn(300);
    });
    $(".delete-notification").unbind().on("click", function() {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var notification = notifications[index];
        $("#confirm-title").html("Hapus Notifikasi");
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus notifikasi ini?");
        $("#confirm-ok").unbind().on("click", function() {
            showProgress("Menghapus notifikasi");
            var fd = new FormData();
            fd.append("id", notification["id"]);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'delete-notification.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    $("#confirm-container").fadeOut(300);
                    getNotifications();
                }
            });
        });
        $("#confirm-cancel").unbind().on("click", function() {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
    });
}

function closeEditNotificationDialog() {
    $("#edit-notification-container").fadeOut(300);
}

function selectNotificationImg() {
    $("#select-notification-img").on("change", function() {
        imgFile = $(this).prop("files")[0];
        imgChanged = true;
        var fr = new FileReader();
        fr.onload = function() {
            $("#edit-notification-img").attr("src", fr.result);
        };
        fr.readAsDataURL(imgFile);
    });
    $("#select-notification-img").click();
}

function addNotification() {
    $("#edit-notification-dialog-title").html("Tambah Notifikasi");
    $("#edit-notification-title").val("");
    $("#edit-notification-content").val("");
    $("#edit-notification-img").attr("src", "img/no_img.png");
    imgChanged = false;
    imgFile = null;
    $("#edit-notification-ok").unbind().on("click", function() {
        var title = $("#edit-notification-title").val().trim();
        var content = $("#edit-notification-content").val().trim();
        if (title == "") {
            show("Mohon masukkan judul");
            return;
        }
        if (content == "") {
            show("Mohon masukkan konten");
            return;
        }
        showProgress("Menyimpan notifikasi");
        if (imgChanged && imgFile != null) {
            let fd = new FormData();
            var imgFileName = generateUUID()+".jpg";
            fd.append("file", imgFile);
            fd.append("file_name", imgFileName);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'upload-image.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    let fd = new FormData();
                    fd.append("title", title);
                    fd.append("description", content);
                    fd.append("img", imgFileName);
                    $.ajax({
                        type: 'POST',
                        url: PHP_PATH+'add-notification.php',
                        data: fd,
                        processData: false,
                        contentType: false,
                        cache: false,
                        success: function(response) {
                            $("#edit-notification-container").fadeOut(300);
                            getNotifications();
                        }
                    });
                }
            });
        } else {
            var fd = new FormData();
            fd.append("title", title);
            fd.append("description", content);
            fd.append("img", "");
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'add-notification.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    $("#edit-notification-container").fadeOut(300);
                    getNotifications();
                }
            });
        }
    });
    $("#edit-notification-container").css("display", "flex").hide().fadeIn(300);
}