
// MAIN DRIVER FOR SPT / MST shortest path algorithm - epsilon greedy
function findMinCost(typeNode, typeEdge) {
       //sort all edges by weight- for convenience
       var invertCost=0;
       if(typeNode==="GCN" && typeEdge==="green"){  
              invertCost=0; 
              sendSPTAlg(invertCost, typeNode, typeEdge);
       }
       else if(typeNode==="RCN" && typeEdge==="road"){
              invertCost=1; 
              sendSPTAlg(invertCost, typeNode, typeEdge);
       }
       else if(typeNode==="MST" && typeEdge==="MST"){ 
              invertCost=2; 
              sendMSTAlg(invertCost, typeNode, typeEdge)
       }
       else if(typeNode==="EVAC" && typeEdge==="EVAC"){ 
              invertCost=3; 
              sendEVACSPTAlg(invertCost, typeNode, typeEdge)
       }

}




//SPT ALG
function sendSPTAlg(invertCost, typeNode, typeEdge){
       console.log("In GCN SPT : "+invertCost);
       initEdgeCost(invertCost);              // for green DO NOT INVERT, for road invert
       var nodeHeap = getNodeHeap();       //get all valis nodes - point
       var source;                         //get ource node: first res in node heap
       for(var i=0; i<nodeHeap.length; i++){
              if(nodeHeap[i].getType()===typeNode){
                     source=nodeHeap[i];
                     break;
              }
       }
       source.dist=0;                     //initialize alg with source dist=0
       source.parent=null;                //source parent is null
       nodeHeap.splice(0,1);              //remove source from nodeheap
       var resultNodeHeap=[];             //init result nodeheap - to store nodes
       resultNodeHeap.push(source);       //first element is the source


       // djikstra algorithm to find min dist of all nodes from source 
       // recursive algorithm:
       // 1. find all neighbours and update dist
       // 2. extract min from the heap
       // loop until result heap is as big as initial nodeHeap
       // this sets the min dist from all nodes to source
       var k=0; 
       while(nodeHeap.length>0){
              var neighbours=getAllEdgesOfNode(source, networkEdgesArr);
              source=extractMinHeap(neighbours, nodeHeap);
              try{
                     for(var i=0; i<nodeHeap.length; i++){     //remove the source from nodeheap
                            if(utilDi(source.getPt(),nodeHeap[i].getPt())< 0.1){
                                   nodeHeap.splice(i,1);
                                   break;
                            }
                     }
              }catch(err){
                     console.log("error found");
                     console.log(nodeHeap);
                     break;
              }              
              resultNodeHeap.push(source);
              k++;
       }            
       // res = GCN
       // comm = NCN
       // office = RCN
       // get all nodes of typeNode ie "res", "comm", "office" node-type
       // each res type will be a sink; make an array of sinks
       // the required spine will be a summation of all the paths to source
       var reqResNodes=[];
       for (var i = 0; i < networkNodesArr.length; i++) {
              if(networkNodesArr[i].getType()===typeNode){
                     try{
                            var p=networkNodesArr[i].getPt()
                            reqResNodes.push(networkNodesArr[i]);
                     } catch(err) {
                            //error in getPT();
                     }
              }
       }


       //once again find the source - typeNode
       //this is the node with min dist
       var source;
       var minDi=10000000;
       var req;
       for(var i=0; i<reqResNodes.length; i++){
              var node=reqResNodes[i];
              if(node.dist<minDi && node.getType()==typeNode){
                     minDi=node.dist;
                     source=node;
              }
       }

       // get all paths from each element of the sink array
       // set each edge to typeEdge:green , road, path
       // getPath is recursive function:
       //     1. start with the sink
       //     2. find parent and add to array
       //     3. loop until parent is source
       var finalEdgeArr=[];
       for(var i=0; i<reqResNodes.length; i++){
              var sink=reqResNodes[i];
              var tmpArr=[];
              tmpArr=getPath(source, sink, resultNodeHeap, networkEdgesArr, tmpArr);
              setEdgeToType(tmpArr, typeEdge);
       }
       return reqResNodes;
       //finally render the geometry: nsMain.js after ENTER is pressed
       //genNetworkGeometry();
}

