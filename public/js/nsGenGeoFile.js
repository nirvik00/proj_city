// GUI

// res = GCN
// comm = NCN
// office= RCN

var varCellNumLe = 2;
var varCellNumDe = 2;
var varCellLe = 3;
var varCellDe = 3;
var varGlobalOffset=0.1;


var GcnFsr=0.3;
var NcnFsr=0.3;
var RcnFsr=0.3;
var EvacFsr=0.1;

var datgui = new dat.GUI({ autoPlace: false });

//cell-grid gui controls
var gridGuiControls = new function() {
  this.num_Length = 1.5;
  this.num_Depth = 1.5;
  this.cell_Length = 3;
  this.cell_Depth = 3;
  this.global_offset = 0.5;
  this.show_Grid = false;
  this.show_GCN=true;
  this.show_RCN=true;
  this.show_NCN=true;
  this.show_MST=true;
  this.show_EVAC=true;
};
var cellGUI = datgui.addFolder("gridGuiControls");
var cellNumLe = cellGUI.add(gridGuiControls, "num_Length", 1, 5);
var cellNumDe = cellGUI.add(gridGuiControls, "num_Depth", 1, 5);
var cellLe = cellGUI.add(gridGuiControls, "cell_Length", 1, 5);
var cellDe = cellGUI.add(gridGuiControls, "cell_Depth", 1, 5);
var varGlobalOffset = cellGUI.add(gridGuiControls, "global_offset", 0.1, 1);
var showGCN = cellGUI.add(gridGuiControls, "show_GCN");
var showRCN = cellGUI.add(gridGuiControls, "show_RCN");
var showNCN = cellGUI.add(gridGuiControls, "show_NCN");
var showMST = cellGUI.add(gridGuiControls, "show_MST");
var showEVAC = cellGUI.add(gridGuiControls, "show_EVAC");
cellGUI.add(gridGuiControls, "show_Grid");

varCellNumLe = gridGuiControls.num_Length;
varCellNumDe = gridGuiControls.num_denpth;
varCellLe = gridGuiControls.cell_Length;
varCellDe = gridGuiControls.cell_Depth;
varGlobalOffset = gridGuiControls.global_offset;

//ground gui controls
var groundGuiControls = new function() {
  this.cost_GCN_GCN = 0.1;
  this.cost_GCN_NCN = 0.30;
  this.cost_NCN_NCN = 0.45;
  this.cost_RCN_GCN = 0.75;
  this.cost_RCN_NCN = 0.85;
  this.cost_RCN_RCN = 0.95;
  this.cost_EVAC = 0.95;
  this.show_Green = true;
  this.show_Path = true;
  this.show_Road = true;
  this.show_Intx=true;
  this.show_MST=true;
};
var groundGUI = datgui.addFolder("groundGuiControls");
groundGUI.add(groundGuiControls, "cost_GCN_GCN", 0.01, 1);
groundGUI.add(groundGuiControls, "cost_GCN_NCN", 0.01, 1);
groundGUI.add(groundGuiControls, "cost_NCN_NCN", 0.01, 1);
groundGUI.add(groundGuiControls, "cost_RCN_GCN", 0.01, 1);
groundGUI.add(groundGuiControls, "cost_RCN_NCN", 0.01, 1);
groundGUI.add(groundGuiControls, "cost_RCN_RCN", 0.01, 1);
groundGUI.add(groundGuiControls, "cost_EVAC", 0.01, 1);
groundGUI.add(groundGuiControls, "show_Green");
groundGUI.add(groundGuiControls, "show_Path");
groundGUI.add(groundGuiControls, "show_Road");
groundGUI.add(groundGuiControls, "show_Intx");
groundGUI.add(groundGuiControls, "show_MST");

