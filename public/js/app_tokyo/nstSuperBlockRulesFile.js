
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
                if(k<2 || k>cells.length-2 || quads[j].class==="building"){
                    cells[k].class="building";
                    siteObjArr[i].quadArr[j].subCellQuads[k].class="building";
                    siteObjArr[i].quadArr[j].subCellQuads[k].type="building";
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

    var res=allocateFunctionToCells(parkdensity, "park"); // allocate park function to cells return: array of site index, used
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
            allCells[t].type="GCN"; 
            gotNumGcn++;
            itr++;
        }
        var gotNumRcn=0;
        var j=0
        for(var j=0; j<allCells.length; j++){
            if(gotNumRcn>=fsrDensityArr[i][0]){
                break; 
            }
            var t=tmp2[itr];
            allCells[t].type="RCN"; 
            gotNumRcn++;
            itr++;
        }
    }
}

function allocateFunctionToCells(density, type){
    res=[];
    for(var i=0; i<siteObjArr.length; i++){
        var quads=siteObjArr[i].quadArr;        
        // use random shuffle to find cells for parks
        var allCells=[];
        for(var j=0; j<quads.length; j++){
            var cells=quads[j].subCellQuads;
            for(var k=0; k<cells.length; k++){
                allCells.push(cells[k]);
            }
        }

        var tmp=[];
        for(var j=0; j<allCells.length; j++){
            tmp.push(j);
        }

        var num=Math.floor(allCells.length*density);
        var tmp2=randomShuffle(tmp);
        var typeCell=[];
        for(var j=0; j<num; j++){
            var t=tmp2[j];
            typeCell.push([type, t]);
        }

        // set the subCellQuads
        var counter=0;
        var used=0;
        for(var j=0; j<quads.length; j++){
            var cells=quads[j].subCellQuads;
            for(var k=0; k<cells.length; k++){
                var ty=cells[k].type;
                for(var itr=0; itr<typeCell.length; itr++){
                    if(itr<typeCell.length){
                        if(typeCell[itr][0]===type && typeCell[itr][1]===counter){
                            if(siteObjArr[i].quadArr[j].subCellQuads[k].type!=="building"){
                                siteObjArr[i].quadArr[j].subCellQuads[k].type=type;
                                used++;
                            }
                        }
                    }
                }
                counter++;
            }
        }
        for(var j=0; j<allCells.length; j++){
            if(allCells[j].type!=="park"){
                allCells[j].class="building";
                allCells[j].type="NCN";
            }
        }
        var remainingCells=allCells.length-used;
        res.push([i, remainingCells]);
    }
    console.log("in allocation");
    console.log("used cells = "+used);
    return res;
}

function outputCells(){
    for( var i=0; i<siteObjArr.length; i++){
        var quads=siteObjArr[i].quadArr;    
        for(var j=0; j<quads.length; j++){
            var cells=quads[j].subCellQuads;
            for(var k=0; k<cells.length; k++){
                var cell=cells[k];
                mesh=genBldgFromQuad(cell,cell.type); //nst geo utils file
                superBlockForms.push(mesh);
            }
        }
    }
    console.log("superBlockForms: "+superBlockForms.length);
}

function randomShuffle(array){
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


