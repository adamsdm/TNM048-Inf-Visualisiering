/**
* DBSCAN algorithm
* @param d = starting points
* @param eps = Max distance inside cluster
* @param minPts = Min pts in a cluster
*/

function DBScan(d, eps, minPts){
console.time("cluster");
    // Add clustering data to each circles data
    d.forEach(function(d){
        var dData = d.__data__;
        dData.clustering = {};
        dData.clustering.isVisited = false;
        dData.clustering.isMember = false;
        dData.clustering.cluster = -1;
    })

    var c = [];
    var cind = 0;
    // Start the clustering
    for (var i = 0; i < d.length; i++){
        var dData = d[i].__data__;

        if (!dData.clustering.isVisited) {
            dData.clustering.isVisited = true;

            var neighbourPts = [];
            var neighbourPtsind = regionQuery(i, eps);


            if(neighbourPtsind.length > minPts){

                c[cind] = [];
                expandCluster(d[i], c[cind], eps, minPts, neighbourPtsind);
                cind ++;
            }
        }
    }

    console.log(c);
console.timeEnd("cluster");
    function displayCluster(){

    }



    // Help functions
    function regionQuery(p, eps){
        var clusterPoints = [];

        for (var i = 0; i < d.length; i++){
            if (euclideanDistance(d[i], d[p]) <= eps)
                clusterPoints.push(i);
        }

        return clusterPoints;
    }


    function expandCluster(p, c, eps, minPts, neighbourPtsind){
        if(!p.isMember){
            c.push(p);
        }

        var initLength = neighbourPtsind.length;


        for (var i = 0; i < initLength; i++){
            var tempData = d[neighbourPtsind[i]].__data__;
            //console.log(d[neighbourPtsind[i]].__data__.clustering.isVisited);
            if(!tempData.clustering.isVisited)
            {
                tempData.clustering.isVisited = true;
                var neighbourPts2 = regionQuery(neighbourPtsind[i], eps);
                if (neighbourPts2.length >= minPts)
                    neighbourPtsind = neighbourPtsind.concat(neighbourPts2); //join the 2 areas
            }
            if(!tempData.isMember){
                c.push(d[neighbourPtsind[i]]);
                tempData.clustering.isMember = true;

            }
                
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
