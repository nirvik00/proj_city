function runAgentOnCells(){
    for(var i=0; i<siteObjArr.length; i++){
        var allcells=[];
        var quads=siteObjArr[i].quadArr;
        for(var j=0; j<quads.length; j++){
            var cells=quads[j].subCellQuads;
            for(var k=0; k<cells.length; k++){
                allcells.push(cells[k]);
            }
        }
        var t=Math.floor(Math.random()*allcells.length - 1);
        var c=allcells[t].mp();
        debugSphere(c,1);
    }
}