// data gui
// gui variables

var datgui=new dat.GUI({autoPlace:false});
var genGuiControls=new function(){
    this.Q0_GCN=1.0;
    this.Q0_NCN=1.0;
    this.Q0_RCN=1.0;
    this.Q1_GCN=1.0;
    this.Q1_NCN=1.0;
    this.Q1_RCN=1.0;
    this.Q2_GCN=1.0;
    this.Q2_NCN=1.0;
    this.Q2_RCN=1.0;
    this.Q3_GCN=1.0;
    this.Q3_NCN=1.0;
    this.Q3_RCN=1.0;
    this.ht_coeff=2.0;
    this.road_Depth=0.05;
    this.show_Parks=true;
    this.show_GCN_Bldg=true;
    this.show_NCN_Bldg=true;
    this.show_RCN_Bldg=true;
    this.show_Debug=false;
    this.show_Network=false;
    this.show_Axes=false;
}

var guiControls=datgui.addFolder("genGuiControls");
var Q0_GCN=guiControls.add(genGuiControls, "Q0_GCN", 0.0,10.0);
var Q0_NCN=guiControls.add(genGuiControls, "Q0_NCN", 0.0,10.0);
var Q0_RCN=guiControls.add(genGuiControls, "Q0_RCN", 0.0,10.0);
var Q1_GCN=guiControls.add(genGuiControls, "Q1_GCN", 0.0,10.0);
var Q1_NCN=guiControls.add(genGuiControls, "Q1_NCN", 0.0,10.0);
var Q1_RCN=guiControls.add(genGuiControls, "Q1_RCN", 0.0,10.0);
var Q2_GCN=guiControls.add(genGuiControls, "Q2_GCN", 0.0,10.0);
var Q2_NCN=guiControls.add(genGuiControls, "Q2_NCN", 0.0,10.0);
var Q2_RCN=guiControls.add(genGuiControls, "Q2_RCN", 0.0,10.0);
var Q3_GCN=guiControls.add(genGuiControls, "Q3_GCN", 0.0,10.0);
var Q3_NCN=guiControls.add(genGuiControls, "Q3_NCN", 0.0,10.0);
var Q3_RCN=guiControls.add(genGuiControls, "Q3_RCN", 0.0,10.0);

var HT_COEFF=guiControls.add(genGuiControls, "ht_coeff", 0.50,5.00);
var roadDepth=guiControls.add(genGuiControls, "road_Depth",0.05,0.10);
showGcnBldgs=guiControls.add(genGuiControls, "show_GCN_Bldg");
showNcnBldgs=guiControls.add(genGuiControls, "show_NCN_Bldg");
showRcnBldgs=guiControls.add(genGuiControls, "show_RCN_Bldg");
showParks=guiControls.add(genGuiControls, "show_Parks");
showBldgs=guiControls.add(genGuiControls, "show_Network");
showAxes=guiControls.add(genGuiControls, "show_Axes");
showAxes=guiControls.add(genGuiControls, "show_Debug");

var customContainer=document.getElementById("moveGUI");
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