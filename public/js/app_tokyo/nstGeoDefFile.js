
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

    this.genCells=function(baydepth){
        this.subCellQuads=[];        
        var p=this.p; // 0  ordered in previous function p-q
        var q=this.q; // 1  ordered in previous function q-r
        var r=this.r; // 2  ordered in previous function r-s
        var s=this.s; // 3  ordered in previous function s-p
        var u=new nsPt((q.x-p.x)/utilDi(p,q), (q.y-p.y)/utilDi(p,q), 0); // unit vector
        var norm=utilDi(p,q); // norm of pq
        var R=new nsPt(-u.y,u.x,0); // normal 1 to pq
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
                    segArr.push(new nsSeg(a,I));
                }
            }
        }
        segArr.push(new nsSeg(q,r));
        for(var i=0; i<segArr.length-1; i++){
            var a=segArr[i].p;
            var b=segArr[i].q;
            var c=segArr[i+1].p;
            var d=segArr[i+1].q;            
            //if(utilDi(p,q)>baydepth*2 || utilDi(r,s)>baydepth*2){continue;}
            var quad=new nsQuad(a,b,c,d);
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