// step 1 of spt : get neighbours and update distance from source
function getAllEdgesOfNode(node, edges){
       var p=node.getPt();
       var neighbors=[];
       for(var i=0; i<edges.length; i++){
              var n0=edges[i].getNode0();
              var n1=edges[i].getNode1();
              var q=n0.getPt();
              var r=n1.getPt();
              if(utilDi(p,q)<0.01 && utilDi(p,r)>0.5){
                     if(n1.dist > (node.dist + edges[i].cost)){
                            n1.parent=node;
                            n1.dist=node.dist + edges[i].cost;
                            neighbors.push(n1);
                     }
              }else if(utilDi(p,r)<0.01  && utilDi(p,q)>0.5){
                     if(n0.dist > (node.dist + edges[i].cost)){
                            n0.parent=node;
                            n0.dist=node.dist + edges[i].cost;
                            neighbors.push(n0);
                     }
              }
       }
       return neighbors;
}

// step 2 of spt: get the min dist node from source - out of the nodeheap
function extractMinHeap(neighbours,nodeHeap){
       for(var i=0; i<nodeHeap.length; i++){
              for(var j=0; j<neighbours.length; j++){
                     if(utilDi(nodeHeap[i].getPt(),neighbours[j].getPt()) < 0.01){
                            nodeHeap[i].dist=neighbours[j].dist;
                     }
              }
       }
       var minDist=100000;
       var node=null;
       for(var i=0; i<nodeHeap.length; i++){
              var n0=nodeHeap[i];
              if(n0.dist<minDist){
                     minDist=n0.dist;
                     node=n0;
              }
       }
       try{
              //console.log("min id = " + node.id);
       }catch(err){
              console.log("error in extract min heap function");
              console.log(err);
              console.log(nodeHeap);
       }
       
       return node;
}





// MST Algorithm
function sendMSTAlg(invertCost, typeNode, typeEdge){
       // console.log("\n\n\ninvert-2 SPT Alg" + invertCost);
       initEdgeCost(invertCost);              // for green DO NOT INVERT, for road invert
       console.log("In MST : "+invertCost);
       // make a copy of networkEdgesArr into notMstEdges
       var notMstEdges=[];
       for(var i=0; i<networkEdgesArr.length; i++){
              var e=networkEdgesArr[i];
              try{
                     var p= e.getNode0();
                     var q= e.getNode1();
                     var f=new nsNetworkEdge(p.getPt(),q.getPt());
                     f.node0=p;
                     f.node0.dist=1000000;
                     f.node1=q;
                     f.node1.dist=1000000;
                     f.cost=e.cost;                     
                     f.type=e.type;
                     notMstEdges.push(f);
              }catch(err){
                     console.log("error in edges" + err);
              }
       }
       var notMstNodes=[];
       for(var i=0; i<networkNodesArr.length; i++){
              var n=networkNodesArr[i];
              try{
                     var p=n.getPt();
                     n.parent=0;
                     n.dist=1000000;
                     n.id=i;
                     //n.display();
                     notMstNodes.push(n);
              }catch(err){
                     console.log("error in nodes");
              }
       }
       var source;
       var t=Math.ceil(Math.random()*notMstNodes.length) -1 ;
       source=notMstNodes[t];
       notMstNodes.splice(t,1);

       // console.log(source);
       // source.display();

       var mstEdges=[];
       var mstNodes=[];
       mstNodes.push(source);

       // from source find neighbors
       // check if neighbor is in notMstNodes=true
       // update the dist of the neighbor
       // extract min edge 
       // update result
       var k=0;
       while(notMstNodes.length > 0 && k<100){
              // console.log("\n\n\nresult of iteration:" + k + " : " + notMstNodes.length);
              // console.log("source: ");
              // source.display();
              // console.log("neighbors: ");
              
              source.dist=0; // different from Djikstra
              //find all neighbors & update dist
              var neighborVertices = updateNeighborEdgeCostMST(source, notMstEdges); 
              
              //extract min heap : different from SPT, 
              //dont remove neighbor but min dist from among all nodes 
              var newSource;
              var minDi=10000000;
              for(var i=0; i<notMstNodes.length; i++){
                     var a=notMstNodes[i];
                     var s=vertexInArray(a,notMstNodes);
                     if(s===true && a.dist<minDi){
                            minDi=a.dist;
                            newSource=a;
                     }
              }
              //console.log("new source: ");
              //newSource.display();
              //newSource.parent.display();

              //remove newSource from notMstNodes, add to mstVertices; add edge to mstEdges
              for(var i=0; i<notMstNodes.length; i++){
                     var a=notMstNodes[i];
                     if( utilDi(a.getPt(), newSource.getPt()) < 0.01 ){
                            // console.log("\nnode removed:");
                            // a.display();
                            notMstNodes.splice(i,1);
                            break;
                     }
              }
              //find the edge from notMstEdges, add to mstEdges
              for(var i=0; i<notMstEdges.length; i++){
                     try{
                            var e= notMstEdges[i];
                            var a= e.getNode0().getPt();
                            var b= e.getNode1().getPt();
                            var c= newSource.parent.getPt();
                            var d= newSource.getPt();
                            if ((utilDi(a,c)<0.01 && utilDi(b,d)<0.01) || (utilDi(a,d)<0.01 && utilDi(b,c)<0.01) ) {
                                   mstEdges.push(e);
                                   //console.log("edge added");
                                   break;
                            }
                     }catch(err){
                            continue;
                     }
              }
              //continue the loop with newSource as source
              source=newSource;
              //console.log("\n\nremaining nodes: ");
              for(var i=0; i<notMstNodes.length; i++){
                     //notMstNodes[i].display();
                     notMstNodes[i].dist=1000000;
              }
              k++;
       }

       // console.log("\n\n\nFINAL MST EDGES= " + mstEdges.length);
       for(var i=0; i<mstEdges.length; i++){
              var e=mstEdges[i];
              e.type="MST";
              // e.display();
       }

       //set mstEdge type to evac & add to networkEdges
       for(var i=0; i<mstEdges.length; i++){
              var e=mstEdges[i];
              networkEdgesArr.push(e);
       }
}