//building gui controls
var bldgGuiControls = new function() {
  this.evacuation_density = 0.05;
  this.GCN_FSR = 0.3;
  this.NCN_FSR = 0.3;
  this.RCN_FSR = 0.3;
  this.EVAC_FSR = 0.1;
  this.show_Evacuation = true;
  this.show_GCN = true;
  this.show_NCN = true;
  this.show_RCN = true;

};
var buildingGUI = datgui.addFolder("bldgGuiControls");
buildingGUI.add(bldgGuiControls, "evacuation_density", 0.01, 0.1);
buildingGUI.add(bldgGuiControls, "GCN_FSR", 0.1, 1);
buildingGUI.add(bldgGuiControls, "NCN_FSR", 0.1, 1);
buildingGUI.add(bldgGuiControls, "RCN_FSR", 0.1, 1);
buildingGUI.add(bldgGuiControls, "EVAC_FSR", 0.1, 1);
buildingGUI.add(bldgGuiControls, "show_Evacuation");
buildingGUI.add(bldgGuiControls, "show_GCN");
buildingGUI.add(bldgGuiControls, "show_NCN");
buildingGUI.add(bldgGuiControls, "show_RCN");

// main functions about the generation
var genGuiControls = new function() {
  this.hide_Ground = true;
  this.hide_Buildings = true;
  this.show_Network = true;
  this.show_Information = false;
  this.show_Axis = false;
}
datgui.add(genGuiControls, "hide_Ground");
datgui.add(genGuiControls, "hide_Buildings");
datgui.add(genGuiControls, "show_Network");
datgui.add(genGuiControls, "show_Information");
datgui.add(genGuiControls, "show_Axis");

var customContainer = document.getElementById("moveGUI");
customContainer.appendChild(datgui.domElement);

datgui.close();
//
//  END OF GUI
//

// generate the grids
var genGrid = function() {
  clrBuildings();
  clrGround();
  varCellNumLe = gridGuiControls.num_Length;
  varCellNumDe = gridGuiControls.num_Depth;
  varCellLe = gridGuiControls.cell_Length;
  varCellDe = gridGuiControls.cell_Depth;

  for (var i = 0; i < gridArr.length; i++) {
    gridArr[i].geometry.dispose();
    gridArr[i].material.dispose();
    scene.remove(gridArr[i]);
  }
  ptArr = Array();
  cellQuadArr = Array();
  gridArr = Array();
  var a = varCellLe;
  var c = varCellDe;
  var numL = varCellNumLe;
  var numH = varCellNumDe;
  for (var i = -numL; i < numL; i++) {
    for (var j = -numH; j < numH; j++) {
      var p = new THREE.Geometry();
      p.vertices.push(new THREE.Vector3(0, 0, 0));
      p.vertices.push(new THREE.Vector3(a, 0, 0));
      p.vertices.push(new THREE.Vector3(a, 0, c));
      p.vertices.push(new THREE.Vector3(0, 0, c));
      p.faces.push(new THREE.Face3(0, 1, 2));
      p.faces.push(new THREE.Face3(0, 3, 2));
      var mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(255,0,0)"),
        side: THREE.DoubleSide,
        wireframe: true
      });
      var mesh = new THREE.Mesh(p, mat);
      mesh.position.x = i * a;
      mesh.position.y = 0;
      mesh.position.z = j * c;
      gridArr.push(mesh);

      var nspt = new nsPt(i * a, 0, j * c);
      ptArr.push(nspt);

      var p0 = new nsPt(i * a, 0, j * c);
      var p1 = new nsPt(i * a + a, 0, j * c);
      var p2 = new nsPt(i * a + a, 0, j * c + c);
      var p3 = new nsPt(i * a, 0, j * c + c);
      cellQuadArr.push(new nsQuad(p0, p1, p2, p3));
    }
  }
  for (var i = 0; i < gridArr.length; i++) {
    scene.add(gridArr[i]);
  }
  initNetwork();
};

function utilDi(a, b) {
  return Math.sqrt(
    (a.x - b.x) * (a.x - b.x) +
      (a.y - b.y) * (a.y - b.y) +
      (a.z - b.z) * (a.z - b.z)
  );
}

