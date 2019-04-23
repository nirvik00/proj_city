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
    for(var i=0; i<debugArr.length; i++){
        scene.remove(debugArr[i].goemetry);
        scene.remove(debugArr[i].material);
    }
    debugArr=[];
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
    MIN=di_arr[0];
    MAX=di_arr[di_arr.length-1];
    var q0=MIN
    var q1=MIN+(0.33)*(MAX-MIN)/MAX;
    var q2=MIN+(0.66)*(MAX-MIN)/MAX;    
    QUARTILES={q0,q1,q2};
    for(var i=0; i<line_seg.length; i++){
        var p=line_seg[i][0];
        var q=line_seg[i][1];
        var d=line_seg[i][2];
        var r=(d-MIN)/(MAX-MIN);
        var thisCase=-1;
        if(r<q0){
            thisCase=parseInt(0);
        }else if(r>=q0 && r<q1){
            thisCase=parseInt(1);
        }else if(r>=q1 && r<q2){
            thisCase=parseInt(2);
        }else{
            thisCase=parseInt(3);
        }
        bldgObjArr[i].diRa=r;
        bldgObjArr[i].quartile=thisCase;
        debugLineZ(p,q,r);
    }
}

function genBldgGeometry2() {
    for(var i=0; i<ncnBldgArr.length; i++){
        ncnBldgArr[i].geometry.dispose();
        ncnBldgArr[i].material.dispose();
        scene.remove(ncnBldgArr[i]);
    }
    ncnBldgArr=[];
    for(var i=0; i<rcnBldgArr.length; i++){
        rcnBldgArr[i].geometry.dispose();
        rcnBldgArr[i].material.dispose();
        scene.remove(ncnBldgArr[i]);
    }
    rcnBldgArr=[];
    for(var i=0; i<gcnBldgArr.length; i++){
        gcnBldgArr[i].geometry.dispose();
        gcnBldgArr[i].material.dispose();
        scene.remove(ncnBldgArr[i]);
    }
    gcnBldgArr=[];
    var num0=0.0;
    var num1=0.0;
    var num2=0.0;
    var num3=0.0;
    var coeff=false;
    for(var i=0; i<bldgObjArr.length; i++){
        //console.log(bldgObjArr[i].quartile);
        if(bldgObjArr[i].quartile===0){
            //NCN: commerce
            var colr1=new THREE.Color("rgb(255,150,0)");
            var ret1=extrBldg(bldgObjArr[i],0,colr1, true);
            var mesh1=ret1[0];
            var ht1=ret1[1];
            ncnBldgArr.push(mesh1);

            //GCN: green
            var colr2=new THREE.Color("rgb(50,250,150)");
            var ret2=extrBldg(bldgObjArr[i],ht1,colr2, coeff);
            var mesh2=ret2[0];
            var ht1=ret2[1];
            gcnBldgArr.push(mesh2);
            
            num0++;
        }else if(bldgObjArr[i].quartile===1){
            //GCN: green
            var colr2=new THREE.Color("rgb(50,250,150)");
            var ret2=extrBldg(bldgObjArr[i],0,colr2, coeff);
            var mesh2=ret2[0];
            var ht1=ret2[1];
            gcnBldgArr.push(mesh2);

            //RCN: office
            var colr0=new THREE.Color("rgb(150,150,150)");
            var ret0=extrBldg(bldgObjArr[i],ht1,colr0, coeff);
            var mesh0=ret0[0];
            rcnBldgArr.push(mesh0);        
            num1++;
        }else if(bldgObjArr[i].quartile===2){
            //RCN: office
            var colr0=new THREE.Color("rgb(150,150,150)");
            var ret0=extrBldg(bldgObjArr[i],0,colr0, coeff);
            var mesh0=ret0[0];
            var ht0=ret0[1];
            rcnBldgArr.push(mesh0);   
            num2++;     
        }else{
            //NCN: commerce
            var colr1=new THREE.Color("rgb(255,150,0)");
            var ret1=extrBldg(bldgObjArr[i],0,colr1, coeff);
            var mesh1=ret1[0];
            var ht1=ret1[1];
            ncnBldgArr.push(mesh1);

            //RCN: office
            var colr0=new THREE.Color("rgb(150,150,150)");
            var ret0=extrBldg(bldgObjArr[i],ht1,colr0, true);
            var mesh0=ret0[0];
            var ht2=ret0[1]+ht1;
            rcnBldgArr.push(mesh0);  

            //GCN: green
            var colr2=new THREE.Color("rgb(50,250,150)");
            var ret2=extrBldg(bldgObjArr[i],ht2,colr2, coeff);
            var mesh2=ret2[0];
            var ht2=ret2[1];
            gcnBldgArr.push(mesh2);

            num3++;
        }
    }
    console.log(num0, num1, num2, num3);
}

