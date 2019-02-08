var scene3d=document.getElementById("scene3d");
var infoPara=document.getElementById("information");

var camera, scene, renderer, control;
var COUNTER=0;
var wireframeVal=false;

var networkNodesArr= Array();
var networkEdgesArr=Array();
var nodeArr=Array(); //mesh of nodes
var edgeArr=Array(); //mesh of node-edges

var gridArr=Array();  
var evacArr=Array();  
var resCubeArr=Array();
var commCubeArr=Array();
var officeCubeArr=Array();
var cellQuadArr=Array();
var pathArr=Array();
var roadArr=Array();
var greenArr=Array();
var groundArr=Array();


var init=function(){
  scene=new THREE.Scene();
  scene.background=new THREE.Color("rgb(255,255,255)");
  
  camera=new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 1, 1000);
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
    console.log("new iteration: "+COUNTER);
    COUNTER++;
    var source=infoPara.innerHTML;
    source+= "\nchange "+COUNTER;
    infoPara.innerHTML=source;
    genGrid();
  }
});

var mainLoop= function(){
  varCellNumLe=gridGuiControls.num_Length;
  varCellNumDe=gridGuiControls.num_Depth;
  varCellLe=gridGuiControls.cell_Length;
  varCellDe=gridGuiControls.cell_Depth;
  
  cellNumLe.onChange(function(){
    genGrid();  
  });
  
  cellNumDe.onChange(function(){
    genGrid();  
  });
    
  cellLe.onChange(function(){
    genGrid();  
  });
    
  cellDe.onChange(function(){
    genGrid();  
  });
  
  if(genGuiControls.AUTOLOOP==true){
    genGrid();  
  }  

  if(groundGuiControls.show_Green==false){
    for(var i=0; i<greenArr.length; i++){
      scene.remove(greenArr[i]);  
    }    
  }else{
    for(var i=0; i<greenArr.length; i++){
      scene.add(greenArr[i]);  
    }    
  }
    
  if(groundGuiControls.show_Path==false){
    for(var i=0; i<pathArr.length; i++){
      scene.remove(pathArr[i]);  
    }    
  }else{
    for(var i=0; i<pathArr.length; i++){
      scene.add(pathArr[i]);  
    }    
  }
      
  if(groundGuiControls.show_Road==false){
    for(var i=0; i<roadArr.length; i++){
      scene.remove(roadArr[i]);  
    }    
  }else{
    for(var i=0; i<roadArr.length; i++){
      scene.add(roadArr[i]);  
    }    
  }
  
  if(bldgGuiControls.show_Residences==true && groundGuiControls.show_Only_Ground==false){
    for(var i=0; i<resCubeArr.length; i++){
      scene.add(resCubeArr[i]);  
    }
  }else{
    for(var i=0; i<resCubeArr.length; i++){
      scene.remove(resCubeArr[i]);  
    }        
  }
  
  if(bldgGuiControls.show_Commercial==true && groundGuiControls.show_Only_Ground==false){
    for(var i=0; i<commCubeArr.length; i++){
      scene.add(commCubeArr[i]);  
    } 
  }else{
    for(var i=0; i<commCubeArr.length; i++){
      scene.remove(commCubeArr[i]);  
    }       
  }
  
  if(bldgGuiControls.show_Office==true && groundGuiControls.show_Only_Ground==false){
    for(var i=0; i<officeCubeArr.length; i++){
      scene.add(officeCubeArr[i]);  
    }    
  }else{
    for(var i=0; i<officeCubeArr.length; i++){
      scene.remove(officeCubeArr[i]);  
    }  
  }
  
  if(bldgGuiControls.show_Evacuation==true && groundGuiControls.show_Only_Ground==false){
    for(var i=0; i<evacArr.length; i++){
      scene.add(evacArr[i]);  
    }    
  }else{
    for(var i=0; i<evacArr.length; i++){
      scene.remove(evacArr[i]);  
    }  
  }
  
  if(genGuiControls.show_Information==false){
    infoPara.hidden=true;  
  } else{
    infoPara.hidden=false;  
  }
  
  if(gridGuiControls.show_Network==true){
    for(var i=0; i<nodeArr.length; i++){
      scene.add(nodeArr[i]);
    }
  } else{
    for(var i=0; i<nodeArr.length; i++){
      scene.remove(nodeArr[i]);
    }
  }
    
  if(gridGuiControls.show_Grid==true){
    for(var i=0; i<gridArr.length; i++){
      scene.add(gridArr[i]);
    }
  } else{
    for(var i=0; i<gridArr.length; i++){
      scene.remove(gridArr[i]);
    }
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

