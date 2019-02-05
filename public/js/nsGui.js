/* GUI variables
* gridLe
* gridWi
* gridHi
*/
var datgui= new dat.GUI({ autoPlace: false });
var guiControls=new function(){
  this.numL=2;
  this.numH=2;
  this.gridL=2.5;
  this.gridH=2.5;
  
  this.ratio_Road=0.25;
  this.ratio_Path=0.50;
  this.ratio_Green=0.25;
  
  this.FSRRes=0.3;
  this.FSRComm=0.3;
  this.FSROffice=0.3;
  
  this.minHt=3;
  this.midHt=7;
  this.maxHt=20;
  
  this.ratio_Res_Comm=0.3;
  this.ratio_Comm_Off=0.3;
  this.ratio_Off_Res=0.3;
  
  this.autoLoop=false;
  
  this.show_OnlyGround=false;
  this.show_Road=true;
  this.show_Green=true;
  this.show_Path=true;
  
  this.show_Residences=true;
  this.show_Commercial=true;
  this.show_Office=true;
  
  this.show_Information=false;
}
datgui.add(guiControls, "numL", 1, 5);
datgui.add(guiControls, "numH", 1, 5);
datgui.add(guiControls, "gridL", 1, 5);
datgui.add(guiControls, "gridH", 1, 5);

datgui.add(guiControls, "ratio_Road", 0.1,1);
datgui.add(guiControls, "ratio_Path", 0.1,1);
datgui.add(guiControls, "ratio_Green", 0.1,1);

datgui.add(guiControls, "FSRRes", 0.1,3);
datgui.add(guiControls, "FSRComm", 0.1,3);
datgui.add(guiControls, "FSROffice", 0.1,3);

datgui.add(guiControls, "minHt",1,5);
datgui.add(guiControls, "midHt",5,12);
datgui.add(guiControls, "maxHt",12,25);

datgui.add(guiControls, "autoLoop");

datgui.add(guiControls, "show_OnlyGround");

datgui.add(guiControls, "show_Green");
datgui.add(guiControls, "show_Road");
datgui.add(guiControls, "show_Path");

datgui.add(guiControls, "show_Residences");
datgui.add(guiControls, "show_Commercial");
datgui.add(guiControls, "show_Office");
datgui.add(guiControls, "show_Information");


var customContainer = document.getElementById('moveGUI');
customContainer.appendChild(datgui.domElement);