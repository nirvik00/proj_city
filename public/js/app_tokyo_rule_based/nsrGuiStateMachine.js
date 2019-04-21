// data gui
// gui variables

var datgui=new dat.GUI({autoPlace:false});
var genGuiControls=new function(){
    this.show_Parks=true;
    this.show_Buildings=false;
    this.show_Axes=false;
}

var guiControls=datgui.addFolder("genGuiControls");
showBldgs=guiControls.add(genGuiControls, "show_Buildings");
showParks=guiControls.add(genGuiControls, "show_Parks");
showAxes=guiControls.add(genGuiControls, "show_Axes");

var customContainer=document.getElementById("moveGui");
customContainer.appendChild(datgui.domElement);
datgui.close();


function guiUpdates(){
    if(genGuiControls.show_Buildings===true){
        for(var i=0; i<bldgArr.length; i++){
            scene.add(bldgArr[i]);
        }
    }else{
        for(var i=0; i<bldgArr.length; i++){
            scene.remove(bldgArr[i]);
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
}