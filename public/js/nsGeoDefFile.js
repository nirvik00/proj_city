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
    var norm=Math.sqrt(dx*dx + dy*dy + dz*dz);
    var u=new nsPt(dx/norm, dy/norm, dz/norm);
    return u;
}