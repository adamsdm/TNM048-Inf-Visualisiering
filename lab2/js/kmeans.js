    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */

    function kmeans(data, k) {
        var clusters = [];


        const DIMS = d3.keys(data[0]).length;

        // Position cluster centroids
        for(var i=0; i<k; i++){
            clusters[i] = [];
            for(var dim=0; dim<DIMS; dim++){
                clusters[i][dim] = Math.random();
            }
        }

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

            // Update cluster centroids
        // endWhile
    //return data

    };

    var a = [1,2,3];
    var b = [1,2,3];

    console.log(eDistance(a,b));

    // calculate N-dimensional euclidian distance from d1 to d2
    function eDistance(c, l) {
        var rootSum = 0;

        // Calculate root sum
        for(var i=0; i<c.length; i++){
            rootSum+= Math.pow(c[i]-l[i], 2);
        }

        return Math.sqrt(rootSum);
    }
