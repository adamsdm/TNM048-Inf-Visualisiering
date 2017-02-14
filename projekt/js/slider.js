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

    noUiSlider.create(dateSlider, {
    // Create two timestamps to define a range.
        connect: true,
        range: {
            min: timestamp('1942'),
            max: timestamp('1996')
        },

    // Two more timestamps indicate the handle starting positions.
        start: [ timestamp('1942'), timestamp('1996') ],

    // Steps of one week
        step: 7 * 24 * 60 * 60 * 1000,

    
    });

    var dateValues = [
        document.getElementById('event-start'),
        document.getElementById('event-end')
    ];

    dateSlider.noUiSlider.on('update', function( values, handle ) {
        dateValues[handle].innerHTML = formatDate(new Date(+values[handle]));
    });

    dateSlider.noUiSlider.on('change', function( values, handle ) {

        console.log(formatDate(new Date(+values[0])));
        console.log(formatDate(new Date(+values[1])));
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

        return weekdays[date.getDay()] + ", " +
            date.getDate() + nth(date.getDate()) + " " +
            months[date.getMonth()] + " " +
            date.getFullYear();
    }
}
