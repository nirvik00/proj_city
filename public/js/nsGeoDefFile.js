
function nsPt(a,b,c){
    this.x=a;
    this.y=b;
    this.z=c;
}

function nsEdge(a,b){
    this.p=a;
    this.q=b;
}

function nsNetworkNode(a,b,c, nodeId){
    this.x=a;
    this.y=b;
    this.z=c;
    this.type="other";
    this.id=nodeId;
    this.parent=0;
    this.dist=1000;

    this.getPt=function(){
        return new nsPt(this.x, this.y, this.z);
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
    this.geoNode=new THREE.SphereGeometry(0.25,32,32);
    this.matNode; 
    this.nodeMesh;
    this.getObj=function(){        
        this.matNode=getBuildingMaterialFromType(this.type);
        this.nodeMesh=new THREE.Mesh(this.geoNode, this.matNode);
        this.nodeMesh.position.x=this.x;
        this.nodeMesh.position.y=this.y+0.5;
        this.nodeMesh.position.z=this.z;    
        return this.nodeMesh;
    }
    this.display=function(){
        var s="Pt ="+this.x+","+this.y+","+this.z +" , type=" + this.type + ", dist="+this.dist;
        console.log(s);
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

    //set type of edge:{green, path, road} based on two node-types at each end
    this.type="path";
    this.setType=function(name){
        this.type=name;
    }
    this.getType=function(){
        return this.type;
    }
    this.getObj=function(t){
        var path = new THREE.Geometry();
        if(this.getType() === "MST"){
            path.vertices.push(new THREE.Vector3( this.p.x, this.p.y+1.0, this.p.z ));
            path.vertices.push(new THREE.Vector3( this.q.x, this.q.y+1.0, this.q.z ));
        }else if(this.getType() === "EVAC"){
            path.vertices.push(new THREE.Vector3( this.p.x, this.p.y+1.5+(t/10), this.p.z ));
            path.vertices.push(new THREE.Vector3( this.q.x, this.q.y+1.5+(t/10), this.q.z ));
        }else{
            path.vertices.push(new THREE.Vector3( this.p.x, this.p.y+0.5, this.p.z ));
            path.vertices.push(new THREE.Vector3( this.q.x, this.q.y+0.5, this.q.z ));
        }
        var material = getPathMaterialFromType(this.getType(), this.id);
        var line = new THREE.Line(path, material);
        return line;
    }
    this.display=function(){
        var s= "EDGE id= "+this.id+", node0 type= "+this.node0.getType() +", node0 id= "+this.node0.id + ", node1 type= "+this.node1.getType() +", node1 id= "+this.node0.id + ", edge type= "+this.getType() +", cost= "+this.cost;
        console.log(s);
    }
}

function nsTile(a,b,c,d){
    this.p=a;
    this.q=b;
    this.r=c;
    this.s=d;
    this.GCN=0.25;
    this.NCN=0.25;
    this.RCN=0.25;
    this.neutral=0.25;   
}

function nsQuad(a,b,c,d,i){
    this.p=a;
    this.q=b;
    this.r=c;
    this.s=d;
    this.type="";

    this.cellId=i;
    
    this.gcnRat=0.0;
    this.ncnRat=0.0;
    this.rcnRat=0.0;

    this.gcnArea=0.0;
    this.ncnArea=0.0;
    this.rcnArea=0.0;

    this.mp=function(){
        var p=new nsPt((this.p.x+this.r.x)/2, (this.p.y+this.r.y)/2, (this.p.z+this.s.z)/2);
        return p;
    }
    this.type="";
    this.setType=function(t){
        this.type=t;
    }
}

function nsUnitVec(a,b){
    var dx=b.x-a.x;
    var dy=b.y-a.y;
    var dz=b.z-a.z;
    var norm=nsDis(a,b);
    var u=new nsPt(dx/norm, dy/norm, dz/norm);
    return u;
}

function nsDis(a,b){
    var dx=b.x-a.x;
    var dy=b.y-a.y;
    var dz=b.z-a.z;
    var norm=Math.sqrt(dx*dx + dy*dy + dz*dz);
    return norm;
}

function setPath(quad, name, ht){
    this.quad=quad;
    this.name=name;
    this.generateGround=function(){
        var a=quad.p;
        var b=quad.q;
        var c=quad.r;
        var d=quad.s;
        var p=new THREE.Geometry();
        var t=ht;//Math.random()*4;
        p.vertices.push(new THREE.Vector3(a.x,t,a.z));
        p.vertices.push(new THREE.Vector3(b.x,t,b.z));
        p.vertices.push(new THREE.Vector3(c.x,t,c.z));
        p.vertices.push(new THREE.Vector3(d.x,t,d.z));
        p.faces.push(new THREE.Face3(0,2,1));
        p.faces.push(new THREE.Face3(0,3,2));
        var mat;
        if(name==="road"){
            mat=new THREE.MeshBasicMaterial({color:new THREE.Color("rgb(100,100,100)")}); 
            var mesh=new THREE.Mesh(p, mat);   
            roadArr.push(mesh); 
        }else if (name==="path"){
            mat=new THREE.MeshBasicMaterial({color:new THREE.Color("rgb(255,155,0)")});
            var mesh=new THREE.Mesh(p, mat);
            pathArr.push(mesh);    
        }else if(name==="green"){
            mat=new THREE.MeshBasicMaterial({color:new THREE.Color("rgb(50,255,50)")});
            var mesh=new THREE.Mesh(p, mat);    
            greenArr.push(mesh);
        }
        else if(name==="intx"){
            mat=new THREE.LineBasicMaterial({color:new THREE.Color("rgb(255,0,255)")});
            var mesh=new THREE.Mesh(p, mat);    
            intxArr.push(mesh);
        }else if(name==="MST"){
            //for mst
            mat=new THREE.LineBasicMaterial({color:new THREE.Color("rgb(30,155,255)")});
            var mesh=new THREE.Mesh(p, mat);    
            mstArr.push(mesh);
        }else{
            mat=new THREE.LineBasicMaterial({color:new THREE.Color("rgb(255,15,55)")});
            var mesh=new THREE.Mesh(p, mat);    
            evacArr.push(mesh);
        }
    }
}

// CUBE DECISIONS
// three types of buildings: GCN, NCN, RCN
// max heights: 3, 7, 20
// make the cube from properties - RANDOM
function makeBuildings(quad, numlyr, types, maxht){
    this.quad=quad;
    this.numLayers=numlyr;
    this.types=types;
    this.maxHt=maxht;
    this.pt=this.quad.mp();
    this.genBuilding=function(){
        var n = this.maxHt/ this.types.length;
        var p=this.pt;
        var htarr=Array();
        var meshArr=Array();
        for(var i=0; i<this.types.length; i++){
            var selfHt=parseInt(Math.random()*2 + 1);
            if(types[i]=="evac"){
                selfHt=1;
            }
            var prevHt=0;
            if(i>0){
                for(var j=0; j<htarr.length; j++){
                    prevHt+=htarr[j];    
                }                
            } 
            htarr.push(selfHt);
            var reqLe=varCellLe-3*gridGuiControls.global_offset;
            var reqDe=varCellDe-3*gridGuiControls.global_offset;
            var geox = new THREE.BoxGeometry(reqLe, selfHt, reqDe);
            var matx=getBuildingMaterialFromType(this.types[i]);
            var mesh = new THREE.Mesh(geox, matx);
            mesh.position.x = p.x;
            mesh.position.y = (selfHt/2) + prevHt;
            mesh.position.z = p.z;    
            if(this.types[i]=="GCN"){
                GCNCubeArr.push(mesh);
            }else if(this.types[i]=="NCN"){
                NCNCubeArr.push(mesh);
            }else if(this.types[i]=="RCN"){
                RCNCubeArr.push(mesh);
            }else{ //evacuation
                evacArr.push(mesh);    
            }
        }
    }
}

function getBuildingMaterialFromType(type){
    this.mat=this.mat = new THREE.MeshBasicMaterial ({color: new THREE.Color("rgb(255,255,255)"),
        wireframe:wireframeVal});;
    if(type=="GCN"){
        this.mat = new THREE.MeshBasicMaterial ({
        color: new THREE.Color("rgb(0,255,0)"),
        wireframe: wireframeVal});        
    }else if(type=="NCN"){
        this.mat = new THREE.MeshBasicMaterial ({
        color: new THREE.Color("rgb(255,102,0)"),
        wireframe: wireframeVal});        
    }else if(type=="RCN"){
        this.mat = new THREE.MeshBasicMaterial ({
        color: new THREE.Color("rgb(50,50,50)"),
        wireframe:wireframeVal});
    }else{//evac
        this.mat = new THREE.MeshBasicMaterial ({
        color: new THREE.Color("rgb(255,0,0)"),
        wireframe:wireframeVal});
    }
    return this.mat
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
        mat=new THREE.LineBasicMaterial({color:new THREE.Color("rgb(250,0,0)")});
    }
    return mat;
}

var debugSphere=function(p){
    var geox = new THREE.SphereGeometry(.5,10,10);
    var matx = new THREE.MeshBasicMaterial ({
      color: new THREE.Color("rgb(102,153,255)"),
      wireframe: wireframeVal});
    var mesh = new THREE.Mesh(geox, matx);
    mesh.position.x = p.x;
    mesh.position.y = p.y;
    mesh.position.z = p.z; 
    scene.add(mesh);
}
  
var debugQuad=function(p,q,r,s,y){
    var geox = new THREE.Geometry();
    geox.vertices.push(new THREE.Vector3(p.x,y,p.z));
    geox.vertices.push(new THREE.Vector3(q.x,y,q.z));
    geox.vertices.push(new THREE.Vector3(r.x,y,r.z));
    geox.vertices.push(new THREE.Vector3(s.x,y,s.z));
    geox.vertices.push(new THREE.Vector3(p.x,y,p.z));
    var matx=new THREE.LineBasicMaterial( { color: new THREE.Color("rgb(255,0,0)") } );
    var line = new THREE.Line( geox, matx);
    scene.add(line);
}