var clrGround=function(){
  for (var i = 0; i < pathArr.length; i++) {
    pathArr[i].geometry.dispose();
    pathArr[i].material.dispose();
    scene.remove(pathArr[i]);
  }
  for (var i = 0; i < roadArr.length; i++) {
    roadArr[i].geometry.dispose();
    roadArr[i].material.dispose();
    scene.remove(roadArr[i]);
  }
  for (var i = 0; i < greenArr.length; i++) {
    greenArr[i].geometry.dispose();
    greenArr[i].material.dispose();
    scene.remove(greenArr[i]);
  }
  for (var i = 0; i < intxArr.length; i++) {
    intxArr[i].geometry.dispose();
    intxArr[i].material.dispose();
    scene.remove(intxArr[i]);
  }
  for (var i = 0; i < groundArr.length; i++) {
    groundArr[i].geometry.dispose();
    groundArr[i].material.dispose();
    scene.remove(groundArr[i]);
  }
  for (var i = 0; i < evacArr.length; i++) {
    evacArr[i].geometry.dispose();
    evacArr[i].material.dispose();
    scene.remove(evacArr[i]);
  }
  for (var i = 0; i < mstArr.length; i++) {
    mstArr[i].geometry.dispose();
    mstArr[i].material.dispose();
    scene.remove(mstArr[i]);
  }
  pathArr = Array();
  roadArr = Array();
  greenArr = Array();
  groundArr = Array();
  evacArr=[];
  intxArr=[];
  mstArr=[];
}

var genGroundTiles=function(){
  for (var i = 0; i < pathArr.length; i++) {
    scene.add(pathArr[i]);
  }
  for (var i = 0; i < roadArr.length; i++) {
    scene.add(roadArr[i]);
  }
  for (var i = 0; i < greenArr.length; i++) {
    scene.add(greenArr[i]);
  }  
  for (var i = 0; i < intxArr.length; i++) {
    scene.add(intxArr[i]);
  }    
  for (var i = 0; i < evacArr.length; i++) {
    scene.add(evacArr[i]);
  }
  for (var i = 0; i < groundArr.length; i++) {
    scene.add(groundArr[i]);
  }
  for (var i = 0; i < mstArr.length; i++) {
    scene.add(mstArr[i]);
  }
}

//generate the passage: returnNodeType
var constructGroundTiles = function(doRandom) {
  clrGround();
  var pathQuadArr = Array();
  var w = (varCellNumLe - 1) / 2;
  var t = (varCellNumDe - 1) / 2;
  mstArr=[]
  circulationQuads=[];
  var offset=gridGuiControls.global_offset;
  genCirculationCorner(doRandom,offset);
  genCirculationLinear(doRandom,offset);
  for (var i = 0; i < circulationQuads.length; i++) {
    var name = circulationQuads[i].type;
    var ht=0.0;
    //if(name==="MST"){
      //ht=0.15;
    //}
    var PA = new setPath(circulationQuads[i], name, ht);
    PA.generateGround();
  }
  genGroundTiles(); // definition files
};

function getRandomType(){
  var type;
  var t=Math.random();
  if (t < 0.35) {
    type = "road";
  } else if (t >= 0.35 && t < 0.75) {
    type = "path";
  } else if (t >= 0.75) {
    type = "green";
  }else {
    type = "MST";
  }
  return type;
}

//util function to generate linear circulation along edge : hor / ver
var genCirculationLinear=function(doRandom, offset){
  for(var i=0; i<networkEdgesArr.length; i++){
    var type;
    if(doRandom===false){
      type=networkEdgesArr[i].getType();
    }else{
      type=getRandomType();
    }    
    var a=networkEdgesArr[i].getNode0().getPt();
    var b=networkEdgesArr[i].getNode1().getPt();
    var p,q;
    if(a.x===b.x && a.z<b.z){
      p=a; q=b;
      genVerticalCirculationQuad(p,q, offset, type);
    }else if(a.x===b.x && a.z>b.z){
      p=b; q=a;
      genVerticalCirculationQuad(p,q, offset, type);
    }else if(a.x<b.x && a.z===b.z){
      p=a; q=b;
      genHorizontalCirculationQuad(p,q, offset, type);
    }else if(a.x>b.x && a.z===b.z){
      p=b; q=a;
      genHorizontalCirculationQuad(p,q, offset, type);
    }
  }
}

