var scene3d=document.getElementById("scene3d");
var infoPara=document.getElementById("information");

var camera, scene, renderer, control;
var COUNTER=0;
var wireframeVal=false;


var gridArr=Array();  
var cubeArr=Array();
var cellQuadArr=Array();
var pathArr=Array();


var init=function(){
  scene=new THREE.Scene();
  scene.background=new THREE.Color("rgb(255,255,255)");
  
  camera=new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 1, 1000);
  camera.lookAt(new THREE.Vector3(0,0,0));
  camera.position.x=10;
  camera.position.y=10;
  camera.position.z=10;

  renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  scene3d.appendChild(renderer.domElement);

  controls=new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);
  controls.enableZoom=true;
  genGrid();
}

document.addEventListener("keypress", function(event){
  if(event.keyCode===13){
    COUNTER++;
    var source=infoPara.innerHTML;
    source+= "\nchange "+COUNTER;
    infoPara.innerHTML=source;
    genGrid();
  }
});

var mainLoop= function(){
  if(guiControls.autoLoop==true){
    genGrid();  
  }  

  requestAnimationFrame(mainLoop);
  controls.update();
  render();
}

var render=function(){
  renderer.render(scene, camera);
}

init();
mainLoop();

