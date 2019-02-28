
var clrBuildings=function(){
  for (var i = 0; i < GCNCubeArr.length; i++) {
    GCNCubeArr[i].geometry.dispose();
    GCNCubeArr[i].material.dispose();
    scene.remove(GCNCubeArr[i]);
  }
  for (var i = 0; i < NCNCubeArr.length; i++) {
    NCNCubeArr[i].geometry.dispose();
    NCNCubeArr[i].material.dispose();
    scene.remove(NCNCubeArr[i]);
  }
  for (var i = 0; i < RCNCubeArr.length; i++) {
    RCNCubeArr[i].geometry.dispose();
    RCNCubeArr[i].material.dispose();
    scene.remove(RCNCubeArr[i]);
  }
  GCNCubeArr = Array();
  NCNCubeArr = Array();
  RCNCubeArr = Array();
}

function addBldgs(){
  for (var i = 0; i < GCNCubeArr.length; i++) {
    scene.add(GCNCubeArr[i]);
  }
  for (var i = 0; i < NCNCubeArr.length; i++) {
    scene.add(NCNCubeArr[i]);
  }
  for (var i = 0; i < RCNCubeArr.length; i++) {
    scene.add(RCNCubeArr[i]);
  }
  for (var i = 0; i < evacArr.length; i++) {
    scene.add(evacArr[i]);
  }
}

//MAIN DRIVER FUNCTION generate the cubes
var genCubes = function(doRandom) {
  var numGcnSubCells=0;
  var numNcnSubCells=0;
  var numRcnSubCells=0;
  //var subCellQuadArr=[];
  clrBuildings();
  cellQuadsAlignment(); //sets the cell Area for gcn, ncn, rcn based on node type
  genSubCells();
  //allocateSubCellsRandomShuffle();
  allocateSubCells();
  addBldgs();
};


function genSubCells(){
  for (var i = 0; i < cellQuadArr.length; i++) {
    var gcnAr=cellQuadArr[i].gcnArea;
    var ncnAr=cellQuadArr[i].ncnArea;
    var rcnAr=cellQuadArr[i].rcnArea;

    //console.log(i+". Areas: "+gcnAr+", "+ncnAr+", "+rcnAr);
    var quad = cellQuadArr[i];  
    var offset=bldgGuiControls.global_offset+0.1;
    var p=new nsPt(quad.p.x+offset, quad.p.y, quad.p.z+offset);
    var q=new nsPt(quad.q.x-offset, quad.q.y, quad.q.z+offset);
    var r=new nsPt(quad.r.x-offset, quad.r.y, quad.r.z-offset);
    var s=new nsPt(quad.s.x+offset, quad.s.y, quad.s.z-offset);    
    var quadAr=gcnAr+ncnAr+rcnAr;


    //find the longest side
    var d_pq=utilDi(p,q);
    var d_qr=utilDi(q,r);
    if(d_pq < d_qr){
      var t= new nsPt((p.x+q.x)/2, 0, (p.z+q.z)/2);
      var u= new nsPt((r.x+s.x)/2, 0, (r.z+s.z)/2);
      var D=(((7/8)*utilDi(p,t))>1)? 1 : utilDi(p,t);
      var p_=new nsPt((D*(q.x-p.x))/utilDi(q,p) + p.x, 0, (D*(q.z-p.z))/utilDi(q,p) + p.z);
      var s_=new nsPt((D*(r.x-s.x))/utilDi(r,s) + s.x, 0, (D*(r.z-s.z))/utilDi(r,s) + s.z);
      //quad1=new nsQuad(p,p_,s_,s,0);
      var quad1=genVerSubCells(p,p_,s_,s);
      try{
        for(var j=0; j<quad1.length; j++){
          cellQuadArr[i].subCellQuads.push(quad1[j]);
        }
      }catch(err){}
      var q_=new nsPt((D*(t.x-q.x))/utilDi(t,q) + q.x, 0, (D*(t.z-q.z))/utilDi(t,q) + q.z);
      var r_=new nsPt((D*(u.x-r.x))/utilDi(r,u) + r.x, 0, (D*(u.z-r.z))/utilDi(r,u) + r.z);
      //quad2=new nsQuad(q_,q,r,r_);
      var quad2=genVerSubCells(q_,q,r,r_);
      try{
        for(var j=0; j<quad2.length; j++){
          cellQuadArr[i].subCellQuads.push(quad2[j]);
        }
      }catch(err){}
    } else { //pq>qr : horizontal
      var t=new nsPt((p.x+s.x)/2, 0, (p.z+s.z)/2); 
      var u=new nsPt((q.x+r.x)/2, 0, (q.z+r.z)/2); 
      var D=(((7/8)*utilDi(p,t))>1)?1:utilDi(p,t);
      var q_=new nsPt((D*(u.x-q.x))/(utilDi(u,q)) + q.x, 0, (D*(u.z-q.z))/(utilDi(u,q)) + q.z);
      var p_=new nsPt((D*(t.x-p.x))/(utilDi(t,p)) + p.x, 0, (D*(t.z-p.z))/(utilDi(t,p)) + p.z);
      //quad1=new nsQuad(p,q,q_,p_);
      var quad1=genHorSubCells(p,q,q_,p_);
      try{
        for(var j=0; j<quad1.length; j++){
          cellQuadArr[i].subCellQuads.push(quad1[j]);
        }
      }catch(err){}
      var r_=new nsPt((D*(u.x-r.x))/(utilDi(u,r)) + r.x, 0, (D*(u.z-r.z))/(utilDi(u,r)) + r.z);
      var s_=new nsPt((D*(t.x-s.x))/(utilDi(t,s)) + s.x, 0, (D*(t.z-s.z))/(utilDi(t,s)) + s.z);
      //quad2=new nsQuad(s_,r_,r,s);
      var quad2=genHorSubCells(s_,r_,r,s);
      try{
        for(var j=0; j<quad2.length; j++){
          cellQuadArr[i].subCellQuads.push(quad2[j]);
        }
      } catch(err){}
    }
  }
}