//util function to generate linear circulation along edge : ver
var genVerticalCirculationQuad=function(p,q,offset, type){
  var a,b,c,d;
  var r=0.5*offset;
  //if(type==="green" || type==="path"){
    //a=new nsPt(p.x-offset, p.y, p.z+offset);
    //b=new nsPt(p.x+offset, p.y, p.z+offset);
    //c=new nsPt(q.x+offset, q.y, q.z-offset);
    //d=new nsPt(q.x-offset, q.y, q.z-offset);
  //}else if(type === "road"){
  var r=0.5*offset;
  a=new nsPt(p.x-r, p.y, p.z+2*r);
  b=new nsPt(p.x+r, p.y, p.z+2*r);
  c=new nsPt(q.x+r, q.y, q.z-2*r);
  d=new nsPt(q.x-r, q.y, q.z-2*r);
  if(type === "MST"){
    //mst
    a=new nsPt(p.x-2*r, p.y, p.z+2*r);
    b=new nsPt(p.x-r, p.y, p.z+2*r);
    c=new nsPt(q.x-r, q.y, q.z-2*r);
    d=new nsPt(q.x-2*r, q.y, q.z-2*r);
    
    e=new nsPt(p.x+2*r, p.y, p.z+2*r);
    f=new nsPt(q.x+2*r, q.y, q.z-2*r);
    g=new nsPt(q.x+r, q.y, q.z-2*r);
    h=new nsPt(p.x+r, p.y, p.z+2*r);

    var quad2=new nsQuad(e,f,g,h);
    quad2.type=type;
    circulationQuads.push(quad2);
  }
  var quad=new nsQuad(a,b,c,d);
  quad.type=type;
  circulationQuads.push(quad);
}

//util function to generate  linear circulation along edge : hor
var genHorizontalCirculationQuad=function(p,q,offset, type){
  var a,b,c,d;
  var r=0.5*offset;
  //if(type==="green" || type==="path" || type==="intx"){
    //a=new nsPt(p.x+offset, p.y, p.z-offset);
    //b=new nsPt(q.x-offset, q.y, q.z-offset);
    //c=new nsPt(q.x-offset, q.y, p.z+offset);
    //d=new nsPt(p.x+offset, p.y, p.z+offset);
  //}else if(type === "road"){
    a=new nsPt(p.x+2*r, p.y, p.z-r);
    b=new nsPt(q.x-2*r, q.y, q.z-r);
    c=new nsPt(q.x-2*r, q.y, p.z+r);
    d=new nsPt(p.x+2*r, p.y, p.z+r);
  if(type === "MST"){
    //top MST
    //var r=0.5*offset;
    a=new nsPt(p.x+2*r, p.y, p.z-2*r);
    b=new nsPt(q.x-2*r, q.y, q.z-2*r);
    c=new nsPt(q.x-2*r, q.y, q.z-r);
    d=new nsPt(p.x+2*r, p.y, p.z-r);

    e=new nsPt(p.x+2*r, p.y, p.z+r);
    f=new nsPt(q.x-2*r, q.y, q.z+r);
    g=new nsPt(q.x-2*r, q.y, q.z+2*r);
    h=new nsPt(p.x+2*r, p.y, p.z+2*r);
    var quad2=new nsQuad(e,f,g,h);
    quad2.type=type;
    circulationQuads.push(quad2);
  }
  var quad=new nsQuad(a,b,c,d);
  quad.type=type;
  circulationQuads.push(quad);
}

