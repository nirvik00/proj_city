// GUI
var varCellNumLe = 2;
var varCellNumDe = 2;
var varCellLe = 3;
var varCellDe = 3;
var varGlobalOffset=0.1;

var datgui = new dat.GUI({ autoPlace: false });

//cell-grid gui controls
var gridGuiControls = new function() {
  this.num_Length = 1;
  this.num_Depth = 1;
  this.cell_Length = 3;
  this.cell_Depth = 3;
  this.global_offset = 0.5;
  this.show_Grid = false;
}();
var cellGUI = datgui.addFolder("gridGuiControls");
var cellNumLe = cellGUI.add(gridGuiControls, "num_Length", 1, 5);
var cellNumDe = cellGUI.add(gridGuiControls, "num_Depth", 1, 5);
var cellLe = cellGUI.add(gridGuiControls, "cell_Length", 1, 5);
var cellDe = cellGUI.add(gridGuiControls, "cell_Depth", 1, 5);
var varGlobalOffset = cellGUI.add(gridGuiControls, "global_offset", 0.1, 1);
cellGUI.add(gridGuiControls, "show_Grid");

varCellNumLe = gridGuiControls.num_Length;
varCellNumDe = gridGuiControls.num_denpth;
varCellLe = gridGuiControls.cell_Length;
varCellDe = gridGuiControls.cell_Depth;
varGlobalOffset = gridGuiControls.global_offset;

//ground gui controls
var groundGuiControls = new function() {
  this.cost_Res_Res = 0.1;
  this.cost_Res_Comm = 0.30;
  this.cost_Comm_Comm = 0.45;
  this.cost_Office_Res = 0.75;
  this.cost_Office_Comm = 0.85;
  this.cost_Office_Office = 0.95;
  this.show_Green = true;
  this.show_Path = true;
  this.show_Road = true;
}();
var groundGUI = datgui.addFolder("groundGuiControls");
groundGUI.add(groundGuiControls, "cost_Res_Res", 0.01, 1);
groundGUI.add(groundGuiControls, "cost_Res_Comm", 0.01, 1);
groundGUI.add(groundGuiControls, "cost_Comm_Comm", 0.01, 1);
groundGUI.add(groundGuiControls, "cost_Office_Res", 0.01, 1);
groundGUI.add(groundGuiControls, "cost_Office_Comm", 0.01, 1);
groundGUI.add(groundGuiControls, "cost_Office_Office", 0.01, 1);
groundGUI.add(groundGuiControls, "show_Green");
groundGUI.add(groundGuiControls, "show_Path");
groundGUI.add(groundGuiControls, "show_Road");

//building gui controls
var bldgGuiControls = new function() {
  this.evacuation_density = 0.05;
  this.res_FSR = 0.3;
  this.comm_FSR = 0.3;
  this.office_FSR = 0.3;
  this.min_Ht = 3;
  this.mid_Ht = 7;
  this.max_Ht = 20;
  this.show_Evacuation = true;
  this.show_Residences = true;
  this.show_Commercial = true;
  this.show_Office = true;
}();
var buildingGUI = datgui.addFolder("bldgGuiControls");
buildingGUI.add(bldgGuiControls, "evacuation_density", 0.01, 0.1);
buildingGUI.add(bldgGuiControls, "res_FSR", 0.1, 3);
buildingGUI.add(bldgGuiControls, "comm_FSR", 0.1, 3);
buildingGUI.add(bldgGuiControls, "office_FSR", 0.1, 3);
buildingGUI.add(bldgGuiControls, "min_Ht", 1, 5);
buildingGUI.add(bldgGuiControls, "mid_Ht", 5, 12);
buildingGUI.add(bldgGuiControls, "max_Ht", 12, 25);
buildingGUI.add(bldgGuiControls, "show_Evacuation");
buildingGUI.add(bldgGuiControls, "show_Residences");
buildingGUI.add(bldgGuiControls, "show_Commercial");
buildingGUI.add(bldgGuiControls, "show_Office");

// main functions about the generation
var genGuiControls = new function() {
  this.hide_Ground = true;
  this.hide_Buildings = true;
  this.show_Network = true;
  this.show_Information = false;
  this.AUTOLOOP = false;
}();
datgui.add(genGuiControls, "hide_Ground");
datgui.add(genGuiControls, "hide_Buildings");
datgui.add(genGuiControls, "show_Network");
datgui.add(genGuiControls, "show_Information");
datgui.add(genGuiControls, "AUTOLOOP");

var customContainer = document.getElementById("moveGUI");
customContainer.appendChild(datgui.domElement);

datgui.close();
//
//  END OF GUI
//

