var scene3d = document.getElementById("scene3d");
var infoPara = document.getElementById("information");

var camera, scene, renderer, control, axes;
var ITERATION = 1;var COUNTER = 0;
var wireframeVal = false;

var costRcnRcn;
var costGcnGcn;
var costNcnNcn;
var costGcnNcn;
var costRcnGcn;
var costRcnNcn;
var costEVAC;



var evacEdges=[];
var networkNodesArr = [];
var networkEdgesArr = [];
var tempNetworkEdgesArr = Array();
var nodeArr = Array(); //network mesh of nodes
var edgeArr = Array(); //network mesh of node-edges
var greenEdgeArr=Array(); //network mesh of green edge


var globalOffset=0.5;

var gridArr = Array();
var evacArr = Array();
var GCNCubeArr = Array();
var NCNCubeArr = Array();
var RCNCubeArr = Array();
var cellQuadArr = Array();
var pathArr = Array();
var roadArr = Array();
var greenArr = Array();
var groundArr = Array();
var evacArr = [];
var mstArr=[]; // Mst quads
var intxArr=[];
var dupEvacArr=[];

var circulationQuads=[];  //data str 
var circulationQuadArr=[]; //rendered object

var init = function() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("rgb(255,255,255)");

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.x = 10;
  camera.position.y = 10;
  camera.position.z = 10;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  scene3d.appendChild(renderer.domElement);
  axes = new THREE.AxesHelper(5);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render);
  controls.enableZoom = true;
  runSystem();
};

function checkNodeTypeExists(nodeType){
  var t=false;
  for(var i=0; i<networkNodesArr.length; i++){
    var type=networkNodesArr[i].getType();
    if(type === nodeType) { t=true; break; }
  }
  return t;
}

document.addEventListener("keypress", function(event) {
  if (event.keyCode === 13) {
    //ENTER key event
    console.clear();
    console.log("iteration: (ENTER)" + ITERATION);

    runSystem(false);
    
    var source = infoPara.innerHTML;
    source += "\noptimize: " + COUNTER;
    infoPara.innerHTML = source;    
    ITERATION++;
  }
});

var runSystem=function(doRandom){
  genGrid();

  if(doRandom===false){
    //typeNode, typeEdge
    var t=checkNodeTypeExists("GCN");
    if(t===true){ 
      findMinCost("GCN", "green"); 
    }

    var t=checkNodeTypeExists("RCN");
    if(t===true){ 
      findMinCost("RCN", "road"); 
    }

    findMinCost("MST", "MST"); 

    var t=checkNodeTypeExists("EVAC");
    if(t===true){ 
      findMinCost("EVAC", "EVAC"); 
    }
  }

  // initialize & generate the network
  genNetworkGeometry();
  
  // construct the ground tiles
  constructGroundTiles(doRandom);

  //get the quads and set the probabilities of GCN, NCN, RCN
  //generate the cubes
  genCubes();
}

