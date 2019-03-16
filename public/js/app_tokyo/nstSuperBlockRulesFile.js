function genCellFromRules(){
    for( var i=0; i<siteObjArr.length; i++){
      var quads=siteObjArr[i].quadArr;    
      for(var j=0; j<quads.length; j++){
        if(j===0 || j===quads.length){
            quads[j].periphery=true;
        }
        var cells=quads[j].subCellQuads;
        for(var k=0; k<cells.length; k++){
            var t=Math.random();
            //if(t>0.5){
                var cell=cells[k];
                if(cells[k].periphery===true){
                    var mesh=genBldgFromQuad(cell);
                    superBlockForms.push(mesh);
                }                
            //}
        }
      }
    }
}

