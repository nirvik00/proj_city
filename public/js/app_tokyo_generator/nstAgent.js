

function runAgentOnCells(){
    var siteBB=[];
    var minDi=100000; var maxDi=-1000000;
    for(var i=0; i<siteObjArr.length; i++){
        var ret=siteObjArr[i].genBB();
        siteBB.push(ret[0]);
        var mindi=ret[1];
        if(mindi<minDi) { minDi=mindi; }
        var maxdi=ret[2];
        if(maxdi>maxDi){ maxDi=maxdi; }
    }
    console.log(minDi, maxDi);
}
