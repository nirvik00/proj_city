

var scene3d = document.getElementById("scene3d");
var infoPara = document.getElementById("information");

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
}
var superBlockGui=datgui.addFolder("superBlockControls");
var bayDepth=superBlockGui.add(superBlockControls,"bay_depth",0.15,1.0);
var extDepth=superBlockGui.add(superBlockControls,"ext_depth",0.05,0.5);
var showDiags=superBlockGui.add(superBlockControls, "show_diags");
var showSegs=superBlockGui.add(superBlockControls, "show_segs");
var showQuads=superBlockGui.add(superBlockControls, "show_quads");
var showCells=superBlockGui.add(superBlockControls, "show_cells");
var showForms=superBlockGui.add(superBlockControls, "show_forms");

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

showNodes = datgui.add(genGuiControls, "show_Nodes");
showEdges = datgui.add(genGuiControls, "show_Edges");
var roadDepth=datgui.add(genGuiControls,"road_depth",0.05,0.35);
showParks = datgui.add(genGuiControls, "show_Parks");
showBldgs = datgui.add(genGuiControls, "show_Buildings");
showSites = datgui.add(genGuiControls, "show_Sites");
showAxes = datgui.add(genGuiControls, "show_Axis");
datgui.add(genGuiControls, "show_Information");

var customContainer = document.getElementById("moveGUI");
customContainer.appendChild(datgui.domElement);
datgui.close();
// END OF GUI

var wireframeVal=false;
var ALLJSONOBJS=[];
var networkEdgesArr=[]; // network edges object from db
var networkNodesArr=[]; // network nodes object from db
var nodeArr=[]; // network node render object from db
var edgeArr=[]; // network edge Line render object from db
var edgeMeshArr=[]; // network edge Mesh render object from db
var parkObjArr=[]; // park object from db
var parkArr=[]; // park render object from db
var bldgObjArr=[]; // bldg object from db
var bldgArr=[]; // bldg rendered object from db
var siteObjArr=[]; // site object from db
var siteArr=[]; // rendered site object from db

var siteSegArr=[]; // dynamic ->  segments from the diagonal to the site boundary
var siteQuadArr=[]; // dynamic -> site split into divs and construct quad from successive seg= Arr
var cellArr=[]; //dynamic ->  array of cells from the quad-> bays of the site
var siteDiagArr=[]; // dynamic -> rendered diags of site obj
var superBlockForms=[]; // dynamic -> rendered mesh for superblocks

// main functions about the generation
var camera, scene, renderer, control, axes, stats;

var sceneObjs=[]; // raycaster intersection with object
var raycaster,INTERSECTED;
var raycasterLine;
var intersects;
var mouse;
var isShiftDown=false;
var mouse = new THREE.Vector2();

var init = function() {
       scene = new THREE.Scene();
       scene.background = new THREE.Color("rgb(255,255,255)");
       raycaster = new THREE.Raycaster();
       camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
       // position and point the camera to the center of the scene
       camera.position.x = 0;
       camera.position.y = -20;
       camera.position.z = 20;
       camera.rotation.x=Math.PI/6;       
       addPointLights();
       renderer = new THREE.WebGLRenderer();
       renderer.setPixelRatio(window.devicePixelRatio);
       renderer.setSize(window.innerWidth, window.innerHeight);
       scene3d.appendChild(renderer.domElement);
       //stats = new Stats();
      // scene3d.appendChild(stats.dom);
       axes = new THREE.AxesHelper(5);
       //scene.add(axes);
       controls = new THREE.OrbitControls(camera, renderer.domElement);
       controls.addEventListener("change", render);
       controls.enableZoom = true;
       // horizontally angle control
       controls.minAzimuthAngle = 0;// -Math.PI / 10;
       controls.maxAzimuthAngle = 0;// Math.PI / 10;
       controls.zoomSpeed=4;
       // vertical angle control
       //controls.minPolarAngle = -Math.PI / 10;
       //controls.maxPolarAngle = Math.PI / 10;
       document.addEventListener( 'mousemove', onDocumentMouseMove, false );
       document.addEventListener('keydown', onDocumentKeyDown, false);
       document.addEventListener('keyup', onDocumentKeyUp, false);
       window.addEventListener( 'resize', onWindowResize, false );
}

