window.onload = function(){
    loadScreen();
}

function loadScreen(){
    setTimeout(function(){
        $("#hideLoading").fadeIn();
    }, 2000);
}

document.getElementById("hideLoading").onclick = function(){
    $("#loadscreen").fadeOut();
}