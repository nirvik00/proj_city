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
  genCubes();
  constructPassage();
}

var genCubes=function(){
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
    var mat=new THREE.MeshBasicMaterial({color:new THREE.Color("rgb(255,200,10)"), wireframe:wireframeVal});
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

var constructPassage=function(){
  for(var i=0; i<pathArr.length; i++){
    pathArr[i].geometry.dispose();
    pathArr[i].material.dispose();
    scene.remove(pathArr[i]);
  }
  pathArr=Array();
  var pathQuadArr=Array();
  var w=(guiControls.gridL-1)/2;
  var t=(guiControls.gridH-1)/2;

  for(var i=0; i<cellQuadArr.length; i++){
    var quad=cellQuadArr[i];
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
    var I=new nsPt(e.x,0,e.z-t);
    var j=new nsPt(f.x,0,f.z-t);
    var k=new nsPt(f.x+w,0,f.z);
    var l=new nsPt(g.x+w,0,g.z);
    var m=new nsPt(g.x,0,g.z+t);
    var n=new nsPt(h.x,0,h.z+t);
    var o=new nsPt(h.x-w,0,h.z);
    var p=new nsPt(e.x-w,0,e.z);
    
    var q0=new nsQuad(a,I,e,p);
    var q1=new nsQuad(I,j,f,e);
    var q2=new nsQuad(j,b,k,f);
    var q3=new nsQuad(f,k,l,g);
    var q4=new nsQuad(g,l,c,m);
    var q5=new nsQuad(h,g,m,n);
    var q6=new nsQuad(o,h,n,d);
    var q7=new nsQuad(p,e,h,o);
    
    pathQuadArr.push(q0);  
    pathQuadArr.push(q1);  
    pathQuadArr.push(q2);  
    pathQuadArr.push(q3);  
    pathQuadArr.push(q4);  
    pathQuadArr.push(q5);  
    pathQuadArr.push(q6);  
    pathQuadArr.push(q7);  
  }
 
  for(var i=0; i<pathQuadArr.length; i++){
    var t=Math.random();
    var name;
    if(t>0.5){
      name="road";
    }else{
      name="green";
    }
    var path=new setPath(pathQuadArr[i], name);
    var mesh=path.display();
    pathArr.push(mesh);
  }
  for(var i=0; i<pathArr.length; i++){
    scene.add(pathArr[i]);
  }
}