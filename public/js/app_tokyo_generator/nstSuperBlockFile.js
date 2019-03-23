//
//
// site object to implement super block generation
//
//
function nsSite(type, index, area, cen, pts){
    this.index=index;
    this.type=type;
    this.area=area;
    this.cen=cen;
    this.renderedObject; //outline of the site: polyline
    this.diag; // diagonals of the site : longest line segment between the points
    this.bb;//bounding box of site
    this.segArr=[]; // segments generated from the diagonal
    this.quadArr=[]; // quads of the site
    this.subCellQuadArr=[];//cells of the site obj
    this.parkMeshArr=[]; // rendered park objects
    this.gcnMeshArr=[]; // rendered gcn mesh objects
    this.ncnMeshArr=[]; // rendered ncn mesh objects
    this.rcnMeshArr=[]; // rendered rcn mesh objects
    this.detailedInfo="";//updated from superblockrules files

    this.pts=[];
    for(var i=0; i<pts.length; i++){
        var x=pts[i].x;
        var y=pts[i].y;
        var z=0;
        this.pts.push(new nsPt(x,y,z));
    }
    
    this.crvSegs=[];
    for(var i=0; i<this.pts.length-1; i++){
        var p=this.pts[i];
        var q=this.pts[i+1];
        var d=utilDi(p,q);
        if(d>0.01){
            this.crvSegs.push(new nsSeg(p,q));
        }
    }

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
        var material=new THREE.MeshPhongMaterial({color:new THREE.Color("rgb(200,200,70)"), side:THREE.DoubleSide});
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

    this.display=function(){
        var sp="";
        for(var i=0; i<this.pts.length; i++){
            console.log(this.pts[i]);
            var x=this.pts[i].x;
            var y=this.pts[i].y;
            var z=1;
            sp+=x+","+y+","+z+"\n";
        }
        var s="Site area: "+this.area+"\ncenter: "+this.cen+"\npoints: \n"+sp;
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
        var s="Site area: "+this.area+"\ncenter: "+this.cen+"\npoints: \n"+sp;
        return s;
    }
    
    this.getDiagonal=function(){
        var diagArr=new Array();
        for(var i=0; i<this.pts.length; i++){
            var p=this.pts[i];
            for(var j=0; j<this.pts.length; j++){
                var q=this.pts[j];
                var d=utilDi(p,q);
                if(d>0){
                    diagArr.push([p,q,d]);
                }
            }
        }
        diagArr.sort(function(a,b){
            return a[2]-b[2];
        });
        var dia=diagArr[diagArr.length-1];
        var p=dia[0];
        var q=dia[1];
        var d=dia[2];
        var s=new nsSeg(p,q);
        this.diag=s;
        siteDiagArr.push(this.diag.getObj());
        return this.diag;
    }
    
    this.genBB=function(){
        var sortable=[];
        for(var i=0; i<this.pts.length-1; i++){
            var x=parseFloat(this.pts[i].x);
            var y=parseFloat(this.pts[i].y);
            var z=parseFloat(this.pts[i].z);
            sortable.push([x,y,z]);
        }
        sortable.sort(function(a,b){
            return a[0]-b[0];
        });
        var minx=sortable[0][0];
        var maxx=sortable[sortable.length-1][0];
        sortable.sort(function(a,b){
            return a[1]-b[1];
        });
        var miny=sortable[0][1];
        var maxy=sortable[sortable.length-1][1];
        var p=new nsPt(minx,miny,0); //in order p-q-r-s //debugSphereZ(p,0.1,1);
        var q=new nsPt(maxx,miny,0); //in order p-q-r-s //
        var r=new nsPt(maxx,maxy,0); //in order p-q-r-s // debugSphereZ(r,0.2,1);
        var s=new nsPt(minx,maxy,0); //in order p-q-r-s //
        this.bb=new nsQuad(p,q,r,s);
        var sortable=[];
        sortable.push([utilDi(p,q)]);
        sortable.push([utilDi(q,r)]);
        sortable.push([utilDi(r,s)]);
        sortable.push([utilDi(s,p)]);
        sortable.sort(function(a,b){
            return a-b;
        })
        var minDi=sortable[0];
        var maxDi=sortable[sortable.length-1];
        return [this.bb,minDi,maxDi];
    }

    this.setBays=function(baydepth,extdepth){
        this.quadArr=[]; // updated dynamically
        this.subCellQuadArr=[]; // updated dynamically
        this.segArr=[]; // updated dynamically
        var p=this.diag.p; // point 1 on diag
        var q=this.diag.q; // point 2 on diag
        var norm=utilDi(p,q);
        var u=new nsPt((q.x-p.x)/norm, (q.y-p.y)/norm, 0); //unit vector pq
        var nR=new nsPt(-u.y, u.x, 0); // normal 1 to pq
        var nL=new nsPt(u.y, -u.x, 0); // normal 2 to pq
        var intxDepth=100 // some constant large enough to intersect with site
        var num=100; //number of iterations from p to q at bay depth
        for (var i=0; i<num; i++){
            var a=new nsPt(p.x+(u.x*i*baydepth), p.y+(u.y*i*baydepth), 0); // next point on diag pq
            var check0=ptInSeg(p,a,q);//check if a is in between pq else break
            if(check0===false){ break; }
            var b=new nsPt(a.x + nR.x*intxDepth, a.y + nR.y*intxDepth, 0); // right normal point 
            var c=new nsPt(a.x + nL.x*intxDepth, a.y + nL.y*intxDepth, 0); // left normal point
            var segI=this.getIntxSeg(a,b); // right intersection
            var segJ=this.getIntxSeg(a,c); // left intersection
            var I=segI.q;
            var J=segJ.q;
            if(I!==0 && J!==0){
                var seg=new nsSeg(I,J);
                var eI=new nsPt(I.x+(c.x-b.x)*extdepth/utilDi(b,c), I.y+(c.y-b.y)*extdepth/utilDi(b,c), 0);
                var eJ=new nsPt(J.x+(b.x-c.x)*extdepth/utilDi(b,c), J.y+(b.y-c.y)*extdepth/utilDi(b,c), 0);
                var check1=ptInSeg(b,eI,c);
                var check2=ptInSeg(b,eJ,c);
                if(check1===true && check2===true && utilDi(eI,eJ)>baydepth/2){
                    var reqseg=new nsSeg(eI,eJ);
                    this.segArr.push(reqseg);
                    var seg=reqseg.getObj();
                    siteSegArr.push(seg);//line added to global arr
                }   
            }
        }
    }

    this.getIntxSeg=function(R,S){
        var I;
        var sum1=0;
        for(var j=0; j<this.crvSegs.length; j++){
            var P=this.crvSegs[j].p;
            var Q=this.crvSegs[j].q;
            I=nsIntx(P,Q,R,S);
            if(I.x!==0 && I.y!==0){
                sum1++;
                break;
            }
        }
        if(sum1>0){
            var s3=new nsSeg(R,I);
            return s3;
        }else{
            return 0;
        }
    }

    this.processBays=function(baydepth){
        var segs=this.segArr;
        for(var i=0; i<segs.length-1; i++){
            var p=segs[i].p;
            var q=segs[i].q;
            var r=segs[i+1].q;
            var s=segs[i+1].p;
            var t=0;
            var quad=new nsQuad(p,q,r,s,i);
            this.quadArr.push(quad);//not for rendering
            var Q=quad.genQuad(0.25); //generates geometry for rendering
            siteQuadArr.push(Q);//global array for rendering
        }
    }
}
