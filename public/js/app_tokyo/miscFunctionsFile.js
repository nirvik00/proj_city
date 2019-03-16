
//previously used as setBays function in nstSuperBlockFile.js
this.setBaysDup=function(baydepth,intoff,extoff){
    this.quadArr=[];
    this.subCellQuadArr=[];
    this.topLeSegArr=[]; // be careful of arrays in the class
    this.topRiSegArr=[];
    this.bottomLeSegArr=[];
    this.bottomRiSegArr=[];
    var p=this.diag.p;
    var q=this.diag.q;
    var r=this.diag.mp; 
    var norm=utilDi(p,q);
    var u=new nsPt((q.x-p.x)/norm, (q.y-p.y)/norm, 0);
    var nR=new nsPt(-u.y, u.x, 0);
    var nL=new nsPt(u.y, -u.x, 0);
    //var baydepth=superBlockControls.bay_Depth;
    var intxDepth=100;
    var n=Math.floor(utilDi(p,r)/baydepth);

    // top bays
    for(var i=0; i<n; i++){
        var s=i*baydepth;
        var a=new nsPt(r.x+u.x*s, r.y+u.y*s, 0);

        // right side of top            
        var b=new nsPt(a.x+nR.x*intxDepth, a.y+nR.y*intxDepth,0);
        var segR=this.getIntxSeg(a,b);
        if(segR!==0 && segR.le>baydepth/2){
            var I=segR.q;
            var aR=new nsPt(a.x+(I.x-a.x)*intoff/segR.le, a.y+(I.y-a.y)*intoff/segR.le, 0);
            var iR=new nsPt(I.x+(a.x-I.x)*extoff/segR.le, I.y+(a.y-I.y)*extoff/segR.le, 0);
            var check1=ptInSeg(a,aR,I);
            var check2=ptInSeg(aR,iR,I);
            if(check1===true && check2===true && utilDi(aR,iR)>baydepth/2){
                var reqseg=new nsSeg(aR,iR);
                this.topRiSegArr.push(reqseg);
                var seg=reqseg.getObj();
                siteSegArr.push(seg);//line added to global arr
            }                
        }

        // left side of top           
        var c=new nsPt(a.x+nL.x*intxDepth, a.y+nL.y*intxDepth,0);
        var segL=this.getIntxSeg(a,c);
        if(segL!==0){
            var I=segL.q;
            var aL=new nsPt(a.x+(I.x-a.x)*intoff/segL.le, a.y+(I.y-a.y)*intoff/segL.le, 0);
            var iL=new nsPt(I.x+(a.x-I.x)*extoff/segL.le, I.y+(a.y-I.y)*extoff/segL.le, 0);
            var check1=ptInSeg(a,aL,I);
            var check2=ptInSeg(aL,iL,I);
            if(check1===true && check2===true && utilDi(aL,iL)>baydepth/2){
                var reqseg=new nsSeg(aL,iL);
                this.topLeSegArr.push(reqseg);
                var seg=reqseg.getObj();
                siteSegArr.push(seg);//line added to global arr
            }                
        }                
    }
        
    // bottom bays
    for(var i=0; i<n; i++){
        //var intoff=superBlockControls.int_off;
        //var extoff=superBlockControls.ext_off;
        var s=i*baydepth;
        var a=new nsPt(r.x-u.x*s, r.y-u.y*s, 0);
        var b=new nsPt(a.x+nR.x*intxDepth, a.y+nR.y*intxDepth,0);
        //right            
        var segR=this.getIntxSeg(a,b);
        if(segR!==0){
            var I=segR.q;
            var aR=new nsPt(a.x+(I.x-a.x)*intoff/segR.le, a.y+(I.y-a.y)*intoff/segR.le, 0);
            var iR=new nsPt(I.x+(a.x-I.x)*extoff/segR.le, I.y+(a.y-I.y)*extoff/segR.le, 0);
            var check1=ptInSeg(a,aR,I);
            var check2=ptInSeg(aR,iR,I);
            if(check1===true && check2===true && utilDi(aR,iR)>baydepth/2){
                var reqseg=new nsSeg(aR,iR);
                this.bottomRiSegArr.push(reqseg);
                var seg=reqseg.getObj();                    
                siteSegArr.push(seg);//line added to global arr
            }
            
        }
        //left
        var c=new nsPt(a.x+nL.x*intxDepth, a.y+nL.y*intxDepth,0);
        var segL=this.getIntxSeg(a,c);
        if(segL!==0){
            var I=segL.q;
            var aL=new nsPt(a.x+(I.x-a.x)*intoff/segL.le, a.y+(I.y-a.y)*intoff/segL.le, 0);
            var iL=new nsPt(I.x+(a.x-I.x)*extoff/segL.le, I.y+(a.y-I.y)*extoff/segL.le, 0);
            var check1=ptInSeg(a,aL,I);
            var check2=ptInSeg(aL,iL,I);
            if(check1==true && check2===true && utilDi(aL,iL)>baydepth/2){
                var reqseg=new nsSeg(aL,iL);
                this.bottomLeSegArr.push(reqseg);
                var seg=reqseg.getObj();
                siteSegArr.push(seg);//line added to global arr
            }                
        }
    }
}

