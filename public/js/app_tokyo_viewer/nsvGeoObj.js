//DATA
//p= 
//[0]=1.29
//[1]=3.46
//[2]=0.00
//
//q=
//[3]=1.02
//[4]=3.87
//[5]=0.00
//
//r=
//[6]=1.71
//[7]=3.73
//[8]=0.00,
//
//s=
//[9]=1.43
//[10]=4.15,
//[11]=.00
//
//type=
//[12]=park

var nsPt=function(x,y,z){
    this.x=x;
    this.y=y;
    this.z=z;
}

var CellObj=function(data){
    var arr=data.split(",");
    this.p=new nsPt(parseFloat(arr[0]), parseFloat(arr[1]), parseFloat(arr[2]));
    this.q=new nsPt(parseFloat(arr[3]), parseFloat(arr[4]), parseFloat(arr[5]));
    this.s=new nsPt(parseFloat(arr[6]), parseFloat(arr[7]), parseFloat(arr[8]));
    this.r=new nsPt(parseFloat(arr[9]), parseFloat(arr[10]), parseFloat(arr[11]));
    this.type=arr[12];
    this.getMeshGeo=function(){
        var geox=new THREE.Shape();
        geox.moveTo(0,0);
        geox.lineTo(this.q.x-this.p.x,this.q.y-this.p.y);
        geox.lineTo(this.r.x-this.p.x,this.r.y-this.p.y);
        geox.lineTo(this.s.x-this.p.x,this.s.y-this.p.y);
        geox.autoClose=true;

        var colr=new THREE.Color("rgb(0,0,2000)");
        var ext=0.1;
        if(this.type==="GCN"){
            colr=new THREE.Color("rgb(55,255,175)");
            ext=Math.random()/2 +0.30;
        }else if(this.type==="NCN"){
            colr=new THREE.Color("rgb(175,100,5)");
            ext=Math.random()/2 + .15;
        }else if(this.type==="RCN"){
            colr=new THREE.Color("rgb(150,150,150)");
            ext=Math.random()/2 + .5;
        }else if(this.type==="park"){
            colr=new THREE.Color("rgb(0,255,0)");
            ext=0.05;
        }else{
            colr=new THREE.Color("rgb(250,0,0)");
            ext=Math.random()/2 + 0.35;
        }
        var extSettings={
            steps:1,
            amount:ext, 
            bevelEnabled:false
        }
        var geometry=new THREE.ExtrudeBufferGeometry(geox, extSettings);
        var material=new THREE.MeshPhongMaterial({
            color:colr, 
            specular: 0x000000,
            shininess:10,
            flatShading:true
        });
        var mesh=new THREE.Mesh(geometry, material);
        mesh.position.x=this.p.x;
        mesh.position.y=this.p.y;
        return mesh;
    }
    this.display=function(){
        console.log(this.type);
    }
}

