/**
* DBSCAN algorithm
* @param d = starting points
* @param eps = Max distance inside cluster
* @param minPts = Min pts in a cluster
*/

function DBScan(d, eps, minPts, noSamples){
    console.time("clustering");
    if(noSamples > d.length){
        console.error("To many sample points");
        return;
    }

    // Add clustering data to each circles data
    d.forEach(function(d){
        var dData = d.__data__;
        dData.clustering = {};
        dData.clustering.isVisited = false;
        dData.clustering.isMember = false;
        dData.clustering.cluster = -1;
    })



    var samplePoints = [];
    var indices = [];

    while( indices.length < noSamples ){
        var ind = Math.floor(Math.random() * (d.length-1) );

        if(! _.contains(indices, ind)){ //if index is not already in
            indices.push(ind);
        }

        samplePoints.push(d[ind]);

    }


    var c = [];
    var cind = 0;
    // Start the clustering
    for (var i = 0; i < samplePoints.length; i++){
        var dData = samplePoints[i].__data__;

        if (!dData.clustering.isVisited) {
            dData.clustering.isVisited = true;

            neighbourPts = regionQuery(samplePoints[i], eps);

            if(neighbourPts.length >= minPts){
                c[cind] = [];
                expandCluster(samplePoints[i], neighbourPts, c[cind], eps, minPts, cind);
                cind ++;
            }
        }
    }

    console.timeEnd("Clustering");

    console.log(c);
    displayCluster();
    
    console.timeEnd("clustering");


    // Help functions
    function displayCluster(){
        d.forEach(function(p){
            if(p.__data__.clustering.cluster == -1){
                p.style.fill = "darkgray";
                p.style.opacity = 0.2;
            }
        });
    }


    function regionQuery(p, eps){
        var clusterPoints = [];
        clusterPoints.push(p);

        for (var i = 0; i < samplePoints.length; i++){
            if (euclideanDistance(samplePoints[i], p) <= eps)
                clusterPoints.push(samplePoints[i]);
        }

        return clusterPoints;
    }


    function expandCluster(p, neighbourPts, c, eps, minPts, cInd){

        if(!p.__data__.clustering.isMember){
            c.push(p);
            p.__data__.clustering.isMember = true;
            p.__data__.clustering.cluster = cInd;
        }

        for (var i = 0; i < neighbourPts.length; i++){
            if(!neighbourPts[i].__data__.clustering.isVisited)
            {
                neighbourPts[i].__data__.clustering.isVisited = true;
                var neighbourPts2 = regionQuery(neighbourPts[i], eps);
                if (neighbourPts2.length >= minPts)
                    neighbourPts = neighbourPts.concat(neighbourPts2); //join the 2 areas
            }
            if(!neighbourPts[i].__data__.clustering.isMember){
                c.push(neighbourPts[i]);
                neighbourPts[i].__data__.clustering.isMember = true;
                neighbourPts[i].__data__.clustering.cluster = cInd;
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
