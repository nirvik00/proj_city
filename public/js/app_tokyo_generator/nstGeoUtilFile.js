

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

var interpPts=function(p,q,num){
       var pts=[];
       var u=new nsPt((q.x-p.x)/utilDi(p,q), (q.y-p.y)/utilDi(p,q), (q.z-p.z)/utilDi(p,q));
       var diff=utilDi(p,q)/(num-1);
       for(var i=0; i<num; i++){
              var r=new nsPt(p.x+u.x*diff*i,p.y+u.y*diff*i,p.z+u.z*diff*i);
              pts.push(r);
       }
       return pts;
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
       var S=(a+b+c)/2;
       var ar1=Math.sqrt(S*(S-a)*(S-b)*(S-c));
       s=(a+d+c)/2;
       var ar2=Math.sqrt(S*(S-a)*(S-d)*(S-c));
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

function offsetPt(p,q,r){
       var norm_pq=utilDi(p,q);
       var norm_pr=utilDi(p,r);
       var sc1=0.035;// - 0.10
       var sc2=0.035;
       var u=new nsPt(p.x + (q.x-p.x)*sc1/norm_pq, p.y + (q.y-p.y)*sc1/norm_pq, 0);
       var v=new nsPt(u.x + (r.x-p.x)*sc2/norm_pr, u.y + (r.y-p.y)*sc2/norm_pr, 0);
       return v;
}

function genBldgFromQuad(siteobj, quad, e){
       var p=quad.p; 
       var q=quad.q;
       var r=quad.r; //not in order: interchange r&s
       var s=quad.s; //not in order: interchange r&s

       var p1=offsetPt(p,q,r);
       var q1=offsetPt(q,p,s);
       var r1=offsetPt(s,q,r);
       var s1=offsetPt(r,p,s);
       //debugQuadZ(p1,q1,r1,s1,3);
       p=p1; q=q1;s=r1;r=s1; // change this line to remove offset

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

function nsIntx(p,q,r,s){
       var a1=q.y-p.y; var b1=p.x-q.x; var c1=(a1*q.x)+(b1*q.y);
       var a2=s.y-r.y; var b2=r.x-s.x; var c2=(a2*s.x)+(b2*s.y);
       var det=((a1*b2)-(a2*b1));
       var x=((c1*b2)-(c2*b1))/det; var y=((c2*a1)-(c1*a2))/det;
       var I=new nsPt(x,y,0); 
       var ip=utilDi(p,I); var iq=utilDi(q,I); var pq=utilDi(p,q);
       var ir=utilDi(r,I); var is=utilDi(s,I); var rs=utilDi(r,s);
   
       if(Math.abs(ip+iq-pq)<0.01 && Math.abs(ir+is-rs)<0.01){
           return I;
       }else{
           return new nsPt(0,0,0);
       }
}

function heronAreaTri(p,q,r){
       var a=utilDi(p, q);
       var b=utilDi(q, r);
       var c=utilDi(r, p);
       var S=(a+b+c)/2;
       var ar1=Math.sqrt(S*(S-a)*(S-b)*(S-c));
       return ar1;
}

function ptInCell(a, cell){
       var p=cell.p;
       var q=cell.q;
       var r=cell.r;
       var s=cell.s;
       var ar1=heronAreaTri(p,q,r); //ar1 + ar2= poly
       var ar2=heronAreaTri(q,r,s); //ar1 + ar2= poly

       var ar3=heronAreaTri(p,q,a);
       var ar4=heronAreaTri(p,r,a);
       var ar5=heronAreaTri(s,r,a);
       var ar6=heronAreaTri(s,q,a);

       if(Math.abs((ar1+ar2)-(ar3+ar4+ar5+ar6))<0.01){
              return true;// pt  in poly
       }else{
              return false;// pt not in poly
       }
}

function ptInPoly(p, pts){
       var extreme=new nsPt(p.x+100000, p.y, 0);
       var count=0;
       for(var i=0; i<pts.length; i++){
              var a,b;
              if(i===0){
                     a=pts[pts.length-1];
                     b=pts[0];
              }else{
                     a=pts[i-1];
                     b=pts[i];
              }
              var T=findIntx(a,b,p,extreme);
              if(T===true){
                     count++;
              }
       }
       if(count>0){
              if(count%2 === 0){
                     return false;
              }else{
                     return true;
              }
       }else{
              return false;
       }
}

var findIntx=function(p,q,r,s){
       var T=false;
       var a1=q.y-p.y; var b1=p.x-q.x; var c1=(a1*q.x)+(b1*q.y);
       var a2=s.y-r.y; var b2=r.x-s.x; var c2=(a2*s.x)+(b2*s.y);

       var det=(a1*b2)-(a2*b1);
       var x=((c1*b2)-(c2*b1))/det;
       var y=((c2*a1)-(c1*a2))/det;
       var I=new nsPt(x,y,0);
       var iD0=utilDi(I,p);
       var iD1=utilDi(I,q);
       var iD2=utilDi(I,r);
       var iD3=utilDi(I,s);
       var L=utilDi(p,q);
       var M=utilDi(r,s);
       if(Math.abs(L-(iD0+iD1))<0.001 && Math.abs(M-(iD2+iD3))<0.001 ){
              T=true;
       }else{
              T=false;
       }
       return T;
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
   
var debugSphereZ=function(p,r,z){
       var geox = new THREE.SphereGeometry(r,10,10);
       var matx = new THREE.MeshBasicMaterial ({
         color: new THREE.Color("rgb(102,153,255)"),
         wireframe: wireframeVal
       });
       var mesh = new THREE.Mesh(geox, matx);
       mesh.position.x = p.x;
       mesh.position.y = p.y;
       mesh.position.z = z; 
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
       return res;
}

var debugLine=function(p,q){
       var geox = new THREE.Geometry();
       geox.vertices.push(new THREE.Vector3(p.x,p.y,p.z));
       geox.vertices.push(new THREE.Vector3(q.x,q.y,q.z));
       var matx=new THREE.LineBasicMaterial({ 
              color: new THREE.Color("rgb(0,0,255)") 
       });
       var line = new THREE.Line( geox, matx);
       scene.add(line);
}

var debugLineZ=function(p,q,z){
       var geox = new THREE.Geometry();
       geox.vertices.push(new THREE.Vector3(p.x,p.y,z));
       geox.vertices.push(new THREE.Vector3(q.x,q.y,z));
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

var genColorQuad=function(p,q,r,s,t,colr){
       var geox = new THREE.Shape();
       geox.moveTo(0,0);
       geox.lineTo(q.x-p.x,q.y-p.y);
       geox.lineTo(s.x-p.x,s.y-p.y);
       geox.lineTo(r.x-p.x,r.y-p.y);
       geox.autoClose=true;
       var extsettings={
           steps: 1,
           amount: t,
           bevelEnabled: false
       }
       var geom=new THREE.ExtrudeBufferGeometry(geox, extsettings);
       
       var material = new THREE.MeshPhongMaterial({
           color: colr, specular: 0x000000, shininess: 10, flatShading: true 
       });
       var mesh=new THREE.Mesh(geom, material);
       mesh.position.x=p.x;
       mesh.position.y=p.y;
       //mesh.position.z=t;
       scene.add(mesh);
}