function addPointLights(){
       var intensity = 0.5;
       var distance = 50;
       var decay = 2.0;
       var c1 = 0xcccccc  , c2 = 0xcccccc , c3 = 0xcccccc , c4 = 0xcccccc , c5 = 0xcccccc , c6 = 0xcccccc ;
       var sphere = new THREE.SphereBufferGeometry( 0.25, 1, 32 );

       light1 = new THREE.PointLight( c1, intensity, distance, decay );
       light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c1 } ) ) );
       light1.position.z=5;
       scene.add( light1 );

       light2 = new THREE.PointLight( c2, intensity, distance, decay );
       light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c2 } ) ) );
       light2.position.x=7;
       light2.position.y=-7;
       light2.position.z=5;
       scene.add( light2 );

       light3 = new THREE.PointLight( c3, intensity, distance, decay );
       light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c3 } ) ) );
       light3.position.y=10;
       light3.position.z=5;
       scene.add( light3 );

       light4 = new THREE.PointLight( c4, intensity, distance, decay );
       light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c4 } ) ) );
       light4.position.y=-7;
       light4.position.z=5;
       scene.add( light4 );

       light5 = new THREE.PointLight( c5, intensity, distance, decay );
       light5.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c5 } ) ) );
       light5.position.x=-7;
       light5.position.y=7;
       light5.position.z=5;
       scene.add( light5 );

       light6 = new THREE.PointLight( c6, intensity, distance, decay );
       light6.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c6 } ) ) );
       light6.position.x=-7;
       light6.position.y=-7;
       light6.position.z=5;
       scene.add( light6 );

       var dlight = new THREE.DirectionalLight( 0xffffff, 0.05 );
       dlight.position.set( 0.5, 10, 5 ).normalize();
       scene.add( dlight );
}

function onWindowResize() {
       camera.aspect = window.innerWidth / window.innerHeight;
       camera.updateProjectionMatrix();
       renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentKeyUp(event){
       if (event.keyCode===16){
              isShiftDown=false;
              //break;
       }
}

function onDocumentKeyDown(event){
       if(event.keyCode===16){
              isShiftDown=true;
              //break;
       }
       if(event.keyCode===82){
              console.clear();
              infoPara.innerHTML = "";
              genNetworkGeometry();
              genParkGeometry();
              genBldgGeometry();              
       }
}

function onDocumentMouseMove( event ) {
       event.preventDefault();
       
       mouse.x= (event.clientX/window.innerWidth)*2 - 1;
       mouse.y=-(event.clientY/window.innerHeight)*2 + 1;

       //mouse.x = ( (event.clientX -renderer.domElement.offsetLeft) / renderer.domElement.width ) * 2 - 1;
       //mouse.y = -( (event.clientY - renderer.domElement.offsetTop) / renderer.domElement.height ) * 2 + 1;

       if(isShiftDown===true){
              //genNetworkGeometry();
              var distFromSource=10;
              //drawRaycastLine(raycaster);
              raycaster.setFromCamera(mouse, camera);// find intersections
              intersects = raycaster.intersectObjects( scene.children );// calculate objects intersecting the picking ray
              for ( var i = 0; i < intersects.length; i++ ) {
                     //if(intersects[i].faceIndex===null){

                     //}else{
                            var SUM=0;
                            if(intersects[i].distance<distFromSource){
                                   //console.log(intersects[i].object);
                                   var g=intersects[i].object.position;
                                   var pos=new nsPt(g.x,g.y,g.z);
                                   intersects[i].object.material.color.set(new THREE.Color("rgb(200,0,0)"));
                                   for(var j=0; j<bldgObjArr.length; j++){
                                          var e=bldgObjArr[j].renderedObject.position;
                                          var pos2=new nsPt(e.x,e.y,e.z);
                                          var di=utilDi(pos, pos2);
                                          if(di<distFromSource){
                                                 INTERSECTED=bldgObjArr[j];
                                                 SUM++;
                                                 break;
                                          }
                                   }
                                   if(SUM>0){break;}
                                   for(var j=0; j<parkObjArr.length; j++){
                                          var e=parkObjArr[j].renderedObject.position;
                                          var pos2=new nsPt(e.x,e.y,e.z);
                                          var di=utilDi(pos, pos2);
                                          if(di<distFromSource){
                                                 INTERSECTED=bldgObjArr[j];
                                                 SUM++;
                                                 break;
                                          }
                                   }
                                   if(SUM>0){break;}
                                   for(var j=0; j<networkNodesArr.length; j++){
                                          var e=networkNodesArr[j].renderedObject.position;
                                          var pos2=new nsPt(e.x,e.y,e.z);
                                          var di=utilDi(pos, pos2);
                                          if(di<distFromSource){
                                                 INTERSECTED=bldgObjArr[j];
                                                 SUM++;
                                                 break;
                                          }
                                   }
                                   if(SUM>0){break;}
                            //}
                     }                     
              }              
       }
       //var objInfo=INTERSECTED.info();
       //var source = infoPara.innerHTML;
       //source = objInfo;
       //infoPara.innerHTML = source;  
}

var mainLoop = function() {
       requestAnimationFrame(mainLoop);
       controls.update();
       //stats.update();
       guiUpdates();
       render();
}

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
   
var render = function() {
       renderer.render(scene, camera);
}

var getData=function(allobjs){
       ALLJSONOBJS=allobjs;
       initNetwork(ALLJSONOBJS);
       initGeometry(ALLJSONOBJS);
}

init();
mainLoop();