
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

//generate the cubes
var genCubes = function(doRandom) {
  var numGcnSubCells=0;
  var numNcnSubCells=0;
  var numRcnSubCells=0;
  //var subCellQuadArr=[];
  clrBuildings();
  cellQuadsAlignment(); //sets the cell Area for gcn, ncn, rcn based on node type
  genSubCells();
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
    var offset=gridGuiControls.global_offset+0.1;
    var p=new nsPt(quad.p.x+offset, quad.p.y, quad.p.z+offset);
    var q=new nsPt(quad.q.x-offset, quad.q.y, quad.q.z+offset);
    var r=new nsPt(quad.r.x-offset, quad.r.y, quad.r.z-offset);
    var s=new nsPt(quad.s.x+offset, quad.s.y, quad.s.z-offset);    
    var quadAr=gcnAr+ncnAr+rcnAr;

    //req offset is given by a quadratic equation multiplied by a constant for number of floors
    //var d=0.3*(-(varCellLe-(2*offset)+varCellDe)+Math.sqrt(((varCellLe-(2*offset)+varCellDe)*(varCellLe-(2*offset)+varCellDe)) + 4*quadAr))/2;
    var d=gridGuiControls.global_offset*(varCellLe+varCellDe)/3.5;
    
    //quad A : PQ
    var h1=1; // for debug quad
    var a1=new nsPt(p.x,p.y,p.z);
    var b1=new nsPt(q.x,q.y,q.z);
    var c1=new nsPt(q.x,q.y,q.z+d);
    var d1=new nsPt(p.x,p.y,p.z+d);
    var quads=genHorSubCells(a1,b1,c1,d1);
    try{
      for(var j=0; j<quads.length; j++){
        cellQuadArr[i].subCellQuads.push(quads[j]);
      }
    }catch(err){}

    // debugQuad(a1,b1,c1,d1,h1);
    //quad B : QR
    var h2=1;
    var a2=new nsPt(q.x-d,q.y,q.z+d);
    var b2=new nsPt(q.x,q.y,q.z+d);
    var c2=new nsPt(r.x,r.y,r.z-d);
    var d2=new nsPt(r.x-d,r.y,r.z-d);
    var quadB=new nsQuad(a2,b2,c2,d2);
    if(utilDi(b2,c2)>varCellDe/3){
      // debugQuad(a2,b2,c2,d2,h2);
      var quads=genVerSubCells(a2,b2,c2,d2);
      try{
        for(var j=0; j<quads.length; j++){
          cellQuadArr[i].subCellQuads.push(quads[j]);
        }
      }catch(err){}      
    }

    //quad C : RS
    var h3=1;
    var a3=new nsPt(s.x,s.y,s.z-d);
    var b3=new nsPt(r.x,r.y,r.z-d);
    var c3=new nsPt(r.x,r.y,r.z);
    var d3=new nsPt(s.x,s.y,s.z);
    var quadC=new nsQuad(a3,b3,c3,d3);
    // debugQuad(a3,b3,c3,d3,h3);
    var quads=genHorSubCells(a3,b3,c3,d3)
    try{
      for(var j=0; j<quads.length; j++){
        cellQuadArr[i].subCellQuads.push(quads[j]);
      }
    }catch(err){}  

    //quad D : SP
    var h4=1;
    var a4=new nsPt(p.x,p.y,p.z+d);
    var b4=new nsPt(p.x+d,p.y,p.z+d);
    var c4=new nsPt(s.x+d,s.y,s.z-d);
    var d4=new nsPt(s.x,s.y,s.z-d);
    var quadD=new nsQuad(a4,b4,c4,d4);
    if(utilDi(b4,c4)>varCellDe/3){
      var quadsd=genVerSubCells(a4,b4,c4,d4)
      // debugQuad(a4,b4,c4,d4,h4);
      try{
        for(var j=0; j<quads.length; j++){
          cellQuadArr[i].subCellQuads.push(quads[j]);
        }
      }catch(err){}
    }
  }
}

function allocateSubCells(){
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
    //debugQuad(a,b,c,d);
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

  var bua=(cellQuadArr.length*varCellLe*varCellDe);
  //normalize the FSR input to 1 and then distribute the FSR
  var gcnFsr=bldgGuiControls.GCN_FSR
  var ncnFsr=bldgGuiControls.NCN_FSR
  var rcnFsr=bldgGuiControls.RCN_FSR
  var sumFsr= (gcnFsr+ncnFsr+rcnFsr);
  var gcnArea = bua * gcnFsr/sumFsr;
  var rcnArea = bua * rcnFsr/sumFsr;
  var ncnArea = bua * ncnFsr/sumFsr; 
  
  //console.log(gcnArea + ", " + ncnArea + ", " + rcnArea);
  var GCNCellsArr = [];
  var NCNCellsArr = [];
  var RCNCellsArr = [];
  // calculate the number of node of each type in quad
  // set the gcn, ncn, rcn ratios to the quad
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

  console.log("\n\n\nGot Areas :\nCumulative areas : G=" + cumuGcnArea+ ", N="+cumuNcnArea + ", R="+cumuRcnArea);
  console.log("Total Area : " + (cumuGcnArea+ cumuNcnArea +cumuRcnArea));
}