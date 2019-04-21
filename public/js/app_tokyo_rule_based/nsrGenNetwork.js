function initGeometry(ALLJSONOBJS){
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
            }
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
    //genDynamicFunc(); // dynamic functions- once everything is loaded -> generate new diag, quad, cells, allocate, generate mesh renders
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
}
  
function genSiteGeometry() {
    for(var i=0; i<siteArr.length; i++){
        siteArr[i].geometry.dispose();
        siteArr[i].material.dispose();
        scene.remove(siteArr[i]);
    }
    siteArr=[];
    if(genGuiControls.show_Sites===true){
        for(var i=0; i<siteObjArr.length; i++) {
            siteObjArr[i].genGeo();
        }
        for(var i=0; i<siteArr.length; i++){
            scene.add(siteArr[i]);
        }
    }
}
  
