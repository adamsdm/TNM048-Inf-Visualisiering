/**
* DBSCAN algorithm
* @param d = starting points
* @param eps = Max distance inside cluster
* @param minPts = Min pts in a cluster
*/

function DBScan(d, eps, minPts){

    // Add clustering data to each circles data
    d.forEach(function(d){
        var dData = d.__data__;
        dData.clustering = {};
        dData.clustering.isVisited = false;
        dData.clustering.isMember = false;
        dData.clustering.cluster = -1;
    })


    // Start the clustering
    for (var i = 0; i < d.length; i++){
        var dData = d[i].__data__;

        if (!dData.clustering.isVisited) {
            dData.clustering.isVisited = true;

            neighbourPts = regionQuery(d[i], eps);


            if(neighbourPts.length > minPts){
                c = []; //should be next cluster
                expandCluster(d[p], neighbourPts, c, eps, minPts);
            }
        }
    }



    // Help functions
    function regionQuery(p, eps){
        var clusterPoints = [];
        clusterPoints.push(p);

        for (var i = 0; i < d.length; i++){
            if (euclideanDistance(d[i], p) <= eps)
                clusterPoints.push(d[i]);
        }

        return clusterPoints;
    }


    function expandCluster(p, neighbourPts, c, eps, minPts){
        c.push(p);

        for (var i = 0; i < neighbourPts.length; i++){
            if(!neighbourPts[i].isVisited)
            {
                neighbourPts[i].isVisited = true;
                var neighbourPts2 = regionQuery(neighbourPts[i], eps);
                if (neighbourPts2.length >= minPts)
                    neighbourPts = neighbourPts.concat(neighbourPts2); //join the 2 areas
            }
            if(!neighbourPts[i].isMember)
                c.push(neighbourPts[i]);
        }
    }

    function euclideanDistance(p1, p2){
        var p1x = p1.getAttribute("cx")
        var p1y = p1.getAttribute("cy")
        var p2x = p2.getAttribute("cx")
        var p2y = p2.getAttribute("cy")

        var dx = Math.abs(p1x - p2x);
        var dy = Math.abs(p1y - p2y);

        return Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
    }

}
