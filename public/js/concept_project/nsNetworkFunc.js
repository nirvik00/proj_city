// generate NETWORK
//construct networkEdgesArr
function initNetwork() {
       networkEdgesArr = [];
       networkNodesArr = [];
       evacEdges=[]
       for (var i = 0; i < cellQuadArr.length; i++) {
         var quad = cellQuadArr[i];
         var p = quad.p;
         var q = quad.q;
         var r = quad.r;
         var s = quad.s;
         var m = quad.mp();
         var e0 = new nsNetworkEdge(p, q);
         var e1 = new nsNetworkEdge(q, r);
         var e2 = new nsNetworkEdge(r, s);
         var e3 = new nsNetworkEdge(s, p);
         var t0 = checkNetworkEdgeRepetition(networkEdgesArr, e0);
         var t1 = checkNetworkEdgeRepetition(networkEdgesArr, e1);
         var t2 = checkNetworkEdgeRepetition(networkEdgesArr, e2);
         var t3 = checkNetworkEdgeRepetition(networkEdgesArr, e3);
         if (t0 === false) {
           networkEdgesArr.push(e0);
         }
         if (t1 === false) {
           networkEdgesArr.push(e1);
         }
         if (t2 === false) {
           networkEdgesArr.push(e2);
         }
         if (t3 === false) {
           networkEdgesArr.push(e3);
         }
       }
     
        //construct networkNodesArr
        networkNodesArr = Array();
        for (var i = 0; i < networkEdgesArr.length; i++) {
          getNetworkNodes(networkEdgesArr[i]);
        }
        
        // set type of node array based on FSR
        var max=networkNodesArr.length;
        // console.log(GcnFsr, NcnFsr, RcnFsr, EvacFsr, max);
        var sum=GcnFsr+NcnFsr+RcnFsr+EvacFsr;
        var numNcn=Math.ceil(NcnFsr*max/sum);
        var numRcn=Math.ceil(RcnFsr*max/sum);
        var numEvac=Math.floor(EvacFsr*max/sum);
        var numGcn=max-(numNcn+ numRcn+ numEvac)
        // console.log(max, numGcn, numNcn, numRcn, numEvac);
        var doRandom=gridGuiControls.random_distribution;
        setNodeType(max, numGcn, numNcn, numRcn, numEvac, doRandom);



        //set this node to networkEdges
        for (var i = 0; i < networkEdgesArr.length; i++) {
          var e = networkEdgesArr[i];
          var n0 = e.getNode0();
          var p = n0.getPt();
          var n1 = e.getNode1();
          var q = n1.getPt();
          for (var j = 0; j < networkNodesArr.length; j++) {
            var n2 = networkNodesArr[j];
            var r = n2.getPt();
            var d02 = utilDi(p, r);
            if (d02 < 0.001) {
              networkEdgesArr[i].setNode0(networkNodesArr[j]);
              break;
            }
          }
          for (var j = 0; j < networkNodesArr.length; j++) {
            var n2 = networkNodesArr[j];
            var r = n2.getPt();
            var d01 = utilDi(q, r);
            if (d01 < 0.001) {
              networkEdgesArr[i].setNode1(networkNodesArr[j]);
              break;
            }
          }
        }
        //next function
        genNetworkGeometry();
  }
  
  
