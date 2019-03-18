
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
        if(parkcen===false){
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
                    allCells[j].type="NCN";
                }
            }
            var remainingCells=allCells.length-used;
            res.push([i, remainingCells]);
        }else{
            // set central cells as park
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
                    allCells[j].type="NCN";
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

function cenOfArr(arr){
    var sortable=[];
    for(var i=0; i<arr.length; i++){
        var x=arr[i].mp().x;
        var y=arr[i].mp().y;
        sortable.push([x,y])
    }
    sortable.sort(function(a,b){
        return a[0]-b[0];
    });
    var minx=sortable[0][0];
    var maxx=sortable[sortable.length-1][0];
    var sortable2=[];
    for(var i=0; i<arr.length; i++){
        var x=arr[i].mp().x;
        var y=arr[i].mp().y;
        sortable2.push([x,y])
    }
    sortable2.sort(function(a,b){
        return a[1]-b[1];
    });
    var miny=sortable2[0][1];
    var maxy=sortable2[sortable.length-1][1];
    var cen=new nsPt((minx+maxx)/2,(miny+maxy)/2,0);
    return cen;
}









