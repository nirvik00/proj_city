function initGeometry(ALLJSONOBJS){
    networkEdgesArr = [];
    networkNodesArr = [];
  
    console.log("got the data!!!!");
    //network nodes
    for (var i = 0; i < ALLJSONOBJS.length; i++) {
        obj = ALLJSONOBJS[i];
        if (obj.element_type === "node") {
            var node = new nsNetworkNode(obj.x, obj.y, obj.z, obj.nsId);
            node.type=obj.t;
            networkNodesArr.push(node);
            //console.log(obj.x, obj.z, obj.y, obj.nsId);
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

    // buildings
    bldgObjArr=[];
    for(var i=0; i<ALLJSONOBJS.length; i++){
        obj=ALLJSONOBJS[i];
        if(obj.element_type==="bldg"){
            var area=obj.area;
            var cen=obj.cen;
            var coords=obj.pts;
            var ptArr=[];
            for(var j=0; j<coords.length; j++){
                var p=coords[j].split(",");
                var x=p[0];
                var y=p[1];
                var z=0;
                ptArr.push(new THREE.Vector2(x,y));
            }
            var bldgObj=new nsBldg("bldg",area, cen, ptArr);
            bldgObjArr.push(bldgObj);
        }
    }
    //parks
    parkObjArr=[];
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

    //sites
    for (var i = 0; i < ALLJSONOBJS.length; i++) {
        obj = ALLJSONOBJS[i];
        if (obj.element_type === "site") {
            var area=parseFloat(obj.area);
            var cen=obj.cen;
            var coords=obj.pts;
            var ptArr=[];
            for(var j=0; j<coords.length; j++){
                var p,x,y,z;
                p=coords[j].split(",");
                x=p[0];
                y=p[1];
                z=0;
                ptArr.push(new THREE.Vector2(x,y));
            }
            var siteObj=new nsSite("site", i, area, cen, ptArr);
            siteObjArr.push(siteObj);
        }
    }
    genBldgGeometry(); // loaded from DB
    genParkGeometry(); // loaded from DB
    genSiteGeometry(); // loaded from DB
    genDynamicFunc(); // dynamic functions- once everything is loaded -> generate new diag, quad, cells, allocate, generate mesh renders
    genNetworkGeometry();
}

function genBldgGeometry() {
    for(var i=0; i<bldgArr.length; i++){
        bldgArr[i].geometry.dispose();
        bldgArr[i].material.dispose();
        scene.remove(bldgArr[i]);
    }
    bldgArr=[];
    for(var i=0; i<bldgObjArr.length; i++){
        bldgObjArr[i].genGeo();
    }
}
  
function genParkGeometry() {
    for(var i=0; i<parkArr.length; i++){
        parkArr[i].geometry.dispose();
        parkArr[i].material.dispose();
        scene.remove(parkArr[i]);
    }
  
    parkArr=[];
    for(var i=0; i<parkObjArr.length; i++) {
        parkObjArr[i].genGeo();
    }
    for(var i=0; i<parkArr.length; i++){
        scene.add(parkArr[i]);
    }
}
  
function genSiteGeometry() {
    for(var i=0; i<siteArr.length; i++){
        siteArr[i].geometry.dispose();
        siteArr[i].material.dispose();
        scene.remove(siteArr[i]);
    }
    siteArr=[];
    //if(genGuiControls.show_Sites===true){
        for(var i=0; i<siteObjArr.length; i++) {
            siteObjArr[i].genGeo();
        }
        for(var i=0; i<siteArr.length; i++){
            scene.add(siteArr[i]);
        }
    //}
}
  
function genDynamicFunc(){
    for(var i=0; i<bldgObjArr.length; i++){
        var c=bldgObjArr[i].cen;
        var p=new nsPt(parseFloat(c[0]),parseFloat(c[1]),parseFloat(c[2]));
        debugSphereZ(p,0.05,.1);
    }
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
      networkNodesArr[i].getObj();// adds netwrok nodes directly to global array
    }
    
    var roaddepth=1;//enGuiControls.road_depth;
  
    for (var i = 0; i < networkEdgesArr.length; i++) {
      networkEdgesArr[i].getLineObj();// adds network edges Line directly to global array
      networkEdgesArr[i].getMeshObj(roaddepth);// adds network edges Mesh directly to global array
    }
    console.log("INIT COMPLETE...scene rendered" + nodeArr.length + ", " +edgeArr.length);


    for(var i=0; i<nodeArr.length; i++){
        scene.add(nodeArr[i]);
    }

    for(var i=0; i<edgeArr.length; i++){
        scene.add(edgeArr[i]);
    }
}