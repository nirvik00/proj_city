function getNumForInterp(thisDi, minDi, maxDi, minNumInterp, maxNumInterp){
    return Math.ceil((thisDi-minDi)*(maxNumInterp-minNumInterp)/(maxDi-minDi))+minNumInterp;
}

// main initializer
function runAgentOnCells(){
    var siteBBx=[];
    var minDi=100000; var maxDi=-1000000;
    for(var i=0; i<siteObjArr.length; i++){
        var ret=siteObjArr[i].genBB();//array of bbx, minL, maxL of bbx
        siteBBx.push(ret[0]);//bbx quad
        var mindi=ret[1];//minL
        if(mindi<minDi) { minDi=mindi; } //minL of all sites
        var maxdi=ret[2];//maxL
        if(maxdi>maxDi){ maxDi=maxdi; }//maxL of all sites
    }
    //generate interpolated points 
    siteInterpPts=[]; // for each point, get the interp points
    for(var i=0; i<siteBBx.length; i++){        
        //if(i!==28) { continue; } // render only site #28
        var P=siteBBx[i].p;
        var Q=siteBBx[i].q;
        var R=siteBBx[i].r;
        var S=siteBBx[i].s;

        var maxNumInterp=10;
        var minNumInterp=2;  
        var p,q,r,s;
        if(utilDi(P,Q)>utilDi(P,S)){
            p=P; q=Q; r=R; s=S;
        }else{
            p=P; q=S; r=Q; s=R;
        }
        var NUM=getNumForInterp(utilDi(p,q), minDi, maxDi, minNumInterp, maxNumInterp);
        var ptsPQ=interpPts(P,Q,NUM);
        var ptsSR=interpPts(S,R,NUM);

        var htDebug=0;
        var tmpPts=[];
        for(var j=0; j<NUM; j++){
            var a=ptsPQ[j]; var b=ptsSR[j];
            var pts2=interpPts(a,b,NUM);            
            var sitePts=siteObjArr[i].pts;
            for(var k=0; k<NUM; k++){
                var T=ptInPoly(pts2[k],sitePts);
                if(T===true){
                    tmpPts.push(pts2[k]);                    
                }
            }
        }
        siteObjArr[i].interpPts=tmpPts;//directly update field in superblock
        siteObjArr[i].interpDiff=utilDi(P,Q)/(NUM-1);//directly update field in superblock
    }//end of grid points in site

    for(var i=0; i<siteObjArr.length; i++){
        moveAgent(siteObjArr[i]);
    }
}

//this is inside of iteration of site array (i)
var moveAgent=function(site){
    site.genDir();
    
    debugQuadZ(site.bb.p, site.bb.q, site.bb.r, site.bb.s, 0);//bounding box of each site
    
    var pts=site.interpPts;
    for(var i=0; i<pts.length; i++){
        debugSphereZ(pts[i], 0.1, 0);//inter p points inside the site
    }        
    
    var moverAgentArr=[];
    var idx= Math.floor(Math.random()*(pts.length-1));  
    var p=pts[idx];
    var A=new moverAgent(p,site.interpPts,site.U,site.V,site.W,site.X,site.interpDiff);
    var b=A.move(0);
    debugLine(p, b);
    debugSphereZ(b,0.15,0);
}




