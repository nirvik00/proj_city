
function nsPt(a,b,c){
    this.x=a;
    this.y=b;
    this.z=c;
}

function nsEdge(a,b){
    this.p=a;
    this.q=b;
}

function nsSeg(a,b){
    this.p=new nsPt(parseFloat(a.x), parseFloat(a.y), 0);
    this.q=new nsPt(parseFloat(b.x), parseFloat(b.y), 0);
    this.le=utilDi(this.p, this.q);
    this.mp=new nsPt((this.p.x+this.q.x)/2, (this.p.y+this.q.y)/2, 0);
    this.renderedObject;
    this.getObj=function(){
        var path= new THREE.Geometry();
        path.vertices.push(new THREE.Vector3(this.p.x, this.p.y, 0));
        path.vertices.push(new THREE.Vector3(this.q.x, this.q.y, 0));
        var material = getPathMaterialFromType({color:new THREE.Color("rgb(0,0,255)")});
        this.renderedObject = new THREE.Line(path, material);
        return this.renderedObject;
    }
    this.display=function(){
        console.log("\nsegment: ")
        console.log(this.p,this.q);
    }
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

//from db
function nsPark(type, area, cen, pts){
    this.type=type;
    this.area=area;
    this.cen=cen;
    this.pts=pts;
    this.renderedObject;
    this.genGeo=function(){
        var geox=new THREE.Shape();
        var p=pts[0];
        geox.moveTo(0,0);
        for(var i=1; i<pts.length; i++){
            var q=pts[i];
            geox.lineTo(q.x-p.x,q.y-p.y);
        }
        geox.autoClose=true;
        var geometry=new THREE.ShapeGeometry(geox);
        var material=new THREE.MeshPhongMaterial({color:new THREE.Color("rgb(0,255,70)"), side:THREE.DoubleSide});
        var mesh=new THREE.Mesh(geometry, material);
        mesh.position.x=p.x;
        mesh.position.y=p.y;
        this.renderedObject=mesh;
        parkArr.push(this.renderedObject);
        //return mesh;
    }
    this.display=function(){
        var sp="";
        for(var i=0; i<this.pts.length; i++){
            var x=this.pts[i].x;
            var y=this.pts[i].y;
            var z=0;
            sp+=x+","+y+","+z+"\n";
        }
        var s="Park area: "+this.area+"\ncenter: "+this.cen+"\npoints: \n"+sp;
        console.log(s);
    }
    this.info=function(){
        var sp="";
        for(var i=0; i<this.pts.length; i++){
            var x=this.pts[i].x;
            var y=this.pts[i].y;
            var z=0;
            sp+=x+","+y+","+z+"\n";
        }
        var s="Park area: "+this.area+"\ncenter: "+this.cen+"\npoints: \n"+sp;
        return s;
    }
}

//from db
function nsBldg(type, area, cen, pts){
    this.type=type;
    this.area=area;
    this.cen=cen;
    this.pts=pts;
    this.renderedObject;
    this.genGeo=function(){
        var p=pts[0];
        var geox=new THREE.Shape();
        geox.moveTo(0,0);
        for(var i=1; i<pts.length; i++){
            var q=pts[i];
            geox.lineTo(q.x-p.x,q.y-p.y);
        }
        geox.autoClose=true;
        //var geometry=new THREE.ShapeGeometry(geox);
        var extsettings={
            steps: 1,
            amount: Math.random()+0.1,
            bevelEnabled: false
        }
        var geometry=new THREE.ExtrudeBufferGeometry(geox, extsettings);
        
        var material = new THREE.MeshPhongMaterial({
            color: 0xdddddd, specular: 0x000000, shininess: 10, flatShading: true 
        });
        var mesh=new THREE.Mesh(geometry, material);
        mesh.position.x=p.x;
        mesh.position.y=p.y;
        this.renderedObject=mesh;
        bldgArr.push(this.renderedObject);
    }
    this.display=function(){
        var sp="";
        for(var i=0; i<this.pts.length; i++){
            var x=this.pts[i].x;
            var y=this.pts[i].y;
            var z=0;
            sp+=x+","+y+","+z+"\n";
        }
        var s="Building area: "+this.area+"\ncenter: "+x+","+y+","+z+"\npoints: \n"+sp;
        console.log(s);
    }
    this.info=function(){
        var sp="";
        for(var i=0; i<this.pts.length; i++){
            var x=this.pts[i].x;
            var y=this.pts[i].y;
            var z=0;
            sp+=x+","+y+","+z+"\n";
        }
        var x=this.cen[0];
        var y=this.cen[1];
        var z=this.cen[2];
        var s="Building area: "+this.area+"\ncenter: "+this.cen+"\npoints: \n"+sp;
        return s;
    }
}

function nsQuad(a,b,c,d,i){
    this.p=a;
    this.q=b;
    this.r=c;
    this.s=d;
    this.type;
    this.subCellQuads=[];
    this.cellId=i;
    this.gcnRat=0.0;
    this.ncnRat=0.0;
    this.rcnRat=0.0;
    this.gcnArea=0.0;
    this.ncnArea=0.0;
    this.rcnArea=0.0;
    this.cellArea=0.0;
    this.mp=function(){
        var p=new nsPt((this.p.x+this.r.x)/2, (this.p.y+this.r.y)/2, (this.p.z+this.s.z)/2);
        return p;
    }

    this.setType=function(t){
        this.type=t;
    }

    this.display=function(){
        //console.log("nsQuad type= " +this.type + "; Cell ar= "+ this.cellArea + ", gcn=" + this.gcnArea+", ncn="+this.ncnArea+", rcn="+this.rcnArea);
    }

    this.genQuad=function(t){
        var geox = new THREE.Geometry();
        geox.vertices.push(new THREE.Vector3(this.p.x,this.p.y,t));
        geox.vertices.push(new THREE.Vector3(this.q.x,this.q.y,t));
        geox.vertices.push(new THREE.Vector3(this.r.x,this.r.y,t));
        geox.vertices.push(new THREE.Vector3(this.s.x,this.s.y,t));
        geox.vertices.push(new THREE.Vector3(this.p.x,this.p.y,t));
        var matx=new THREE.LineBasicMaterial({color: new THREE.Color("rgb(255,0,0)")});
        var Q = new THREE.Line(geox, matx);

        var M=new THREE.Geometry();
        M.vertices.push(new THREE.Vector3(this.p.x,this.p.y,t));
        M.vertices.push(new THREE.Vector3(this.r.x,this.r.y,t));
        var L1=new THREE.Line(M,matx);
 
        var N=new THREE.Geometry();
        N.vertices.push(new THREE.Vector3(this.q.x,this.q.y,t));
        N.vertices.push(new THREE.Vector3(this.s.x,this.s.y,t));
        var L2=new THREE.Line(N,matx);

        var res=[Q,L1,L2];

        return res;
    } 

    this.genCells=function(){
        this.subCellQuads=[];
        var baydepth=superBlockControls.bay_Depth;
        var p=this.p; // 0  ordered in previous function p-q
        var q=this.q; // 1  ordered in previous function q-r
        var r=this.r; // 2  ordered in previous function r-s
        var s=this.s; // 3  ordered in previous function s-p
        var u=new nsPt((q.x-p.x)/utilDi(p,q), (q.y-p.y)/utilDi(p,q), 0); // unit vector
        var norm=utilDi(p,q); // norm of pq
        var R=new nsPt(-u.y,u.x,0); // normal 1 to pq
        //debugSphere(p,0.1);
        var num=100;//max number of iterations on pq
        var segArr=[];
        segArr.push(new nsSeg(p,s));
        for(var i=0; i<num; i++){
            var a=new nsPt(p.x+u.x*baydepth*i, p.y+u.y*i*baydepth,0);
            if(ptInSeg(p,a,q)===false) { break; }//if a is outside pq
            if((utilDi(a,q)<baydepth/2)){break;}//dont take if very close to q
            if(utilDi(p,a)<0.01) {continue;}//dont take if very close to p
            var b=new nsPt(a.x+(R.x*baydepth*1.5),a.y+(R.y*baydepth*1.5),0);
            var I=nsIntx(a,b,r,s);
            if(I.x!==0 && I.y!==0){
                if(utilDi(a,I)>baydepth*1.5){
                    break;
                }else{
                    //debugLine(a,I,1);
                    segArr.push(new nsSeg(a,I));
                }
            }
        }
        segArr.push(new nsSeg(q,r));
        for(var i=0; i<segArr.length-1; i++){
            var p=segArr[i].p;
            var q=segArr[i].q;
            var r=segArr[i+1].q;
            var s=segArr[i+1].p;
            if(utilDi(p,q)>baydepth*2 || utilDi(r,s)>baydepth*2){continue;}
            var quad=new nsQuad(p,q,s,r);
            this.subCellQuads.push(quad);
        }
    }
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
        p.vertices.push(new THREE.Vector3(a.x,a.y,a.z));
        p.vertices.push(new THREE.Vector3(b.x,b.y,b.z));
        p.vertices.push(new THREE.Vector3(c.x,c.y,c.z));
        p.vertices.push(new THREE.Vector3(d.x,d.y,d.z));
        p.faces.push(new THREE.Face3(0,2,1));
        p.faces.push(new THREE.Face3(0,3,2));
        var mat;
        if(name==="road"){
            mat=new THREE.MeshBasicMaterial({color:new THREE.Color("rgb(100,100,100)"),side:THREE.DoubleSide});
            var mesh=new THREE.Mesh(p, mat);   
            roadArr.push(mesh); 
        }else if (name==="path"){
            mat=new THREE.MeshBasicMaterial({color:new THREE.Color("rgb(255,155,0)"),side:THREE.DoubleSide});
            var mesh=new THREE.Mesh(p, mat);
            pathArr.push(mesh);    
        }else if(name==="green"){
            mat=new THREE.MeshBasicMaterial({color:new THREE.Color("rgb(50,255,50)"),side:THREE.DoubleSide});
            var mesh=new THREE.Mesh(p, mat);    
            greenArr.push(mesh);
        }
        else if(name==="intx"){
            mat=new THREE.LineBasicMaterial({color:new THREE.Color("rgb(255,0,255)"),side:THREE.DoubleSide});
            var mesh=new THREE.Mesh(p, mat);    
            intxArr.push(mesh);
        }else if(name==="MST"){
            //for mst
            mat=new THREE.LineBasicMaterial({color:new THREE.Color("rgb(30,155,255)"),side:THREE.DoubleSide});
            var mesh=new THREE.Mesh(p, mat);    
            mstArr.push(mesh);
        }else{
            mat=new THREE.LineBasicMaterial({color:new THREE.Color("rgb(255,15,55)"),side:THREE.DoubleSide});
            var mesh=new THREE.Mesh(p, mat);    
            evacArr.push(mesh);
        }
    }
}

