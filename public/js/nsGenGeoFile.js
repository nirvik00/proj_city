// GUI
var varCellNumLe = 2;
var varCellNumDe = 2;
var varCellLe = 2;
var varCellDe = 2;

var datgui = new dat.GUI({ autoPlace: false });

//cell-grid gui controls
var gridGuiControls = new function() {
  this.num_Length = 2;
  this.num_Depth = 2;
  this.cell_Length = 3;
  this.cell_Depth = 3;
  this.show_Grid = false;
}();
var cellGUI = datgui.addFolder("gridGuiControls");
var cellNumLe = cellGUI.add(gridGuiControls, "num_Length", 1, 5);
var cellNumDe = cellGUI.add(gridGuiControls, "num_Depth", 1, 5);
var cellLe = cellGUI.add(gridGuiControls, "cell_Length", 1, 5);
var cellDe = cellGUI.add(gridGuiControls, "cell_Depth", 1, 5);
cellGUI.add(gridGuiControls, "show_Grid");


varCellNumLe = gridGuiControls.num_Length;
varCellNumDe = gridGuiControls.num_denpth;
varCellLe = gridGuiControls.cell_Length;
varCellDe = gridGuiControls.cell_Depth;

//ground gui controls
var groundGuiControls = new function() {
  this.cost_Res_Res = 0.1;
  this.cost_Res_Comm = 0.2;
  this.cost_Comm_Comm = 0.3;
  this.cost_Office_Res = 0.5;
  this.cost_Office_Comm = 0.75;
  this.cost_Office_Office = 1.0;
  this.show_Green = true;
  this.show_Path = true;
  this.show_Road = true;
}();
var groundGUI = datgui.addFolder("groundGuiControls");
groundGUI.add(groundGuiControls, "cost_Res_Res", 0.1, 1);
groundGUI.add(groundGuiControls, "cost_Res_Comm", 0.1, 1);
groundGUI.add(groundGuiControls, "cost_Comm_Comm", 0.1, 1);
groundGUI.add(groundGuiControls, "cost_Office_Res", 0.1, 1);
groundGUI.add(groundGuiControls, "cost_Office_Comm", 0.1, 1);
groundGUI.add(groundGuiControls, "cost_Office_Office", 0.1, 1);
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
buildingGUI.add(bldgGuiControls, "evacuation_density", 0.001, 0.1);
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

// generate NETWORK
//construct networkEdgesArr
function initNetwork() {
  networkEdgesArr = [];
  networkNodesArr=[];
  for (var i = 0; i < cellQuadArr.length; i++) {
    var quad = cellQuadArr[i];
    var p = quad.p;
    var q = quad.q;
    var r = quad.r;
    var s = quad.s;
    var m = quad.mp();
    var e0 = new nsNetworkEdge(p, q);
    var e1 = new nsNetworkEdge(q, r);
    var e2 = new nsNetworkEdge(r, s);
    var e3 = new nsNetworkEdge(s, p);
    var t0 = checkNetworkEdgeRepetition(networkEdgesArr, e0);
    var t1 = checkNetworkEdgeRepetition(networkEdgesArr, e1);
    var t2 = checkNetworkEdgeRepetition(networkEdgesArr, e2);
    var t3 = checkNetworkEdgeRepetition(networkEdgesArr, e3);
    if (t0 === false) {
      networkEdgesArr.push(e0);
    }
    if (t1 === false) {
      networkEdgesArr.push(e1);
    }
    if (t2 === false) {
      networkEdgesArr.push(e2);
    }
    if (t3 === false) {
      networkEdgesArr.push(e3);
    }
  }
  
  //construct networkNodesArr
  networkNodesArr=Array();
  for(var i=0; i<networkEdgesArr.length; i++){
    getNetworkNodes(networkEdgesArr[i]);
  }

  // set type of node array
  for(var i=0; i<networkNodesArr.length; i++){
    networkNodesArr[i].setType();
  }

  //set this node to networkEdges
  for(var i=0; i<networkEdgesArr.length; i++){
    var e=networkEdgesArr[i];
    var n0=e.getNode0(); var p=n0.getPt();
    var n1=e.getNode1(); var q=n1.getPt();
    for(var j=0; j<networkNodesArr.length; j++){
      var n2=networkNodesArr[j]; var r=n2.getPt();
      var d02=utilDi(p,r);
      if(d02<0.001){
        networkEdgesArr[i].setNode0(networkNodesArr[j]);
        break;
      }
    }
    for(var j=0; j<networkNodesArr.length; j++){
      var n2=networkNodesArr[j]; var r=n2.getPt();
      var d01=utilDi(q,r);
      if(d01<0.001){
        networkEdgesArr[i].setNode1(networkNodesArr[j]);
        break;
      }
    }
  }

 //update type of networkedges
  for(var i=0; i<networkEdgesArr.length; i++){
    networkEdgesArr[i].updateType();
  }

  //update cost of network edges
  for(var i=0; i<networkEdgesArr.length; i++){
    networkEdgesArr[i].updateCost();
  }

  //next function
  genNetworkGeometry();
}

