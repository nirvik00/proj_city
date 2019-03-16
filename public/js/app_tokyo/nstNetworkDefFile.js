
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
        var extSettings={
            setps:1,
            amount:0.1,
            bevelEnabled:false
        }
        var geometry=new THREE.ExtrudeBufferGeometry(geox,extSettings);
        if(this.type==="road"){
            var material=new THREE.MeshPhongMaterial({
                color:new THREE.Color("rgb(100,100,100)"),
                specular: 0x000000,
                shininess: 10,
                flatShading: true
            });
        }else{
            var material=new THREE.MeshPhongMaterial({
                color:new THREE.Color("rgb(0,255,50)"),
                specular: 0x000000,
                shininess: 10,
                flatShading: true
            });
        }
        
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
