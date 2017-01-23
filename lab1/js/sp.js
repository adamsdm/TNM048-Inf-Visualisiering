function sp(){

    var self = this; // for internal d3 functions

    var spDiv = $("#sp");

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom,
        xScale, yScale, rScale;

    //initialize color scale
    //...

    //initialize tooltip
    //...

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#sp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Load data
    d3.csv("data/OECD-better-life-index-hi.csv", function(error, data) {
        self.data = data;

        var padding = 10;

        //define the domain of the scatter plot axes
        yScale = d3.scale.linear()
                     .domain( d3.extent(self.data, function(d) { return d['Household income']; }) )
                     .range([height, 0]);

        xScale = d3.scale.linear()
                     .domain( d3.extent(self.data, function(d) { return d['Life satisfaction']; }) )
                     .range([0, width]);

        rScale = d3.scale.linear()
                    .domain( d3.extent(self.data, function(d) { return d['Employment rate']; }) )
                    .range([2, 10]); // min, max radius of dots





        draw();

    });

    function draw()
    {

        // Add x axis and title.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .attr("text-anchor", "end")
            .text("Life satisfaction");


        // Add y axis and title.
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .attr("text-anchor", "end")
            .text("Household income");


        // Add the scatter dots.
        svg.selectAll(".dot")
            .data(self.data)
            .enter().append("circle")
            .attr("class", "dot")
            //Define the x and y coordinate data values for the dots
            .attr("cx", function(d, i) {
                return xScale(d['Life satisfaction']);
            })
            .attr("cy", function(d, i) {
                return yScale(d['Household income']);
            })
            .attr("r", function(d, i) {
                return rScale(d['Employment rate']);
            })
            .attr("fill", function(d) {
                return "rgb(0, 0, " + 255 + ")";
            })


            //tooltip
            .on("mousemove", function(d) {
                //...
            })
            .on("mouseout", function(d) {
                //...
            })
            .on("click",  function(d) {
              console.log('x: ' + d['Life satisfaction']);
              console.log('y: ' + d['Household income']);
            });

    }

    //method for selecting the dot from other components
    this.selectDot = function(value){
        //...
    };

    //method for selecting features of other components
    function selFeature(value){
        //...
    }

}
