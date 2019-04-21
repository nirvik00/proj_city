var scene3d=document.getElementById("scene3d");
var infoPara=document.getElementById("information");

var init=function(){
    scene=new THREE.Scene();
    scene.background=new THREE.Color("rgb(255,255,255)");
    raycaster=new THREE.Raycaster();
    camera=new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.up=new THREE.Vector3(0,0,1);    
    camera.position.x=0;
    camera.position.y=-20;
    camera.position.z=20;
    
    addPointLights();
    
    renderer=new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    scene3d.appendChild(renderer.domElement);
    axes=new THREE.AxesHelper(5);
    scene.add(axes);

    controls=new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    controls.enableZoom=true;
}

var mainLoop=function(){
    requestAnimationFrame(mainLoop);
    guiUpdates();
    render();
}

var render=function(){
    renderer.render(scene,camera);
}

function addPointLights(){
    var intensity = 0.5;
    var distance = 50;
    var decay = 2.0;
    var c1 = 0xcccccc  , c2 = 0xcccccc , c3 = 0xcccccc , c4 = 0xcccccc , c5 = 0xcccccc , c6 = 0xcccccc ;
    var sphere = new THREE.SphereBufferGeometry( 0.25, 1, 32 );

    light1 = new THREE.PointLight( c1, intensity, distance, decay );
    light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c1 } ) ) );
    light1.position.z=15;
    scene.add( light1 );

    light2 = new THREE.PointLight( c2, intensity, distance, decay );
    light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c2 } ) ) );
    light2.position.x=7;
    light2.position.y=-7;
    light2.position.z=15;
    scene.add( light2 );

    light3 = new THREE.PointLight( c3, intensity, distance, decay );
    light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c3 } ) ) );
    light3.position.y=10;
    light3.position.z=15;
    scene.add( light3 );

    light4 = new THREE.PointLight( c4, intensity, distance, decay );
    light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c4 } ) ) );
    light4.position.y=-7;
    light4.position.z=15;
    scene.add( light4 );

    light5 = new THREE.PointLight( c5, intensity, distance, decay );
    light5.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c5 } ) ) );
    light5.position.x=-7;
    light5.position.y=7;
    light5.position.z=15;
    scene.add( light5 );

    light6 = new THREE.PointLight( c6, intensity, distance, decay );
    light6.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c6 } ) ) );
    light6.position.x=-7;
    light6.position.y=-7;
    light6.position.z=15;
    scene.add( light6 );

    var dlight = new THREE.DirectionalLight( 0xffffff, 0.05 );
    dlight.position.set( 0.5, 10, 5 ).normalize();
    scene.add( dlight );
}


var getData=function(allobjs){
    var ALLJSONOBJS=allobjs;
    initGeometry(ALLJSONOBJS);
    //console.log(allobjs);
}

init();
mainLoop();