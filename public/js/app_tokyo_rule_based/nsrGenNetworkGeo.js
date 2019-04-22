
function initNetwork(ALLJSONOBJS){
    networkEdgesArr = [];
    networkNodesArr = [];
    greenNodeLoc=[];
    console.log("got the data!!!!");
    //network nodes
    for (var i = 0; i < ALLJSONOBJS.length; i++) {
        obj = ALLJSONOBJS[i];
        if (obj.element_type === "node") {
            var node = new nsNetworkNode(obj.x, obj.y, obj.z, obj.nsId);
            node.type=obj.t;
            networkNodesArr.push(node);
            if(obj.t==='GCN'){
                var p=new nsPt(obj.x,obj.y,obj.z);
                greenNodeLoc.push(p);
            }
        }
    }
    //network edges
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
            var edge = new nsNetworkEdge(node0, node1);
            edge.id = obj.nsId;
            edge.type=obj.t;
            networkEdgesArr.push(edge);
        }
    }
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
    nodeArr = Array();
  
    for (var i = 0; i < edgeArr.length; i++) {
      edgeArr[i].geometry.dispose();
      edgeArr[i].material.dispose();
      scene.remove(edgeArr[i]);
    }
    edgeArr = Array();
  
    for (var i = 0; i < edgeMeshArr.length; i++) {
      edgeMeshArr[i].geometry.dispose();
      edgeMeshArr[i].material.dispose();
      scene.remove(edgeMeshArr[i]);
    }
    edgeMeshArr=[];
  
    for (var i = 0; i < networkNodesArr.length; i++) {
      // networkNodesArr[i].getObj();// adds netwrok nodes directly to global array
    }
    
    var roaddepth=1;//enGuiControls.road_depth;
  
    for (var i = 0; i < networkEdgesArr.length; i++) {
      //networkEdgesArr[i].getLineObj();// adds network edges Line directly to global array
      networkEdgesArr[i].getMeshObj(roaddepth);// adds network edges Mesh directly to global array
    }
    console.log("INIT COMPLETE...scene rendered" + nodeArr.length + ", " +edgeArr.length);
}