//for network: nodes and edges
//set property of nodes to res, comm, off
function genNetworkGeometry(){
  for (var i = 0; i < nodeArr.length; i++) {
    nodeArr[i].geometry.dispose();
    nodeArr[i].material.dispose();
    scene.remove(nodeArr[i]);
  }
  for (var i = 0; i < edgeArr.length; i++) {
    edgeArr[i].geometry.dispose();
    edgeArr[i].material.dispose();
    scene.remove(edgeArr[i]);
  }
  edgeArr=Array();
  for(var i=0; i<networkEdgesArr.length; i++){
    var e=networkEdgesArr[i];
    edgeArr.push(e.getObj());
  }
  for(var i=0; i<edgeArr.length; i++){  
    scene.add(edgeArr[i]); 
  }

  nodeArr = Array();
  for(var i=0; i<networkNodesArr.length; i++){
    var n0=networkNodesArr[i];
    nodeArr.push(n0.getObj());
  }
  for(var i=0; i<nodeArr.length; i++){
    scene.add(nodeArr[i]);
  }
}



//check if the network edge already exists in networkEdgesArr
function checkNetworkEdgeRepetition(arr, e0) {
  var sum = 0;
  if (arr.length > 0) {
    for (var i = 0; i < arr.length; i++) {
      var a = arr[i].getP();
      var b = arr[i].getQ();
      var p = e0.getP();
      var q = e0.getQ();
      var T = 0.0001;
      if (
        (utilDi(p, a) < T && utilDi(q, b) < T) ||
        (utilDi(p, b) < T && utilDi(q, a) < T)
      ) {
        sum++;
      }
    }
  }
  if (sum === 0) {
    return false;
  } else {
    return true;
  }
}

// network node creation from edge - repetition
function getNetworkNodes(e){
  
  var sum0=0;
  var sum1=0;
  var n0=e.getNode0();
  var n1=e.getNode1();

  var p=n0.getPt();
  var q=n1.getPt();
  
  if(networkEdgesArr.length>0){
    for(var i=0; i<networkNodesArr.length; i++){
      var n2=networkNodesArr[i].getPt();
      if(utilDi(n0,n2) < 0.01){
        sum0++;
        break;
      }
    }
    if(sum0==0){
      networkNodesArr.push(n0);
    }
    for(var i=0; i<networkNodesArr.length; i++){
      var n2=networkNodesArr[i].getPt();
      if(utilDi(n1,n2) < 0.01){
        sum1++;
        break;
      }
    }
    if(sum1==0){
      networkNodesArr.push(n1);
    }
  }
}