// step 1 of MST : get neighbours and update distance from source
function updateNeighborEdgeCostMST(node, edges){
       var p=node.getPt();
       var neighbours=[];
       for(var i=0; i<edges.length; i++){
              var n0=edges[i].getNode0();
              var n1=edges[i].getNode1();
              var q=n0.getPt();
              var r=n1.getPt();
              if(utilDi(p,q)<0.01 && utilDi(p,r)>0.01){
                     if(n1.dist > (node.dist + edges[i].cost)){
                            n1.parent=node;
                            n1.dist=node.dist + edges[i].cost;
                            neighbours.push(n1);
                     }
              }else if(utilDi(p,r)<0.01  && utilDi(p,q)>0.5){
                     if(n0.dist > (node.dist + edges[i].cost)){
                            n0.parent=node;
                            n0.dist=node.dist + edges[i].cost;
                            neighbours.push(n0);
                     }
              }
       }
       return neighbours;
}





// EVAC SPT ALgorithm
function sendEVACSPTAlg(invertCost, typeNode, typeEdge){
       initEdgeCost(invertCost);
       console.log("In Evac SPT : "+invertCost);
       // organize the nodes into evac and not evac
       var notEvacNodes=[]
       var allNodes=[];
       for(var i=0; i<networkNodesArr.length; i++){
              var n=networkNodesArr[i];
              try{
                     var p=n.getPt();
                     allNodes.push(n);
                     if(n.type=== "EVAC"){
                            n.dist=0;
                     }else{
                            n.dist=1000000;
                            notEvacNodes.push(n);
                     }
              }catch(err){
                     console.log("error in network nodes");
              }
       }
       var allEdges=[];
       for(var i=0; i<networkEdgesArr.length; i++){
              var e=networkEdgesArr[i];
              try{
                     var p= e.getNode0();
                     var q= e.getNode1();
                     var f=new nsNetworkEdge(p.getPt(),q.getPt());
                     f.node0=p;
                     f.node0.dist=1000000;
                     f.node1=q;
                     f.node1.dist=1000000;
                     f.cost=e.cost;                     
                     f.type=e.type;
                     allEdges.push(f);
              }catch(err){
                     console.log("error in edges" + err);
              }
       }
       
       for(var i=0; i<notEvacNodes.length; i++){
              var sink=notEvacNodes[i]; // this node
              var tmpArr=genEvacPath(sink, allEdges);
              for(var j=0; j<tmpArr.length; j++){
                   tmpArr[j].type="EVAC";
              }
              evacEdges.push(tmpArr);
       }

}


