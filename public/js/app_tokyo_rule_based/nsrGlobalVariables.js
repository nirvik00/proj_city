
var wireframeVal=false;
var ALLJSONOBJS=[];
var networkEdgesArr=[]; // network edges object from db
var networkNodesArr=[]; // network nodes object from db
var nodeArr=[]; // network node render object from db
var edgeArr=[]; // network edge Line render object from db
var edgeMeshArr=[]; // network edge Mesh render object from db
var parkObjArr=[]; // park object from db
var parkArr=[]; // park render object from db
var bldgObjArr=[]; // bldg object from db
var bldgArr=[]; // bldg rendered object from db

var siteObjArr=[]; // site object from db
var siteArr=[]; // rendered site object from db

var camera, scene, renderer, controls, axes, stats; //required to render 3.js scene


var showBldgs=false;
var showParks=false;
var showAxes=false;