//util function to find and render intersection between circulation routes
var genCirculationCorner=function(doRandom,offset){
  for(var i=0; i<networkNodesArr.length; i++){
    var a=networkNodesArr[i].getPt();
    var type;
    if(doRandom===false){
      var numIntx=0;
      var numGreen=0;
      var numPath=0;
      var numRoad=0; 
      for(var j=0; j<networkEdgesArr.length; j++){
        var b=networkEdgesArr[j].getNode0().getPt();
        var c=networkEdgesArr[j].getNode1().getPt();
        if((utilDi(a,b)<0.01 && utilDi(a,c)>0.01) || (utilDi(a,c)<0.01 && utilDi(a,b)>0.01)){
          if(networkEdgesArr[j].getType() === "intx"){
            numIntx++;
          }else if(networkEdgesArr[j].getType() === "green"){
            numGreen++;
          }else if(networkEdgesArr[j].getType() === "path"){
            numPath++;
          }else if(networkEdgesArr[j].getType() === "road"){
            numRoad++;
          }
        }
      }
      var type="path";
      if(numIntx>0){ type = "intx"; }
      else if(numGreen>0 && numRoad>0){ type = "intx"; }
      else if(numGreen>0 && numRoad<1){ type = "green"; }
      else if(numGreen<1 && numRoad>0){ type = "road"; }
      else{type="path";}
    }else{
      type=getRandomType();
    }  
    var p=new nsPt(a.x-offset, a.y, a.z-offset);
    var q=new nsPt(a.x+offset, a.y, a.z-offset);
    var r=new nsPt(a.x+offset, a.y, a.z+offset);
    var s=new nsPt(a.x-offset, a.y, a.z+offset);   
    //debugQuad(p,q,r,s);
    var quad=new nsQuad(p,q,r,s);
    quad.type=type;
    circulationQuads.push(quad);
  }
}

var clrBuildings=function(){
  for (var i = 0; i < GCNCubeArr.length; i++) {
    GCNCubeArr[i].geometry.dispose();
    GCNCubeArr[i].material.dispose();
    scene.remove(GCNCubeArr[i]);
  }
  for (var i = 0; i < NCNCubeArr.length; i++) {
    NCNCubeArr[i].geometry.dispose();
    NCNCubeArr[i].material.dispose();
    scene.remove(NCNCubeArr[i]);
  }
  for (var i = 0; i < RCNCubeArr.length; i++) {
    RCNCubeArr[i].geometry.dispose();
    RCNCubeArr[i].material.dispose();
    scene.remove(RCNCubeArr[i]);
  }
  GCNCubeArr = Array();
  NCNCubeArr = Array();
  RCNCubeArr = Array();
}

function addBldgs(){
  for (var i = 0; i < GCNCubeArr.length; i++) {
    scene.add(GCNCubeArr[i]);
  }
  for (var i = 0; i < NCNCubeArr.length; i++) {
    scene.add(NCNCubeArr[i]);
  }
  for (var i = 0; i < RCNCubeArr.length; i++) {
    scene.add(RCNCubeArr[i]);
  }
  for (var i = 0; i < evacArr.length; i++) {
    scene.add(evacArr[i]);
  }
}

//generate the cubes
var genCubes = function(doRandom) {
  var numGcnSubCells=0;
  var numNcnSubCells=0;
  var numRcnSubCells=0;
  //var subCellQuadArr=[];
  clrBuildings();
  cellQuadsAlignment(); //sets the cell Area for gcn, ncn, rcn based on node type
  genSubCells();
  allocateSubCells();
  addBldgs();
};


