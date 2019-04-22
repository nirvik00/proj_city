// data gui
// gui variables

var datgui=new dat.GUI({autoPlace:false});
var genGuiControls=new function(){
    this.show_Parks=true;
    this.show_GCN_Bldg=true;
    this.show_NCN_Bldg=true;
    this.show_RCN_Bldg=true;
    this.ht_coeff=2.0;
    this.show_Debug=false;
    this.show_Network=false;
    this.show_Axes=false;
}

var guiControls=datgui.addFolder("genGuiControls");
showGcnBldgs=guiControls.add(genGuiControls, "show_GCN_Bldg");
showNcnBldgs=guiControls.add(genGuiControls, "show_NCN_Bldg");
showRcnBldgs=guiControls.add(genGuiControls, "show_RCN_Bldg");
var HT_COEFF=guiControls.add(genGuiControls, "ht_coeff", 0.50,5.00);
showParks=guiControls.add(genGuiControls, "show_Parks");
showBldgs=guiControls.add(genGuiControls, "show_Network");
showAxes=guiControls.add(genGuiControls, "show_Axes");
showAxes=guiControls.add(genGuiControls, "show_Debug");

var customContainer=document.getElementById("moveGui");
customContainer.appendChild(datgui.domElement);
datgui.close();


function guiUpdates(){
    if(genGuiControls.show_GCN_Bldg===true){
        for(var i=0; i<gcnBldgArr.length; i++){
            scene.add(gcnBldgArr[i]);
        }
    }else{
        for(var i=0; i<gcnBldgArr.length; i++){
            scene.remove(gcnBldgArr[i]);
        }
    }
    if(genGuiControls.show_NCN_Bldg===true){
        for(var i=0; i<ncnBldgArr.length; i++){
            scene.add(ncnBldgArr[i]);
        }
    }else{
        for(var i=0; i<ncnBldgArr.length; i++){
            scene.remove(ncnBldgArr[i]);
        }
    }
    if(genGuiControls.show_RCN_Bldg===true){
        for(var i=0; i<rcnBldgArr.length; i++){
            scene.add(rcnBldgArr[i]);
        }
    }else{
        for(var i=0; i<rcnBldgArr.length; i++){
            scene.remove(rcnBldgArr[i]);
        }
    }

    
    if(genGuiControls.show_Parks===true){
        for(var i=0; i<parkArr.length; i++){
            scene.add(parkArr[i]);
        }
    }else{
        for(var i=0; i<parkArr.length; i++){
            scene.remove(parkArr[i]);
        }
    }
    if(genGuiControls.show_Axes===true){
        scene.add(axes);
    }else{
        scene.remove(axes);
    }
    if(genGuiControls.show_Network===true){
        for(var i=0; i<nodeArr.length; i++){
            scene.add(nodeArr[i]);
        }    
        for(var i=0; i<edgeArr.length; i++){
            scene.add(edgeArr[i]);
        }
    }else{
        for(var i=0; i<nodeArr.length; i++){
            scene.remove(nodeArr[i]);
        }    
        for(var i=0; i<edgeArr.length; i++){
            scene.remove(edgeArr[i]);
        }
    }
    if(genGuiControls.show_Debug===true){
        for(var i=0; i<debugArr.length; i++){
            scene.add(debugArr[i]);
        }
    }else{
        for(var i=0; i<debugArr.length; i++){
            scene.remove(debugArr[i]);
        }
    }
    /*
    HT_COEFF.onChange(function(){
        console.clear();
        console.log("ht coefficient: "+genGuiControls.ht_coeff);
        initNetwork(ALLJSONOBJS);
        initGeometry(ALLJSONOBJS);
    });
    */
}