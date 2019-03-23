function runVoronoi(){
    for(var i=0; i<siteObjArr.length; i++){
        if(i===28){
            var allcells=[];        
            var quads=siteObjArr[i].quadArr;
            for(var j=0; j<quads.length; j++){
                var cells=quads[j].subCellQuads;
                for(var k=0; k<cells.length; k++){
                    try{
                        var c=cells[k].mp2();
                        allcells.push(cells[k]);
                    }catch(e){}
                }
            }
            var numPts=Math.ceil(allcells.length/35);
            selSiteCells(allcells, numPts);
        }
    }
}

function selSiteCells(cells,n){
    //console.log(cells.length, n);
    var selCells=[];
    var idx=[];
    var i=0;
    while(i<n){
        if(i>cells.length){ break; }
        var t=Math.floor(Math.random()*cells.length-1);
        if((t<0 || t>cells.length-1) || t>cells.length-1 || cells.length===0){ continue; }
        if(idx.length===0) { 
            idx.push([t]); 
        }else{
            var sum=0;
            for(var j=0; j<idx.length; j++){
                if(idx[j]===t){
                    sum++; 
                }
            }
            if(sum===0){
                idx.push(t);
                selCells.push(cells[t]);
                i++;
            }
        }
    }
    for(var i=0; i<selCells.length; i++){
        debugSphere(selCells[i].mp2(), 0.1);
    }
    genVoronoi(selCells, cells);
}

function genVoronoi(site, cells){
    console.log("generate");
    var mycells=[];
    for(var i=0; i<cells.length; i++){
        var p=cells[i].mp2();
        var minD=1000000;
        var idx=0;
        for(var j=0; j<site.length; j++){
            var q=site[j].mp2();
            var d=utilDi(p,q);
            if(d<minD){
                minD=d;
                idx=j;
            }
        }
        debugSphere(site[idx].mp2(), 0.2);
        mycells.push([cells[i],idx]);
    }
    var colrs=[];
    for(var i=0; i<site.lengthl; i++){
        color = new THREE.Color( 0xffffff );
        color.setHex( Math.random() * 0xffffff );
        colrs.push(color);
    }
    
    for(var i=0; i<mycells.length; i++){
        var R=mycells[i][1];
        var cell=mycells[i][0];
        var p=cell.p;
        var q=cell.q;
        var r=cell.r;
        var s=cell.s;
        genColorQuad(p,q,r,s,R/10,colrs[R]);
    }
    console.log('done');
}


