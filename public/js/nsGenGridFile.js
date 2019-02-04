var genGrid =function(){
  var axes=new THREE.AxesHelper(5);
  scene.add(axes);
  for(var i=0; i<gridArr.length; i++){
    gridArr[i].geometry.dispose();
    gridArr[i].material.dispose();
    scene.remove(gridArr[i]);
  }
  ptArr=new Array();
  cellQuadArr=new Array();
  gridArr=new Array();
  var a=guiControls.gridL;
  var c=guiControls.gridH;
  for(var i=-5; i<5; i++){
    for(var j=-5; j<5; j++){
      var p=new THREE.Geometry();
      p.vertices.push(new THREE.Vector3(0,0,0));
      p.vertices.push(new THREE.Vector3(a,0,0));
      p.vertices.push(new THREE.Vector3(a,0,c));
      p.vertices.push(new THREE.Vector3(0,0,c));
      p.faces.push(new THREE.Face3(0,1,2));
      p.faces.push(new THREE.Face3(0,3,2));
      var mat=new THREE.MeshBasicMaterial({color:new THREE.Color("rgb(255,0,0)"), side:THREE.DoubleSide, wireframe:true});
      var mesh=new THREE.Mesh(p, mat);
      mesh.position.x=i*a;
      mesh.position.z=j*c;
      gridArr.push(mesh); 
      
      var nspt=new nsPt(i*a,0,j*c);
      ptArr.push(nspt);
      
      var p0=new nsPt(i*a,0,j*c);      
      var p1=new nsPt(i*a + a,0,j*c);      
      var p2=new nsPt(i*a + a,0,j*c + c);      
      var p3=new nsPt(i*a,0,j*c + c);      
      cellQuadArr.push(new nsQuad(p0,p1,p2,p3));
    }
  }

  for(var i=0; i<gridArr.length; i++){
    scene.add(gridArr[i]);
  }
  
  genCubes(ptArr,a,c);
}

var genCubes=function(ptArr,a,c){
  for(var i=0; i<cubeArr.length; i++){
    cubeArr[i].geometry.dispose();
    cubeArr[i].material.dispose();
    scene.remove(cubeArr[i]);
  }
  cubeArr=Array();
  for(var i=0; i<cellQuadArr.length; i++){
    var p=cellQuadArr[i].mp();
    var t=Math.random()*4;
    var geo=new THREE.BoxGeometry(1,t,1);
    var mat=new THREE.MeshBasicMaterial({color:new THREE.Color("rgb(255,200,10)")});
    mesh=new THREE.Mesh(geo, mat);
    mesh.position.x=p.x;
    mesh.position.y=t;
    mesh.position.z=p.z;
    cubeArr.push(mesh);
  }
  for(var i=0; i<cubeArr.length; i++){
    scene.add(cubeArr[i]);
  } 
 
}