// generate the grids
var genGrid = function() {
  varCellNumLe = gridGuiControls.num_Length;
  varCellNumDe = gridGuiControls.num_Depth;
  varCellLe = gridGuiControls.cell_Length;
  varCellDe = gridGuiControls.cell_Depth;

  var axes = new THREE.AxesHelper(5);
  scene.add(axes);
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
  //genCubes();
  //constructRandomGroundTiles();
  //findMinCost();
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
    greenArr[i].material.dispose();
    scene.remove(intxArr[i]);
  }
  for (var i = 0; i < groundArr.length; i++) {
    groundArr[i].geometry.dispose();
    groundArr[i].material.dispose();
    scene.remove(groundArr[i]);
  }
  for (var i = 0; i < circulationQuadArr.length; i++) {
    circulationQuadArr[i].geometry.dispose();
    circulationQuadArr[i].material.dispose();
    scene.remove(circulationQuadArr[i]);
  }

  pathArr = Array();
  roadArr = Array();
  greenArr = Array();
  groundArr = Array();
  circulationQuadArr = [];
}


//generate the passage: returnNodeType
var constructGroundTiles = function(doRandom) {
  clrGround();

  var pathQuadArr = Array();
  var w = (varCellNumLe - 1) / 2;
  var t = (varCellNumDe - 1) / 2;

  for (var i = 0; i < cellQuadArr.length; i++) {
    var quad = cellQuadArr[i];
    var q = quad.mp();
    var a = quad.p;
    var b = quad.q;
    var c = quad.r;
    var d = quad.s;

    // a=NE,b=SE,c=SW,d=NW
    var offset=0.5;
    var e = new nsPt(q.x - offset, 0, q.z - offset);
    var f = new nsPt(q.x + offset, 0, q.z - offset);
    var g = new nsPt(q.x + offset, 0, q.z + offset);
    var h = new nsPt(q.x - offset, 0, q.z + offset);
    var I = new nsPt(e.x, 0, a.z);
    var j = new nsPt(f.x, 0, b.z);
    var k = new nsPt(b.x, 0, f.z);
    var l = new nsPt(b.x, 0, g.z);
    var m = new nsPt(g.x, 0, c.z);
    var n = new nsPt(h.x, 0, d.z);
    var o = new nsPt(d.x, 0, h.z);
    var p = new nsPt(a.x, 0, e.z);

    var q0 = new nsQuad(a, I, e, p, i);
    var q1 = new nsQuad(I, j, f, e, i);
    var q2 = new nsQuad(j, b, k, f, i);
    var q3 = new nsQuad(f, k, l, g, i);
    var q4 = new nsQuad(g, l, c, m, i);
    var q5 = new nsQuad(h, g, m, n, i);
    var q6 = new nsQuad(o, h, n, d, i);
    var q7 = new nsQuad(p, e, h, o, i);

    pathQuadArr.push(q0);
    pathQuadArr.push(q1);
    pathQuadArr.push(q2);
    pathQuadArr.push(q3);
    pathQuadArr.push(q4);
    pathQuadArr.push(q5);
    pathQuadArr.push(q6);
    pathQuadArr.push(q7);
  }

  if (doRandom === false) {
    circulationQuads=[];
    var offset=gridGuiControls.global_offset;
    genCirculationCorner(offset);
    genCirculationLinear(offset);
    for (var i = 0; i < circulationQuads.length; i++) {
      var name = circulationQuads[i].type;
      var PA = new setPath(circulationQuads[i], name);
      PA.generateGround();
    }
  } else {
    for (var i = 0; i < pathQuadArr.length; i++) {
      var name = "";
      var t = Math.random();
      if (name === "" || name == "") {
        if (t < 0.35) {
          name = "road";
        } else if (t > 0.35 && t < 0.75) {
          name = "path";
        } else {
          name = "green";
        }
      }
      var PA = new setPath(pathQuadArr[i], name);
      PA.generateGround();
    }
  }

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

  for (var i = 0; i < groundArr.length; i++) {
    scene.add(groundArr[i]);
  }
};