function genSubCells(){
  for (var i = 0; i < cellQuadArr.length; i++) {
    var gcnAr=cellQuadArr[i].gcnArea;
    var ncnAr=cellQuadArr[i].ncnArea;
    var rcnAr=cellQuadArr[i].rcnArea;

    //console.log(i+". Areas: "+gcnAr+", "+ncnAr+", "+rcnAr);
    var quad = cellQuadArr[i];  
    var offset=gridGuiControls.global_offset+0.1;
    var p=new nsPt(quad.p.x+offset, quad.p.y, quad.p.z+offset);
    var q=new nsPt(quad.q.x-offset, quad.q.y, quad.q.z+offset);
    var r=new nsPt(quad.r.x-offset, quad.r.y, quad.r.z-offset);
    var s=new nsPt(quad.s.x+offset, quad.s.y, quad.s.z-offset);    
    var quadAr=gcnAr+ncnAr+rcnAr;

    //req offset is given by a quadratic equation multiplied by a constant for number of floors
    //var d=0.3*(-(varCellLe-(2*offset)+varCellDe)+Math.sqrt(((varCellLe-(2*offset)+varCellDe)*(varCellLe-(2*offset)+varCellDe)) + 4*quadAr))/2;
    var d=gridGuiControls.global_offset*(varCellLe+varCellDe)/3.5;
    
    //quad A : PQ
    var h1=1; // for debug quad
    var a1=new nsPt(p.x,p.y,p.z);
    var b1=new nsPt(q.x,q.y,q.z);
    var c1=new nsPt(q.x,q.y,q.z+d);
    var d1=new nsPt(p.x,p.y,p.z+d);
    var quads=genHorSubCells(a1,b1,c1,d1);
    try{
      for(var j=0; j<quads.length; j++){
        cellQuadArr[i].subCellQuads.push(quads[j]);
      }
    }catch(err){}

    // debugQuad(a1,b1,c1,d1,h1);
    //quad B : QR
    var h2=1;
    var a2=new nsPt(q.x-d,q.y,q.z+d);
    var b2=new nsPt(q.x,q.y,q.z+d);
    var c2=new nsPt(r.x,r.y,r.z-d);
    var d2=new nsPt(r.x-d,r.y,r.z-d);
    var quadB=new nsQuad(a2,b2,c2,d2);
    if(utilDi(b2,c2)>varCellDe/3){
      // debugQuad(a2,b2,c2,d2,h2);
      var quads=genVerSubCells(a2,b2,c2,d2);
      try{
        for(var j=0; j<quads.length; j++){
          cellQuadArr[i].subCellQuads.push(quads[j]);
        }
      }catch(err){}      
    }

    //quad C : RS
    var h3=1;
    var a3=new nsPt(s.x,s.y,s.z-d);
    var b3=new nsPt(r.x,r.y,r.z-d);
    var c3=new nsPt(r.x,r.y,r.z);
    var d3=new nsPt(s.x,s.y,s.z);
    var quadC=new nsQuad(a3,b3,c3,d3);
    // debugQuad(a3,b3,c3,d3,h3);
    var quads=genHorSubCells(a3,b3,c3,d3)
    try{
      for(var j=0; j<quads.length; j++){
        cellQuadArr[i].subCellQuads.push(quads[j]);
      }
    }catch(err){}  

    //quad D : SP
    var h4=1;
    var a4=new nsPt(p.x,p.y,p.z+d);
    var b4=new nsPt(p.x+d,p.y,p.z+d);
    var c4=new nsPt(s.x+d,s.y,s.z-d);
    var d4=new nsPt(s.x,s.y,s.z-d);
    var quadD=new nsQuad(a4,b4,c4,d4);
    if(utilDi(b4,c4)>varCellDe/3){
      var quadsd=genVerSubCells(a4,b4,c4,d4)
      // debugQuad(a4,b4,c4,d4,h4);
      try{
        for(var j=0; j<quads.length; j++){
          cellQuadArr[i].subCellQuads.push(quads[j]);
        }
      }catch(err){}
    }
  }
}

