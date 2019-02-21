// generate NETWORK
//construct networkEdgesArr
function initNetwork() {
       networkEdgesArr = [];
       networkNodesArr = [];
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
     
       // set type of node array
       for (var i = 0; i < networkNodesArr.length; i++) {
         networkNodesArr[i].setType();
         networkNodesArr[i].id=i;
       }
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
      edgeArr.push(e.getObj());
    }
    if(gridGuiControls.show_RCN===true && e.type==="road"){
      edgeArr.push(e.getObj());
    }
    if(gridGuiControls.show_NCN===true && e.type==="path"){
      edgeArr.push(e.getObj());
    }
    if(gridGuiControls.show_MST===true && e.type==="MST"){
      edgeArr.push(e.getObj());
    } 
    if((gridGuiControls.show_GCN===true || gridGuiControls.show_RCN===true ) && e.type==="intx"){
      edgeArr.push(e.getObj());
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
     
     