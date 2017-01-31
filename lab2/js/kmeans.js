    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */

    function kmeans(data, k) {
        var clusters = [], newData = [];
        var letters = ["A", "B", "C", "D", "E", "F", "G"];

        const DIMS = d3.keys(data[0]).length;

        for(var i = 0; i<k; i++){
            var cc = {};
            for(var dim = 0; dim<DIMS; dim++){
                cc[letters[dim]] = String(Math.random());
            }
            clusters[i] = cc;
        }


        // while error < Threshold
        // if max iterations => early termination
            // Nearest neigbours
            data.forEach(function(d, i){
                var distArr = [];
                clusters.forEach(function(c){
                    distArr.push(eDistance(d, c));
                });
                d["distArr"] = distArr;
                d["cluster"] = distArr.indexOf(Math.min(...distArr));
            });




            // Update cluster centroids
        // endWhile
    //return data

    return clusters;

    };

    /**
    * euclidian distance between two vectors of dim N
    * @param c = clusterLine
    * @param l = line
    * @return {float}
    */
    function eDistance(c, l) {

        var rootSum = 0;
        var DIMS = Math.min(Object.keys(c).length, Object.keys(l).length);

        // Calculate root sum
        for(var i=0; i<DIMS; i++){
            var ci = c[Object.keys(c)[i]];
            var li = l[Object.keys(l)[i]];
            rootSum += Math.pow(ci-li, 2);
        }


        return Math.sqrt(rootSum);
    }