//for network: nodes and edges
//set property of nodes to res, comm, off
function genNetworkGeometry() {
  for (var i = 0; i < nodeArr.length; i++) {
        nodeArr[i].geometry.dispose();
        nodeArr[i].material.dispose();
        scene.remove(nodeArr[i]);
  }
  for (var i = 0; i < edgeArr.length; i++) {
        edgeArr[i].geometry.dispose();
        edgeArr[i].material.dispose();
        scene.remove(edgeArr[i]);
  }

  edgeArr = Array();
  for (var i = 0; i < networkEdgesArr.length; i++) {
    var e = networkEdgesArr[i];
    if(gridGuiControls.show_GCN===true && e.type==="green"){
      edgeArr.push(e.getObj(0));
    }
    if(gridGuiControls.show_RCN===true && e.type==="road"){
      edgeArr.push(e.getObj(0));
    }
    if(gridGuiControls.show_NCN===true && e.type==="path"){
      edgeArr.push(e.getObj(0));
    }
    if(gridGuiControls.show_MST===true && e.type==="MST"){
      edgeArr.push(e.getObj(0));
    } 
    if((gridGuiControls.show_GCN===true || gridGuiControls.show_RCN===true ) && e.type==="intx"){
      edgeArr.push(e.getObj(0));
    } 
  }
  if(gridGuiControls.show_EVAC===true){
    var k=1;
    for(var i=0; i<evacEdges.length; i++){
      var tmpArr=evacEdges[i];
      for(var j=0; j<tmpArr.length; j++){
        var e=tmpArr[j];
        edgeArr.push(e.getObj(k));
      }
      k++;
    }
  }

  for (var i = 0; i < edgeArr.length; i++) {
        scene.add(edgeArr[i]);
  }

  nodeArr = Array();
  for (var i = 0; i < networkNodesArr.length; i++) {
        var n0 = networkNodesArr[i];
        nodeArr.push(n0.getObj());
  }
  for (var i = 0; i < nodeArr.length; i++) {
        scene.add(nodeArr[i]);
  }
}
     
//check if the network edge already exists in networkEdgesArr
function checkNetworkEdgeRepetition(arr, e0) {
  var sum = 0;
  if (arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
        var a = arr[i].getP();
        var b = arr[i].getQ();
        var p = e0.getP();
        var q = e0.getQ();
        var T = 0.0001;
        if ((utilDi(p, a) < T && utilDi(q, b) < T) || (utilDi(p, b) < T && utilDi(q, a) < T)) {
          sum++;
        }
    }
  }
  if (sum === 0) {
        return false;
  } else {
        return true;
  }
}

// network node creation from edge - repetition
function getNetworkNodes(e) {
  var sum0 = 0;
  var sum1 = 0;
  var n0 = e.getNode0();
  var n1 = e.getNode1();

  var p = n0.getPt();
  var q = n1.getPt();

  var nodeCounter = 0;
  if (networkEdgesArr.length > 0) {
       for (var i = 0; i < networkNodesArr.length; i++) {
         var r = networkNodesArr[i].getPt();
        if (utilDi(p, r) < 0.01) {
          sum0++;
          break;
        }
       }
       
       if (sum0 == 0) { networkNodesArr.push(n0); }

       for (var i = 0; i < networkNodesArr.length; i++) {
        var r = networkNodesArr[i].getPt();
        if (utilDi(q, r) < 0.01) { 
          sum1++;
          break;
        }
       }
       if (sum1 == 0) { networkNodesArr.push(n1); }
  }
}

