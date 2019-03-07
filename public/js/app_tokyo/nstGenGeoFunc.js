// GUI

// res = GCN
// comm = NCN
// office= RCN
/*
var varCellNumLe = 2;
var varCellNumDe = 2;
var varCellLe = 5.0;
var varCellDe = 3.0;
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
  this.cell_Length = 5;
  this.cell_Depth = 2.5;
  this.GCN_Centrality=0.33;
  this.NCN_Centrality=0.33;
  this.RCN_Centrality=0.33;
  this.random_distribution=false;
  this.show_Grid = false;
  this.show_GCN=true;
  this.show_RCN=true;
  this.show_NCN=true;
  this.show_MST=true;
  this.show_EVAC=true;
}
var cellGUI = datgui.addFolder("gridGuiControls");
var cellNumLe = cellGUI.add(gridGuiControls, "num_Length", 1, 5);
var cellNumDe = cellGUI.add(gridGuiControls, "num_Depth", 1, 5);
var cellLe = cellGUI.add(gridGuiControls, "cell_Length", 2.5, 7);
var cellDe = cellGUI.add(gridGuiControls, "cell_Depth", 2.5, 7);

cellGUI.add(gridGuiControls, "GCN_Centrality",0.0,1);
cellGUI.add(gridGuiControls, "NCN_Centrality",0.0,1);
cellGUI.add(gridGuiControls, "RCN_Centrality",0.0,1);
cellGUI.add(gridGuiControls, "random_distribution");
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
}
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
  this.Bldg_HT = 0.25;
  this.global_offset = 0.5;  
  this.GCN_FSR = 0.3;
  this.NCN_FSR = 0.3;
  this.RCN_FSR = 0.3;
  this.EVAC_FSR = 0.1;
  this.GCN_setback=0.1;
  this.NCN_setback=0.12;
  this.RCN_setback=0.25;
  this.show_Evacuation = true;
  this.show_GCN = true;
  this.show_NCN = true;
  this.show_RCN = true;
};

var buildingGUI = datgui.addFolder("bldgGuiControls");
buildingGUI.add(bldgGuiControls, "Bldg_HT", 0.1, 1.0);
var varGlobalOffset = buildingGUI.add(bldgGuiControls, "global_offset", 0.1, 1);
buildingGUI.add(bldgGuiControls, "GCN_FSR", 0.0, 1);
buildingGUI.add(bldgGuiControls, "NCN_FSR", 0.0, 1);
buildingGUI.add(bldgGuiControls, "RCN_FSR", 0.0, 1);
buildingGUI.add(bldgGuiControls, "EVAC_FSR", 0.0, 1);
buildingGUI.add(bldgGuiControls, "GCN_setback", 0.0, 1);
buildingGUI.add(bldgGuiControls, "NCN_setback", 0.0, 1);
buildingGUI.add(bldgGuiControls, "RCN_setback", 0.0, 1);
buildingGUI.add(bldgGuiControls, "show_Evacuation");
buildingGUI.add(bldgGuiControls, "show_GCN");
buildingGUI.add(bldgGuiControls, "show_NCN");
buildingGUI.add(bldgGuiControls, "show_RCN");
varGlobalOffset = bldgGuiControls.global_offset;
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
*/
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
}

function utilDi(a, b) {
  return Math.sqrt(
    (a.x - b.x) * (a.x - b.x) +
      (a.y - b.y) * (a.y - b.y) +
      (a.z - b.z) * (a.z - b.z)
  );
}



