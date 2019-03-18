//quad object
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

    // allocate type or function to celll
    this.type="";
    this.class="";
    this.occupied=false;
    this.displayType=function(){
        var s="type: "+this.type;
        return s;
    }

    this.mp=function(){
        var p=new nsPt((this.p.x+this.r.x)/2, (this.p.y+this.r.y)/2, (this.p.z+this.s.z)/2);
        return p;
    }
    
    this.area=function(){
        var a=utilDi(this.p, this.q);
        var b=utilDi(this.q, this.r);
        var c=utilDi(this.r, this.s);
        var d=utilDi(this.s, this.p);
        var s=(a+b+c)/2;
        var ar1=Math.sqrt(s*(s-a)*(s-b)*(s-c));
        s=(a+d+c)/2;
        var ar2=Math.sqrt(s*(s-a)*(s-d)*(s-c));
        var ar=ar1+ar2;
        return ar;
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
        
        var matx;
        if(this.periphery===true){
            matx=new THREE.LineBasicMaterial({color: new THREE.Color("rgb(75,255,0)")});
        }
        if(this.building===true){
            matx=new THREE.LineBasicMaterial({color: new THREE.Color("rgb(255,0,0)")});
        }        
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
            if(utilDi(a,b)>baydepth*2 || utilDi(c,d)>baydepth*2){
            }else{
                var quad=new nsQuad(a,b,c,d);
                if(i==0 || i>segArr.length-3){
                 quad.periphery=true;   
                }
                this.subCellQuads.push(quad);
            }
        }
    }
}





