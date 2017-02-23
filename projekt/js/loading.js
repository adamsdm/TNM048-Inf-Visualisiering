window.onload = function(){
    loadScreen();
}

function loadScreen(){
    $("#hideLoading").fadeIn();
}

document.getElementById("hideLoading").onclick = function(){
    $("#loadscreen").fadeOut();
}
