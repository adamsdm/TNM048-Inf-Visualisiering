function slider(data) {
    var dateSlider = document.getElementById('slider-date');
    var that = this;
    this.isPlaying = false;
        // Create a list of day and monthnames.
    var weekdays = [
            "Sunday", "Monday", "Tuesday",
            "Wednesday", "Thursday", "Friday",
            "Saturday"
    ];
    var months = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

    var startDate = '1945-01-01';
    var endDate = '1995-12-31';

    noUiSlider.create(dateSlider, {
    // Create two timestamps to define a range.
        connect: true,
        range: {
            min: timestamp(startDate),
            max: timestamp(endDate)
        },
        behaviour: 'tap-drag', // Move handle on tap, bar is draggable
    // Two more timestamps indicate the handle starting positions.
        start: [ 
            timestamp(startDate), // Handle 1
            timestamp(endDate)  // Handle 2
        ],
        tooltips: [true, true],

    // Steps of one week
        step: 1 * 24 * 60 * 60 * 1000,
    });



    this.play = function(){
        var endDate = timestamp('1995-12-31');

        var timer = setInterval(function(){
            var slide1 = +dateSlider.noUiSlider.get()[0];
            var slide2 = +slide1 + (4*365*24*60*60*1000);
            
            console.log(slide2 > endDate);
            if(!(that.isPlaying) || slide2 >= endDate){ // = 1995-12-31
                
                that.isPlaying = false;
                document.getElementById("play").innerHTML = "PLAY";
                clearInterval(timer);
            }

            slide1 += (30*24*60*60*1000);
            dateSlider.noUiSlider.set([slide1, slide2]);
        }, 50);
    }
    
    document.getElementById("play").onclick = function(){
        that.isPlaying = !that.isPlaying;

        if(that.isPlaying){
            this.innerHTML = "PAUSE";
            
        } else {
            this.innerHTML = "PLAY";
        };

        
        that.play();
    };

    dateSlider.noUiSlider.on('update', function( values, handle ) {

        var date1 = new Date(+values[0]);
        var date2 = new Date(+values[1]);


        var handles = document.getElementsByClassName("noUi-tooltip");
        var handle1 = handles[0];
        var handle2 = handles[1];
        
        handle1.innerHTML = formatDate(date1);
        handle2.innerHTML = formatDate(date2);


        //Date1/2 should be in format 1942-01-01
        map1.filterTime([ date1, date2 ]);
    });


    function timestamp(str){
        return new Date(str).getTime();   
    }

    // Append a suffix to dates.
    // Example: 23 => 23rd, 1 => 1st.
    function nth (d) {
      if(d>3 && d<21) return 'th';
      switch (d % 10) {
            case 1:  return "st";
            case 2:  return "nd";
            case 3:  return "rd";
            default: return "th";
        }
    }

    // Create a string representation of the date.
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
