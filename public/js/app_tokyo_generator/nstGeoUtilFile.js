

function utilDi(a, b) {
       return Math.sqrt(((a.x-b.x)*(a.x-b.x))+((a.y-b.y)*(a.y-b.y))+((a.z-b.z)*(a.z-b.z)));
}
     
function nsDis(a,b){
       var dx=b.x-a.x;
       var dy=b.y-a.y;
       var dz=b.z-a.z;
       var norm=Math.sqrt(dx*dx + dy*dy + dz*dz);
       return norm;
}

function nsIntx(p,q,r,s){
       var a1=q.y-p.y; var b1=p.x-q.x; var c1=(a1*q.x)+(b1*q.y);
       var a2=s.y-r.y; var b2=r.x-s.x; var c2=(a2*s.x)+(b2*s.y);
       var det=((a1*b2)-(a2*b1));
       var x=((c1*b2)-(c2*b1))/det; var y=((c2*a1)-(c1*a2))/det;
       var I=new nsPt(x,y,0); 
       var ip=utilDi(p,I); var iq=utilDi(q,I); var pq=utilDi(p,q);
       var ir=utilDi(r,I); var is=utilDi(s,I); var rs=utilDi(r,s);
   
       if(Math.abs(ip+iq-pq)<.1 && Math.abs(ir+is-rs)<.1){
           return I;
       }else{
           return new nsPt(0,0,0);
       }
}

var ptInSeg=function(p,q,r){
       //pt q is in between segment(p,r)
       var dpr=utilDi(p,r);//full length - p r
       var dpq=utilDi(p,q);//half length - p q
       var dqr=utilDi(q,r);//half length - q r
       if(Math.abs(dpr-dpq-dqr)<0.01){
              return true;
       }
       return false;
 }

function nsUnitVec(a,b){
       var dx=b.x-a.x;
       var dy=b.y-a.y;
       var dz=b.z-a.z;
       var norm=nsDis(a,b);
       var u=new nsPt(dx/norm, dy/norm, dz/norm);
       return u;
}

function heronArea(p,q,r,s){
       var a=utilDi(p, q);
       var b=utilDi(q, r);
       var c=utilDi(r, s);
       var d=utilDi(s, p);
       var s=(a+b+c)/2;
       var ar1=Math.sqrt(s*(s-a)*(s-b)*(s-c));
       s=(a+d+c)/2;
       var ar2=Math.sqrt(s*(s-a)*(s-d)*(s-c));
       var ar=ar1+ar2;
       return ar;
}

function randomShuffle(array){
       for (var i = array.length - 1; i > 0; i--) {
              var j = Math.floor(Math.random() * (i + 1));
              var temp = array[i];
              array[i] = array[j];
              array[j] = temp;
       }
       return array;
}
   
function cenOfArr(arr){
       var sortable=[];
       for(var i=0; i<arr.length; i++){
              var x=arr[i].mp().x;
              var y=arr[i].mp().y;
              sortable.push([x,y])
       }
       sortable.sort(function(a,b){
              return a[0]-b[0];
       });
       var minx=sortable[0][0];
       var maxx=sortable[sortable.length-1][0];
       var sortable2=[];
       for(var i=0; i<arr.length; i++){
              var x=arr[i].mp().x;
              var y=arr[i].mp().y;
              sortable2.push([x,y])
       }
       sortable2.sort(function(a,b){
              return a[1]-b[1];
       });
       var miny=sortable2[0][1];
       var maxy=sortable2[sortable.length-1][1];
       var cen=new nsPt((minx+maxx)/2,(miny+maxy)/2,0);
       return cen;
}
   

