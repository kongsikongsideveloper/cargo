//const HOST = "localhost/kongsicargo";
const HOST = "kongsikongsi.com/cargo";
const PHP_PATH = "http://"+HOST+"/php/";
const API_KEY = "AIzaSyCNA8fwTJhMu8ju9pdg08M5zBmninVPm5k";
const HERE_APP_ID = "BqM8uW7Z8qDUrv8ZxlSX";
const HERE_APP_CODE = "Oey0WMUEYBpTe5qq3mrq5w";
const DEFAULT_LATITUDE = -6.229728;
const DEFAULT_LONGITUDE = 106.6894287;

function show(msg) {
    $("#toast-msg").html(msg);
    $("#toast-container").css("display", "flex").hide().fadeIn(500);
    setTimeout(function() {
        $("#toast-container").fadeOut(500);
    }, 3000);
}

function showProgress(msg) {
    $("#loading-blocker").fadeIn(200);
    $("#loading-msg").html(msg+" . . .");
    $("#loading-container").css("margin-bottom", "0");
    var currentDotCount = 3;
    var progressMsgUpdater = function() {
        if (currentDotCount < 6) {
            currentDotCount++;
        } else {
            currentDotCount = 3;
        }
        var dotMsg = "";
        for (var i=0; i<currentDotCount; i++) {
            dotMsg += " ";
            dotMsg += ".";
        }
        $("#loading-msg").html(msg + dotMsg);
        setTimeout(progressMsgUpdater, 500);
    };
    setTimeout(progressMsgUpdater, 500);
}

function hideProgress() {
    $("#loading-blocker").fadeOut(200);
    $("#loading-container").css("margin-bottom", "-45px");
}

function showAlert(title, msg) {
    $("#alert-title").html(title);
    $("#alert-msg").html(msg);
    $("#alert-container").css("display", "flex").hide().fadeIn(300);
    $("#close-alert").unbind().on("click", function() {
        $("#alert-container").fadeOut(300);
    });
    $("#alert-ok").unbind().on("click", function() {
        $("#alert-container").fadeOut(300);
    });
}

function logout() {
    $("#confirm-title").html("Keluar");
    $("#confirm-msg").html("Apakah Anda yakin ingin keluar?");
    $("#confirm-ok").unbind().on("click", function() {
        $("#confirm-container").hide();
        $("#loading-blocker").show();
        showProgress("Sedang keluar");
        $.ajax({
            type: 'GET',
            url: PHP_PATH+'logout.php',
            dataType: 'text',
            cache: false,
            success: function(a) {
                window.location.href = "login.html";
            }
        });
    });
    $("#confirm-cancel").unbind().on("click", function() {
        $("#confirm-container").hide();
    });
    $("#confirm-container").css("display", "flex");
}

function openAdmins() {
    window.location.href = "admins.html";
}

function openBanks() {
    window.location.href = "banks.html";
}

function openUsers() {
    window.location.href = "users.html";
}

function openDrivers() {
    window.location.href = "drivers.html";
}

function openOrders() {
    window.location.href = "orders.html";
}

function openMobileTopUps() {
    window.location.href = "topups.html";
}

function openDataTopUps() {
    window.location.href = "data.html";
}

function openElectricityTopUps() {
    window.location.href = "electricity.html";
}

function openWithdraws() {
    window.location.href = "withdraws.html";
}

function openPrices() {
    window.location.href = "prices.html";
}

function openReferralCodes() {
    window.location.href = "referrals.html";
}

function openVoucherCodes() {
    window.location.href = "vouchers.html";
}

function openTrucks() {
    window.location.href = "vehicles.html";
}

function generateRandomID(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/*function formatMoney(money) {
    return (money).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}*/

function formatMoney(n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

Date.prototype.customFormat = function(formatString){
    var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
    var dateObject = this;
    YY = ((YYYY=dateObject.getFullYear())+"").slice(-2);
    MM = (M=dateObject.getMonth()+1)<10?('0'+M):M;
    MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
    DD = (D=dateObject.getDate())<10?('0'+D):D;
    DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dateObject.getDay()]).substring(0,3);
    th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
    formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
    h=(hhh=dateObject.getHours());
    if (h==0) h=24;
    if (h>12) h-=12;
    hh = h<10?('0'+h):h;
    hhhh = hhh<10?('0'+hhh):hhh;
    AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
    mm=(m=dateObject.getMinutes())<10?('0'+m):m;
    ss=(s=dateObject.getSeconds())<10?('0'+s):s;
    return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
}