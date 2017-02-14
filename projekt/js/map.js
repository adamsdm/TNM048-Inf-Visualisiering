function map(data) {

    var mapDiv = $("#map");

    var width = mapDiv.width();
    var height = mapDiv.height();

        var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 5])
            .on("zoom", move);


    var curr_mag = 4;

    var format = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");

    var timeExt = d3.extent(data.map(function (d) {
        //return format.parse(d.time);
    }));

    //initialize tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var filterdData = data;

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

    //Formats the data in a feature collection trougth geoFormat()
    var geoData = {type: "FeatureCollection", features: geoFormat(data)};

    //Loads geo data
    d3.json("data/world-topo.json", function (error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        draw(countries);
    });

    //Calls the filtering function
    d3.select("#slider").on("input", function () {
        filterMag(this.value, data);
    });

    //Formats the data in a feature collection
    function geoFormat(array) {
        var data = [];
        array.map(function (d, i) {
            // fill data with GeoJSON features according to:
            // http://geojson.org/geojson-spec.html#examples
            var feat = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [d.lon, d.lat]
                },
                "properties": {
                    "depth": d.depth,
                    "id": d.id,
                    "mag": d.mag,
                    "place": d.place,
                    "time": d.time
                }
            } //endFeat

            data.push(feat);
        });

        return data;
    }

    //Draws the map and the points
    function draw(countries)
    {
        //draw map
        var country = g.selectAll(".country").data(countries);
        country.enter().insert("path")
                .attr("class", "country")
                .attr("d", path);

        //draw detonations
        // http://bl.ocks.org/phil-pedruco/7745589
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
                    .attr("r", "20px")
                    .attr("fill", (d) =>{
                        switch(d.testingParty) {
                            case 'US': // USA
                                return 'blue';
                                break;
                            case 'CP': //USSR
                                return 'red';
                                break;
                            default:
                                return 'orange';
                        } 
                        return d.testingParty;
                    })
                    .on("mousemove", function(d) {
                        return tooltip.html(
                            "Name:" + d.name + "<br />" +
                            "Date:" + d.date + "<br />" +
                            "Testing party:" + d.testingParty + "<br />" +
                            "coords:" + d.coords + "<br />"

                            )
                        .style("opacity", .9)
                        .style("top", (d3.event.pageY-15)+"px")
                        .style("left",(d3.event.pageX+7)+"px");
                    })
                    .on("mouseout",  function(d) {
                        return tooltip
                        .transition().duration(400)
                        .style("opacity", 0);
                    });
    };

    //Filters data points according to the specified magnitude
    function filterMag(value) {
        g.selectAll("circle").attr("opacity", (d) => {
			var dMag = d.properties.mag;
			if(dMag>value)
				return 1.0;
			return 0.0;
		});
    }



    //Filters data points according to the specified time window
    this.filterTime = function (value) {
		var start = value[0];
		var end = value[1];


		g.selectAll("circle").attr("opacity", (d) => {
			var dTime = format.parse(d.properties.time);
			if(dTime<end && dTime > start)
				return 1.0;
			return 0.0;
		});
    };

    //Calls k-means function and changes the color of the points
    this.cluster = function () {
        k = document.getElementById("k").value;
        if(k>10) k=10; // Only allow for 10 

        kmeans(geoData.features, k);
        g.selectAll("circle")
                    .attr("fill", (d) =>{
                        return colors[d.cluster];
                    })
    };

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