// step 0. set parent node as closest to node
function setEvacParentNode(allNodes, evacNodes){
       // for each not evac node, set its closest evac node as parent 
       for(var i=0; i<allNodes.length; i++){
              var n=allNodes[i];
              var p=n.getPt();
              var minDi=1000000;
              var parent;
              for(var j=0; j<evacNodes.length; j++){
                     var m=evacNodes[j];
                     var q=m.getPt();
                     var thisDi=utilDi(p,q);
                     if(thisDi<minDi){
                            minDi=thisDi;
                            parent=m;
                     }
              }
              
       }
       return allNodes;
}

// step 1. for EVAC SPT Algorithm-
function genEvacPath(sink, allEdges){
       var evacNodes=[];
       var allInitNodes=[];
       for(var i=0; i<networkNodesArr.length; i++){
              var n=networkNodesArr[i];
              try{
                     var p=n.getPt();
                     if(n.type==="EVAC"){
                            evacNodes.push(n);
                     }
                     allInitNodes.push(n);
              }catch(err){
                     //error
              }
       }

       var source;
       var allNodes=setEvacParentNode(allInitNodes, evacNodes);
       var minDi=100000000;
       for(var i=0; i<evacNodes.length; i++){
              var di=utilDi(evacNodes[i].getPt(), sink.getPt());
              if(di<minDi){
                     minDi=di;
                     source=evacNodes[i];
              }
       }

       // source=closest evac node
       // sink = this node
       // all nodes=all nodes in graph
       // set dist of nodes = metric dist from source for this node + di from this node
       for(var i=0; i<allNodes.length; i++){
              var n=allNodes[i];
              var p=source.getPt();
              var di=utilDi(n.getPt(),p);
              allNodes[i].dist=di;
       }
       source.dist=0;
       sink.dist=utilDi(source.getPt(),sink.getPt());
       sink.parent=source;

       // recursive algorithm:
       // 1. find all neighbours and update dist
       // 2. extract min from the heap
       // loop until result heap is as big as initial nodeHeap
       // this sets the min dist from all nodes to source
       var k=0; 
       var resultNodeHeap=[];
       while(allNodes.length>0){
              var neighbours=getAllEdgesOfNode(source, allEdges);
              source=extractMinHeap(neighbours, allNodes);
              try{
                     for(var i=0; i<allNodes.length; i++){ //remove the source from allNodes
                            if(utilDi(source.getPt(),allNodes[i].getPt())< 0.1){
                                   allNodes.splice(i,1);
                                   break;
                            }
                     }
              }catch(err){
                     console.log("error found");
                     console.log(allNodes);
                     break;
              }              
              resultNodeHeap.push(source);
              k++;
       }

       //from sink recursively goto parent until parent=source
       var reqEdges=[];
       var reqNodes=[];
       var k=0;
       while(k<10){
              var p=sink.getPt(); 
              var q=sink.parent.getPt();
              //get edge from sink & sink parent
              for(var i=0; i<allEdges.length; i++){
                     var r=allEdges[i].getNode0().getPt();
                     var s=allEdges[i].getNode1().getPt();
                     if((utilDi(p,r)<0.01 && utilDi(q,s)<0.01) || (utilDi(p,s)<0.01 && utilDi(q,r)<0.01)){
                            reqEdges.push(allEdges[i]);
                            break;
                     }
              }              
              if(sink.parent.type==="EVAC"){
                     break;
              }else{
                     sink=sink.parent;
              }  
              k++;
       }
       return reqEdges;
}

