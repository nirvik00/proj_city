//data gui 

//gui variables
var showNodes=true; //global visibility of network nodes
var showEdges=true; //global visibility of network edges
var showParks=false; //global visibility of parks
var showBldgs=false; //global visibility of buildings
var showSites=false; //global visibility of sites

var showDivisions=false; //superblock visibility of site divisions


// START OF GUI
var datgui = new dat.GUI({ autoPlace: false });

var superBlockControls=new function(){
       this.bay_depth=0.5;
       this.ext_depth=0.2;       
       this.show_diags=false;
       this.show_segs=false;
       this.show_quads=false;
       this.show_cells=false;
       this.show_forms=false;
       this.park_density=0.5;
       this.park_spread=0.2
}
var superBlockGui=datgui.addFolder("superBlockControls");
var bayDepth=superBlockGui.add(superBlockControls,"bay_depth",0.15,1.0);
var extDepth=superBlockGui.add(superBlockControls,"ext_depth",0.05,0.5);
var showDiags=superBlockGui.add(superBlockControls, "show_diags");
var showSegs=superBlockGui.add(superBlockControls, "show_segs");
var showQuads=superBlockGui.add(superBlockControls, "show_quads");
var showCells=superBlockGui.add(superBlockControls, "show_cells");
var showForms=superBlockGui.add(superBlockControls, "show_forms");
var parkDensity=superBlockGui.add(superBlockControls, "park_density");
var parkSpread=superBlockGui.add(superBlockControls, "park_spread");

var genGuiControls = new function() {
  this.show_Nodes = false;
  this.road_depth=0.1;
  this.show_Edges = true;
  this.show_Parks = false;
  this.show_Buildings = false;
  this.show_Sites=false;
  this.show_Axis = true;
  this.show_Information = false;
}
var dbGuiControls=datgui.addFolder("genGuiControls");
showNodes = dbGuiControls.add(genGuiControls, "show_Nodes");
showEdges = dbGuiControls.add(genGuiControls, "show_Edges");
var roadDepth=dbGuiControls.add(genGuiControls,"road_depth",0.05,0.35);
showParks = dbGuiControls.add(genGuiControls, "show_Parks");
showBldgs = dbGuiControls.add(genGuiControls, "show_Buildings");
showSites = dbGuiControls.add(genGuiControls, "show_Sites");
showAxes = dbGuiControls.add(genGuiControls, "show_Axis");
dbGuiControls.add(genGuiControls, "show_Information");

var customContainer = document.getElementById("moveGUI");
customContainer.appendChild(datgui.domElement);
datgui.close();
// END OF GUI

// gui update functions
function guiUpdates(){
    if (genGuiControls.show_Information == false) {
           infoPara.hidden = true;
         } else {
           infoPara.hidden = false;
    }

    // gen gui controls
    if(genGuiControls.show_Axis===true){ 
           scene.add(axes); 
    }else{
           scene.remove(axes); 
    }

    if(genGuiControls.show_Nodes===true){
           for (var i = 0; i < nodeArr.length; i++) {
                  scene.add(nodeArr[i]);
           }
    }else{
           for (var i = 0; i < nodeArr.length; i++) {
                  scene.remove(nodeArr[i]);
           }   
    }

    if(genGuiControls.show_Edges===true){
           for (var i = 0; i < edgeArr.length; i++) {
                  scene.add(edgeArr[i]);
           }
           for (var i=0; i<edgeMeshArr.length ; i++){
                  scene.add(edgeMeshArr[i]);
           }
    }else{
           for (var i = 0; i < edgeArr.length; i++) {
                  scene.remove(edgeArr[i]);
           }   
           for(var i=0; i<edgeMeshArr.length; i++){
                  scene.remove(edgeMeshArr[i]);
           }
    }

    roadDepth.onChange(function(value){
           for (var i = 0; i < edgeMeshArr.length; i++) {
                  edgeMeshArr[i].geometry.dispose();
                  edgeMeshArr[i].material.dispose();
                  scene.remove(edgeMeshArr[i]);
           }
           edgeMeshArr = Array();  
           console.log(networkEdgesArr.length);
           for(var i=0; i<networkEdgesArr.length; i++){
                  networkEdgesArr[i].getMeshObj(value);
           }
           for (var i=0; i<edgeMeshArr.length ; i++){
                  scene.add(edgeMeshArr[i]);
           }
    });

    if(genGuiControls.show_Parks===true){
           for(var i=0; i<parkArr.length; i++){
                  scene.add(parkArr[i]);
           }
    }else{
           for(var i=0; i<parkArr.length; i++){
                  scene.remove(parkArr[i]);
           }
    }
    
    if(genGuiControls.show_Buildings===true){
           for(var i=0; i<bldgArr.length; i++){
                  scene.add(bldgArr[i]);
           }
    }else{
           for(var i=0; i<bldgArr.length; i++){
                  scene.remove(bldgArr[i]);
           }
    }

    showSites.onChange(function(){
           genSiteGeometry();
    });

    // super block controls
    bayDepth.onChange(function(){                          
           genDynamicFunc();
    });

    extDepth.onChange(function(){                          
           genDynamicFunc();
    });

    if(superBlockControls.show_quads===true){
           for(var i=0; i<siteQuadArr.length;i++){
                  scene.add(siteQuadArr[i][0]);
                  scene.add(siteQuadArr[i][1]);
                  scene.add(siteQuadArr[i][2]);  
           }
    }else{
           for (var i=0; i<siteQuadArr.length; i++){
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
    }

    if(superBlockControls.show_segs===true){
           for(var i=0; i<siteSegArr.length;i++){
                  scene.add(siteSegArr[i]);
           }
    }else{
           for(var i=0; i<siteSegArr.length;i++){
                  scene.remove(siteSegArr[i]);
           }
    }

    if(superBlockControls.show_diags===true){
           for(var i=0; i<siteDiagArr.length;i++){
                  scene.add(siteDiagArr[i]);
           }
    }else{
           for(var i=0; i<siteDiagArr.length;i++){
                  scene.remove(siteDiagArr[i]);
           }
    }

    if(superBlockControls.show_cells===true){
           for(var i=0; i<cellArr.length;i++){
                  scene.add(cellArr[i][0]);
                  scene.add(cellArr[i][1]);
                  scene.add(cellArr[i][2]);  
           } 
    }else{
           for(var i=0; i<cellArr.length; i++){
                  var quad=cellArr[i][0];
                  var L1=cellArr[i][1];
                  var L2=cellArr[i][2];
                  quad.geometry.dispose();
                  quad.material.dispose();
                  scene.remove(quad);
                  L1.geometry.dispose();
                  L1.material.dispose();
                  scene.remove(L1);
                  L2.geometry.dispose();
                  L2.material.dispose();
                  scene.remove(L2);
           }
    }

    if(superBlockControls.show_forms===false){
           for(var i=0; i<superBlockForms.length; i++){
                  scene.remove(superBlockForms[i]);
           }
    }else{
           for(var i=0; i<superBlockForms.length; i++){
                  scene.add(superBlockForms[i]);
           }
    }    
}