function setNodeType(max, numGcn, numNcn, numRcn, numEvac, doRandom){
  if(doRandom===false){
    var unUsed=[];
    for(var i=0; i<networkNodesArr.length; i++){
      unUsed.push(networkNodesArr[i]);
    }
    var res=sortNodesByCenter(unUsed);
    networkNodesArr=[];
    networkNodesArr=res[0];
    var pGcn=res[1]; //percent of GCN in center
    var pNcn=res[2]; //percent of Ncn in center
    var pRcn=res[3]; //percent of Rcn in center

    var cenNumGcn=Math.floor(numGcn*pGcn);
    var outNumGcn=numGcn-cenNumGcn;

    var cenNumNcn=Math.floor(numNcn*pNcn);
    var outNumNcn=numNcn-cenNumNcn;
    
    var cenNumRcn=Math.floor(numRcn*pRcn);
    var outNumRcn=numRcn-cenNumRcn;

    var remNodes=[];
    for(var i=0; i<networkNodesArr.length; i++){
      if(i<cenNumGcn){
        networkNodesArr[i].type="GCN";
      }else if(i>=cenNumGcn && i<cenNumNcn+cenNumGcn){
        networkNodesArr[i].type="NCN";
      }else if(i>=cenNumGcn+cenNumNcn && i<cenNumNcn+cenNumGcn+cenNumRcn){
        networkNodesArr[i].type="RCN";
      }else{
        remNodes.push(i);
      }
    }
    // console.log("\n\n\ncentrality & dispersion");
    // console.log(cenNumGcn, outNumGcn, numGcn);
    // console.log(cenNumNcn, outNumNcn, numNcn);
    // console.log(cenNumRcn, outNumRcn, numRcn);
    // console.log(remNodes)

    remNodes=shuffleArray(remNodes);
    for(var i=0; i<remNodes.length; i++){
      var t=remNodes[i];
      if(i<outNumGcn){
        networkNodesArr[t].type="GCN";
      }else if(i>=outNumGcn && i<outNumNcn+outNumGcn){
        networkNodesArr[t].type="NCN";
      }else if(i>=outNumGcn+outNumNcn && i<outNumNcn+outNumGcn+outNumRcn){
        networkNodesArr[t].type="RCN";
      }else{
        networkNodesArr[t].type="EVAC";
      }
    }

  }else{
    var used=[];
    var unUsed=[]
    for(var i=0; i<networkNodesArr.length; i++){
      networkNodesArr[i].id=i;
      unUsed.push(i);   
    }
    //randomly shuffle array and allocate type to nodes
    unUsed=shuffleArray(unUsed);
    for(var i=0; i<unUsed.length; i++){
      var t=unUsed[i];
      if(i<numGcn){
        networkNodesArr[t].type="GCN";
      }else if(i>=numGcn && i<numNcn+numGcn){
        networkNodesArr[t].type="NCN";
      }else if(i>=numGcn+numNcn && i<numNcn+numGcn+numRcn){
        networkNodesArr[t].type="RCN";
      }else{
        networkNodesArr[t].type="EVAC";
      }
    }
  }
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
}

function sortNodesByCenter(iniNodes){
  var gcnCen=gridGuiControls.GCN_Centrality;
  var ncnCen=gridGuiControls.NCN_Centrality;
  var rcnCen=gridGuiControls.RCN_Centrality;
  var sumCen=(gcnCen+ncnCen+rcnCen);
  var pGcn=(gcnCen/sumCen);
  var pNcn=pGcn + (ncnCen/sumCen);
  var pRcn=pNcn + (rcnCen/sumCen);

  //console.log(pGcn, pNcn, pRcn);
  //console.log("\n\n\nbefore sorting");
  //console.log(iniNodes);


  var cenX=0.0; var cenZ=0.0;
  var sortableX = new Array();
  for(var i=0; i<iniNodes.length; i++){
        sortableX.push([iniNodes[i].x,iniNodes[i].z]);
  }
  sortableX.sort(function(a, b) {
         return a[0] - b[0];
  });
  cenX=(sortableX[0][0]+sortableX[sortableX.length-1][0])/2;
  
  sortableX.sort(function(a,b){
    return a[1]-b[1];
  });
  cenZ=(sortableX[0][1]+sortableX[sortableX.length-1][1])/2;

  // console.log("\center: "+ cenX+","+ cenZ);
  var cen=new nsPt(cenX,0,cenZ);

  var sortableY=[];
  for(var i=0; i<iniNodes.length; i++){
    var p;
    var d;
    try{
      p=iniNodes[i].getPt();
      d=utilDi(cen,p);
    }catch(err){
      var x=iniNodes[i].x;
      var y=iniNodes[i].y;
      var z=iniNodes[i].z;
      iniNodes[i].pt=new nsPt(x,y,z,i);
      p=new nsPt(x,y,z);
      d=utilDi(cen,p);
    }
    //console.log("dist = " + d);
    //console.log(p, cen);
    sortableY.push([iniNodes[i], d]);   
  }
  sortableY.sort(function(a,b){
    return a[1]-b[1];
  });
  //console.log("\n\n\nafter sorting based on d from c");
  //console.log(sortableY);
  nodes=[];
  for(var i=0; i<sortableY.length; i++){
    nodes.push(sortableY[i][0]);
  }
  return [nodes, pGcn, pNcn, pRcn];
}