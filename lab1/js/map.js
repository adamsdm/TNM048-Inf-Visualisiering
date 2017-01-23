function map(){

    var self = this;
    self.countryArray = [];

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = mapDiv.width() - margin.right - margin.left,
        height = mapDiv.height() - margin.top - margin.bottom;

    //initialize color scale
    //...

    //initialize tooltip
    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("tool");

    var projection = d3.geo.mercator()
        .center([50, 60 ])
        .scale(250);

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

    var path = d3.geo.path()
        .projection(projection);

    g = svg.append("g");

    // load data and draw the map
    d3.json("data/world-topo.topojson", function(error, world) {

        var countries = topojson.feature(world, world.objects.countries).features;

        //load summary data
        //...

        draw(countries);

    });

    function draw(countries,data)
    {
        var country = g.selectAll(".country").data(countries);

        //initialize a color country object

        var cc = {};

        for(var i = 0; i< countries.length; i++){

            cc.country = countries[i].properties.name;
            cc.color   = countries[i].properties.color;

            self.countryArray.push(cc);
        }

        //console.log(countryArray);
        //console.log(countries);


        country.enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("title", function(d) { return d.properties.name; })
            //country color
            .style("fill", function(d) { return d.properties.color; })

            //tooltip
            .on("mousemove", function(d) {
                return tooltip.style("visibility", "visible").style("top", (d3.event.pageY-15)+"px").style("left",(d3.event.pageX+7)+"px").text(d.properties.name);
            })
            .on("mouseout",  function(d) {
                return tooltip.style("visibility", "hidden");
            })
            //selection
            .on("click",  function(d) {
                console.log(d.properties);
            });

    }

    //zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;


        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

    }

    //method for selecting features of other components
    function selFeature(value){

    }
}
