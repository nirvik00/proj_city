class moverAgent{
    constructor(site){
        this.U=site.U;//unit vector up
        this.V=site.V;//unit vector down
        this.W=site.W;//unit vector left
        this.X=site.X;//unit vector right        
        this.interpPts=site.interpPts; // interpolated points in site
        this.dirUp=0;//dir up occupied
        this.dirDn=0;//dir down occupied
        this.dirLe=0;//dir left occupied
        this.dirRi=0;//dir right occupied
        this.DistX=site.interpDiffX;//distance X pq to be travelled =interp distance
        this.DistY=site.interpDiffY;//distance Y ps to be travelled =interp distance        
        this.nodes=[];
        this.nodes.push(this.P);
        this.init();        
    }

    init(){
        for(var i=0; i<this.interpPts.length; i++){
            this.move(0);
        }        
    }
    
    move(counter){        
        var idx= Math.floor(Math.random()*(this.interpPts.length-1));  
        var p=this.interpPts[idx];        
        var q=new nsPt(-1000,-1000,0);
        var dir=Math.random();
        if(dir<0.25){
            q=this.moveUp(p,q);
        }else if(dir>0.25 && dir<0.5){
            q=this.moveDn(p,q);
        }else if(dir>0.5 && dir<0.75){
            q=this.moveLe(p,q);
        }else{
            q=this.moveRi(p,q);
        }
        var sum=0;
        for(var i=0; i<this.interpPts.length; i++){
            var r=this.interpPts[i];
            if(utilDi(r,q)<0.01){
                sum++;
                break;
            }
        }
        if(sum===0 && counter<100){
            counter++;
            this.move(counter);
        }else if(sum>0){
           var seg=new moverSeg(p,q);
           seg.display();
        }  
    }    
    moveUp(p,q){
        var q=new nsPt(p.x+this.U.x*this.DistY, p.y+this.U.y*this.DistY, 0);
        return q;
    }
    moveDn(p,q){
        var q=new nsPt(p.x+this.V.x*this.DistY, p.y+this.V.y*this.DistY, 0);
        return q;
    }
    moveLe(p,q){
        var q=new nsPt(p.x+this.W.x*this.DistX, p.y+this.W.y*this.DistX, 0);
        return q;
    }
    moveRi(p,q){
        var q=new nsPt(p.x+this.X.x*this.DistX, p.y+this.X.y*this.DistX, 0);
        return q;
    }
}

class moverSeg{
    constructor(p_,q_){
        this.p=p_;
        this.q=q_;
    }
    display(){
        debugLine(this.p, this.q);
    }
}