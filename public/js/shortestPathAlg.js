//get neighbours and update distance from source
function getAllEdgesOfNode(node, edges){
       var neighbours=[];
       for(var i=0; i<edges.length; i++){
              var n0=edges[i].getNode0();
              var n1=edges[i].getNode1();
              if(node.id===n0.id){
                     if(n1.dist>node.dist){
                            neighbours.push(n1);
                            n1.parent=node;
                            n1.dist=node.dist + edges[i].cost;
                     }                     
              }else if(node.id === n1.id){
                     if(n0.dist>node.dist){
                            neighbours.push(n0);
                            n0.parent=node;
                            n0.dist=node.dist + edges[i].cost;
                     }                     
              }
       }
       
       var ids=[];
       for(var i=0; i<neighbours.length; i++){
              ids.push(neighbours[i].id);
       }
       //console.log("\n\n\n\nneighbours id = "+ ids);
       return neighbours;
}


//get the min dist node from source - out of the nodeheap
function extractMinHeap(neighbours,nodeHeap){
       for(var i=0; i<nodeHeap.length; i++){
              for(var j=0; j<neighbours.length; j++){
                     if(utilDi(nodeHeap[i].getPt(),neighbours[j].getPt()) < 0.1){
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

function spt(edgeArr, nodeHeap, source, current){
       console.log("\n\n\nstart spt : " + source);
       source.dist=0;
       source.parent=null;
       nodeHeap.splice(0,1);
       var resultNodeHeap=[]
       resultNodeHeap.push(source);
       var k=0; 
       while(nodeHeap.length>1){
              var neighbours=getAllEdgesOfNode(source, edgeArr);
              source=extractMinHeap(neighbours, nodeHeap);
              for(var i=0; i<nodeHeap.length; i++){     //remove the source from nodeheap
                     if(source.id==nodeHeap[i].id){
                            nodeHeap.splice(i,1);
                            break;
                     }
              }
              resultNodeHeap.push(source);
              console.log("\nnew source:"+source.id);
              //console.log("\nremaining node heap: ");
              //console.log(nodeHeap);
              k++;
       }      

       console.log("\n\n\nsolution: ");
       console.log(resultNodeHeap);
}

// initiate edge weights - green network
function initGreenEdges(){
       for (var i = 0; i < networkEdgesArr.length; i++) {
              var e = networkEdgesArr[i];
              e.updateCost();
              e.updateType();
       }
       
       for(var i=0; i<networkNodesArr.length; i++){
              networkNodesArr[i].id=i;
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

// make sure nodes in array are correct - getPt()
function getNodeHeap(){
       var nodeHeap=[];
       for (var i = 0; i < networkNodesArr.length; i++) {
              try{
              var p=networkNodesArr[i].getPt()
              nodeHeap.push(networkNodesArr[i]);
              }catch(err){
              }          
         }
       return nodeHeap;
}

// shortest path algorithm - epsilon greedy
function findMinCost() {
       initGreenEdges();              //sort all edges by weight- for convenience
       var nodeHeap = getNodeHeap();      //get all valis nodes - point
       var source;                 //get source node: first res in node heap
       for(var i=0; i<nodeHeap.length; i++){
              if(nodeHeap[i].getType()=="res"){
                     source=nodeHeap[i];
                     break;
              }
       }

       source.dist=0;                     //initialize alg with source dist=0
       source.parent=null;                //source parent is null
       nodeHeap.splice(0,1);              //remove source from nodeheap
       var resultNodeHeap=[];             //init result nodeheap - to store nodes
       resultNodeHeap.push(source);       //first element is the source

       //console.log("\n\n\ninit to start spt : ");
       //console.log(source);

       //djikstra algorithm to find min dist of all nodes from source 
       //recursive algorithm:
       //1. find all neighbours and update dist
       //2. extract min from the heap
       //loop until result heap is as big as initial nodeHeap
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
              console.log("\nnew source:");
              console.log(source);
              console.log("\nremaining node heap: ");
              console.log(nodeHeap);
              k++;
       }      

       //console.log("\n\n\nsolution: ");
       //console.log(resultNodeHeap);
       
       
       //get all nodes of "res" type
       //each res type will be a sink; make an array of sinks
       //the required spine will be a summation of all the paths to source
       var reqResNodes=[];
       for (var i = 0; i < networkNodesArr.length; i++) {
              if(networkNodesArr[i].getType()==="res"){
                     try{
                            var p=networkNodesArr[i].getPt()
                            reqResNodes.push(networkNodesArr[i]);
                     }catch(err){
                            //error in getPT();
                     }   
              }
       }

       //once again find the source
       //this is the node with min dist
       var source;
       var minDi=10000000;
       var req;
       for(var i=0; i<reqResNodes.length; i++){
              var node=reqResNodes[i];
              if(node.dist<minDi && node.getType()=="res"){
                     minDi=node.dist;
                     source=node;
              }
       }

       //get all paths from each element of the sink array
       //set each edge to green
       //getPath is recursive function:
       //1.start with the sink
       //2.find parent and add to array
       //3.loop until parent is source

       for(var i=0; i<reqResNodes.length; i++){
              var sink=reqResNodes[i];
              var tmpArr=[];
              tmpArr=getPath(source, sink, resultNodeHeap, networkEdgesArr, tmpArr);
              setEdgeToType(tmpArr,"green");
       }

       //finally set the edges to green
       genNetworkGeometry();
}

function setEdgeToType(tmpArr, type){
       for(var i=0; i<tmpArr.length; i++){
              var p=tmpArr[i].getNode0().getPt();
              var q=tmpArr[i].getNode1().getPt();
              for(var j=0; j<networkEdgesArr.length; j++){
                     var r=networkEdgesArr[j].getNode0().getPt();
                     var s=networkEdgesArr[j].getNode1().getPt();
                     if(utilDi(p,r)<0.1 && utilDi(q,s)<0.1){
                            networkEdgesArr[j].setType(type);
                            break;
                     }
                     if(utilDi(p,s)<0.1 && utilDi(q,r)<0.1){
                            networkEdgesArr[j].setType(type);
                            break;
                     }
              }
       }
}

function getPath(source, sink, nodes, edges, tmpArr){
       var u=source.getPt();
       var p=sink.getPt();
       var q;
       try{
              q=sink.parent.getPt();
       }catch(err){
              return tmpArr;
       }
       console.log("\n\n\n\nlast leg ...");
       console.log(source.id, sink.id, sink.parent.id);
       
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
       sink=sink.parent;
       if(t==true){
              getPath(source, sink, nodes, edges, tmpArr);
       }
       return tmpArr;
}