

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

function nsNetworkNode(a,b,c, nodeId){
    this.x=a;
    this.y=b;
    this.z=c;
    this.type="other";
    this.id=nodeId;
    this.parent=0;
    this.dist=1000;
    this.pt=new nsPt(this.x,this.y,this.z);
    this.getPt=function(){
        return this.pt;
    }
    this.setType=function(){
        var t=Math.random();
        if(t<0.35){
            this.type="GCN";
        }else if(t>=0.35 && t<0.7){
            this.type="NCN";
        }else if(t>=0.7 && t<0.95){
            this.type="RCN";   
        }else{
            this.type="EVAC";   
        }
    };
    this.getType=function(){
        return this.type;
    }
    this.geoNode=new THREE.SphereGeometry(0.15,32,32);
    this.matNode; 
    this.renderedObject;
    this.getObj=function(){
        this.matNode=getNodeMaterialFromType(this.type);
        this.renderedObject=new THREE.Mesh(this.geoNode, this.matNode);
        this.renderedObject.position.x=this.x;
        this.renderedObject.position.y=this.y;
        this.renderedObject.position.z=this.z;    
        nodeArr.push(this.renderedObject);
        //return this.nodeMesh;
    }
    this.display=function(){
        var s="Node ="+this.x+","+this.y+","+this.z +" , type=" + this.type + ", dist="+this.dist;
        console.log(s);
    }
    this.info=function(){
        var t="Node cen: "+this.x+","+this.y+","+this.z +"\ntype=" + this.type + "\n dist="+this.dist;
        return t;
    }
}

function nsNetworkEdge(a,b){
    this.p=a; //nsPt
    this.q=b; //nsPt
    this.getP=function(){return this.p;}
    this.getQ=function(){return this.q;}
    this.getMp=function(){ return new nsPt((this.p.x+this.q.x)/2 , (this.p.y+this.q.y)/2, (this.p.z+this.q.z)/2 ); }
    
    this.node0=new nsNetworkNode(this.p.x,this.p.y,this.p.z);
    this.node1=new nsNetworkNode(this.q.x,this.q.y,this.q.z);

    this.setNode0=function(n0){this.node0=n0;}
    this.setNode1=function(n1){this.node1=n1;}
    
    this.getNode0=function(){return this.node0; }
    this.getNode1=function(){return this.node1; }
    
    this.id=-1;
    this.cost=0;   
    this.updateCost=function(inv){      //inverse of same also - boolean var
        if (inv===0 || inv===1) { // SPT
            if(this.node0.getType()==="RCN" && this.node1.getType()==="RCN"){ 
                if(inv===0){ this.cost=costRcnRcn; }
                else if(inv===1){ this.cost=1/costRcnRcn; }
            }
            else if(this.node0.getType()==="GCN" && this.node1.getType()==="GCN"){
                if(inv===0){ this.cost=costGcnGcn; }
                else if(inv===1){ this.cost=1/costGcnGcn; }
            }
            else if(this.node0.getType()==="NCN" && this.node1.getType()==="NCN"){
                if(inv===0) { this.cost=costNcnNcn; } 
                else if(inv===1){ this.cost=1/costNcnNcn; }
            }
            else if((this.node0.getType()==="GCN" && this.node1.getType()==="NCN")||(this.node0.getType()==="NCN" && this.node1.getType()==="GCN")){
                if(inv === 0) { this.cost=costGcnNcn; }
                else if(inv===1){ this.cost=1/costGcnNcn; }
            }
            else if((this.node0.getType()==="GCN" && this.node1.getType()==="RCN")||(this.node0.getType()==="RCN" && this.node1.getType()==="GCN")){
                if(inv === 0 ){ this.cost=costRcnGcn; }
                else if(inv === 1){ this.cost=1/costRcnGcn; }
            }
            else if((this.node0.getType()==="NCN" && this.node1.getType()==="RCN")||(this.node0.getType()==="RCN" && this.node1.getType()==="NCN")){
                if(inv===0 ) { this.cost=costRcnNcn; }
                else if(inv===1){ this.cost=1/costRcnNcn; }
            }else{
                this.cost=Math.random() + 0.5;    
            }
        } else if(inv === 2) { // MST
            this.cost=0.5;
            if(this.type==="green"){
                this.cost+=1;
            }else if(this.type==="road"){
                this.cost+=1; 
            } 
        } else { // EVAC SPT
            this.cost=0.75;
        }
    }

    //set the area required at that edge
    this.area=0.0;
    this.renderedObject;
    //set type of edge:{green, path, road} based on two node-types at each end
    this.type="path";
    this.setType=function(name){
        this.type=name;
    }
    this.getType=function(){
        return this.type;
    }
    this.getLineObj=function(t){ //line 
        var path = new THREE.Geometry();
        if(this.getType() === "MST"){
            path.vertices.push(new THREE.Vector3( this.p.x, this.p.y, this.p.z ));
            path.vertices.push(new THREE.Vector3( this.q.x, this.q.y, this.q.z ));
        }else if(this.getType() === "EVAC"){
            path.vertices.push(new THREE.Vector3( this.p.x, this.p.y, this.p.z ));
            path.vertices.push(new THREE.Vector3( this.q.x, this.q.y, this.q.z ));
        }else{
            path.vertices.push(new THREE.Vector3( this.p.x, this.p.y, this.p.z ));
            path.vertices.push(new THREE.Vector3( this.q.x, this.q.y, this.q.z ));
        }
        var material = getPathMaterialFromType(this.getType(), this.id);
        this.renderedObject = new THREE.Line(path, material);
        edgeArr.push(this.renderedObject);
        //return line;
    }
    this.getMeshObj=function(e){ //mesh->input=offset
        var p=new nsPt(parseFloat(this.p.x),parseFloat(this.p.y),0); 
        var q=new nsPt(parseFloat(this.q.x),parseFloat(this.q.y),0); 
        var u=new nsPt((q.x-p.x)/utilDi(p,q),(q.y-p.y)/utilDi(p,q),0);
        var R=new nsPt(-u.y,u.x,0);
        var L=new nsPt(u.y,-u.x,0);
        
        var pL=new nsPt(p.x+R.x*e,p.y+R.y*e,0); // [0]
        var pR=new nsPt(p.x+L.x*e,p.y+L.y*e,0); // [1]
        var qR=new nsPt(q.x+L.x*e,q.y+L.y*e,0); // [2]
        var qL=new nsPt(q.x+R.x*e,q.y+R.y*e,0); // [3]

        var geox=new THREE.Shape();
        geox.moveTo(0,0);
        geox.lineTo(pR.x-pL.x, pR.y-pL.y);
        geox.lineTo(qR.x-pL.x, qR.y-pL.y);
        geox.lineTo(qL.x-pL.x, qL.y-pL.y);
        geox.autoClose=true;
        var extSettings;
        if(this.type==="road"){
            var material=new THREE.MeshPhongMaterial({
                color:new THREE.Color("rgb(100,100,100)"),
                specular: 0x000000,
                shininess: 10,
                flatShading: true
            });
            extSettings={
                setps:1,
                amount:0.1,
                bevelEnabled:false
            }
        }else{
            var material=new THREE.MeshPhongMaterial({
                color:new THREE.Color("rgb(0,255,50)"),
                specular: 0x000000,
                shininess: 10,
                flatShading: true
            });
            extSettings={
                setps:1,
                amount:0.15,
                bevelEnabled:false
            }
        }
        var geometry=new THREE.ExtrudeBufferGeometry(geox,extSettings);
        var mesh=new THREE.Mesh(geometry,material);
        mesh.position.x=pL.x;
        mesh.position.y=pL.y;
        edgeMeshArr.push(mesh);
    }
    
    this.display=function(){
        var s= "EDGE id= "+this.id+", node0 type= "+this.node0.getType() +", node0 id= "+this.node0.id + ", node1 type= "+this.node1.getType() +", node1 id= "+this.node0.id + ", edge type= "+this.getType() +", cost= "+this.cost;
        console.log(s);
    }
    this.info=function(){
        var s= "EDGE id= "+this.id+"\n node0 type= "+this.node0.getType() +"\n node0 id= "+this.node0.id + "\n node1 type= "+this.node1.getType() +"\n node1 id= "+this.node0.id + "\n edge type= "+this.getType() +"\n cost= "+this.cost;
        return s;
    }
}

