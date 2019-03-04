var scene3d = document.getElementById("scene3d");
var infoPara = document.getElementById("information");
var camera, scene, renderer, control, axes;

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
       scene.add(axes);
       controls = new THREE.OrbitControls(camera, renderer.domElement);
       controls.addEventListener("change", render);
       controls.enableZoom = true;
       //runSystem();
     };
     
var mainLoop = function() {
       requestAnimationFrame(mainLoop);
       controls.update();
       render();
};
   
var render = function() {
       renderer.render(scene, camera);
};
   
   init();
   mainLoop();