//generate the passage: returnNodeType RANDOMLY
var constructRandomGroundTiles = function() {
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
  for (var i = 0; i < groundArr.length; i++) {
    groundArr[i].geometry.dispose();
    groundArr[i].material.dispose();
    scene.remove(groundArr[i]);
  }
  pathArr = Array();
  roadArr = Array();
  greenArr = Array();
  groundArr = Array();
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
    var e = new nsPt(q.x - 0.5, 0, q.z - 0.5);
    var f = new nsPt(q.x + 0.5, 0, q.z - 0.5);
    var g = new nsPt(q.x + 0.5, 0, q.z + 0.5);
    var h = new nsPt(q.x - 0.5, 0, q.z + 0.5);
    var I = new nsPt(e.x, 0, a.z);
    var j = new nsPt(f.x, 0, b.z);
    var k = new nsPt(b.x, 0, f.z);
    var l = new nsPt(b.x, 0, g.z);
    var m = new nsPt(g.x, 0, c.z);
    var n = new nsPt(h.x, 0, d.z);
    var o = new nsPt(d.x, 0, h.z);
    var p = new nsPt(a.x, 0, e.z);

    var q0 = new nsQuad(a, I, e, p);
    var q1 = new nsQuad(I, j, f, e);
    var q2 = new nsQuad(j, b, k, f);
    var q3 = new nsQuad(f, k, l, g);
    var q4 = new nsQuad(g, l, c, m);
    var q5 = new nsQuad(h, g, m, n);
    var q6 = new nsQuad(o, h, n, d);
    var q7 = new nsQuad(p, e, h, o);

    pathQuadArr.push(q0);
    pathQuadArr.push(q1);
    pathQuadArr.push(q2);
    pathQuadArr.push(q3);
    pathQuadArr.push(q4);
    pathQuadArr.push(q5);
    pathQuadArr.push(q6);
    pathQuadArr.push(q7);
  }

  for (var i = 0; i < pathQuadArr.length; i++) {
    var name="";
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

  for (var i = 0; i < pathArr.length; i++) {
    scene.add(pathArr[i]);
  }

  for (var i = 0; i < roadArr.length; i++) {
    scene.add(roadArr[i]);
  }

  for (var i = 0; i < greenArr.length; i++) {
    scene.add(greenArr[i]);
  }

  for (var i = 0; i < groundArr.length; i++) {
    scene.add(groundArr[i]);
  }
};




