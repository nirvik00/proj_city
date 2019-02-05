
function nsPt(a,b,c){
    this.x=a;
    this.y=b;
    this.z=c;
}

function nsEdge(a,b){
    this.p=a;
    this.q=b;
}

function nsQuad(a,b,c,d){
    this.p=a;
    this.q=b;
    this.r=c;
    this.s=d;
    this.mp=function(){
        var p=new nsPt((this.p.x+this.r.x)/2, (this.p.y+this.r.y)/2, (this.p.z+this.s.z)/2);
        return p;
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

function setPath(quad, name, arr){
    this.quad=quad;
    this.name=name;
    this.generateGround=function(){
        var a=quad.p;
        var b=quad.q;
        var c=quad.r;
        var d=quad.s;
        var p=new THREE.Geometry();
        var t=0;//Math.random()*4;
        p.vertices.push(new THREE.Vector3(a.x,t,a.z));
        p.vertices.push(new THREE.Vector3(b.x,t,b.z));
        p.vertices.push(new THREE.Vector3(c.x,t,c.z));
        p.vertices.push(new THREE.Vector3(d.x,t,d.z));
        p.faces.push(new THREE.Face3(0,1,2));
        p.faces.push(new THREE.Face3(0,3,2));
        var mat;
        if(name==="road"){
            mat=new THREE.MeshBasicMaterial({color:new THREE.Color("rgb(155,150,100)"), side:THREE.DoubleSide, wireframe:wireframeVal});   
            var mesh=new THREE.Mesh(p, mat);   
            roadArr.push(mesh); 
        }else if (name==="path"){
            mat=new THREE.MeshBasicMaterial({color:new THREE.Color("rgb(178,255,102)"), side:THREE.DoubleSide, wireframe:wireframeVal});
            var mesh=new THREE.Mesh(p, mat);
            pathArr.push(mesh);    
        }else if (name=="green"){
            mat=new THREE.MeshBasicMaterial({color:new THREE.Color("rgb(0,155,0)"), side:THREE.DoubleSide, wireframe:wireframeVal});
            var mesh=new THREE.Mesh(p, mat);    
            greenArr.push(mesh);
        }else{
            var mesh=new THREE.Mesh(p, mat);    
            groundArr.push(mesh);
        }
    }
}


// CUBE DECISIONS
// determine the number of layers of buildings on site: three - max
// three types of buildings: res, comm, office
// max heights: 3, 7, 20

function CubeDecisions(){
    
    var T=Math.random();
    this.numLayers;
    this.types=Array();
    this.maxHt;
    
    this.getNumLayers=function(){
        if(T<0.35){
            this.numLayers=3;
        }
        else if(T>0.35 && T<0.7){
            this.numLayers=2;
        }else{
            this.numLayers=1;
        }
        return this.numLayers;
    }
    
    this.getMaxHt=function(){
        var n=Math.random();
        if(n<0.35){
          this.maxHt=3;
        }else if(n>0.35 && n<0.7){
          this.maxHt=7;
        }else{
          this.maxHt=20;
        }
        return this.maxHt;
    }
    
    this.getType=function(){
        var t=this.numLayers;
        if(t==3){
            var m=Math.random();
            if(m<0.16){
                this.types.push("res");      
                this.types.push("comm");
                this.types.push("office");
            }else if(m>0.16 && m<0.32){
                this.types.push("res");
                this.types.push("office");
                this.types.push("comm");      
            }else if(m>0.32 && m<0.48){
                this.types.push("comm");
                this.types.push("office");
                this.types.push("res");      
            }else if(m>0.48 && m<0.60){
                this.types.push("comm");
                this.types.push("res"); 
                this.types.push("office");
            }else if(m>0.60 && m<0.72){
                this.types.push("office");
                this.types.push("comm");
                this.types.push("res"); 
            }else{
                this.types.push("office");
                this.types.push("res");                 
                this.types.push("comm");                
            }
        }else if(t==2){
            var m=Math.random();
            if(m<0.35){
                this.types.push("res");      
                this.types.push("comm");
            }else if(m>0.35 && m<0.7){
                this.types.push("comm");      
                this.types.push("res");
            }else{
                this.types.push("office");      
                this.types.push("comm");
            }
        }else{
            var m=Math.random();
            if(m<0.35){
                this.types.push("res");      
            }else if(m>0.35 && m<0.7){
                this.types.push("comm");      
            }else if(m>0.35 && m<0.9){
                this.types.push("office");      
            }else{
                this.types.push("evac");      
            }
        }
        return this.types;
    } 
}


// make the cube from properties
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
            var geox = new THREE.BoxGeometry(1, selfHt, 1);
            var matx=getBuildingMaterialFromType(this.types[i]);
            var mesh = new THREE.Mesh(geox, matx);
            mesh.position.x = p.x;
            mesh.position.y = (selfHt/2) + prevHt;
            mesh.position.z = p.z;    
            if(this.types[i]=="res"){
                resCubeArr.push(mesh);
            }else if(this.types[i]=="comm"){
                commCubeArr.push(mesh);
            }else if(this.types[i]=="office"){
                officeCubeArr.push(mesh);
            }else{ //evacuation
                evacArr.push(mesh);    
            }
        }
    }
}

function getBuildingMaterialFromType(type){
    this.mat=this.mat = new THREE.MeshBasicMaterial ({color: new THREE.Color("rgb(255,255,255)"),
        wireframe:wireframeVal});;
    if(type=="res"){
        this.mat = new THREE.MeshBasicMaterial ({
        color: new THREE.Color("rgb(102,153,255)"),
         wireframe: wireframeVal});        
    }else if(type=="comm"){
        this.mat = new THREE.MeshBasicMaterial ({
        color: new THREE.Color("rgb(178,102,102)"),
        wireframe: wireframeVal});        
    }else if(type=="office"){
        this.mat = new THREE.MeshBasicMaterial ({
        color: new THREE.Color("rgb(255,102,102)"),
        wireframe:wireframeVal});
    }else{//evac
        this.mat = new THREE.MeshBasicMaterial ({
        color: new THREE.Color("rgb(50,50,50)"),
        wireframe:wireframeVal});
    }
    return this.mat
}