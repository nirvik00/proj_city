var wireframeVal=false;
var ALLJSONOBJS=[];
var networkEdgesArr=[];//object
var networkNodesArr=[];//object
var nodeArr=[];//render object
var edgeArr=[];//render object
var parkObjArr=[];//object
var parkArr=[];//render object
var bldgObjArr=[];//object
var bldgArr=[];//rendered object
var sceneObjs=[];//raycaster intersection with object



var scene3d = document.getElementById("scene3d");
var infoPara = document.getElementById("information");

var camera, scene, renderer, control, axes, stats;

var raycaster,INTERSECTED;
var raycasterLine;
var intersects;
var mouse;
var isShiftDown=false;
var mouse = new THREE.Vector2();

var init = function() {
       //container = document.createElement('mydiv');
       //document.body.appendChild(container);

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
       stats = new Stats();
       scene3d.appendChild(stats.dom);

       axes = new THREE.AxesHelper(5);
       scene.add(axes);

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
       }
}

function onDocumentMouseMove( event ) {
       event.preventDefault();
       
       mouse.x= (event.clientX/window.innerWidth)*2 - 1;
       mouse.y=-(event.clientY/window.innerHeight)*2 + 1;

       //mouse.x = ( (event.clientX -renderer.domElement.offsetLeft) / renderer.domElement.width ) * 2 - 1;
       //mouse.y = -( (event.clientY - renderer.domElement.offsetTop) / renderer.domElement.height ) * 2 + 1;

       if(isShiftDown===true){
              //drawRaycastLine(raycaster);
              raycaster.setFromCamera(mouse, camera);// find intersections
              intersects = raycaster.intersectObjects( scene.children );// calculate objects intersecting the picking ray
              for ( var i = 0; i < intersects.length; i++ ) {
                     if(intersects[i].faceIndex===null){

                     }else{
                            if(intersects[i].distance<2){
                                   //console.log(intersects[i].object);
                                   var g=intersects[i].object.position;
                                   var pos=new nsPt(g.x,g.y,g.z);
                                   intersects[i].object.material.color.set(new THREE.Color("rgb(200,0,0)"));
                                   for(var j=0; j<bldgObjArr.length; j++){
                                          var e=bldgObjArr[j].renderedObject.position;
                                          var pos2=new nsPt(e.x,e.y,e.z);
                                          var di=utilDi(pos, pos2);
                                          if(di<1){
                                                 //console.log(bldgObjArr[j]);
                                                 var objInfo=bldgObjArr[j].info();
                                                 //console.log(objInfo);
                                                 var source = infoPara.innerHTML;
                                                 source = objInfo;
                                                 infoPara.innerHTML = source;  
                                                 break;
                                          }
                                   }
                                   for(var j=0; j<parkObjArr.length; j++){
                                          var e=parkObjArr[j].renderedObject.position;
                                          var pos2=new nsPt(e.x,e.y,e.z);
                                          var di=utilDi(pos, pos2);
                                          if(di<1){
                                                 //console.log(bldgObjArr[j]);
                                                 var objInfo=parkObjArr[j].info();
                                                 //console.log(objInfo);
                                                 var source = infoPara.innerHTML;
                                                 source = objInfo;
                                                 infoPara.innerHTML = source;  
                                                 break;
                                          }
                                   }
                                   for(var j=0; j<networkNodesArr.length; j++){
                                          var e=networkNodesArr[j].renderedObject.position;
                                          var pos2=new nsPt(e.x,e.y,e.z);
                                          var di=utilDi(pos, pos2);
                                          if(di<1){
                                                 //console.log(bldgObjArr[j]);
                                                 var objInfo=networkNodesArr[j].info();
                                                 //console.log(objInfo);
                                                 var source = infoPara.innerHTML;
                                                 source = objInfo;
                                                 infoPara.innerHTML = source;  
                                                 break;
                                          }
                                   }
                            }                            
                     }                     
              }              
       }
       /*
       var sortableX = new Array();
       for (var i = 0; i < iniNodes.length; i++) {
         sortableX.push([iniNodes[i].x, iniNodes[i].z]);
       }
       sortableX.sort(function(a, b) {
         return a[0] - b[0];
       });
       */
}


var mainLoop = function() {
       requestAnimationFrame(mainLoop);
       controls.update();
       stats.update();
       render();
}
   
var render = function() {
       renderer.render(scene, camera);
}

var getData=function(allobjs){
       ALLJSONOBJS=allobjs;
       initNetwork(ALLJSONOBJS);
}

init();
mainLoop();