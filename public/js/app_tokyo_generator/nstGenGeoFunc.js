

function initGeometry(ALLJSONOBJS){
  //buildings
  bldgObjArr=[];
  for(var i=0; i<ALLJSONOBJS.length; i++){
    obj=ALLJSONOBJS[i];
    if(obj.element_type === "bldg"){
      var area=obj.area;
      var cen=obj.cen;
      var coords=obj.pts
      var ptArr=[];
      for(var j=0; j<coords.length; j++){
        var p=coords[j].split(",");
        var x=p[0];
        var y=p[1];
        var z=0;
        ptArr.push(new THREE.Vector2(x,y));
      }
      var bldgObj=new nsBldg("bldg", area, cen, ptArr);  
      bldgObjArr.push(bldgObj);    
    }
  }
  
  //parks
  parkObjArr=[];
  for (var i = 0; i < ALLJSONOBJS.length; i++) {
    obj = ALLJSONOBJS[i];
    if (obj.element_type === "park") {
      var area=obj.area;
      var cen=obj.cen;
      var coords=obj.pts;
      var ptArr=[];
      for(var j=0; j<coords.length-2; j++){
        var p,x,y,z;
          p=coords[j].split(",");
          x=p[0];
          y=p[1];
          z=0;
          //console.log(x,y);
          ptArr.push(new THREE.Vector2(x,y));
      }
      var parkObj=new nsPark("park", area, cen, ptArr);
      parkObjArr.push(parkObj);
    }
  }

  //sites
  for (var i = 0; i < ALLJSONOBJS.length; i++) {
    obj = ALLJSONOBJS[i];
    if (obj.element_type === "site") {
      var area=parseFloat(obj.area);
      var cen=obj.cen;
      var coords=obj.pts;
      var ptArr=[];
      for(var j=0; j<coords.length; j++){
        var p,x,y,z;
          p=coords[j].split(",");
          x=p[0];
          y=p[1];
          z=0;
          ptArr.push(new THREE.Vector2(x,y));
      }
      var siteObj=new nsSite("site", i, area, cen, ptArr);
      siteObjArr.push(siteObj);
    }
  }
  genBldgGeometry(); // loaded from DB
  genParkGeometry(); // loaded from DB
  genSiteGeometry(); // loaded from DB
  genDynamicFunc(); // dynamic functions- once everything is loaded -> generate new diag, quad, cells, allocate, generate mesh renders
}

function genDynamicFunc(){
  console.clear();
  clearSiteMeshes();
  genSiteSegments(); // generated - dynamic
  if(superBlockControls.gen_Random===true){
    genPeripheralCellFromRules(); // dynamically generates peripheral cells, class:buildings from cells super block rules files
    initAllocateFunctionsCells();// deprecated // get user inputs and init allocate functions to cells
  }else{
    runAgentOnCells(); //AGENT!!!!
    //runVoronoi();
  }  
  outputCells(); // generate the meshes for the super block 
  updateSiteInfo();//required to display information: set the information to site obj arr
  updateDBInfo();//required for db exchange: get the coordinates and type of cells and write to textarea for db
  console.log("Dynamic functions loaded");
}

function genBldgGeometry() {
  for(var i=0; i<bldgArr.length; i++){
    bldgArr[i].geometry.dispose();
    bldgArr[i].material.dispose();
    scene.remove(bldgArr[i]);
  }
  bldgArr=[];
    for(var i=0; i<bldgObjArr.length; i++){
      bldgObjArr[i].genGeo();
    }
}

function genParkGeometry() {
  for(var i=0; i<parkArr.length; i++){
    parkArr[i].geometry.dispose();
    parkArr[i].material.dispose();
    scene.remove(parkArr[i]);
  }

  parkArr=[];
  for(var i=0; i<parkObjArr.length; i++) {
    parkObjArr[i].genGeo();
  }
}

function genSiteGeometry() {
  for(var i=0; i<siteArr.length; i++){
    siteArr[i].geometry.dispose();
    siteArr[i].material.dispose();
    scene.remove(siteArr[i]);
  }
  siteArr=[];
  if(genGuiControls.show_Sites===true){
    for(var i=0; i<siteObjArr.length; i++) {
      siteObjArr[i].genGeo();
    }
    for(var i=0; i<siteArr.length; i++){
      scene.add(siteArr[i]);
    }
  }
}

