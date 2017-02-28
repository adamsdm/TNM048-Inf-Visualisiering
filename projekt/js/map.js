function map(data) {

    var mapDiv = $("#map");

    var width = mapDiv.width();
    var height = mapDiv.height();

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

    var scale = window.innerWidth/6000;
    var zoomWidth = (width-scale*width)/2;
    var zoomHeight = (height-scale*height)/2;

    var zoom = d3.behavior.zoom()
        .scaleExtent([0.1, 5])
        .translate([zoomWidth,zoomHeight])
        .scale(scale)
        .on("zoom", move);

    //Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

    var g = svg.append("g")
            .attr("transform", "translate("+zoomWidth+","+zoomHeight+") scale("+scale+")");
    var d = svg.append("d");

    // Deselect all on click
    svg.on("click", function() {
        var selected = document.querySelectorAll(".selected");
        [].forEach.call(selected, function(el) {
            el.classList.remove("selected");
        });
    });


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
                                "Date: " + d.date + "<br />"
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
                        // Remove class 'selected' from previously not selected
                        var selected = document.querySelectorAll(".selected");
                        [].forEach.call(selected, function(el) {
                            el.classList.remove("selected");
                        });

                        var allCircles = g.selectAll("circle")

                        console.log("x: " + this.getAttribute("cx"));
                        console.log("y: " + this.getAttribute("cy"));
                        console.log(this.getAttribute("r"));
                        //console.log(allCircles[0]);

                        this.classList.add("selected");
                        displaySelected(d);
                        d3.event.stopPropagation();
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



    //Calls DBSCAN and changes the color of the points
    document.getElementById("cluster").onclick = function(){
        var d = g.selectAll("circle")[0];
        var eps = 50;
        var minPts = 20;
        var noClusters = 1000;

        DBScan(d, eps, minPts, noClusters);
    }


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

    function displaySelected(d){
        var sites = {
            "ANM": "Alamogordo, New Mexico, USA (US atmospheric test)",
            "HRJ": "Hiroshima, Japan (US/warfare)",
            "NGJ": "Nagasaki, Japan (US/warfare)",
            "BKN": "Bikini (US atmospheric tests)",
            "ENW": "Enwetak (US atmospheric tests)",
            "CNV": "Centra Nevada (US underground test)",
            "NTS": "Nevada Test Site, Nevada, USA (US atmospheric and underground and UK underground tests)",
            "FMT": "Farmington, Colorado (US underground natural gas stimulation test)",
            "MBI": "Monte Bello Islands, Australia (UK atmospheric test)",
            "EMU": "Emu Field, 480 kilometers SW of Woomera, Australia (UK atmospheric tests)",
            "PAC": "Various Pacific Ocean sites",
            "MAR": "Maralinga, Australia (UK atmospheric tests)",
            "CHR": "Christmas Island (UK and US atmospheric tests)",
            "NZ" : "Novaya Zemlya, USSR (USSR atmospheric and underground tests)",
            "KTS": "Eastern Kazakh or Semipalitinsk test site, USSR (USSR atmospheric and underground tests)",
            "REG": "Reggane Proving Grounds, Algeria (French Atmospheric Tests)",
            "ECK": "Ecker, Algeria (French Underground tests)",
            "CLS": "Carlsbad, New Mexico, USA (US underground test)",
            "JON": "Johnston Island (US atmospheric tests)",
            "FAL": "Fallon, Nevada, USA (US underground test)",
            "LNR": "Lop Nor, PRC (PRC atmospheric and underground tests)",
            "AMC": "Amchitka Island, Aleutians, Alaska, USA (US underground tests)",
            "MUR": "Muruora Is. (French atmospheric and underground tests)",
            "FAN": "Fangataufa Is. (French atmospheric and underground tests)",
            "HTB": "Hattiesburg, Mississippi, USA (US underground tests)",
            "GRV": "Grand Valley, Colorado, USA (US natural gas stimulation)",
            "RAJ": "Rajasthan Desert, India (Indian underground test)",
            "?IN": "Indian Ocean (putative Israeli Test)",
            "RFL": "Rifle, Colorado, USA (3x33kt simultaneous gas stimulation shots)",
            "SAT": "South Atlantic Ocean (three US tests, rocket to 482 kilometers altitude)",
            "MAL": "Malden Island (UK atmospheric tests)",
            "KPY": "Kapustin Yar (USSR)",
            "SYS": "Sary Shagan (USSR)"
        };

        var types = {
            "AIRD": "Airdrop",
            "ART" : "Artillery shell",
            "ATMO": "In or above the atmosphere",
            "BALN": "Balloon",
            "BARG": "Barge",
            "CRAT": "Crater",
            "RC"  : "Roman candle=open vertical shaft",
            "ROCK": "Rocket",
            "SHFT": "Stemmed vertical shaft",
            "SS1" : "Simultaneous shot in shaft 1",
            "SS2" : "Simultaneous shot in shaft 2",
            "SSn" : "Simultaneous shot in shaft n",
            "SURF": "Surface (unknown but probably not airdropped, near surface)",
            "TOWR": "Yower",
            "TUNN": "Yunnel",
            "UNDW": "Underwater"
        }

        var purposes = {
            "WR": "Weapons related",
            "**": "War",
            "WE": "Weapons effects",
            "SF": "Safety",
            "PS": "Plowshare (US PNE engineering shots)",
            "VU": "US Vela Uniform-directed toward seismic detection of underground shots"
        }
        var days = ["Monday", "Tuesday", "Wednesday","Thursday","Friday", "Saturday", "Sunday"];
        var months = ["Jan", "Feb", "Mars","April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var mod = $("#infoModal");
        var modTitle = $("#infoModal .modal-title");
        var modBody = $("#infoModal .modal-body");

        var name=d.name, date = format.parse(d.date), tp = d.testingParty,
            site=sites[d.site] || "No data", yiel=d.yieldKilotons, type = types[d.type] || "No data",
            purpose = purposes[d.purpose] || "No data";

        if(name.length==0) name = "No name";

        console.log(days[5]);

        modTitle.html("Test name: " + name);
        modBody.html("<p>" +
                    "<b>Date:</b> " + formatDate(date) + '<br />' +
                    "<b>Testing party:</b> "  + tp + '<br />' +
                    "<b>Site:</b> " + site + '<br />' +
                    "<b>Yield:</b> " + yiel +" Kt" + '<br />' +
                    "<b>Purpose:</b> " + purpose + '<br />' +
                    "<b>Type:</b> " + type + '<br />' +
                    "</p>"
        )

        // Display modal
        mod.modal();

        function formatDate ( date ) {
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day = date.getDate();

            // Convert day, month to two digit
            day = ("0" + day).slice(-2);
            month = ("0" + month).slice(-2);

            return year + '-' + month + '-' + day;
        }
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