function getBuildingMaterialFromType(type){
    this.mat = new THREE.MeshBasicMaterial ({color: new THREE.Color("rgb(255,255,255)"),
        wireframe:wireframeVal});
    if(type=="GCN"){
        var t=Math.random();
        if(t<0.5){
            this.mat = new THREE.MeshBasicMaterial ({
                color: new THREE.Color("rgb(0,255,0)"),
                wireframe: wireframeVal});        
        }else{
            this.mat = new THREE.MeshBasicMaterial ({
                color: new THREE.Color("rgb(0,255,150)"),
                wireframe: wireframeVal});        
        }
    }else if(type=="NCN"){
        var t=Math.random();
        if(t<0.5){
            this.mat = new THREE.MeshBasicMaterial ({
                color: new THREE.Color("rgb(255,102,0)"),
                wireframe: wireframeVal});        
        }else{
            this.mat = new THREE.MeshBasicMaterial ({
                color: new THREE.Color("rgb(225,125,0)"),
                wireframe: wireframeVal});        
        }
        
    }else if(type=="RCN"){
        var t=Math.random();
        if(t<0.5){
            this.mat = new THREE.MeshBasicMaterial ({
                color: new THREE.Color("rgb(150,150,150)"),
                wireframe:wireframeVal});
        }else{
            this.mat = new THREE.MeshBasicMaterial ({
                color: new THREE.Color("rgb(200,200,200)"),
                wireframe:wireframeVal});
        }
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