//randomly place buildings

function allocateSubCellsRandomShuffle(){
  var cumuArea=0.0;
  for(var i=0; i<cellQuadArr.length; i++){
    var subCellQuadArr=cellQuadArr[i].subCellQuads;
    var mainQuad=cellQuadArr[i];
    //console.log(i+". Areas= " + mainQuad.gcnArea+", "+mainQuad.ncnArea+", "+mainQuad.rcnArea);
    cumuArea+=mainQuad.gcnArea+mainQuad.ncnArea+mainQuad.rcnArea;
    var arCell=0.0;
    for(var j=0; j<subCellQuadArr.length; j++){
      var p=subCellQuadArr[j].mp();
      var minDi=1000000000;
      var type;
      for(var k=0; k<networkEdgesArr.length; k++){
        var q=networkEdgesArr[k].getMp();
        if(utilDi(p,q)<minDi){
          minDi=utilDi(p,q);
          type=networkEdgesArr[k].getType();
        }
      }
      var a=subCellQuadArr[j].p;
      var b=subCellQuadArr[j].q;
      var c=subCellQuadArr[j].r;
      var d=subCellQuadArr[j].s;
      arCell=utilDi(a,b)*utilDi(b,c);
    }

    numCellsNcn=Math.ceil(parseFloat(mainQuad.ncnArea)/parseFloat(arCell));
    numCellsRcn=Math.ceil(parseFloat(mainQuad.rcnArea)/parseFloat(arCell));
    
    var totalNum=subCellQuadArr.length;
    var totalArea=mainQuad.gcnArea+mainQuad.ncnArea+mainQuad.rcnArea;
    numCellsGcn=Math.ceil(totalNum*mainQuad.gcnArea/totalArea);
    numCellsNcn=Math.ceil(totalNum*mainQuad.ncnArea/totalArea);
    numCellsRcn=Math.ceil(totalNum*mainQuad.rcnArea/totalArea);

    
    //console.log(arCell+"; numbers = "+ numCellsGcn+", "+ numCellsNcn +", "+ numCellsRcn+ " -"+totalNum+", "+totalArea);
    
    shuffleArray(subCellQuadArr);
    var numCellsGcnGot=0;
    var numCellsNcnGot=0;
    var numCellsRcnGot=0;
    var counter=0;
    for(var j=0; j<subCellQuadArr.length; j++){
      if(numCellsGcnGot<numCellsGcn){
        var quad=subCellQuadArr[j];
        quad.type="GCN";
        quad.genCube(numCellsGcn);
        numCellsGcnGot++;
        counter++;
      }      
    }
    for(var j=counter; j<subCellQuadArr.length; j++){
      if(numCellsNcnGot<numCellsNcn){
        var quad=subCellQuadArr[j];
        quad.type="NCN";
        quad.genCube(numCellsNcn);
        numCellsNcnGot++;
        counter++;
      }      
    }
    for(var j=counter; j<subCellQuadArr.length; j++){
      if(numCellsRcnGot<numCellsRcn){
        var quad=subCellQuadArr[j];
        quad.type="RCN";
        quad.genCube(numCellsRcn);
        numCellsRcnGot++;
        counter++;
      }      
    }
  }
  //console.log("\nTotal Area= "+cumuArea);
}

