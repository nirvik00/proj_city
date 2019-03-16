function genCellFromRules(){
    for( var i=0; i<siteObjArr.length; i++){
        var quads=siteObjArr[i].quadArr;    
        for(var j=0; j<quads.length; j++){
            if(j===0 || j===quads.length){
                quads[j].periphery=true;
            }
            var cells=quads[j].subCellQuads;
            for(var k=0; k<cells.length; k++){
                var cell=cells[k];
                var mesh;
                if(cell.periphery===true){
                    mesh=genBldgFromQuad(cell); //geo utils file
                }else{
                    var t=Math.random();
                    if(t>0.5){
                        mesh=genBldgFromQuad(cell); //geo utils file
                    }
                }
                superBlockForms.push(mesh);
            }
        }
    }
}

