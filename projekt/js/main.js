var area1;
var map1;

d3.json("data/detonations.json", function (error, data) {
    if (error) throw error;
    data = data.detonations;
    map1 = new map(data);

});
