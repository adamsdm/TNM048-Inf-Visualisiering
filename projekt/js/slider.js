function slider(data) {
    var dateSlider = document.getElementById('slider-date');
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
        
        
        format: {
          to: function ( value ) {
            return formatDate(new Date(value) )
          },
          from: function ( value ) {
            return value;
          }
          
        },
        

        

    // Steps of one week
        step: 1 * 24 * 60 * 60 * 1000,
    });


    
    this.play = function(){
        var i=0;
        setInterval(function(){
            var slide1 = +dateSlider.noUiSlider.get()[0] + i*100000000000;
            var slide2 = +slide1+100000000000;
            console.log(slide1 + "   -   " + slide2);
            dateSlider.noUiSlider.set([slide1, slide2]);
            i++;
        }, 1000);
    }
    
    

    dateSlider.noUiSlider.on('update', function( values, handle ) {

        var date1 = new Date(Date.parse("2005-7-8"));
        var date2 = values[1];

        map1.filterTime([ values[0], values[1] ]);
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
