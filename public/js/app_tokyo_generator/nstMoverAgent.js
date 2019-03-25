var moverAgent=function(pt_, interpPts_, up, dn, le, ri, interpDist){
    this.dirUp=0;//dir up occupied
    this.dirDn=0;//dir down occupied
    this.dirLe=0;//dir left occupied
    this.dirRi=0;//dir right occupied
    this.Dist=interpDist;//distance to be travelled =interp distance

    this.U=up;//unit vector up
    this.V=dn;//unit vector down
    this.W=le;//unit vector left
    this.X=ri;//unit vector right

    this.P=pt_; // initial point of mover
    this.interpPts=interpPts_; // interpolated points in site

    this.move=function(counter){
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
        if(sum===0 && counter<10){
            this.move(counter);
        }
        return q;
    }

    this.moveUp=function(){
        var q=new nsPt(this.P.x+this.U.x*this.Dist, this.P.y+this.U.y*this.Dist, 0);
        return q;
    }
    this.moveDn=function(){
        var q=new nsPt(this.P.x+this.V.x*this.Dist, this.P.y+this.V.y*this.Dist, 0);
        return q;
    }
    this.moveLe=function(){
        var q=new nsPt(this.P.x+this.W.x*this.Dist, this.P.y+this.W.y*this.Dist, 0);
        return q;
    }
    this.moveRi=function(){
        var q=new nsPt(this.P.x+this.X.x*this.Dist, this.P.y+this.X.y*this.Dist, 0);
        return q;
    }
}




