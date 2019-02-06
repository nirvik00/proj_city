/* GUI variables
* gridLe
* gridWi
* gridHi
*/
var datgui= new dat.GUI({ autoPlace: false });
var guiControls=new function(){
  this.numL=2;
  this.numH=2;
  this.gridL=2.5;
  this.gridH=2.5;
  
  this.evacuation_density=0.05;
  
  this.ratio_Road=0.25;
  this.ratio_Path=0.50;
  this.ratio_Green=0.25;
  
  this.FSRRes=0.3;
  this.FSRComm=0.3;
  this.FSROffice=0.3;
  
  this.minHt=3;
  this.midHt=7;
  this.maxHt=20;
  
  this.ratio_Res_Comm=0.3;
  this.ratio_Comm_Off=0.3;
  this.ratio_Off_Res=0.3;
  
  this.autoLoop=false;
  
  this.show_OnlyGround=false;
  
  this.show_Road=true;
  this.show_Green=true;
  this.show_Path=true;
  
  this.show_Evacuation=true;
  this.show_Residences=true;
  this.show_Commercial=true;
  this.show_Office=true;
  
  this.show_Information=false;
}
datgui.add(guiControls, "numL", 1, 5);
datgui.add(guiControls, "numH", 1, 5);
datgui.add(guiControls, "gridL", 1, 5);
datgui.add(guiControls, "gridH", 1, 5);

datgui.add(guiControls, "evacuation_density", .001, 0.1);


datgui.add(guiControls, "ratio_Road", 0.1,1);
datgui.add(guiControls, "ratio_Path", 0.1,1);
datgui.add(guiControls, "ratio_Green", 0.1,1);

datgui.add(guiControls, "FSRRes", 0.1,3);
datgui.add(guiControls, "FSRComm", 0.1,3);
datgui.add(guiControls, "FSROffice", 0.1,3);

datgui.add(guiControls, "minHt",1,5);
datgui.add(guiControls, "midHt",5,12);
datgui.add(guiControls, "maxHt",12,25);

datgui.add(guiControls, "autoLoop");

datgui.add(guiControls, "show_OnlyGround");

datgui.add(guiControls, "show_Green");
datgui.add(guiControls, "show_Road");
datgui.add(guiControls, "show_Path");

datgui.add(guiControls, "show_Evacuation");
datgui.add(guiControls, "show_Residences");
datgui.add(guiControls, "show_Commercial");
datgui.add(guiControls, "show_Office");
datgui.add(guiControls, "show_Information");


var customContainer = document.getElementById('moveGUI');
customContainer.appendChild(datgui.domElement);




// generate the grids
var genGrid = function() {
  var axes = new THREE.AxesHelper(5);
  scene.add(axes);
  for (var i = 0; i < gridArr.length; i++) {
    gridArr[i].geometry.dispose();
    gridArr[i].material.dispose();
    scene.remove(gridArr[i]);
  }
  ptArr = new Array();
  cellQuadArr = new Array();
  gridArr = new Array();
  var a = guiControls.gridL;
  var c = guiControls.gridH;
  var numL=guiControls.numL;
  var numH=guiControls.numH;
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
   // scene.add(gridArr[i]);
  }
  genCubes();
  constructPassage();
};

//generate the cubes
var genCubes = function() {
  var a = guiControls.gridL;
  var c = guiControls.gridH;
  
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
  resCubeArr=Array();
  commCubeArr=Array();
  officeCubeArr=Array();
  
  for (var i = 0; i < cellQuadArr.length; i++) {
    var deci= new CubeDecisions();
    var numLayers=deci.getNumLayers();
    var type= deci.getType();    
    var maxHt=deci.getMaxHt();
    var quad=cellQuadArr[i];   
    var MK=new makeBuildings(quad, numLayers, type, maxHt);MK.genBuilding();
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

//generate the passage
var constructPassage = function() {
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
  var w = (guiControls.gridL - 1) / 2;
  var t = (guiControls.gridH - 1) / 2;

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
    var I = new nsPt(e.x, 0, e.z - t);
    var j = new nsPt(f.x, 0, f.z - t);
    var k = new nsPt(f.x + w, 0, f.z);
    var l = new nsPt(g.x + w, 0, g.z);
    var m = new nsPt(g.x, 0, g.z + t);
    var n = new nsPt(h.x, 0, h.z + t);
    var o = new nsPt(h.x - w, 0, h.z);
    var p = new nsPt(e.x - w, 0, e.z);

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
    var t = Math.random();
    var name;
    if (t < 0.35) {
      name = "road";
    } else if(t>0.35 && t<0.75){
      name = "path";
    } else{
      name = "green";
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
