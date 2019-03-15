

function initGeometry(ALLJSONOBJS){
  //buildings
  bldgObjArr=[];
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
      var siteObj=new nsSite("site", area, cen, ptArr);
      siteObjArr.push(siteObj);
    }
  }
  genBldgGeometry();
  genParkGeometry();
  genSiteGeometry();
  genSiteSegments();
}

function genBldgGeometry() {
  for(var i=0; i<bldgArr.length; i++){
    bldgArr[i].geometry.dispose();
    bldgArr[i].material.dispose();
    scene.remove(bldgArr[i]);
  }

  bldgArr=[];
  if(genGuiControls.show_Buildings===true){
    for(var i=0; i<bldgObjArr.length; i++){
      bldgObjArr[i].genGeo();
    }
    for(var i=0; i<bldgArr.length; i++){
      scene.add(bldgArr[i]);
    }
  }  
}

function genParkGeometry() {
  for(var i=0; i<parkArr.length; i++){
    parkArr[i].geometry.dispose();
    parkArr[i].material.dispose();
    scene.remove(parkArr[i]);
  }

  parkArr=[];
  if(genGuiControls.show_Parks===true){
    for(var i=0; i<parkObjArr.length; i++) {
      parkObjArr[i].genGeo();
    }
    for(var i=0; i<parkArr.length; i++){
      scene.add(parkArr[i]);
    }
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

function genSiteSegments(){
  for(var i=0; i<siteSegArr.length; i++){
    siteSegArr[i].geometry.dispose();
    siteSegArr[i].material.dispose();
    scene.remove(siteSegArr[i]);
  }
  siteSegArr=[];

  for(var i=0; i<siteQuadArr.length; i++){
    siteQuadArr[i].geometry.dispose();
    siteQuadArr[i].material.dispose();
    scene.remove(siteQuadArr[i]);
  }
  siteQuadArr=[];

  for(var i=0; i<siteObjArr.length; i++){
    //if(i<1){
      siteObjArr[i].getDiagonal(); // generates diagonal internal to data structure
      siteObjArr[i].setBays();
      siteObjArr[i].processBayArr();
      //console.log(siteObjArr[i].area);
    //}    
  }
  
  if(genGuiControls.show_divisions===true){
    for(var i=0; i<siteSegArr.length;i++){
      scene.add(siteSegArr[i]);
    }
    for(var i=0; i<siteQuadArr.length;i++){
      scene.add(siteQuadArr[i]);
    }
    //console.log(siteArr.length, siteObjArr.length, siteSegArr.length, siteQuadArr.length);
  }
}