//generate the cubes
var genCubes = function() {
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

  for (var i = 0; i < cellQuadArr.length; i++) {
    var deci = new CubeDecisions();
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

function utilDi(a, b) {
  return Math.sqrt(
    (a.x - b.x) * (a.x - b.x) +
      (a.y - b.y) * (a.y - b.y) +
      (a.z - b.z) * (a.z - b.z)
  );
}


function findMinCost(){
  var costResRes = groundGuiControls.cost_Res_Res;
  var costResComm = groundGuiControls.cost_Res_Comm;
  var costCommComm = groundGuiControls.cost_Comm_Comm;
  var costOfficeRes = groundGuiControls.cost_Office_Res;
  var costOfficeComm = groundGuiControls.cost_Office_Comm;
  var costOfficeOffice = groundGuiControls.cost_Office_Office;
  for (var i=0;i<networkEdgesArr.length; i++) {
    var e=networkEdgesArr[i]; e.updateCost(); e.updateType();
    console.log(e.cost + ", "+e.node0.getType() + ", "+e.node1.getType());
  }
  //sort all edges by weight
  var sortedNetworkEdges=new Array();
  var sortable =new Array();
  for (var i=0;i<networkEdgesArr.length; i++) {
      sortable.push([networkEdgesArr[i], networkEdgesArr[i].cost]);
  }
  sortable.sort(function(a, b) {
      return a[1] - b[1];
  });
  networkEdgesArr=Array();
  for (var i=0;i<sortable.length; i++) {
    networkEdgesArr.push(sortable[i][0]);
  }
  sortable=[];
  // end of sorting


  //get all nodes of res type
  var reqResNodes=[];
  for(var i=0; i<networkNodesArr.length; i++){
    if(networkNodesArr[i].getType()==="res") reqResNodes.push(networkNodesArr[i]);
  }
  console.log("length of initial array : " + reqResNodes.length);

  
  //get all nodes of res type
  var tmpEdges=[];
  for(var i=0; i<networkEdgesArr.length; i++){
    var e=networkEdgesArr[i]; var n0=e.getNode0().getPt(); var n1=e.getNode1().getPt();    
    var t=checkNetworkEdgeRepetition(tmpEdges, e);
    if(t==false) {      
      tmpEdges.push(e);
    }
    //remove nodes which have been found
    //if length of remaininig nodes are > 1
    if(reqResNodes.length>0){
      //console.log("length of array : " + reqResNodes.length);
      for(var j=0; j<reqResNodes.length; j++){
        var n2=reqResNodes[j].getPt();
        if(utilDi(n2,n0) < 0.01){
          reqResNodes.splice(j,1);
          break;
        }
        if(utilDi(n2,n1) < 0.01){
          reqResNodes.splice(j,1);
          break;
        }
      }
    }else{
      break;
    }    
  }
  reqResNodes=[];
  for(var i=0; i<tmpEdges.length; i++){
    var f=tmpEdges[i]; var n0=f.getNode0().getPt(); var n1=f.getNode1().getPt();    
    for(var j=0; j<networkEdgesArr.length; j++){
      var e=networkEdgesArr[j]; var n2=e.getNode0().getPt(); var n3=e.getNode1().getPt();   if(utilDi(n0,n2)<0.01 && utilDi(n1,n3)<0.01){
        networkEdgesArr[j].setType("green");
      }
    }      
  }
  tmpEdges=[];
  genNetworkGeometry();
}





//generate the passage: returnNodeType 
var constructGroundTiles = function() {
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
  for (var i = 0; i < groundArr.length; i++) {
    groundArr[i].geometry.dispose();
    groundArr[i].material.dispose();
    scene.remove(groundArr[i]);
  }
  pathArr = Array();
  roadArr = Array();
  greenArr = Array();
  groundArr = Array();
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
    var e = new nsPt(q.x - 0.5, 0, q.z - 0.5);
    var f = new nsPt(q.x + 0.5, 0, q.z - 0.5);
    var g = new nsPt(q.x + 0.5, 0, q.z + 0.5);
    var h = new nsPt(q.x - 0.5, 0, q.z + 0.5);
    var I = new nsPt(e.x, 0, a.z);
    var j = new nsPt(f.x, 0, b.z);
    var k = new nsPt(b.x, 0, f.z);
    var l = new nsPt(b.x, 0, g.z);
    var m = new nsPt(g.x, 0, c.z);
    var n = new nsPt(h.x, 0, d.z);
    var o = new nsPt(d.x, 0, h.z);
    var p = new nsPt(a.x, 0, e.z);

    var q0 = new nsQuad(a, I, e, p);
    var q1 = new nsQuad(I, j, f, e);
    var q2 = new nsQuad(j, b, k, f);
    var q3 = new nsQuad(f, k, l, g);
    var q4 = new nsQuad(g, l, c, m);
    var q5 = new nsQuad(h, g, m, n);
    var q6 = new nsQuad(o, h, n, d);
    var q7 = new nsQuad(p, e, h, o);

    pathQuadArr.push(q0);
    pathQuadArr.push(q1);
    pathQuadArr.push(q2);
    pathQuadArr.push(q3);
    pathQuadArr.push(q4);
    pathQuadArr.push(q5);
    pathQuadArr.push(q6);
    pathQuadArr.push(q7);
  }

  for (var i = 0; i < pathQuadArr.length; i++) {
    var p=pathQuadArr[i].mp();
    var minD=1000000000;
    var name="";
    for (var j=0; j<networkEdgesArr.length; j++){
      var q=networkEdgesArr[j].getMp();
      var d=utilDi(p,q);
      if(d<minD){
        minD=d;
        name=networkEdgesArr[j].getType();
      }
    }
    console.log(name);
    var PA = new setPath(pathQuadArr[i], name);
    PA.generateGround();
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

  for (var i = 0; i < groundArr.length; i++) {
    scene.add(groundArr[i]);
  }
};