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
    this.display=function(){
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
            mat=new THREE.MeshBasicMaterial({color:new THREE.Color("rgb(155,50,100)"), side:THREE.DoubleSide, wireframe:wireframeVal});   
        }else{
            mat=new THREE.MeshBasicMaterial({color:new THREE.Color("rgb(0,0,255)"), side:THREE.DoubleSide, wireframe:wireframeVal});
        }         
        var mesh=new THREE.Mesh(p, mat);
        return mesh;
    }
}


// CUBE DECISIONS
// determine the number of layers of buildings on site: three - max
// three types of buildings: res, comm, office
// max heights: 3, 7, 20

function cubeDecisions(){
    
    var T=Math.random();
    this.name=getName();
    this.numLayers=getNumLayers();
    this.maxHt=getMaxHt();
    
    this.getNumLayers=function(){
        if(T<0.35){
            this.numLayers=3;
        }
        else if(T>0.35 && t<0.7){
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
    
    this.getName=function(){
        var t=this.numLayers;
        if(t==3){
            var m=Math.random();
            if(m<0.35){
                this.name.push("res");      
                this.name.push("comm");
                this.name.push("office");
            }else{
                this.name.push("office");
                this.name.push("comm");
                this.name.push("res");      
            }
        }else if(t==2){
            var m=Math.random();
            if(m<0.35){
                this.name.push("res");      
                this.name.push("comm");
            }else if(m>0.35 && m<0.7){
                this.name.push("comm");      
                this.name.push("res");
            }else{
                this.name.push("office");      
                this.name.push("comm");
            }
        }else{
            var m=Math.random();
            if(m<0.35){
                this.name.push("res");      
            }else if(m>0.35 && m<0.7){
                this.name.push("comm");      
            }else{
                this.name.push("office");      
            }
        }
        return this.name;
    } 
}