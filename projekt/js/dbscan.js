/**
* DBSCAN algorithm
* @param d = starting points
* @param eps = Max distance inside cluster
* @param minPts = Min pts in a cluster 
*/

function DBScan(d, eps, minPts){
    
    for (var i = 0; i < d.length; i++){
        if (!d[p].isVisited)
        {
            d[p].isVisited = true;

            neighbourPts = regionQuery(d[i], eps);

            if(neighbourPts.length < minPts)
                d[p].noise = true;
            else
            {
                c = []; //should be next cluster
                expandCluster(d[p], neighbourPts, c, eps, minPts);
            }
        }
    }


    // Help functions
    function regionQuery(p, eps){
        var clusterPoints = [];
        clusterPoints.push(p);

        var points = g.selectAll("circle");

        for (var i = 0; i < points.length; i++){
            if (euclideanDistance(points[i], p) <= eps)
                clusterPoints.push(points[i]);
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
        return Math.sqrt(Math.pow(p1,2) + Math.pow(p2,2));
    }

}

