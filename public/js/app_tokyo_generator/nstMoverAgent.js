class moverAgent{
    constructor(p, interpPts_, up, dn, le, ri, interpDistX, interpDistY){
        this.U=up;//unit vector up
        this.V=dn;//unit vector down
        this.W=le;//unit vector left
        this.X=ri;//unit vector right
        this.P=p; // initial point of mover
        this.interpPts=interpPts_; // interpolated points in site
        this.dirUp=0;//dir up occupied
        this.dirDn=0;//dir down occupied
        this.dirLe=0;//dir left occupied
        this.dirRi=0;//dir right occupied
        this.DistX=interpDistX;//distance X pq to be travelled =interp distance
        this.DistY=interpDistY;//distance Y ps to be travelled =interp distance
    }    
    move(counter){
        counter++;
        var q=new nsPt(-1000,-1000);
        var dir=Math.random();
        if(dir<0.25){
            q=this.moveUp();
        }else if(dir>0.25 && dir<0.5){
            q=this.moveDn();
        }else if(dir>0.5 && dir<0.75){
            q=this.moveLe();
        }else{
            q=this.moveRi();
        }
        var sum=0;
        for(var i=0; i<this.interpPts.length; i++){
            var p=this.interpPts[i];
            if(utilDi(p,q)<0.01){
                sum++;
                break;
            }
        }
        if(sum===0 && counter<100){
            this.move(counter);
        }else if(sum>0){
            var seg=new moverSeg(this.P,q)
            seg.display();
        }else if(counter===100){
            q= new nsPt(-1,-1,-1);
        }        
    }    
    moveUp(){
        var q=new nsPt(this.P.x+this.U.x*this.DistY, this.P.y+this.U.y*this.DistY, 0);
        return q;
    }
    moveDn(){
        var q=new nsPt(this.P.x+this.V.x*this.DistY, this.P.y+this.V.y*this.DistY, 0);
        return q;
    }
    moveLe(){
        var q=new nsPt(this.P.x+this.W.x*this.DistX, this.P.y+this.W.y*this.DistX, 0);
        return q;
    }
    moveRi(){
        var q=new nsPt(this.P.x+this.X.x*this.DistX, this.P.y+this.X.y*this.DistX, 0);
        return q;
    }
}

class moverSeg{
    constructor(p,q){
        this.p=p;
        this.q=q;
    }
    display(){
        debugLine(this.p, this.q);
    }
}