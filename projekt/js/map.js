function map(data) {

    var mapDiv = $("#map");

    var width = mapDiv.width();
    var height = mapDiv.height();

    var zoom = d3.behavior.zoom()
        .scaleExtent([0.5, 5])
        .on("zoom", move);

    var format = d3.time.format.utc("%Y%m%d");



    //initialize tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var filterdData = data;
    updateCounters();

    //Sets the colormap
    var colors = colorbrewer.Set3[10];
    
    var scale = 0.3;
    var zoomWidth = (width-scale*width)/2 + 120;
    var zoomHeight = (height-scale*height)/2;

    //Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate("+zoomWidth+","+zoomHeight+") scale("+scale+")")   // Center map when map is loaded
            .call(zoom)
            .append("svg:g")

    var g = svg.append("g");
    var d = svg.append("d");

    //Sets the map projection
    var projection = d3.geo.mercator()
            .center([8.25, 56.8])
            .scale(700);

    //Creates a new geographic path generator and assing the projection
    var path = d3.geo.path().projection(projection);

    //Loads geo data
    d3.json("data/world-topo.json", function (error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        draw(countries);
    });

    // Scale for defining radius
    var rScale = d3.scale.linear()
        .domain([0, 60000])
        .range([10, 100]);

    //Draws the map and the points
    function draw(countries)
    {
        //draw map
        var country = g.selectAll(".country").data(countries);
        country.enter().insert("path")
                .attr("class", "country")
                .attr("d", path);

        //draw detonations
        var point = g.selectAll("circle")
                    .data(data).enter()
                    .append("circle")
                    .attr("class", "point")
                    .attr("cx", function (d) {
                        return projection(d.coords)[0];
                    })
                    .attr("cy", function (d) {
                        return projection(d.coords)[1];
                    })
                    .attr("r", function(d){
                        var k = d.yieldKilotons;

                        // If yield is defined
                        if(k){
                            return rScale(k) + "px";
                        }
                        // If yield is undefined return min radius
                        else{
                            return rScale(0) + "px";;
                        }
                    })
                    .attr("opacity", 0.7)
                    .attr("fill", (d) =>{
                        var countryColors = {
                            "United States":                "blue",
                            "UK":                           "dodgerblue",
                            "USSR":                         "red",
                            "France":                       "skyblue",
                            "India":                        "Orange",
                            "People's Republic of China":   "Yellow",
                            "Israel":                       "black"
                        };
                        return countryColors[d.testingParty];
                    })
                    .on("mousemove", function(d) {
                        return tooltip.html(
                                "Name: " + d.name + "<br />" +
                                "Date: " + d.date + "<br />" +
                                "Testing party: "  + d.testingParty + "<br />" +
                                "Coords: " + d.coords + "<br />" +
                                "Site: " + d.site + "<br />" +
                                "Yield (Kt): " + d.yieldKilotons + "<br />"
                            )
                        .style("opacity", .9)
                        .style("top", (d3.event.pageY-15)+"px")
                        .style("left",(d3.event.pageX+7)+"px");
                    })
                    .on("mouseout",  function(d) {
                        return tooltip
                        .transition().duration(400)
                        .style("opacity", 0);
                    })
                    .on("click",  function(d) {
                        this.className += "selected";
                        alert(
                                "Name: " + d.name + "\n" +
                                "Date: " + d.date + "\n" +
                                "Testing party: "  + d.testingParty + "\n" +
                                "Coords: " + d.coords + "\n" +
                                "Site: " + d.site + "\n" +
                                "Yield (Kt): " + d.yieldKilotons + "\n"
                        );
                    });
    };
    

    //Filters data points according to the specified time window
    // Inputs date in string format 1945-01-01
    this.filterTime = function (value) {
        // Parse string to date
		var start = new Date(Date.parse(value[0]));
		var end = new Date(Date.parse(value[1]));

        //Empty filteredData;
        filterdData=[];

		var circles = g.selectAll("circle").attr("class", (d) => {
			var dTime = format.parse(d.date);
			if( !(dTime<end && dTime > start) )
                return "hidden";
            filterdData.push(d);
		});

        //Only update counters if circles have been drawn
        if(circles[0].length>0){
            updateCounters();
        }
    };

    //Calls k-means function and changes the color of the points
    d.cluster = function () {
        k = document.getElementById("k").value;
        if(k>10) k=10; // Only allow for 10 

        kmeans(geoData.features, k);
        g.selectAll("circle")
            .attr("fill", (d) =>{
                return colors[d.cluster];
            })
    };

    // Updates the counters 
    function updateCounters(){

        var cCount = {
            "United States": 0,
            "UK": 0,
            "USSR": 0,
            "France": 0,
            "India": 0,
            "People's Republic of China": 0,
            "Israel": 0
        };

        for(var i=0; i<filterdData.length; i++){
            cCount[filterdData[i].testingParty]++;
        }

        document.getElementById("usa-count").innerHTML =    cCount["United States"];
        document.getElementById("ussr-count").innerHTML =   cCount["USSR"];
        document.getElementById("uk-count").innerHTML =     cCount["UK"];
        document.getElementById("fr-count").innerHTML =     cCount["France"];
        document.getElementById("ch-count").innerHTML =     cCount["People's Republic of China"];
        document.getElementById("ind-count").innerHTML =    cCount["India"];
        document.getElementById("isr-count").innerHTML =    cCount["Israel"];
    }

    //Zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ") scale(" + s + ")");
    }

    //Prints features attributes
    function printInfo(value) {
        var elem = document.getElementById('info');
        elem.innerHTML = "Place: " + value["place"] + " / Depth: " + value["depth"] + " / Magnitude: " + value["mag"] + "&nbsp;";
    }

}
