var wireframeVal=false;
var ALLJSONOBJS=[];
var nodeArr=[];
var edgeArr=[];
var parkArr=[];
var parkOutLineArr=[];
var bldgArr=[];
var bldgOutLineArr=[];
var networkEdgesArr=[];
var networkNodesArr=[];
var parkObjArr=[];
var bldgObjArr=[];

var scene3d = document.getElementById("scene3d");
var infoPara = document.getElementById("information");
var camera, scene, renderer, control, axes;

var raycaster;
var mouse = new THREE.Vector2();

var init = function() {
       scene = new THREE.Scene();
       scene.background = new THREE.Color("rgb(255,255,255)");
     
       camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
       // position and point the camera to the center of the scene
       camera.position.x = 0;
       camera.position.y = 0;
       camera.position.z = 43;
       //camera.rotation.x=Math.PI/6;
       camera.lookAt(scene.position);

       renderer = new THREE.WebGLRenderer({ antialias: true });
       renderer.setSize(window.innerWidth, window.innerHeight);

       scene3d.appendChild(renderer.domElement);

       axes = new THREE.AxesHelper(5);
       scene.add(axes);

       raycaster = new THREE.Raycaster();

       controls = new THREE.OrbitControls(camera, renderer.domElement);
       controls.addEventListener("change", render);
       controls.enableZoom = true;
       // horizontally angle control
       controls.minAzimuthAngle = 0;// -Math.PI / 10;
       controls.maxAzimuthAngle = 0;// Math.PI / 10;
       
       // vertical angle control
       //controls.minPolarAngle = -Math.PI / 10;
       //controls.maxPolarAngle = Math.PI / 10;
       document.addEventListener( 'mousedown', onDocumentMouseDown, false );
       window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
       camera.aspect = window.innerWidth / window.innerHeight;
       camera.updateProjectionMatrix();
       renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseDown( event ) {
       event.preventDefault();
       mouse.x= (event.clientX/window.innerWidth)*2 - 1;
       mouse.y=-(event.clientY/window.innerHeight)*2 + 1;
}


var mainLoop = function() {
       requestAnimationFrame(mainLoop);
       controls.update();
       render();
}
   
var render = function() {
       // find intersections
       raycaster.setFromCamera( mouse, camera );

       // calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( scene.children );
	for ( var i = 0; i < intersects.length; i++ ) {
		intersects[ i ].object.material.color.set( 0xff0000 );
	}
       renderer.render(scene, camera);
}

var getData=function(allobjs){
       ALLJSONOBJS=allobjs;
       initNetwork(ALLJSONOBJS);
}

init();
mainLoop();