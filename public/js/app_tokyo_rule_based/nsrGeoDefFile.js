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
    this.p=new nsPt(parseFloat(a.x), this.parseFloat(a.y), 0);
    this.q=new nsPt(parseFloat(a.x), this.parseFloat(a.y), 0);
    this.le=utilDi(this.p, this.q);
    this.mp=new nsPt((this.p.x+this.q.x)/2,(this.p.y+this.q.y)/2,(this.p.z+this.q.z)/2);
    this.renderedObject;
    this.getObj=function(){
        var path=new THREE.Geometry();
        path.vertices.push(new THREE.Vector3(this.p.x, this.p.y, 0));
        path.vertices.push(new THREE.Vector3(this.q.x, this.q.y, 0));
        var material=getPathMaterialFromType({color:new THREE.Color("rgb(0,0,255)")});
        this.renderedObject=new THREE.Line(path, material);
        return this.renderedObject;
    }    
    this.display=function(){
        console.log("\nsegment: ");
        console.log(this.p, this.q);
    }
}

//plot park from db
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
        for(var i=0; i<pts.length; i++){
            var q=pts[i];
            geox.lineTo(q.x-p.x,q.y-p.y);
        }
        geox.autoClose=true;
        var geometry=new THREE.ShapeGeometry(geox);
        var material=new THREE.MeshPhongMaterial({color:new THREE.Color("rgb(0,255,0)")});
        var mesh=new THREE.Mesh(geometry, material);
        mesh.position.x=p.x;
        mesh.position.y=p.y;
        this.renderedObject=mesh;
        parkArr.push(this.renderedObject);
    }
    this.display=function(){
        var sp="";
        for(var i=0; i<this.pts.length; i++){
            var x=this.pts[i].x;
            var y=this.pts[i].y;
            var z=0;
            sp+=x+","+y+","+z;
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

function utilDi(p,q){
    return Math.sqrt((p.x-q.x)*(p.x-q.x) + (p.y-q.y)*(p.y-q.y) + (p.z-q.z)*(p.z-q.z));
}

function nsSite(type, index, area, cen, pts){
    this.type=type;
    this.index=index;
    this.area=area;
    this.cen=cen;
    this.pts=pts;
    this.genGeo=function(){
        var geox=new THREE.Shape();
        var p=pts[0];
        geox.moveTo(0,0);
        for(var i=1; i<pts.length; i++){
            var q=pts[i];
            geox.lineTo(q.x-p.x, q.y-p.y);
        }
        geox.autoClose=true;
        var geometry=new THREE.ShapeGeometry(geox);
        var material=new THREE.MeshPhongMaterial({color:new THREE.Color("rgb(200,0,0)")});
        var mesh=new THREE.Mesh(geometry, material);
        mesh.position.x=p.x;
        mesh.position.y=p.y;
        this.renderedObject=mesh;

        var geo2=new THREE.Geometry();
        for(var i=0; i<this.pts.length; i++){
            var p=this.pts[i];
            geo2.vertices.push(new THREE.Vector3(p.x,p.y,p.z));
        }
        var mat2=new THREE.LineBasicMaterial({color: new THREE.Color("rgb(0,0,0)")});
        var lineGeo=new THREE.Line(geo2, mat2);
        siteArr.push(lineGeo);
    }
}