function genBldgGeometry() {
    for(var i=0; i<ncnBldgArr.length; i++){
        ncnBldgArr[i].geometry.dispose();
        ncnBldgArr[i].material.dispose();
        scene.remove(ncnBldgArr[i]);
    }
    ncnBldgArr=[];
    
    for(var i=0; i<rcnBldgArr.length; i++){
        rcnBldgArr[i].geometry.dispose();
        rcnBldgArr[i].material.dispose();
        scene.remove(rcnBldgArr[i]);
    }
    rcnBldgArr=[];

    for(var i=0; i<gcnBldgArr.length; i++){
        gcnBldgArr[i].geometry.dispose();
        gcnBldgArr[i].material.dispose();
        scene.remove(gcnBldgArr[i]);
    }
    gcnBldgArr=[];
    var num0=0.0;
    var num1=0.0;
    var num2=0.0;
    var num3=0.0;
    var coeff=false;
    for(var i=0; i<bldgObjArr.length; i++){
        var htExt_gcn, htExt_ncn, htExt_rcn;
        //console.log(bldgObjArr[i].quartile);
        if(bldgObjArr[i].quartile===0){
            htExt_gcn=genGuiControls.Q0_GCN;
            htExt_ncn=genGuiControls.Q0_NCN;
            htExt_rcn=genGuiControls.Q0_RCN;
        }else if(bldgObjArr[i].quartile===1){
            htExt_gcn=genGuiControls.Q1_GCN;
            htExt_ncn=genGuiControls.Q1_NCN;
            htExt_rcn=genGuiControls.Q1_RCN;
        }else if(bldgObjArr[i].quartile===2){
            htExt_gcn=genGuiControls.Q2_GCN;
            htExt_ncn=genGuiControls.Q2_NCN;
            htExt_rcn=genGuiControls.Q2_RCN;
        }else{
            htExt_gcn=genGuiControls.Q3_GCN;
            htExt_ncn=genGuiControls.Q3_NCN;
            htExt_rcn=genGuiControls.Q3_RCN;
        }
        //NCN: commerce
        var colr0=new THREE.Color("rgb(255,150,0)");
        var ret0=extrBldg(bldgObjArr[i],0,colr0, coeff, htExt_ncn);
        var mesh0=ret0[0];
        var ht0=ret0[1];
        ncnBldgArr.push(mesh0);

        //RCN: office
        var colr1=new THREE.Color("rgb(150,150,150)");
        var ret1=extrBldg(bldgObjArr[i], ht0, colr1, coeff, htExt_rcn);
        var mesh1=ret1[0];        
        var ht1=ret1[1]+ht0;        
        rcnBldgArr.push(mesh1);  

        //GCN: green
        var colr2=new THREE.Color("rgb(50,250,150)");
        var ret2=extrBldg(bldgObjArr[i], ht1, colr2, coeff, htExt_gcn);
        var mesh2=ret2[0];
        gcnBldgArr.push(mesh2);
    }
    console.log(num0, num1, num2, num3);
}

function extrBldg(bldgObj, pushZ, colr, coeff, htExt){
    var pts=bldgObj.pts;
    var p=pts[0];
    var diRa=bldgObj.diRa;
    
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
        amount:(htExt)*bldgObj.diRa/5.0,
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




