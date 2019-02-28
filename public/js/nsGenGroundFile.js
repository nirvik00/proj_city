
var clrGround=function(){
       for (var i = 0; i < pathArr.length; i++) {
         pathArr[i].geometry.dispose();
         pathArr[i].material.dispose();
         scene.remove(pathArr[i]);
       }
       for (var i = 0; i < roadArr.length; i++) {
         roadArr[i].geometry.dispose();
         roadArr[i].material.dispose();
         scene.remove(roadArr[i]);
       }
       for (var i = 0; i < greenArr.length; i++) {
         greenArr[i].geometry.dispose();
         greenArr[i].material.dispose();
         scene.remove(greenArr[i]);
       }
       for (var i = 0; i < intxArr.length; i++) {
         intxArr[i].geometry.dispose();
         intxArr[i].material.dispose();
         scene.remove(intxArr[i]);
       }
       for (var i = 0; i < groundArr.length; i++) {
         groundArr[i].geometry.dispose();
         groundArr[i].material.dispose();
         scene.remove(groundArr[i]);
       }
       for (var i = 0; i < evacArr.length; i++) {
         evacArr[i].geometry.dispose();
         evacArr[i].material.dispose();
         scene.remove(evacArr[i]);
       }
       for (var i = 0; i < mstArr.length; i++) {
         mstArr[i].geometry.dispose();
         mstArr[i].material.dispose();
         scene.remove(mstArr[i]);
       }
       pathArr = Array();
       roadArr = Array();
       greenArr = Array();
       groundArr = Array();
       evacArr=[];
       intxArr=[];
       mstArr=[];
     }
     
     var genGroundTiles=function(){
       for (var i = 0; i < pathArr.length; i++) {
         scene.add(pathArr[i]);
       }
       for (var i = 0; i < roadArr.length; i++) {
         scene.add(roadArr[i]);
       }
       for (var i = 0; i < greenArr.length; i++) {
         scene.add(greenArr[i]);
       }  
       for (var i = 0; i < intxArr.length; i++) {
         scene.add(intxArr[i]);
       }    
       for (var i = 0; i < evacArr.length; i++) {
         scene.add(evacArr[i]);
       }
       for (var i = 0; i < groundArr.length; i++) {
         scene.add(groundArr[i]);
       }
       for (var i = 0; i < mstArr.length; i++) {
         scene.add(mstArr[i]);
       }
     }
     
     //generate the passage: returnNodeType
     var constructGroundTiles = function(doRandom) {
       clrGround();
       var pathQuadArr = Array();
       var w = (varCellNumLe - 1) / 2;
       var t = (varCellNumDe - 1) / 2;
       mstArr=[]
       circulationQuads=[];
       var offset=bldgGuiControls.global_offset;
       genCirculationCorner(doRandom,offset);
       genCirculationLinear(doRandom,offset);
       for (var i = 0; i < circulationQuads.length; i++) {
         var name = circulationQuads[i].type;
         var ht=0.0;
         //if(name==="MST"){
           //ht=0.15;
         //}
         var PA = new setPath(circulationQuads[i], name, ht);
         PA.generateGround();
       }
       genGroundTiles(); // definition files
     };
     
     function getRandomType(){
       var type;
       var t=Math.random();
       if (t < 0.35) {
         type = "road";
       } else if (t >= 0.35 && t < 0.75) {
         type = "path";
       } else if (t >= 0.75) {
         type = "green";
       }else {
         type = "MST";
       }
       return type;
     }
     
     //util function to generate linear circulation along edge : hor / ver
     var genCirculationLinear=function(doRandom, offset){
       for(var i=0; i<networkEdgesArr.length; i++){
         var type;
         if(doRandom===false){
           type=networkEdgesArr[i].getType();
         }else{
           type=getRandomType();
         }    
         var a=networkEdgesArr[i].getNode0().getPt();
         var b=networkEdgesArr[i].getNode1().getPt();
         var p,q;
         if(a.x===b.x && a.z<b.z){
           p=a; q=b;
           genVerticalCirculationQuad(p,q, offset, type);
         }else if(a.x===b.x && a.z>b.z){
           p=b; q=a;
           genVerticalCirculationQuad(p,q, offset, type);
         }else if(a.x<b.x && a.z===b.z){
           p=a; q=b;
           genHorizontalCirculationQuad(p,q, offset, type);
         }else if(a.x>b.x && a.z===b.z){
           p=b; q=a;
           genHorizontalCirculationQuad(p,q, offset, type);
         }
       }
     }
     
     //util function to generate linear circulation along edge : ver
     var genVerticalCirculationQuad=function(p,q,offset, type){
       var a,b,c,d;
       var r=0.5*offset;
       //if(type==="green" || type==="path"){
         //a=new nsPt(p.x-offset, p.y, p.z+offset);
         //b=new nsPt(p.x+offset, p.y, p.z+offset);
         //c=new nsPt(q.x+offset, q.y, q.z-offset);
         //d=new nsPt(q.x-offset, q.y, q.z-offset);
       //}else if(type === "road"){
       var r=0.5*offset;
       a=new nsPt(p.x-r, p.y, p.z+2*r);
       b=new nsPt(p.x+r, p.y, p.z+2*r);
       c=new nsPt(q.x+r, q.y, q.z-2*r);
       d=new nsPt(q.x-r, q.y, q.z-2*r);
       if(type === "MST"){
         //mst
         a=new nsPt(p.x-2*r, p.y, p.z+2*r);
         b=new nsPt(p.x-r, p.y, p.z+2*r);
         c=new nsPt(q.x-r, q.y, q.z-2*r);
         d=new nsPt(q.x-2*r, q.y, q.z-2*r);
         
         e=new nsPt(p.x+2*r, p.y, p.z+2*r);
         f=new nsPt(q.x+2*r, q.y, q.z-2*r);
         g=new nsPt(q.x+r, q.y, q.z-2*r);
         h=new nsPt(p.x+r, p.y, p.z+2*r);
     
         var quad2=new nsQuad(e,f,g,h);
         quad2.type=type;
         circulationQuads.push(quad2);
       }
       var quad=new nsQuad(a,b,c,d);
       quad.type=type;
       circulationQuads.push(quad);
     }
     
     //util function to generate  linear circulation along edge : hor
     var genHorizontalCirculationQuad=function(p,q,offset, type){
       var a,b,c,d;
       var r=0.5*offset;
       //if(type==="green" || type==="path" || type==="intx"){
         //a=new nsPt(p.x+offset, p.y, p.z-offset);
         //b=new nsPt(q.x-offset, q.y, q.z-offset);
         //c=new nsPt(q.x-offset, q.y, p.z+offset);
         //d=new nsPt(p.x+offset, p.y, p.z+offset);
       //}else if(type === "road"){
         a=new nsPt(p.x+2*r, p.y, p.z-r);
         b=new nsPt(q.x-2*r, q.y, q.z-r);
         c=new nsPt(q.x-2*r, q.y, p.z+r);
         d=new nsPt(p.x+2*r, p.y, p.z+r);
       if(type === "MST"){
         //top MST
         //var r=0.5*offset;
         a=new nsPt(p.x+2*r, p.y, p.z-2*r);
         b=new nsPt(q.x-2*r, q.y, q.z-2*r);
         c=new nsPt(q.x-2*r, q.y, q.z-r);
         d=new nsPt(p.x+2*r, p.y, p.z-r);
     
         e=new nsPt(p.x+2*r, p.y, p.z+r);
         f=new nsPt(q.x-2*r, q.y, q.z+r);
         g=new nsPt(q.x-2*r, q.y, q.z+2*r);
         h=new nsPt(p.x+2*r, p.y, p.z+2*r);
         var quad2=new nsQuad(e,f,g,h);
         quad2.type=type;
         circulationQuads.push(quad2);
       }
       var quad=new nsQuad(a,b,c,d);
       quad.type=type;
       circulationQuads.push(quad);
     }
     
     //util function to find and render intersection between circulation routes
     var genCirculationCorner=function(doRandom,offset){
       for(var i=0; i<networkNodesArr.length; i++){
         var a=networkNodesArr[i].getPt();
         var type;
         if(doRandom===false){
           var numIntx=0;
           var numGreen=0;
           var numPath=0;
           var numRoad=0; 
           for(var j=0; j<networkEdgesArr.length; j++){
             var b=networkEdgesArr[j].getNode0().getPt();
             var c=networkEdgesArr[j].getNode1().getPt();
             if((utilDi(a,b)<0.01 && utilDi(a,c)>0.01) || (utilDi(a,c)<0.01 && utilDi(a,b)>0.01)){
               if(networkEdgesArr[j].getType() === "intx"){
                 numIntx++;
               }else if(networkEdgesArr[j].getType() === "green"){
                 numGreen++;
               }else if(networkEdgesArr[j].getType() === "path"){
                 numPath++;
               }else if(networkEdgesArr[j].getType() === "road"){
                 numRoad++;
               }
             }
           }
           var type="path";
           if(numIntx>0){ type = "intx"; }
           else if(numGreen>0 && numRoad>0){ type = "intx"; }
           else if(numGreen>0 && numRoad<1){ type = "green"; }
           else if(numGreen<1 && numRoad>0){ type = "road"; }
           else{type="path";}
         }else{
           type=getRandomType();
         }  
         var p=new nsPt(a.x-offset, a.y, a.z-offset);
         var q=new nsPt(a.x+offset, a.y, a.z-offset);
         var r=new nsPt(a.x+offset, a.y, a.z+offset);
         var s=new nsPt(a.x-offset, a.y, a.z+offset);   
         //debugQuad(p,q,r,s);
         var quad=new nsQuad(p,q,r,s);
         quad.type=type;
         circulationQuads.push(quad);
       }
     }
     
     