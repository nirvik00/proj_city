// generate NETWORK
//construct networkEdgesArr
function initNetwork() {
  networkEdgesArr = [];
  networkNodesArr = [];
  evacEdges = [];

  parkCoordsArr=[];

  console.log("got the data!!!!");
  for (var i = 0; i < ALLJSONOBJS.length; i++) {
    obj = ALLJSONOBJS[i];
    if (obj.element_type === "node") {
      var node = new nsNetworkNode(obj.x, obj.y, obj.z, obj.nsId);
      node.type=obj.t;
      networkNodesArr.push(node);
      //console.log(obj.x, obj.z, obj.y, obj.nsId);
    }
  }

  for (var i = 0; i < ALLJSONOBJS.length; i++) {
    obj = ALLJSONOBJS[i];
    if (obj.element_type === "edge") {
      var p = new nsPt(obj.x0, obj.y0, obj.z0);
      var q = new nsPt(obj.x1, obj.y1, obj.z1);
      var node0, node1;
      var sum0=0;
      var sum1=0;
      var minDi=1000000000;
      for (var j = 0; j < networkNodesArr.length; j++) {
        var r = networkNodesArr[j].getPt();
        if (utilDi(p, r) < minDi) {
          node0 = networkNodesArr[j];
          minDi=utilDi(p,r);
        }
      }
      minDi=1000000000;
      for (var j = 0; j < networkNodesArr.length; j++) {
        var r = networkNodesArr[j].getPt();
        if (utilDi(q, r) < minDi) {
          node1 = networkNodesArr[j];
          minDi=utilDi(q,r);
        }
      }
      //console.log(node0.getPt(), node1.getPt());
      var edge = new nsNetworkEdge(node0, node1);
      edge.id = obj.nsId;
      edge.type=obj.t;
      networkEdgesArr.push(edge);
    }
  }
  
  for(var i=0; i<ALLJSONOBJS.length; i++){
    obj=ALLJSONOBJS[i];
    if(obj.element_type === "bldg"){
      var area=obj.area;
      var cen=obj.cen;
      var coords=obj.pts
      var ptArr=[];
      for(var j=0; j<coords.length; j++){
        var p=coords[j].split(",");
        var x=p[0];
        var y=p[1];
        var z=0;
        ptArr.push(new THREE.Vector2(x,y));
      }
      var bldgObj=new nsBldg("bldg", area, cen, ptArr);  
      bldgObjArr.push(bldgObj);    
    }
  }
  
  for (var i = 0; i < ALLJSONOBJS.length; i++) {
    obj = ALLJSONOBJS[i];
    if (obj.element_type === "park") {
      var area=obj.area;
      var cen=obj.cen;
      var coords=obj.pts;
      var ptArr=[];
      for(var j=0; j<coords.length-2; j++){
        var p,x,y,z;
          p=coords[j].split(",");
          x=p[0];
          y=p[1];
          z=0;
          //console.log(x,y);
          ptArr.push(new THREE.Vector2(x,y));
      }
      var parkObj=new nsPark("park", area, cen, ptArr);
      parkObjArr.push(parkObj);
    }
  }
  //console.log(parkCoordsArr);
  //
  //
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

  for(var i=0; i<parkArr.length; i++){
    parkArr[i].geometry.dispose();
    parkArr[i].material.dispose();
    scene.remove(parkArr[i]);
  }

  for(var i=0; i<bldgArr.length; i++){
    bldgArr[i].geometry.dispose();
    bldgArr[i].material.dispose();
    scene.remove(bldgArr[i]);
  }

  edgeArr = Array();
  for (var i = 0; i < networkEdgesArr.length; i++) {
    networkEdgesArr[i].getObj();
  }
  nodeArr = Array();
  for (var i = 0; i < networkNodesArr.length; i++) {
    networkNodesArr[i].getObj();
  }
  parkArr=[];
  for(var i=0; i<parkObjArr.length; i++) {
    parkObjArr[i].genGeo();
  }
  bldgArr=[];
  for(var i=0; i<bldgObjArr.length; i++){
    bldgObjArr[i].genGeo();
  }


  //sceneObjs=[];
  for (var i = 0; i < nodeArr.length; i++) {
    scene.add(nodeArr[i]);
  }
  for (var i = 0; i < edgeArr.length; i++) {
    scene.add(edgeArr[i]);
  }  
  for(var i=0; i<parkArr.length; i++){
    scene.add(parkArr[i]);
    //sceneObjs[i]=parkArr[i].clone();
  }
  for(var i=0; i<bldgArr.length; i++){
    scene.add(bldgArr[i]);
    //sceneObjs[i]=bldgArr[i].clone();
  }
  console.log("INIT COMPLETE...scene rendered");
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
      if (
        (utilDi(p, a) < T && utilDi(q, b) < T) ||
        (utilDi(p, b) < T && utilDi(q, a) < T)
      ) {
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

    if (sum0 == 0) {
      networkNodesArr.push(n0);
    }

    for (var i = 0; i < networkNodesArr.length; i++) {
      var r = networkNodesArr[i].getPt();
      if (utilDi(q, r) < 0.01) {
        sum1++;
        break;
      }
    }
    if (sum1 == 0) {
      networkNodesArr.push(n1);
    }
  }
}