function allocateSubCells(){
  var cumuArea=0.0;
  var CellAr=0.0;
  for(var i=0; i<cellQuadArr.length; i++){
    var subCellQuadArr=cellQuadArr[i].subCellQuads;
    var mainQuad=cellQuadArr[i];
    //console.log(i+". Areas= " + mainQuad.gcnArea+", "+mainQuad.ncnArea+", "+mainQuad.rcnArea);
    cumuArea+=(mainQuad.gcnArea+mainQuad.ncnArea+mainQuad.rcnArea);
    var arCell=0.0;
    for(var j=0; j<subCellQuadArr.length; j++){
      var p=subCellQuadArr[j].mp();
      var minDi=1000000000;
      var type;
      for(var k=0; k<networkEdgesArr.length; k++){
        var q=networkEdgesArr[k].getMp();
        if(utilDi(p,q)<minDi){
          minDi=utilDi(p,q);
          type=networkEdgesArr[k].getType();
        }
      }
      var a=subCellQuadArr[j].p;
      var b=subCellQuadArr[j].q;
      var c=subCellQuadArr[j].r;
      var d=subCellQuadArr[j].s;
      arCell=utilDi(a,b)*utilDi(b,c);
      CellAr=arCell;
    }

    //total number of sub cells
    var totalNum=subCellQuadArr.length; 
    
    //total area required for all cells of the quad
    var totalArea=mainQuad.gcnArea+mainQuad.ncnArea+mainQuad.rcnArea; 
    
    // find proportion of area of each type allocated to a cell
    var pGcnAreaCell=mainQuad.gcnArea/totalNum;
    var pNcnAreaCell=mainQuad.ncnArea/totalNum;
    var pRcnAreaCell=mainQuad.rcnArea/totalNum;
    // var checkArea=pGcnAreaCell+ pNcnAreaCell + pRcnAreaCell;  
    // console.log(arCell.toFixed(2)+"; area types = "+ pGcnAreaCell.toFixed(2)+", "+ pNcnAreaCell.toFixed(2) +", "+ pRcnAreaCell.toFixed(2) + " : "+totalNum+", total Area="+totalArea.toFixed(2) +", check Area="+checkArea.toFixed(2));
    
    // find edge type and generate the buildings
    var sortedSubCells=sortSubCellsByDistFromEdgeType(subCellQuadArr, mainQuad);
    for(var j=0; j<sortedSubCells.length; j++){
      var cell=sortedSubCells[j];
      cell.gcnArea=pGcnAreaCell;
      cell.ncnArea=pNcnAreaCell;
      cell.rcnArea=pRcnAreaCell;
      cell.cellArea=CellAr;
      cell.display();
      cell.genCube();
    }
  }
  //console.log("\nTotal Area= "+cumuArea);
}

function genHorSubCells(p,q,r,s){
  var subCellQuadArr=[];
  var t=0.3;
  var u=new nsPt((q.x-p.x),(q.y-p.y),(q.z-p.z));
  var v=new nsPt((r.x-s.x),(r.y-s.y),(r.z-s.z));
  for(var i=0.0; i<1.0-t; i+=t){
    var a=new nsPt( p.x + (u.x*i), p.y, p.z + (u.z*i) );
    var b=new nsPt( p.x + (u.x*(i+t)), p.y, p.z + u.z*(i+t));
    var c=new nsPt( s.x + (v.x*(i+t)), s.y, s.z + (v.z*(i+t)) );
    var d=new nsPt( s.x + (v.x*i), s.y, s.z + (v.z*i) );
    var quad=new nsQuad(a,b,c,d);      
    subCellQuadArr.push(quad);
  }
  return subCellQuadArr;
}

