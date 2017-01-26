    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */

    function kmeans(data, k) {
        var clusters = [];

        // Position cluster centroids
        for(var i=0; i<k; i++){
            clusters[i] = {
                "Ac": Math.random(),
                "Bc": Math.random(),
                "Dc": Math.random()
            };
        }

        console.log(clusters);

        // while error < Threshold
        // if max iterations => early termination
            // Nearest neigbours
            data.forEach(function(d, i){
                // Calculate distance to each cluster point
                // Assign distance to closest cluster

                if(d.A<0.5) {
                    d.cluster = 0;
                } else {
                    d.cluster = 1;
                }
            });
        // endWhile

    };

    // calculate N-dimensional euclidian distance from d1 to d2
    function eDistance(d1, d2){
        // rootSum = ...
        // return sqrt(rootSum);
    }