function genSiteSegments(){
  var baydepth=superBlockControls.bay_depth; // from main GUI control
  var extdepth=superBlockControls.ext_depth; // from main GUI controls
  for(var i=0; i<siteObjArr.length; i++){
    siteObjArr[i].getDiagonal(); // generates diagonal internal to data structure in site object superblock file
    siteObjArr[i].setBays(baydepth,extdepth); // adds diagonals to global array + generate the bay segments in zones:{top-{left,right}, bottom-{right, left}} in site object superblock file
    siteObjArr[i].processBays(baydepth); // generate the quads for each zone -{rendered quads, internal quad array} in site object superblock file
    var quads=siteObjArr[i].quadArr; // internal quads in site object in superblock file
    for(var j=1; j<quads.length; j++){
      quads[j].genCells(baydepth); // cell quad in each nsQuad object of each site saved in subCellQuad array
      var cells=quads[j].subCellQuads; // cells inside the quad of the site
      for(var k=0; k<cells.length; k++){
        if(j<2 || j>quads.length-2){
          cells[k].periphery=true;
        }
      }
      for(var k=0; k<cells.length; k++){
        cellArr.push(cells[k].genQuad(0)); // generate the quad rendered object 
      }
    }
  }
}

function clearSiteMeshes(){
  for(var i=0; i<cellArr.length; i++){
    var quad=cellArr[i][0];
    quad.geometry.dispose();
    quad.material.dispose();
    scene.remove(quad);
    try{
      var L1=cellArr[i][1];
      var L2=cellArr[i][2];
      L1.geometry.dispose();
      L1.material.dispose();
      scene.remove(L1);
      L2.geometry.dispose();
      L2.material.dispose();
      scene.remove(L2);      
    }catch(e){
      //did not include the diagonals
    }
  }
  cellArr=[];
  
  for(var i=0; i<siteSegArr.length; i++){
    siteSegArr[i].geometry.dispose();
    siteSegArr[i].material.dispose();
    scene.remove(siteSegArr[i]);
  }
  siteSegArr=[];

  for(var i=0; i<siteDiagArr.length; i++){
    siteDiagArr[i].geometry.dispose();
    siteDiagArr[i].material.dispose();
    scene.remove(siteDiagArr[i]);
  }
  siteDiagArr=[];

  for(var i=0; i<siteQuadArr.length; i++){
    siteQuadArr[i][0].geometry.dispose();
    siteQuadArr[i][0].material.dispose();
    scene.remove(siteQuadArr[i][0]);

    siteQuadArr[i][1].geometry.dispose();
    siteQuadArr[i][1].material.dispose();
    scene.remove(siteQuadArr[i][1]);

    siteQuadArr[i][2].geometry.dispose();
    siteQuadArr[i][2].material.dispose();
    scene.remove(siteQuadArr[i][2]);
  }
  siteQuadArr=[];

  for(var i=0; i<siteObjArr.length; i++){
    var parkMeshArr=siteObjArr[i].parkMeshArr;
    for(var j=0; j<parkMeshArr.length; j++){
      parkMeshArr[j].geometry.dispose();
      parkMeshArr[j].material.dispose();
      scene.remove(parkMeshArr[j]);
    }
    siteObjArr[i].parkMeshArr=[];

    var gcnMeshArr=siteObjArr[i].gcnMeshArr;
    for(var j=0; j<gcnMeshArr.length; j++){
      gcnMeshArr[j].geometry.dispose();
      gcnMeshArr[j].material.dispose();
      scene.remove(gcnMeshArr[j]);
    }
    siteObjArr[i].gcnMeshArr=[];

    var ncnMeshArr=siteObjArr[i].ncnMeshArr;
    for(var j=0; j<ncnMeshArr.length; j++){
      ncnMeshArr[j].geometry.dispose();
      ncnMeshArr[j].material.dispose();
      scene.remove(ncnMeshArr[j]);
    }
    siteObjArr[i].ncnMeshArr=[];

    var rcnMeshArr=siteObjArr[i].rcnMeshArr;
    for(var j=0; j<rcnMeshArr.length; j++){
      rcnMeshArr[j].geometry.dispose();
      rcnMeshArr[j].material.dispose();
      scene.remove(rcnMeshArr[j]);
    }
    siteObjArr[i].rcnMeshArr=[];
  }
}












