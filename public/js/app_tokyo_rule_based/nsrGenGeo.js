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
    //genBldgGeometry(); // loaded from DB
    genParkGeometry(); // loaded from DB
    genSiteGeometry(); // loaded from DB
    genDynamicFunc(); // dynamic functions- once everything is loaded -> generate new diag, quad, cells, allocate, generate mesh renders
    //generate the buildings from 
    genBldgGeometry();
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
    for(var i=0; i<siteObjArr.length; i++) {
        siteObjArr[i].genGeo();
    }
    for(var i=0; i<siteArr.length; i++){
        scene.add(siteArr[i]);
    }
}

function genDynamicFunc(){
    var line_seg=[];
    var di_arr=[];    
    for(var i=0; i<bldgObjArr.length; i++){
        var sortable=[];
        var c=bldgObjArr[i].cen;
        var p=new nsPt(parseFloat(c[0]),parseFloat(c[1]),parseFloat(c[2]));
        for(var j=0; j<greenNodeLoc.length; j++){
            var q=greenNodeLoc[j];
            var r=new nsPt(parseFloat(q.x),parseFloat(q.y),parseFloat(q.z));
            var d=utilDi(p,r);
            sortable.push([p,r,d]);
        }
        sortable.sort(function(a,b){
            return a[2]-b[2];
        });
        line_seg.push(sortable[0]);
        di_arr.push(sortable[0][2]);
    }
    di_arr.sort(function(a,b){
        return a-b;
    });
    var min=di_arr[0];
    var max=di_arr[di_arr.length-1];
    for(var i=0; i<line_seg.length; i++){
        var p=line_seg[i][0];
        var q=line_seg[i][1];
        var d=line_seg[i][2];
        var r=(d-min)/(max-min);
        bldgObjArr[i].diRa=r;
        debugLineZ(p,q,0);
    }
}

function genBldgGeometry() {
    for(var i=0; i<bldgArr.length; i++){
        bldgArr[i].geometry.dispose();
        bldgArr[i].material.dispose();
        scene.remove(bldgArr[i]);
    }
    bldgArr=[];
    for(var i=0; i<bldgObjArr.length; i++){        
        //RCN: office
        var colr0=new THREE.Color("rgb(150,150,150)");
        ret0=extrBldg(bldgObjArr[i],0,colr0);
        var mesh0=ret0[0];
        var ht0=ret0[1];
        scene.add(mesh0);

        //NCN: commerce
        var colr1=new THREE.Color("rgb(155,150,0)");
        ret1=extrBldg(bldgObjArr[i],ht0,colr1);
        var mesh1=ret1[0];
        var ht1=ret1[1]+ht0;
        scene.add(mesh1);

        //GCN: green
        var colr2=new THREE.Color("rgb(50,250,150)");
        ret2=extrBldg(bldgObjArr[i],ht1,colr2);
        var mesh2=ret2[0];
        var ht2=ret2[1]+ht1+ht0;
        scene.add(mesh2);
    }
}

function extrBldg(bldgObj, pushZ, colr){
    var pts=bldgObj.pts;
    var p=pts[0];
    //base 
    var geox=new THREE.Shape();
    geox.moveTo(0,0);
    for(var i=1; i<pts.length; i++){
        var q=pts[i];
        geox.lineTo(q.x-p.x,q.y-p.y);
    }
    geox.autoClose=true;
    var extSettings={
        steps:1,
        amount:Math.random()+0.1,
        bevelEnabled:false
    }
    var geometry=new THREE.ExtrudeBufferGeometry(geox, extSettings);
    var material=new THREE.MeshPhongMaterial({
        color:colr,
        specular:0x000000,
        shininess:10,
        flatShading:true
    });
    var mesh=new THREE.Mesh(geometry, material);
    mesh.position.x=p.x;
    mesh.position.y=p.y;
    mesh.position.z=pushZ;
    return [mesh, extSettings.amount];
}