function setNodeType(max, numGcn, numNcn, numRcn, numEvac, doRandom) {
  if (doRandom === false) {
    var unUsed = [];
    for (var i = 0; i < networkNodesArr.length; i++) {
      unUsed.push(networkNodesArr[i]);
    }
    var res = sortNodesByCenter(unUsed);
    networkNodesArr = [];
    networkNodesArr = res[0];
    var pGcn = res[1]; //percent of GCN in center
    var pNcn = res[2]; //percent of Ncn in center
    var pRcn = res[3]; //percent of Rcn in center

    var cenNumGcn = Math.floor(numGcn * pGcn);
    var outNumGcn = numGcn - cenNumGcn;

    var cenNumNcn = Math.floor(numNcn * pNcn);
    var outNumNcn = numNcn - cenNumNcn;

    var cenNumRcn = Math.floor(numRcn * pRcn);
    var outNumRcn = numRcn - cenNumRcn;

    var remNodes = [];
    for (var i = 0; i < networkNodesArr.length; i++) {
      if (i < cenNumGcn) {
        networkNodesArr[i].type = "GCN";
      } else if (i >= cenNumGcn && i < cenNumNcn + cenNumGcn) {
        networkNodesArr[i].type = "NCN";
      } else if (
        i >= cenNumGcn + cenNumNcn &&
        i < cenNumNcn + cenNumGcn + cenNumRcn
      ) {
        networkNodesArr[i].type = "RCN";
      } else {
        remNodes.push(i);
      }
    }
    // console.log("\n\n\ncentrality & dispersion");
    // console.log(cenNumGcn, outNumGcn, numGcn);
    // console.log(cenNumNcn, outNumNcn, numNcn);
    // console.log(cenNumRcn, outNumRcn, numRcn);
    // console.log(remNodes)

    remNodes = shuffleArray(remNodes);
    for (var i = 0; i < remNodes.length; i++) {
      var t = remNodes[i];
      if (i < outNumGcn) {
        networkNodesArr[t].type = "GCN";
      } else if (i >= outNumGcn && i < outNumNcn + outNumGcn) {
        networkNodesArr[t].type = "NCN";
      } else if (
        i >= outNumGcn + outNumNcn &&
        i < outNumNcn + outNumGcn + outNumRcn
      ) {
        networkNodesArr[t].type = "RCN";
      } else {
        networkNodesArr[t].type = "EVAC";
      }
    }
  } else {
    var used = [];
    var unUsed = [];
    for (var i = 0; i < networkNodesArr.length; i++) {
      networkNodesArr[i].id = i;
      unUsed.push(i);
    }
    //randomly shuffle array and allocate type to nodes
    unUsed = shuffleArray(unUsed);
    for (var i = 0; i < unUsed.length; i++) {
      var t = unUsed[i];
      if (i < numGcn) {
        networkNodesArr[t].type = "GCN";
      } else if (i >= numGcn && i < numNcn + numGcn) {
        networkNodesArr[t].type = "NCN";
      } else if (i >= numGcn + numNcn && i < numNcn + numGcn + numRcn) {
        networkNodesArr[t].type = "RCN";
      } else {
        networkNodesArr[t].type = "EVAC";
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

function sortNodesByCenter(iniNodes) {
  var gcnCen = gridGuiControls.GCN_Centrality;
  var ncnCen = gridGuiControls.NCN_Centrality;
  var rcnCen = gridGuiControls.RCN_Centrality;
  var sumCen = gcnCen + ncnCen + rcnCen;
  var pGcn = gcnCen / sumCen;
  var pNcn = pGcn + ncnCen / sumCen;
  var pRcn = pNcn + rcnCen / sumCen;

  //console.log(pGcn, pNcn, pRcn);
  //console.log("\n\n\nbefore sorting");
  //console.log(iniNodes);

  var cenX = 0.0;
  var cenZ = 0.0;
  var sortableX = new Array();
  for (var i = 0; i < iniNodes.length; i++) {
    sortableX.push([iniNodes[i].x, iniNodes[i].z]);
  }
  sortableX.sort(function(a, b) {
    return a[0] - b[0];
  });
  cenX = (sortableX[0][0] + sortableX[sortableX.length - 1][0]) / 2;

  sortableX.sort(function(a, b) {
    return a[1] - b[1];
  });
  cenZ = (sortableX[0][1] + sortableX[sortableX.length - 1][1]) / 2;

  // console.log("\center: "+ cenX+","+ cenZ);
  var cen = new nsPt(cenX, 0, cenZ);

  var sortableY = [];
  for (var i = 0; i < iniNodes.length; i++) {
    var p;
    var d;
    try {
      p = iniNodes[i].getPt();
      d = utilDi(cen, p);
    } catch (err) {
      var x = iniNodes[i].x;
      var y = iniNodes[i].y;
      var z = iniNodes[i].z;
      iniNodes[i].pt = new nsPt(x, y, z, i);
      p = new nsPt(x, y, z);
      d = utilDi(cen, p);
    }
    //console.log("dist = " + d);
    //console.log(p, cen);
    sortableY.push([iniNodes[i], d]);
  }
  sortableY.sort(function(a, b) {
    return a[1] - b[1];
  });
  //console.log("\n\n\nafter sorting based on d from c");
  //console.log(sortableY);
  nodes = [];
  for (var i = 0; i < sortableY.length; i++) {
    nodes.push(sortableY[i][0]);
  }
  return [nodes, pGcn, pNcn, pRcn];
}
