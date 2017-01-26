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
                "Cc": Math.random(),
                "Dc": Math.random()
            };
        }

        // Nearest neigbours
        data.forEach(function(d, i){
            d.color = Math.random();
        });

    };