var mainLoop = function() {
  varCellNumLe = gridGuiControls.num_Length;
  varCellNumDe = gridGuiControls.num_Depth;
  varCellLe = gridGuiControls.cell_Length;
  varCellDe = gridGuiControls.cell_Depth;

  costGcnGcn = groundGuiControls.cost_GCN_GCN;
  costGcnNcn = groundGuiControls.cost_GCN_NCN;
  costNcnNcn = groundGuiControls.cost_NCN_NCN;
  costRcnGcn = groundGuiControls.cost_RCN_GCN;
  costRcnNcn = groundGuiControls.cost_RCN_NCN;
  costRcnRcn = groundGuiControls.cost_RCN_RCN;
  costEVAC = groundGuiControls.cost_EVAC;

  GcnFsr=bldgGuiControls.GCN_FSR;
  NcnFsr=bldgGuiControls.NCN_FSR;
  RcnFsr=bldgGuiControls.RCN_FSR;
  EvacFsr=bldgGuiControls.EVAC_FSR;

  cellNumLe.onChange(function() {
    genGrid();
  });

  cellNumDe.onChange(function() {
    genGrid();
  });

  cellLe.onChange(function() {
    genGrid();
  });

  cellDe.onChange(function() {
    genGrid();
  });

  showGCN.onChange(function(){
    genNetworkGeometry();
  });
  showNCN.onChange(function(){
    genNetworkGeometry();
  });
  showRCN.onChange(function(){
    genNetworkGeometry();
  });
  showMST.onChange(function(){
    genNetworkGeometry();
  });
  showEVAC.onChange(function(){
    genNetworkGeometry();
  });

  if (genGuiControls.show_Axis === true) {
    scene.add(axes);
  }else{
    scene.remove(axes);
  }

  if (groundGuiControls.show_Green === false) {
    for (var i = 0; i < greenArr.length; i++) {
      scene.remove(greenArr[i]);
    }
  } else {
    if(genGuiControls.hide_Ground=== false){
      for (var i = 0; i < greenArr.length; i++) {
        scene.add(greenArr[i]);
      }
    }    
  }

  if (groundGuiControls.show_Path == false) {
    for (var i = 0; i < pathArr.length; i++) {
      scene.remove(pathArr[i]);
    }
  } else {
    if(genGuiControls.hide_Ground==false){
      for (var i = 0; i < pathArr.length; i++) {
        scene.add(pathArr[i]);
      }
    }
  }

  if (groundGuiControls.show_Intx === false) {
    for (var i = 0; i < intxArr.length; i++) {
      scene.remove(intxArr[i]);
    }
  } else {
    if(genGuiControls.hide_Ground==false){
      for (var i = 0; i < intxArr.length; i++) {
        scene.add(intxArr[i]);
      }
    }
  }

  if (groundGuiControls.show_MST === false) {
    for (var i = 0; i < mstArr.length; i++) {
      scene.remove(mstArr[i]);
    }
  } else {
    if(genGuiControls.hide_Ground==false){
      for (var i = 0; i < mstArr.length; i++) {
        scene.add(mstArr[i]);
      }
    }
  }

  if (groundGuiControls.show_Road == false) {
    for (var i = 0; i < roadArr.length; i++) {
      scene.remove(roadArr[i]);
    }
  } else {
    if(genGuiControls.hide_Ground==false){
      for (var i = 0; i < roadArr.length; i++) {
        scene.add(roadArr[i]);
      }
    }
  }

  if(genGuiControls.hide_Ground==true){
    for (var i = 0; i < greenArr.length; i++) {
      scene.remove(greenArr[i]);
    }
    for (var i = 0; i < pathArr.length; i++) {
      scene.remove(pathArr[i]);
    }
    for (var i = 0; i < roadArr.length; i++) {
      scene.remove(roadArr[i]);
    }
    for (var i = 0; i < intxArr.length; i++) {
      scene.remove(intxArr[i]);
    }
    for (var i = 0; i < evacArr.length; i++) {
      scene.remove(evacArr[i]);
    }
    for (var i = 0; i < mstArr.length; i++) {
      scene.remove(mstArr[i]);
    }
  }
  
  if (
    bldgGuiControls.show_GCN == true &&
    genGuiControls.hide_Buildings == false
  ) {
    for (var i = 0; i < GCNCubeArr.length; i++) {
      scene.add(GCNCubeArr[i]);
    }
  } else {
    for (var i = 0; i < GCNCubeArr.length; i++) {
      scene.remove(GCNCubeArr[i]);
    }
  }

  if (
    bldgGuiControls.show_NCN == true &&
    genGuiControls.hide_Buildings == false
  ) {
    for (var i = 0; i < NCNCubeArr.length; i++) {
      scene.add(NCNCubeArr[i]);
    }
  } else {
    for (var i = 0; i < NCNCubeArr.length; i++) {
      scene.remove(NCNCubeArr[i]);
    }
  }

  if (
    bldgGuiControls.show_RCN == true &&
    genGuiControls.hide_Buildings == false
  ) {
    for (var i = 0; i < RCNCubeArr.length; i++) {
      scene.add(RCNCubeArr[i]);
    }
  } else {
    for (var i = 0; i < RCNCubeArr.length; i++) {
      scene.remove(RCNCubeArr[i]);
    }
  }

  if (
    bldgGuiControls.show_Evacuation == true &&
    genGuiControls.hide_Buildings == false
  ) {
    for (var i = 0; i < evacArr.length; i++) {
      scene.add(evacArr[i]);
    }
  } else {
    for (var i = 0; i < evacArr.length; i++) {
      scene.remove(evacArr[i]);
    }
  }

  if (genGuiControls.show_Information == false) {
    infoPara.hidden = true;
  } else {
    infoPara.hidden = false;
  }

  if (genGuiControls.show_Network == true) {
    for (var i = 0; i < nodeArr.length; i++) {
      scene.add(nodeArr[i]);
    }
    for (var i = 0; i < edgeArr.length; i++) {
      scene.add(edgeArr[i]);
    }
  } else {
    for (var i = 0; i < nodeArr.length; i++) {
      scene.remove(nodeArr[i]);
    }
    for (var i = 0; i < edgeArr.length; i++) {
      scene.remove(edgeArr[i]);
    }
  }

  if (gridGuiControls.show_Grid == true) {
    for (var i = 0; i < gridArr.length; i++) {
      scene.add(gridArr[i]);
    }
  } else {
    for (var i = 0; i < gridArr.length; i++) {
      scene.remove(gridArr[i]);
    }
  }
  requestAnimationFrame(mainLoop);
  controls.update();
  render();
};

var render = function() {
  renderer.render(scene, camera);
};

init();
mainLoop();
