var scene3d = document.getElementById("scene3d");
var infoPara = document.getElementById("information");

var camera, scene, renderer, control;
var ITERATION = 1;var COUNTER = 0;
var wireframeVal = false;

var costResRes;
var costResComm;
var costCommComm;
var costOfficeRes;
var costOfficeComm;
var costOfficeOffice;

var networkNodesArr = [];
var networkEdgesArr = [];
var tempNetworkEdgesArr = Array();
var nodeArr = Array(); //network mesh of nodes
var edgeArr = Array(); //network mesh of node-edges
var greenEdgeArr=Array(); //network mesh of green edge


var gridArr = Array();
var evacArr = Array();
var resCubeArr = Array();
var commCubeArr = Array();
var officeCubeArr = Array();
var cellQuadArr = Array();
var pathArr = Array();
var roadArr = Array();
var greenArr = Array();
var groundArr = Array();

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

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render);
  controls.enableZoom = true;
  genGrid();
  constructGroundTiles(true);
};

document.addEventListener("keypress", function(event) {
  if (event.keyCode === 13) {
    //ENTER key event
    console.log("optimize iteration: (ENTER)" + COUNTER);
    //typeNode, typeEdge
    findMinCost("res", "green");
    findMinCost("office", "road");
    genCubes();
    constructGroundTiles(false);
    cellQuadsAlignment();
    
    var source = infoPara.innerHTML;
    source += "\noptimize: " + COUNTER;
    infoPara.innerHTML = source;    
    COUNTER++;
  }
  if (event.keyCode === 32) {
    //SPACE key event
    console.log("new iteration: (SPACE) " + ITERATION);
    genGrid();
    genCubes();
    constructGroundTiles(true);
    
    var source = infoPara.innerHTML;
    source += "\nnew Iteration " +   ITERATION;
    infoPara.innerHTML = source;    
    ITERATION++;
    COUNTER=0;
  }
});

var mainLoop = function() {
  varCellNumLe = gridGuiControls.num_Length;
  varCellNumDe = gridGuiControls.num_Depth;
  varCellLe = gridGuiControls.cell_Length;
  varCellDe = gridGuiControls.cell_Depth;

  costResRes = groundGuiControls.cost_Res_Res;
  costResComm = groundGuiControls.cost_Res_Comm;
  costCommComm = groundGuiControls.cost_Comm_Comm;
  costOfficeRes = groundGuiControls.cost_Office_Res;
  costOfficeComm = groundGuiControls.cost_Office_Comm;
  costOfficeOffice = groundGuiControls.cost_Office_Office;

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

  if (genGuiControls.AUTOLOOP == true) {
    genGrid();
  }

  if (groundGuiControls.show_Green == false) {
    for (var i = 0; i < greenArr.length; i++) {
      scene.remove(greenArr[i]);
    }
  } else {
    if(genGuiControls.hide_Ground==false){
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
  }
  
  if (
    bldgGuiControls.show_Residences == true &&
    genGuiControls.hide_Buildings == false
  ) {
    for (var i = 0; i < resCubeArr.length; i++) {
      scene.add(resCubeArr[i]);
    }
  } else {
    for (var i = 0; i < resCubeArr.length; i++) {
      scene.remove(resCubeArr[i]);
    }
  }

  if (
    bldgGuiControls.show_Commercial == true &&
    genGuiControls.hide_Buildings == false
  ) {
    for (var i = 0; i < commCubeArr.length; i++) {
      scene.add(commCubeArr[i]);
    }
  } else {
    for (var i = 0; i < commCubeArr.length; i++) {
      scene.remove(commCubeArr[i]);
    }
  }

  if (
    bldgGuiControls.show_Office == true &&
    genGuiControls.hide_Buildings == false
  ) {
    for (var i = 0; i < officeCubeArr.length; i++) {
      scene.add(officeCubeArr[i]);
    }
  } else {
    for (var i = 0; i < officeCubeArr.length; i++) {
      scene.remove(officeCubeArr[i]);
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