//util function to generate linear circulation along edge : hor / ver
var genCirculationLinear=function(offset){
  for(var i=0; i<networkEdgesArr.length; i++){
    var type=networkEdgesArr[i].getType();
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
  var a=new nsPt(p.x-offset, p.y, p.z+offset);
  var b=new nsPt(p.x+offset, p.y, p.z+offset);
  var c=new nsPt(q.x+offset, q.y, q.z-offset);
  var d=new nsPt(q.x-offset, q.y, q.z-offset);
  var quad=new nsQuad(a,b,c,d);
  quad.type=type;
  circulationQuads.push(quad);
}
//util function to generate linear circulation along edge : hor
var genHorizontalCirculationQuad=function(p,q,offset, type){
  var a=new nsPt(p.x+offset, p.y, p.z-offset);
  var b=new nsPt(q.x-offset, q.y, q.z-offset);
  var c=new nsPt(q.x-offset, q.y, p.z+offset);
  var d=new nsPt(p.x+offset, p.y, p.z+offset);
  var quad=new nsQuad(a,b,c,d);
  quad.type=type;
  circulationQuads.push(quad);
}
//util function to find and render intersection between circulation routes
var genCirculationCorner=function(offset){
  for(var i=0; i<networkNodesArr.length; i++){
    var a=networkNodesArr[i].getPt();
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
    var p=new nsPt(a.x-offset,a.y, a.z-offset);
    var q=new nsPt(a.x+offset,a.y, a.z-offset);
    var r=new nsPt(a.x+offset,a.y, a.z+offset);
    var s=new nsPt(a.x-offset,a.y, a.z+offset);
    var type="path";
    if(numIntx>0){ type = "intx"; }
    else if(numGreen>0 && numRoad>0){ type = "intx"; }
    else if(numGreen>0 && numRoad<1){ type = "green"; }
    else if(numGreen<1 && numRoad>0){ type = "road"; }
    else{type="path";}
    var quad=new nsQuad(p,q,r,s);
    quad.type=type;
    circulationQuads.push(quad);
  }
}



var clrBuildings=function(){
  for (var i = 0; i < evacArr.length; i++) {
    evacArr[i].geometry.dispose();
    evacArr[i].material.dispose();
    scene.remove(evacArr[i]);
  }

  for (var i = 0; i < resCubeArr.length; i++) {
    resCubeArr[i].geometry.dispose();
    resCubeArr[i].material.dispose();
    scene.remove(resCubeArr[i]);
  }

  for (var i = 0; i < commCubeArr.length; i++) {
    commCubeArr[i].geometry.dispose();
    commCubeArr[i].material.dispose();
    scene.remove(commCubeArr[i]);
  }

  for (var i = 0; i < officeCubeArr.length; i++) {
    officeCubeArr[i].geometry.dispose();
    officeCubeArr[i].material.dispose();
    scene.remove(officeCubeArr[i]);
  }

  evacArr = Array();
  resCubeArr = Array();
  commCubeArr = Array();
  officeCubeArr = Array();
}
//generate the cubes
var genCubes = function(doRandom) {
  clrBuildings();
  for (var i = 0; i < cellQuadArr.length; i++) {
    var deci;
    if (doRandom == false) {
      deci = new CubeDecisions();
    } else {
      deci = new CubeRandomDecisions();
    }

    var numLayers = deci.getNumLayers();
    var type = deci.getType();
    var maxHt = deci.getMaxHt();
    var quad = cellQuadArr[i];
    var MK = new makeBuildings(quad, numLayers, type, maxHt);
    MK.genBuilding();
  }
  for (var i = 0; i < resCubeArr.length; i++) {
    scene.add(resCubeArr[i]);
  }
  for (var i = 0; i < commCubeArr.length; i++) {
    scene.add(commCubeArr[i]);
  }
  for (var i = 0; i < officeCubeArr.length; i++) {
    scene.add(officeCubeArr[i]);
  }
  for (var i = 0; i < evacArr.length; i++) {
    scene.add(evacArr[i]);
  }
};


function cellQuadsAlignment() {
  var resGfa = cellQuadArr.length * varCellLe * varCellDe * bldgGuiControls.res_FSR;
  var commGfa = cellQuadArr.length * varCellLe * varCellDe * bldgGuiControls.comm_FSR;
  var officeGfa = cellQuadArr.length * varCellLe * varCellDe * bldgGuiControls.office_FSR;
  //console.log(resGfa + ", " + commGfa + ", " + officeGfa);
  var resCellsArr = [];
  var commCellsArr = [];
  var officeCellsArr = [];
  for (var i = 0; i < cellQuadArr.length; i++) {
    var p = cellQuadArr[i].mp();
    var commRat = 0;
    var resRat = 0;
    var officeRat = 0;
    for (var j = 0; j < networkNodesArr.length; j++) {
      var q = networkNodesArr[j].getPt();
      var d = utilDi(p, q);
      if (d < 1.5 * Math.sqrt(varCellLe * varCellLe + varCellDe * varCellDe)) {
        var t = networkNodesArr[j].getType();
        if (t === "office") {
          officeRat++;
          officeCellsArr.push(cellQuadArr[i]);
        } else if (t === "res") {
          resRat++;
          resCellsArr.push(cellQuadArr[i]);
        } else if (t === "comm") {
          commRat++;
          commCellsArr.push(cellQuadArr[i]);
        }
      }
    }
    cellQuadArr[i].resRat = resRat;
    cellQuadArr[i].commRat = commRat;
    cellQuadArr[i].officeRat = officeRat;
    var resDistributedFSR = resGfa / resCellsArr.length;
    var commDistributedFSR = commGfa / commCellsArr.length;
    var officeDistributedFSR = officeGfa / officeCellsArr.length;
  }
}


