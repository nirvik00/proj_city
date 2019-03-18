
// cells are nsCellQuad data type
//
// 1. set periphery - realistic geometry 
//       first and last quads 
//
// 2. set cells to buildings
//
// 3. set park points
//       number of points : density
//       radius of spread
//
//

function genCellFromRules(){
    var parkdensity=superBlockControls.park_density;
    var baydepth=superBlockControls.bay_depth;    
    for( var i=0; i<siteObjArr.length; i++){
        var quads=siteObjArr[i].quadArr;    
        //set periphery as buildings for geometric reasonableness
        for(var j=0; j<quads.length; j++){
            if(j<2 || j>quads.length-3){
                quads[j].class="building";
            }
            var cells=quads[j].subCellQuads;
            
            //set periphery allocation to cells
            for(var k=0; k<cells.length; k++){
                try{
                    if(k<2 || k>cells.length-2 || quads[j].class==="building"){
                        cells[k].class="building";
                        siteObjArr[i].quadArr[j].subCellQuads[k].class="building";
                        siteObjArr[i].quadArr[j].subCellQuads[k].type="building";
                    }
                }catch(e){
                }
            }
        }
    }
}

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

function allocateParkFunctionToCells(density, type, parkcen){
    res=[];
    for(var i=0; i<siteObjArr.length; i++){
        var quads=siteObjArr[i].quadArr;     
        var allCells=[];//all cells of the site
        for(var j=0; j<quads.length; j++){
            var cells=quads[j].subCellQuads;
            for(var k=0; k<cells.length; k++){
                allCells.push(cells[k]);
            }
        }
        var NUM=Math.floor(allCells.length*density);//numer of cells required to be park
        var typeCell=[];//bind the index to type="park"
        if(allCells.length>3 && parkcen===false){
            // use random shuffle to find cells for parks
            var tmp=[];
            for(var j=0; j<allCells.length; j++){
                tmp.push(j);
            }
            var tmp2=randomShuffle(tmp);
            for(var j=0; j<NUM; j++){
                var t=tmp2[j];
                typeCell.push([type, t]);
            }
            // set the subCellQuads
            var used=0;
            for(var j=0; j<typeCell.length; j++){
                var t=typeCell[j][1];
                allCells[t].type=type;
                allCells[t].occupied=true;
                used++;
            }
            for(var j=0; j<allCells.length; j++){
                if(allCells[j].type!=="park"){
                    allCells[j].class="building";
                }
            }
            var remainingCells=allCells.length-used;
            res.push([i, remainingCells]);
        }else{
        // set central cells as park  '
            var CEN=cenOfArr(allCells);
            var sortable=[];
            for(var j=0; j<allCells.length; j++){
                var x=allCells[j];
                var y=utilDi(x.mp(), CEN);
                sortable.push([y,x])
            }
            sortable.sort(function(a,b){
                return a[0]-b[0];
            });
            allCells=[];
            for(var j=0; j<sortable.length; j++){
                allCells.push(sortable[j][1]);
            }
            var used=[];
            for(var j=0; j<NUM; j++){
                allCells[j].type="park";
                allCells[j].occupied=true;
                used++;
            }
            for(var j=0; j<allCells.length; j++){
                if(allCells[j].type!=="park"){
                    allCells[j].class="building";
                }
            }
            sortable=[];
            var remainingCells=allCells.length-used;
            res.push([i, remainingCells]);
        }
    }
    return res;
}

function outputCells(){
    // clearSiteMeshes();
    for( var i=0; i<siteObjArr.length; i++){
        var quads=siteObjArr[i].quadArr;  
        for(var j=0; j<quads.length; j++){
            var cells=quads[j].subCellQuads;
            for(var k=0; k<cells.length; k++){
                var cell=cells[k];
                mesh=genBldgFromQuad(siteObjArr[i], cell,cell.type); //nst geo utils file; global array updates for rendered object and data object
            }
        }
    }
    console.log("Meshes added to scene");
}

function updateSiteInfo(){
    for(var i=0; i<siteObjArr.length; i++){
        var quads=siteObjArr[i].quadArr;
        var s1="";
        var numpark=0.0; var arpark=0.0;
        var numgcn=0.0; var argcn=0.0;
        var numncn=0.0; var arncn=0.0;
        var numrcn=0.0; var arrcn=0.0;
        for(var j=0; j<quads.length; j++){
            var cells=quads[j].subCellQuads;
            for(var k=0; k<cells.length; k++){
                var cell=cells[k];
                var type=cell.type;
                var p=cell.p;
                var q=cell.q;
                var r=cell.r;
                var s=cell.s;
                var ar;
                try{
                    var Ar=heronArea(p,q,r,s);
                    if(Ar>0.0){
                        ar=Ar;
                    }
                }catch(e){
                    //console.log("\n\nerror in ar");
                    ar=0.0;
                }
                //console.log(ar);
                if(type==="park"){
                    numpark++;
                    arpark+=ar;
                }else if(type==="GCN"){
                    numgcn++;
                    argcn+=ar;
                }else if(type==="NCN"){
                    numncn++;
                    arncn+=ar;
                }else if(type==="RCN"){
                    numrcn++;
                    arrcn+=ar;
                }
            }
        }
        //console.log(arpark, argcn, arncn, arrcn);
        var arPark=(arpark*100).toFixed(2);
        var arGcn=(argcn*100).toFixed(2);
        var arNcn=(arncn*100).toFixed(2);
        var arRcn=(arrcn*100).toFixed(2);
        s1+="\npark="+arPark+", number="+numpark+"\nGCN area="+arGcn+", number="+numgcn+"\nNCN area="+arNcn+","+numncn+"\nRCN area="+arRcn+", number="+numrcn;
        siteObjArr[i].detailedInfo=s1;
    }

    var s="";
    for(var i=0; i<siteObjArr.length; i++){
        s+="\n----------------\n";
        s+="\nsite = "+i+"\n";//+siteObjArr[i].info();
        s+=siteObjArr[i].detailedInfo;
    }
    var objContents=s.split('\n').join('<br/>');
    document.getElementById("information").innerHTML=objContents;
}