function allocateSubCells(){
  var cumuArea=0.0;
  for(var i=0; i<cellQuadArr.length; i++){
    var subCellQuadArr=cellQuadArr[i].subCellQuads;
    var mainQuad=cellQuadArr[i];
    //console.log(i+". Areas= " + mainQuad.gcnArea+", "+mainQuad.ncnArea+", "+mainQuad.rcnArea);
    cumuArea+=mainQuad.gcnArea+mainQuad.ncnArea+mainQuad.rcnArea;
    var arCell=0.0;
    for(var j=0; j<subCellQuadArr.length; j++){
      var p=subCellQuadArr[j].mp();
      var minDi=1000000000;
      var type;
      for(var k=0; k<networkEdgesArr.length; k++){
        var q=networkEdgesArr[k].getMp();
        if(utilDi(p,q)<minDi){
          minDi=utilDi(p,q);
          type=networkEdgesArr[k].getType();
        }
      }
      var a=subCellQuadArr[j].p;
      var b=subCellQuadArr[j].q;
      var c=subCellQuadArr[j].r;
      var d=subCellQuadArr[j].s;
      arCell=utilDi(a,b)*utilDi(b,c);
    }

    numCellsNcn=Math.ceil(parseFloat(mainQuad.ncnArea)/parseFloat(arCell));
    numCellsRcn=Math.ceil(parseFloat(mainQuad.rcnArea)/parseFloat(arCell));
    
    var totalNum=subCellQuadArr.length;
    var totalArea=mainQuad.gcnArea+mainQuad.ncnArea+mainQuad.rcnArea;
    numCellsGcn=Math.ceil(totalNum*mainQuad.gcnArea/totalArea);
    numCellsNcn=Math.ceil(totalNum*mainQuad.ncnArea/totalArea);
    numCellsRcn=Math.ceil(totalNum*mainQuad.rcnArea/totalArea);

    
    //console.log(arCell+"; numbers = "+ numCellsGcn+", "+ numCellsNcn +", "+ numCellsRcn+ " -"+totalNum+", "+totalArea);
    
    shuffleArray(subCellQuadArr);
    var numCellsGcnGot=0;
    var numCellsNcnGot=0;
    var numCellsRcnGot=0;
    var counter=0;
    for(var j=0; j<subCellQuadArr.length; j++){
      
      if(numCellsGcnGot<numCellsGcn){
        var quad=subCellQuadArr[j];
        quad.type="GCN";
        quad.genCube(numCellsGcn);
        numCellsGcnGot++;
        counter++;
      }      
    }
    for(var j=counter; j<subCellQuadArr.length; j++){
      if(numCellsNcnGot<numCellsNcn){
        var quad=subCellQuadArr[j];
        quad.type="NCN";
        quad.genCube(numCellsNcn);
        numCellsNcnGot++;
        counter++;
      }      
    }
    for(var j=counter; j<subCellQuadArr.length; j++){
      if(numCellsRcnGot<numCellsRcn){
        var quad=subCellQuadArr[j];
        quad.type="RCN";
        quad.genCube(numCellsRcn);
        numCellsRcnGot++;
        counter++;
      }      
    }
  }
  //console.log("\nTotal Area= "+cumuArea);
}

function genHorSubCells(p,q,r,s){
  var subCellQuadArr=[];
  var t=0.3;
  var u=new nsPt((q.x-p.x),(q.y-p.y),(q.z-p.z));
  var v=new nsPt((r.x-s.x),(r.y-s.y),(r.z-s.z));
  for(var i=0.0; i<1.0-t; i+=t){
    var a=new nsPt( p.x + (u.x*i), p.y, p.z + (u.z*i) );
    var b=new nsPt( p.x + (u.x*(i+t)), p.y, p.z + u.z*(i+t));
    var c=new nsPt( s.x + (v.x*(i+t)), s.y, s.z + (v.z*(i+t)) );
    var d=new nsPt( s.x + (v.x*i), s.y, s.z + (v.z*i) );
    var quad=new nsQuad(a,b,c,d);      
    subCellQuadArr.push(quad);
    //debugQuad(a,b,c,d);
  }
  return subCellQuadArr;
}

function genVerSubCells(p,q,r,s){
  var subCellQuadArr=[];
  var t=0.3;
  var u=new nsPt((r.x-q.x),(r.y-q.y),(r.z-q.z));
  var v=new nsPt((s.x-p.x),(s.y-p.y),(s.z-p.z));
  for(var i=0.0; i<1.0-t; i+=t){
    var a=new nsPt( p.x + (v.x*i), p.y, p.z + (v.z*i) );
    var b=new nsPt( q.x + (u.x*(i)), q.y, q.z + u.z*(i));
    var c=new nsPt( q.x + (v.x*(i+t)), q.y, q.z + (v.z*(i+t)) );
    var d=new nsPt( p.x + (v.x*(i+t)), p.y, p.z + (v.z*(i+t)) );
    var quad=new nsQuad(a,b,c,d);      
    subCellQuadArr.push(quad);
    //debugQuad(a,b,c,d);
  }
  return subCellQuadArr;
}

