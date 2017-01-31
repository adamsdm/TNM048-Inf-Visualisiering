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
            var cluster = {
                centroid: {},
                indices: [],
            };

            for(var dim = 0; dim<DIMS; dim++){
                cluster.centroid[letters[dim]] = String(Math.random());
            }
            clusters[i] = cluster;
        }



        // while error < Threshold
        // if max iterations => early termination
            // Nearest neigbours
            data.forEach(function(d, i){
                var distArr = [];
                clusters.forEach(function(c){
                    distArr.push(eDistance(d, c.centroid));
                });

                d["distArr"] = distArr; //TEMP
                d["cluster"] = _.indexOf(distArr, _.min(distArr));
                clusters[_.indexOf(distArr, _.min(distArr))].indices.push(i);
                //console.log(distArr.indexOf(Math.min(...distArr)) );
            });
            // Update cluster centroids
            for(var n = 0; n<k; n++){
                updateClusterCentroid(data, clusters[n]);
            }

        // endWhile


        //return data
        return clusters;










        // HELP FUNCTIONS
        function updateClusterCentroid(data, theCluster){
            if(theCluster.indices.length == 0 ) return;

            var dimSum = Array.apply(null, Array(DIMS)).map(Number.prototype.valueOf,0);
            var newCentroid = {};

            for(var i=0; i<theCluster.indices.length; i++){
                theData = data[theCluster.indices[i]];
                for(var dim=0; dim<DIMS; dim++){
                    dimInd = Object.keys(theData)[dim];
                    dimSum[dim] += parseFloat(theData[dimInd]);
                }
            }

            dimSum = _.map(dimSum, function(num){ return num / theCluster.indices.length; });


            for(var dim=0; dim<DIMS; dim++){
                dimInd = Object.keys(theData)[dim];
                theCluster.centroid[dimInd] = dimSum[dim];
            }
        }

        function eDistance(c, l) {

            var rootSum = 0;

            // Calculate root sum
            for(var i=0; i<DIMS; i++){
                var ci = c[Object.keys(c)[i]];
                var li = l[Object.keys(l)[i]];
                rootSum += Math.pow(ci-li, 2);
            }


            return Math.sqrt(rootSum);
        }

    };
