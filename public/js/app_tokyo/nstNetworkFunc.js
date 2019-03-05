// generate NETWORK
//construct networkEdgesArr
function initNetwork() {
  networkEdgesArr = [];
  networkNodesArr = [];
  evacEdges = [];

  parkCoordsArr=[];

  console.log("got the data!!!!");
  //console.log(ALLJSONOBJS);
  for (var i = 0; i < ALLJSONOBJS.length; i++) {
    obj = ALLJSONOBJS[i];
    if (obj.element_type === "node") {
      var node = new nsNetworkNode(obj.x, obj.y, obj.z, obj.nsId);
      node.type=obj.t;
      networkNodesArr.push(node);
      //console.log(obj.x, obj.z, obj.y, obj.nsId);
    }
  }
  //console.log("node array = ");
 /// for (var i = 0; i < networkNodesArr.length; i++) {
    //networkNodesArr[i].display();
  //}

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


  for (var i = 0; i < ALLJSONOBJS.length; i++) {
    obj = ALLJSONOBJS[i];
    if (obj.element_type === "park") {
      var coords=obj.pts.split(";");
      //console.log("\n\n"+i);
      var ptArr=[];
      for(var j=0; j<coords.length-2; j++){
        var p,x,y,z;
          p=coords[j].split(",");
          x=p[0];
          y=p[1];
          z=0;
          //console.log(x,y,z);
        ptArr.push(new THREE.Vector2(x,y));
      }
      parkCoordsArr.push(ptArr);
    }
  }
  //console.log(parkCoordsArr);
  //next function
  genNetworkGeometry();
}

//for network: nodes and edges
//set property of nodes to res, comm, off
function genNetworkGeometry() {
  for (var i = 0; i < parkArr.length; i++) {
    parkArr[i].geometry.dispose();
    parkArr[i].material.dispose();
    scene.remove(parkArr[i]);
  }

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
    edgeArr.push(e.getObj(0));
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
    //scene.add(nodeArr[i]);
  }

  parkArr = Array();
  for(var i=0; i<parkCoordsArr.length; i++){
    var p=parkCoordsArr[i][0];
    var geox=new THREE.Geometry();
    geox.vertices.push(new THREE.Vector3(p.x,p.y,0.25));
    for(var j=1; j<parkCoordsArr[i].length; j++){
      var q=parkCoordsArr[i][j];
      geox.vertices.push(new THREE.Vector3(q.x,q.y,0.25));
    }
    geox.vertices.push(new THREE.Vector3(p.x,p.y,0.25));
    var matx=new THREE.MeshBasicMaterial({color:new THREE.Color("rgb(250,50,100)")});
    var line=new THREE.Line(geox,matx);
    parkArr.push(line);
  }
  console.log("number of parks: "+parkArr.length);
  for(var i=0; i<parkArr.length; i++) {
    scene.add(parkArr[i]);
  }


  for(var i=0; i<parkCoordsArr.length; i++){
    //if(i==1) break;
    //console.log("\n\n"+i);
    var p=parkCoordsArr[i][0];
    var geox=new THREE.Shape();
    geox.moveTo(0,0);    
    for(var j=1; j<parkCoordsArr[i].length; j++){
      var q=parkCoordsArr[i][j];
      //console.log(q.x-p.x,q.y-p.y);
      geox.lineTo(q.x-p.x,q.y-p.y);    
    }    
    geox.autoClose=true;
    var geometry = new THREE.ShapeGeometry( geox );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var mesh = new THREE.Mesh( geometry, material ) ;
    mesh.position.x=p.x;
    mesh.position.y=p.y;
    scene.add( mesh );
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