function cellQuadsAlignment() {

  var bua=(cellQuadArr.length*varCellLe*varCellDe);
  //normalize the FSR input to 1 and then distribute the FSR
  var gcnFsr=bldgGuiControls.GCN_FSR
  var ncnFsr=bldgGuiControls.NCN_FSR
  var rcnFsr=bldgGuiControls.RCN_FSR
  var sumFsr= (gcnFsr+ncnFsr+rcnFsr);
  var gcnArea = bua * gcnFsr/sumFsr;
  var rcnArea = bua * rcnFsr/sumFsr;
  var ncnArea = bua * ncnFsr/sumFsr; 
  
  //console.log(gcnArea + ", " + ncnArea + ", " + rcnArea);
  var GCNCellsArr = [];
  var NCNCellsArr = [];
  var RCNCellsArr = [];
  // calculate the number of node of each type in quad
  // set the gcn, ncn, rcn ratios to the quad
  // add quads to gcnArr, ncnArr, rcnArr
  var cumuGcnRat=0;
  var cumuNcnRat=0;
  var cumuRcnRat=0;
  for (var i = 0; i < cellQuadArr.length; i++) {
    var p = cellQuadArr[i].p;
    var q = cellQuadArr[i].q;
    var r = cellQuadArr[i].r;
    var s = cellQuadArr[i].s;
    var NCNRat = 0;
    var GCNRat = 0;
    var RCNRat = 0;
    for (var j = 0; j < networkNodesArr.length; j++) {
      var a = networkNodesArr[j].getPt();
      var dp = utilDi(p, a);
      var dq = utilDi(q, a);
      var dr = utilDi(r, a);
      var ds = utilDi(s, a);
      if (dp < 0.01 || dq<0.01 || dr<0.01 || ds<0.01) {
        var t = networkNodesArr[j].getType();
        if (t === "RCN") {
          RCNRat++; cumuRcnRat++;
          RCNCellsArr.push(cellQuadArr[i]);
        } else if (t === "GCN") {
          GCNRat++; cumuGcnRat++;
          GCNCellsArr.push(cellQuadArr[i]);
        } else if (t === "NCN") {
          NCNRat++; cumuNcnRat++;
          NCNCellsArr.push(cellQuadArr[i]);
        }
      }
    }
    cellQuadArr[i].gcnRat = GCNRat;
    cellQuadArr[i].ncnRat = NCNRat;
    cellQuadArr[i].rcnRat = RCNRat;    
  }
  console.log("\n\n\nArea distribution:");
  console.log("Bua: "+bua);
  console.log("FSR req: G ="+gcnArea+", N="+ncnArea +", R= "+rcnArea);
  console.log("Number of Cells: \nG="+GCNCellsArr.length+", N="+ NCNCellsArr.length +", R="+RCNCellsArr.length);
  // set the area of gcn, ncn, rcn to each quad
  // area set is given by the node distribution per cell 
  var cumuGcnArea=0;var cumuNcnArea=0; var cumuRcnArea=0;
  for(var i=0; i<cellQuadArr.length; i++){
    if(cellQuadArr[i].gcnRat>0){
      cellQuadArr[i].gcnArea=gcnArea*cellQuadArr[i].gcnRat/cumuGcnRat;
      cumuGcnArea+=cellQuadArr[i].gcnArea;
    }
    if(cellQuadArr[i].ncnRat>0){
      cellQuadArr[i].ncnArea=ncnArea*cellQuadArr[i].ncnRat/cumuNcnRat;
      cumuNcnArea+=cellQuadArr[i].ncnArea;
    }
    if(cellQuadArr[i].rcnRat>0) {
      cellQuadArr[i].rcnArea=rcnArea*cellQuadArr[i].rcnRat/cumuRcnRat;
      cumuRcnArea+=cellQuadArr[i].rcnArea;
    }
  }

  console.log("\n\n\nGot Areas :\nCumulative areas : G=" + cumuGcnArea+ ", N="+cumuNcnArea + ", R="+cumuRcnArea);
  console.log("Total Area : " + (cumuGcnArea+ cumuNcnArea +cumuRcnArea));
}



