
//previously used as setBays function in nstSuperBlockFile.js
var setBaysDup=function(baydepth,intoff,extoff){
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


//previously used to generate cells in nsQuad 
var genCells=function(){
    this.subCellQuads=[];
    var baydepth=superBlockControls.bay_Depth;
    var p=this.p; // 0  ordered in previous function p-q
    var q=this.q; // 1  ordered in previous function q-r
    var r=this.r; // 2  ordered in previous function r-s
    var s=this.s; // 3  ordered in previous function s-p
    var u=new nsPt((q.x-p.x)/utilDi(p,q), (q.y-p.y)/utilDi(p,q), 0);
    var norm=utilDi(p,q);
    var R=new nsPt(-u.y,u.x,0);
    var L=new nsPt(u.y,-u.x,0);
    var v=new nsPt((r.x-s.x)/utilDi(s,r), (r.y-s.y)/utilDi(r,s), 0);
    var nPQ=Math.floor(utilDi(p,q)/baydepth);
    var nRS=Math.floor(utilDi(s,r)/baydepth);
    var n=10;
    if(nPQ<nRS) { n=nPQ; }
    else { n=nRS; }
    var segArr=[];
    for(var i=0; i<n; i++){
        var a=new nsPt(p.x+(u.x)*i*baydepth, p.y+(u.y)*i*baydepth, 0);
        var b=new nsPt(s.x+(v.x)*i*baydepth, s.y+(v.y)*i*baydepth, 0);
        //debugSphere(a,0.1);
        segArr.push(new nsSeg(a,b));
    }
    segArr.push(new nsSeg(q,r));
    for(var i=0; i<segArr.length-1; i++){
        var a=segArr[i].p;
        var b=segArr[i].q;
        var c=segArr[i+1].q; // change order for elegance
        var d=segArr[i+1].p; // change order for elegance
        var quad=new nsQuad(a,b,c,d);            
        this.subCellQuads.push(quad);
    }
}

function getBuildingMaterialFromType(type){
    this.mat = new THREE.MeshBasicMaterial ({color: new THREE.Color("rgb(255,255,255)"),
        wireframe:wireframeVal});
    if(type=="GCN"){
        var t=Math.random();
        if(t<0.5){
            this.mat = new THREE.MeshBasicMaterial ({
                color: new THREE.Color("rgb(0,255,0)"),
                wireframe: wireframeVal});        
        }else{
            this.mat = new THREE.MeshBasicMaterial ({
                color: new THREE.Color("rgb(0,255,150)"),
                wireframe: wireframeVal});        
        }
    }else if(type=="NCN"){
        var t=Math.random();
        if(t<0.5){
            this.mat = new THREE.MeshBasicMaterial ({
                color: new THREE.Color("rgb(255,102,0)"),
                wireframe: wireframeVal});        
        }else{
            this.mat = new THREE.MeshBasicMaterial ({
                color: new THREE.Color("rgb(225,125,0)"),
                wireframe: wireframeVal});        
        }
        
    }else if(type=="RCN"){
        var t=Math.random();
        if(t<0.5){
            this.mat = new THREE.MeshBasicMaterial ({
                color: new THREE.Color("rgb(150,150,150)"),
                wireframe:wireframeVal});
        }else{
            this.mat = new THREE.MeshBasicMaterial ({
                color: new THREE.Color("rgb(200,200,200)"),
                wireframe:wireframeVal});
        }
    }else{//evac
        this.mat = new THREE.MeshBasicMaterial ({
        color: new THREE.Color("rgb(255,0,0)"),
        wireframe:wireframeVal});
    }
    return this.mat
}


//from superblock rules
function initAllocateFunctionsCells(){
    var baydepth=superBlockControls.bay_depth; //gui input
    var gcnFsr=superBlockControls.GCN_fsr; // gui input 
    var ncnFsr=superBlockControls.NCN_fsr; // gui input
    var rcnFsr=superBlockControls.RCN_fsr; // gui input
    var parkdensity=superBlockControls.park_density; // gui input
    var parkCen=superBlockControls.park_cen;//park centrality form gui

    var res=allocateParkFunctionToCells(parkdensity, "park", parkCen); // allocate park function to cells return: array of site index, used
    var fsrDensityArr=[];
    for(var i=0; i<siteObjArr.length; i++){
        var num = res[i][1];        
        var numGcn = Math.floor((gcnFsr/(gcnFsr+ncnFsr+rcnFsr))*num); 
        var numNcn = Math.floor((ncnFsr/(gcnFsr+ncnFsr+rcnFsr))*num);
        var numRcn = Math.floor((rcnFsr/(gcnFsr+ncnFsr+rcnFsr))*num);
        fsrDensityArr.push([numGcn, numNcn, numRcn]);
        //console.log(res[i] +","+ numGcn+","+ numNcn +","+ numRcn);
    }

    for(var i=0; i<siteObjArr.length; i++){
        var quads=siteObjArr[i].quadArr;   
        var allCells=[];// use random shuffle to cells
        var idx=[];//all ids
        for(var j=0; j<quads.length; j++){
            var cells=quads[j].subCellQuads;
            for(var k=0; k<cells.length; k++){
                allCells.push(cells[k]);
                idx.push(j);
            }
        }
        //randomly shuffle the indices of allcells
        var tmp=[];
        for(var j=0; j<allCells.length; j++){
            tmp.push(j);
        }
        var tmp2=randomShuffle(tmp);
        
        //allcoate the functions based on itr
        var itr=0; //do not clear this
        var gotNumGcn=0;
        for(var j=0; j<allCells.length; j++){
            if(gotNumGcn>=fsrDensityArr[i][0]){
                break; 
            }
            var t=tmp2[itr];
            if(allCells[t].occupied===false){
                allCells[t].type="GCN";
                allCells[t].occupied=true;
                gotNumGcn++;
            }
            itr++;
        }
        var gotNumRcn=0;
        var j=0
        for(var j=0; j<allCells.length; j++){
            if(gotNumRcn>=fsrDensityArr[i][2]){
                break; 
            }
            var t=tmp2[itr];
            if(allCells[t].occupied===false){
                allCells[t].type="RCN"; 
                allCells[t].occupied=true;
                gotNumRcn++;
            }
            itr++;
        }
        for(var j=0; j<allCells.length; j++){
            if(allCells[j].occupied===false){
                allCells[j].type="NCN"; 
                allCells[j].occupied=true;
            }
        }
    }
}