function genVerSubCells(p,q,r,s){
  var subCellQuadArr=[];
  var t=0.3;
  var u=new nsPt((r.x-q.x),(r.y-q.y),(r.z-q.z));
  var v=new nsPt((s.x-p.x),(s.y-p.y),(s.z-p.z));
  for(var i=0.0; i<1.0-t; i+=t){
    var a=new nsPt( p.x + (v.x*i), p.y, p.z + (v.z*i) );
    var b=new nsPt( q.x + (u.x*(i)), q.y, q.z + u.z*(i));
    var c=new nsPt( q.x + (v.x*(i+t)), q.y, q.z + (v.z*(i+t)) );
    var d=new nsPt( p.x + (v.x*(i+t)), p.y, p.z + (v.z*(i+t)) );
    var quad=new nsQuad(a,b,c,d);      
    subCellQuadArr.push(quad);
    //debugQuad(a,b,c,d);
  }
  return subCellQuadArr;
}

function cellQuadsAlignment() {

  //normalize the FSR input to 1 and then distribute the FSR
  var gcnFsr=bldgGuiControls.GCN_FSR
  var ncnFsr=bldgGuiControls.NCN_FSR
  var rcnFsr=bldgGuiControls.RCN_FSR
  var sumFsr= (gcnFsr + ncnFsr + rcnFsr);

  //total bua required
  var bua=(cellQuadArr.length*varCellLe*varCellDe)*sumFsr;
  
  //area of each type based on normalized FSR
  var gcnArea = bua * gcnFsr/sumFsr;
  var rcnArea = bua * rcnFsr/sumFsr;
  var ncnArea = bua * ncnFsr/sumFsr; 

  //console.log(gcnArea + ", " + ncnArea + ", " + rcnArea);
  var GCNCellsArr = [];
  var NCNCellsArr = [];
  var RCNCellsArr = [];

  // calculate the number of node of each type for each quad
  // set the gcn, ncn, rcn ratios to the quad based on the number above
  // add quads to gcnArr, ncnArr, rcnArr
  var cumuGcnRat=0;
  var cumuNcnRat=0;
  var cumuRcnRat=0;
  for (var i = 0; i < cellQuadArr.length; i++) {
    var p = cellQuadArr[i].p;
    var q = cellQuadArr[i].q;
    var r = cellQuadArr[i].r;
    var s = cellQuadArr[i].s;
    var NCNRat = 0;
    var GCNRat = 0;
    var RCNRat = 0;
    for (var j = 0; j < networkNodesArr.length; j++) {
      var a = networkNodesArr[j].getPt();
      var dp = utilDi(p, a);
      var dq = utilDi(q, a);
      var dr = utilDi(r, a);
      var ds = utilDi(s, a);
      if (dp < 0.01 || dq<0.01 || dr<0.01 || ds<0.01) {
        var t = networkNodesArr[j].getType();
        if (t === "RCN") {
          RCNRat++; cumuRcnRat++;
          RCNCellsArr.push(cellQuadArr[i]);
        } else if (t === "GCN") {
          GCNRat++; cumuGcnRat++;
          GCNCellsArr.push(cellQuadArr[i]);
        } else if (t === "NCN") {
          NCNRat++; cumuNcnRat++;
          NCNCellsArr.push(cellQuadArr[i]);
        }
      }
    }
    cellQuadArr[i].gcnRat = GCNRat;
    cellQuadArr[i].ncnRat = NCNRat;
    cellQuadArr[i].rcnRat = RCNRat;    
  }
  console.log("\n\n\nArea distribution:");
  console.log("Bua: "+bua);
  console.log("FSR req: G ="+gcnArea+", N="+ncnArea +", R= "+rcnArea);
  console.log("Number of Cells: \nG="+GCNCellsArr.length+", N="+ NCNCellsArr.length +", R="+RCNCellsArr.length);
  // set the area of gcn, ncn, rcn to each quad
  // area set is given by the node distribution per cell 
  var cumuGcnArea=0;var cumuNcnArea=0; var cumuRcnArea=0;
  for(var i=0; i<cellQuadArr.length; i++){
    if(cellQuadArr[i].gcnRat>0){
      cellQuadArr[i].gcnArea=gcnArea*cellQuadArr[i].gcnRat/cumuGcnRat;
      cumuGcnArea+=cellQuadArr[i].gcnArea;
    }
    if(cellQuadArr[i].ncnRat>0){
      cellQuadArr[i].ncnArea=ncnArea*cellQuadArr[i].ncnRat/cumuNcnRat;
      cumuNcnArea+=cellQuadArr[i].ncnArea;
    }
    if(cellQuadArr[i].rcnRat>0) {
      cellQuadArr[i].rcnArea=rcnArea*cellQuadArr[i].rcnRat/cumuRcnRat;
      cumuRcnArea+=cellQuadArr[i].rcnArea;
    }
  }

  console.log("\n\n\nGot Areas :\nCumulative areas : G=" + cumuGcnArea + ", N="+cumuNcnArea + ", R="+cumuRcnArea);
  console.log("Total Area : " + (cumuGcnArea+ cumuNcnArea +cumuRcnArea));
}

