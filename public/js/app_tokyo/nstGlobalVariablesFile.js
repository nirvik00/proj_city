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

var siteSegArr=[]; // dynamic ->  segments from the diagonal to the site boundary
var siteQuadArr=[]; // dynamic -> site split into divs and construct quad from successive seg= Arr
var cellArr=[]; //dynamic ->  array of cells from the quad-> bays of the site
var siteDiagArr=[]; // dynamic -> rendered diags of site obj
var superBlockForms=[]; // dynamic -> rendered mesh for superblocks

// main functions about the generation
var camera, scene, renderer, control, axes, stats;

var sceneObjs=[]; // raycaster intersection with object
var raycaster,INTERSECTED;
var raycasterLine;
var intersects;
var mouse;
var isShiftDown=false;
var mouse = new THREE.Vector2();