function genBldgFromQuad(siteobj, quad, e){
       var p=quad.p; 
       var q=quad.q;
       var r=quad.r; //not in order: interchange r&s
       var s=quad.s; //not in order: interchange r&s
   
       var geox=new THREE.Shape();
       geox.moveTo(0,0);
       geox.lineTo(q.x-p.x, q.y-p.y);
       geox.lineTo(s.x-p.x, s.y-p.y);
       geox.lineTo(r.x-p.x, r.y-p.y);
       geox.autoClose=true;

       var colr=new THREE.Color("rgb(0,50,0)");
       var ext=0.1;
       if(e==="GCN"){
              colr=new THREE.Color("rgb(55,255,175)");
              ext=Math.random()/2 +0.30;
       }else if(e==="NCN"){
              colr=new THREE.Color("rgb(175,100,5)");
              ext=Math.random()/2 + .15;
       }else if(e==="RCN"){
              colr=new THREE.Color("rgb(150,150,150)");
              ext=Math.random()/2 + .5;
       }else if(e==="park"){
              colr=new THREE.Color("rgb(0,255,0)");
              ext=0.05;
       }else{
              colr=new THREE.Color("rgb(250,0,0)");
              ext=Math.random()/2 + 0.35;
       }

       var extsettings={
              steps: 1,
              amount: ext,
              bevelEnabled: false
       }
       var geometry=new THREE.ExtrudeBufferGeometry(geox, extsettings);

       var material = new THREE.MeshPhongMaterial({
              color: colr, 
              specular: 0x000000, 
              shininess: 10, 
              flatShading: true
       });
       var mesh=new THREE.Mesh(geometry, material);
       mesh.position.x=p.x;
       mesh.position.y=p.y;
       if(e==="park"){
              siteobj.parkMeshArr.push(mesh);
       }else if(e==="GCN"){
              siteobj.gcnMeshArr.push(mesh);
       }else if(e==="NCN"){
              siteobj.ncnMeshArr.push(mesh);
       }else if(e==="RCN"){
              siteobj.rcnMeshArr.push(mesh);
       }
}
   
   
var debugSphere=function(p,r){
       var geox = new THREE.SphereGeometry(r,10,10);
       var matx = new THREE.MeshBasicMaterial ({
         color: new THREE.Color("rgb(102,153,255)"),
         wireframe: wireframeVal
       });
       var mesh = new THREE.Mesh(geox, matx);
       mesh.position.x = p.x;
       mesh.position.y = p.y;
       mesh.position.z = p.z; 
       scene.add(mesh);
}
     
var debugQuad=function(p,q,r,s,y){
       var geox = new THREE.Geometry();
       geox.vertices.push(new THREE.Vector3(p.x,p.y,p.z));
       geox.vertices.push(new THREE.Vector3(q.x,q.y,q.z));
       geox.vertices.push(new THREE.Vector3(r.x,r.y,r.z));
       geox.vertices.push(new THREE.Vector3(s.x,s.y,s.z));
       geox.vertices.push(new THREE.Vector3(p.x,p.y,p.z));
       var matx=new THREE.LineBasicMaterial( { color: new THREE.Color("rgb(255,0,0)") } );
       var line = new THREE.Line( geox, matx);
       scene.add(line);
}
   
var debugQuadZ=function(p,q,r,s,z){
       var geox = new THREE.Geometry();
       geox.vertices.push(new THREE.Vector3(p.x,p.y,z));
       geox.vertices.push(new THREE.Vector3(q.x,q.y,z));
       geox.vertices.push(new THREE.Vector3(r.x,r.y,z));
       geox.vertices.push(new THREE.Vector3(s.x,s.y,z));
       geox.vertices.push(new THREE.Vector3(p.x,p.y,z));
       var matx=new THREE.LineBasicMaterial({
              color: new THREE.Color("rgb(0,0,255)")
       });
       var quad = new THREE.Line(geox, matx);
       
       var M=new THREE.Geometry();
       M.vertices.push(new THREE.Vector3(p.x,p.y,z));
       M.vertices.push(new THREE.Vector3(r.x,r.y,z));
       var L1=new THREE.Line(M,matx);

       var N=new THREE.Geometry();
       N.vertices.push(new THREE.Vector3(q.x,q.y,z));
       N.vertices.push(new THREE.Vector3(s.x,s.y,z));
       var L2=new THREE.Line(N,matx);

       var res=[quad, L1, L2];
       scene.add(quad);
       scene.add(L1);
       scene.add(L2);
       //return res;
}

var debugLine=function(p,q,y){
       var geox = new THREE.Geometry();
       geox.vertices.push(new THREE.Vector3(p.x,p.y,p.z));
       geox.vertices.push(new THREE.Vector3(q.x,q.y,q.z));
       var matx=new THREE.LineBasicMaterial({ 
              color: new THREE.Color("rgb(255,0,0)") 
       });
       var line = new THREE.Line( geox, matx);
       scene.add(line);
}

var debugSeg=function(seg){
       var p=seg.p;
       var q=seg.q;
       var geox = new THREE.Geometry();
       geox.vertices.push(new THREE.Vector3(p.x,p.y,p.z));
       geox.vertices.push(new THREE.Vector3(q.x,q.y,q.z));
       var matx=new THREE.LineBasicMaterial({ 
              color: new THREE.Color("rgb(255,0,0)") 
       });
       var line = new THREE.Line(geox, matx);
       scene.add(line);  
}
   