function getPathMaterialFromType(name, id){
    var mat;
    if(name==="road"){
        mat=new THREE.LineBasicMaterial({color:new THREE.Color("rgb(0,0,0)")}); 
    }else if (name==="path"){
        mat=new THREE.LineBasicMaterial({color:new THREE.Color("rgb(250,150,0)")}); 
    }else if(name==="green"){
        mat=new THREE.LineBasicMaterial({color:new THREE.Color("rgb(0,255,0)")});
    }else if (name==="intx"){
        mat=new THREE.LineBasicMaterial({color:new THREE.Color("rgb(250,0,255)")});
    }else if(name === "MST"){
        mat=new THREE.LineBasicMaterial({color:new THREE.Color("rgb(30,155,255)")}); 
    }else{
        mat=new THREE.LineBasicMaterial({color:new THREE.Color("rgb(150,150,150)")});
    }
    return mat;
}

function getNodeMaterialFromType(type){
    this.mat = new THREE.MeshBasicMaterial ({color: new THREE.Color("rgb(255,255,255)"),
        wireframe:wireframeVal});
    if(type=="GCN"){
        var t=Math.random();
        this.mat = new THREE.MeshBasicMaterial ({
            color: new THREE.Color("rgb(0,255,0)"),
            wireframe: wireframeVal});        
    }else if(type=="NCN"){
            this.mat = new THREE.MeshBasicMaterial ({
                color: new THREE.Color("rgb(255,175,0)"),
                wireframe: wireframeVal});        
    }else if(type=="RCN"){
            this.mat = new THREE.MeshBasicMaterial ({
                color: new THREE.Color("rgb(0,0,0)"),
                wireframe:wireframeVal});
    }else{//evac
        this.mat = new THREE.MeshBasicMaterial ({
        color: new THREE.Color("rgb(150,150,150)"),
        wireframe:wireframeVal});
    }
    return this.mat
}