function sortSubCellsByDistFromEdgeType(cells,quad){
  var p=quad.p;
  var q=quad.q;
  var r=quad.r;
  var s=quad.s;
  var e0,e1,e2,e3;
  var tmpEdges=[];
  for(var i=0; i<networkEdgesArr.length; i++){
    var a=networkEdgesArr[i].getNode0().getPt();
    var b=networkEdgesArr[i].getNode1().getPt();
    if((utilDi(p,a)<0.01 && utilDi(q,b)<0.01) || (utilDi(p,b)<0.01 && utilDi(q,a)<0.01)){
      e0=networkEdgesArr[i];
      tmpEdges.push(e0);
    }

    if((utilDi(q,a)<0.01 && utilDi(r,b)<0.01) || (utilDi(q,b)<0.01 && utilDi(r,a)<0.01)){
      e1=networkEdgesArr[i];
      tmpEdges.push(e1);
    }
    if((utilDi(r,a)<0.01 && utilDi(s,b)<0.01) || (utilDi(r,b)<0.01 && utilDi(s,a)<0.01)){
      e2=networkEdgesArr[i];
      tmpEdges.push(e2);
    }
    if((utilDi(s,a)<0.01 && utilDi(p,b)<0.01) || (utilDi(s,b)<0.01 && utilDi(p,a)<0.01)){
      e3=networkEdgesArr[i];
      tmpEdges.push(e3);
    }
  }
  //console.log("length of tmp edges = "+ tmpEdges.length);
  if(tmpEdges.length<1){
    return cells;
  }

  var f=bldgGuiControls.global_offset+(gridGuiControls.cell_Length+gridGuiControls.cell_Depth)/5;
  for(var i=0; i<cells.length; i++){
    var intxEdges=[];
    var pC=cells[i].mp();
    var c0=new nsPt(pC.x, 0, pC.z+f); // up
    var d0=new nsPt(pC.x, 0, pC.z-f); // down
    var a0=new nsPt(pC.x+f, 0, pC.z); // right
    var b0=new nsPt(pC.x-f, 0, pC.z); // left
    intxEdges.push(new nsEdge(pC,c0));
    intxEdges.push(new nsEdge(pC,d0));
    intxEdges.push(new nsEdge(pC,a0));
    intxEdges.push(new nsEdge(pC,b0));
    
    // debugLine(pC,c0,0);
    // debugLine(pC,d0,0);
    // debugLine(pC,a0,0);
    // debugLine(pC,b0,0);
    // debugSphere(pC,0.1);
    
    for(var j=0; j<intxEdges.length; j++){
      var e=intxEdges[j];
      var p0=new nsPt(e.p.x,0,e.p.z);
      var q0=new nsPt(e.q.x,0,e.q.z);
      for(var k=0; k<tmpEdges.length; k++){
        var g=tmpEdges[k];        
        var r0=new nsPt(g.p.x,0,g.p.z);
        var s0=new nsPt(g.q.x,0,g.q.z);
        var t=checkIntx(p0,q0,r0,s0);
        if(t===true){
          if(g.type==="green"){
            cells[i].setType("GCN");
            break;
          }else if(g.type==="path"){
            cells[i].setType("NCN");
          }else if(g.type==="road"){
            cells[i].setType("RCN");
          }          
        }
      }
    }    
  }
  return cells;
}

function checkIntx(p,q,r,s){
  var a1=q.z-p.z; var b1=p.x-q.x; var c1=(a1*q.x)+(b1*q.z);
  var a2=s.z-r.z; var b2=r.x-s.x; var c2=(a2*s.x)+(b2*s.z);
  var det=((a1*b2)-(a2*b1));
  var x=((c1*b2)-(c2*b1))/det; var z=((c2*a1)-(c1*a2))/det;
  
  var pt=new nsPt(x,0,z);  
  //console.log(pt);
  //check:
  var d_pq=Math.abs(utilDi(p,pt)+utilDi(pt,q)-utilDi(p,q));
  var d_rs=Math.abs(utilDi(r,pt)+utilDi(pt,s)-utilDi(r,s));
  if(d_pq<0.1 && d_rs<0.1){
    //console.log("INTX found");
    //debugSphere(pt, 0.25);
    return true;
  }
}