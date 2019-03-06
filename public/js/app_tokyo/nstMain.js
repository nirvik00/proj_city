var wireframeVal=false;
var ALLJSONOBJS=[];
var nodeArr=[];
var edgeArr=[];
var parkArr=[];
var networkEdgesArr=[];
var networkNodesArr=[];
var parkObjArr=[];
var bldgObjArr=[];



var scene3d = document.getElementById("scene3d");
var infoPara = document.getElementById("information");
var camera, scene, renderer, control, axes;

var init = function() {
       scene = new THREE.Scene();
       scene.background = new THREE.Color("rgb(255,255,255)");
     
       camera = new THREE.PerspectiveCamera(
         40,
         window.innerWidth / window.innerHeight,
         1,
         1000
       );
       camera.position.x = 0;
       camera.position.y = 0;
       camera.position.z = 50;
       renderer = new THREE.WebGLRenderer({ antialias: true });
       renderer.setSize(window.innerWidth, window.innerHeight);
       scene3d.appendChild(renderer.domElement);
       axes = new THREE.AxesHelper(5);
       scene.add(axes);
       controls = new THREE.OrbitControls(camera, renderer.domElement);
       controls.addEventListener("change", render);
       controls.enableZoom = true;
       window.addEventListener( 'resize', onWindowResize, false );
};

function onWindowResize() {
       camera.aspect = window.innerWidth / window.innerHeight;
       camera.updateProjectionMatrix();
       renderer.setSize(window.innerWidth, window.innerHeight);
}

var mainLoop = function() {
       requestAnimationFrame(mainLoop);
       controls.update();
       render();
};
   
var render = function() {
       renderer.render(scene, camera);
};

var getData=function(allobjs){
       ALLJSONOBJS=allobjs;
       initNetwork(ALLJSONOBJS);
}

init();
mainLoop();