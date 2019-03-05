var ALLJSONOBJS=[];
var NODEARR=[];
var EDGEARR=[];

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
     };
     
var mainLoop = function() {
       requestAnimationFrame(mainLoop);
       controls.update();
       render();
};
   
var render = function() {
       renderer.render(scene, camera);
       if(NODEARR.length>0){
              for(var i=0; i<NODEARR.length; i++){
                     scene.add(NODEARR);
              }       
       }       
};

var getData=function(allobjs){
       ALLJSONOBJS=allobjs;
       //console.log("got the data!!!!");
       //console.log(ALLJSONOBJS);
       var nodeArr=[];
       var edgeArr=[];
       for(var i=0; i<ALLJSONOBJS.length; i++){
              obj=ALLJSONOBJS[i];
              if(obj.element_type==="node"){
                     nodeArr[i]=obj;
              }else if(obj.element_type==="edge"){
                     edgeArr[i]=obj;
              }
       }
       console.log("node array = ");
       for(var i=0; i<nodeArr.length; i++){
              console.log(nodeArr[i]);
       }
       console.log("edge array = ");
       for(var i=0; i<edgeArr.length; i++){
              console.log(edgeArr[i]);
       }
}

init();
mainLoop();