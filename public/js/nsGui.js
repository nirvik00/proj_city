/* GUI variables
* gridLe
* gridWi
* gridHi
*/
var datgui= new dat.GUI({ autoPlace: false });
var guiControls=new function(){
  this.gridL=2.5;
  this.gridH=2.5;
  this.FSRRes=0.3;
  this.FSRComm=0.3;
  this.FSROffice=0.3;
  this.autoLoop=false;
  //this.setWireframe=true;
  this.minHt=3;
  this.midHt=7;
  this.maxHt=20;
  this.ratio_Res_Comm=0.3;
  this.ratio_Comm_Off=0.3;
  this.ratio_Off_Res=0.3;
}

datgui.add(guiControls, "gridL", 1, 5);
datgui.add(guiControls, "gridH", 1, 5);
datgui.add(guiControls, "FSRRes", 0.1,3);
datgui.add(guiControls, "FSRComm", 0.1,3);
datgui.add(guiControls, "FSROffice", 0.1,3);
datgui.add(guiControls, "autoLoop");
//datgui.add(guiControls, "setWireframe");
datgui.add(guiControls, "minHt",1,5);
datgui.add(guiControls, "midHt",5,12);
datgui.add(guiControls, "maxHt",12,25);

var customContainer = document.getElementById('moveGUI');
customContainer.appendChild(datgui.domElement);