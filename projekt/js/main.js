
var map1;
var slider;

d3.json("data/detonations.json", function (error, data) {
    if (error) throw error;
    data = data.detonations;
    map1 = new map(data);
    slider = new slider(data);
});

/*
function play(){
    slider.play();
}
*/