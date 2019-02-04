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
  for(var i=-1; i<0; i++){
    for(var j=-1; j<0; j++){
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
      mesh.position.y=0;
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
  constructPassage(cellQuadArr);
}

var genCubes=function(ptArr){
  var a=guiControls.gridL;
  var c=guiControls.gridH;
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
    mesh.position.y=t/2;
    mesh.position.z=p.z;
    cubeArr.push(mesh);
  }
  for(var i=0; i<cubeArr.length; i++){
    scene.add(cubeArr[i]);
  } 
  
}

var constructPassage=function(quadArr){
  for(var i=0; i<planeArr.length; i++){
    planeArr[i].geometry.dispose();
    planeArr[i].material.dispose();
    scene.remove(planeArr[i]);
  }
  planeArr=Array();
  
  var w=(guiControls.gridL/2)-0.5;
  var t=(guiControls.gridH/2)-0.5;
  for(var i=0; i<quadArr.length; i++){
    quad=quadArr[i];
    var q=quad.mp();  
    var a=quad.p;
    var b=quad.q;
    var c=quad.r;
    var d=quad.s;   
   /*
   * a=NE,b=SE,c=SW,d=NW
   */
    var e=new nsPt(q.x-0.5,0,q.z-0.5);
    var f=new nsPt(q.x+0.5,0,q.z-0.5);
    var g=new nsPt(q.x+0.5,0,q.z+0.5);
    var h=new nsPt(q.x-0.5,0,q.z+0.5);
    var i=new nsPt(e.x,0,e.z-t);
    var j=new nsPt(f.x,0,f.z-t);
    var k=new nsPt(f.x+w,0,f.z);
    var l=new nsPt(g.x+w,0,g.z);
    var m=new nsPt(g.x,0,g.z+t);
    var n=new nsPt(h.x,0,h.z+t);
    var o=new nsPt(h.x-w,0,h.z);
    var p=new nsPt(e.x-w,0,e.z);
    
    var g0=new THREE.BoxGeometry(w,0,t);
    var m0=new THREE.MeshBasicMaterial({color:new THREE.Color("rgb(200,0,0)"), side:THREE.DoubleSide, wireframe:false});
    var me0=new THREE.Mesh(g0,m0);
    me0.position.x=e.x-0.25;
    me0.position.y=0;
    me0.position.z=e.z-0.25;
    planeArr.push(me0);
  } 
  for(var i=0; i<planeArr.length; i++){
    scene.add(planeArr[i]);   
  }
  
}