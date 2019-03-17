
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
    console.clear();

    var parkdensity=superBlockControls.park_density;
    var parkspread=superBlockControls.park_spread;
    var baydepth=superBlockControls.bay_depth;
    
    for( var i=0; i<siteObjArr.length; i++){
        var quads=siteObjArr[i].quadArr;    
        //set periphery and buildings
        for(var j=0; j<quads.length; j++){
            if(j<2 || j>quads.length-3){
                quads[j].type="periphery";
            }
            var cells=quads[j].subCellQuads;
            
            //set periphery allocation to cells
            for(var k=0; k<cells.length; k++){
                if(k<2 || k>cells.length-1 || quads[j].type==="periphery"){
                    cells[k].type="periphery";
                    siteObjArr[i].quadArr[j].subCellQuads[k].type="periphery";
                }
            }
            //set building allocation to cells
            for(var k=0; k<cells.length; k++){
                if(cells[k].type==="periphery"){
                    //dont do anything
                }else{
                    var t=Math.random();
                    if(t>0.5){
                        cells[k].type="building";
                    }
                }
                siteObjArr[i].quadArr[j].subCellQuads[k].type=cells[k].type;
            }
        }
    }
    generateParkCells(parkdensity);
}


function generateParkCells(parkdensity){
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

        var num=Math.floor(allCells.length*parkdensity);
        var tmp2=randomShuffle(tmp);
        var parkCell=[];
        for(var j=0; j<num; j++){
            var t=tmp2[j];
            parkCell.push(["park", t]);
        }

        // set the subCellQuads
        var counter=0;
        for(var j=0; j<quads.length; j++){
            var cells=quads[j].subCellQuads;
            for(var k=0; k<cells.length; k++){
                var ty=cells[k].type;
                for(var itr=0; itr<parkCell.length; itr++){
                    if(itr<parkCell.length){
                        if(parkCell[itr][0]==="park" && parkCell[itr][1]===counter){
                            if(siteObjArr[i].quadArr[j].subCellQuads[k].type!=="building"){
                                siteObjArr[i].quadArr[j].subCellQuads[k].type="park";                
                            }                            
                        }                    
                    }                
                }                
                counter++;
            }
        }
    }
    outputCells();
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