// util function for EVAC SPT Algorithm: initiate edge weights - green network
function initEdgeCost(inv){
       for (var i = 0; i < networkEdgesArr.length; i++) {
              var e = networkEdgesArr[i];
              networkEdgesArr[i].id=i;
              e.updateCost(inv);
       }
       var k=0;
       for(var i=0; i<networkNodesArr.length ; i++){
              networkNodesArr[i].id=k;
              k++;
       }
       var sortedNetworkEdges = new Array();  //sort all edges by weight
       var sortable = new Array();
       for (var i = 0; i < networkEdgesArr.length; i++) {
              sortable.push([networkEdgesArr[i], networkEdgesArr[i].cost]);
       }
       sortable.sort(function(a, b) {
              return a[1] - b[1];
       });
       networkEdgesArr = Array();
       for (var i = 0; i < sortable.length; i++) {
              networkEdgesArr.push(sortable[i][0]);
       }
       sortable = [];// end of sorting
}

// util function : make sure nodes in array are correct - getPt()
function getNodeHeap(){
       var nodeHeap=[];
       for (var i = 0; i < networkNodesArr.length; i++) {
              try{
                     var p=networkNodesArr[i].getPt()
                     networkNodesArr[i].parent=null;
                     networkNodesArr[i].dist=10000;
                     nodeHeap.push(networkNodesArr[i]);
              }catch(err){
              }          
       }
       return nodeHeap;
}

// util function : set all edges to a type
function setEdgeToType(tmpeEdgeArr, type){
       var ids=[];
       for(var i=0; i<tmpeEdgeArr.length; i++){
              var p=tmpeEdgeArr[i].getNode0().getPt();
              var q=tmpeEdgeArr[i].getNode1().getPt();
              for(var j=0; j<networkEdgesArr.length; j++){
                     var r=networkEdgesArr[j].getNode0().getPt();
                     var s=networkEdgesArr[j].getNode1().getPt();
                     if((utilDi(p,r)<0.1 && utilDi(q,s)<0.01) || (utilDi(p,s)<0.1 && utilDi(q,r)<0.01)){
                            if(networkEdgesArr[j].getType() === "green" && type==="road"){
                                   networkEdgesArr[j].type= "intx";
                                   ids.push(networkEdgesArr[j].id);
                                   console.log("intx : " + i + ", "+j);
                            }else if(networkEdgesArr[j].getType() === "intx" && type==="road"){
                                   networkEdgesArr[j].type= "intx";
                                   ids.push(networkEdgesArr[j].id);
                                   console.log("intx : " + i + ", "+j);
                            }                            
                            else{
                                   networkEdgesArr[j].setType(type);
                                   break;
                            }
                     } 
              }
       }
}

// util function : get the path from sink to source by following parent trail
function getPath(source, sink, nodes, edges, tmpArr){
       var u=source.getPt();
       var p=sink.getPt();
       var q;
       try{
              q=sink.parent.getPt();
       }catch(err){
              return tmpArr;
       }
       //console.log("\n\n\n\nlast leg ...");
       //console.log(source.id, sink.id, sink.parent.id);
       
       var t=false;
       for(var i=0; i<edges.length; i++){
              var r=edges[i].getNode0().getPt();
              var s=edges[i].getNode1().getPt();
              if(utilDi(p,r) < 0.1  &&  utilDi(q,s) < 0.1){
                     tmpArr.push(edges[i]);
                     t=true;
                     break;
              }
              if(utilDi(p,s) < 0.1  &&  utilDi(q,r) < 0.1){
                     tmpArr.push(edges[i]);
                     t=true;
                     break;
              }
       }
       var newSink=sink.parent;
       if(t===true){
              getPath(source, newSink, nodes, edges, tmpArr);
       }
       return tmpArr;
}

function vertexInArray(n, nodes){
       var p=n.getPt();
       var sum=0;
       for(var i=0; i<nodes.length; i++){
              var q=nodes[i].getPt();
              if(utilDi(p,q)<0.01){
                     sum++;
                     break;
              }
       }
       if(sum===0) { return false; }
       else { return true; }
}







