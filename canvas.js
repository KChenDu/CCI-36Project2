const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// Basic elements
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMapEnabled = true;
document.body.appendChild( renderer.domElement );
const controls = new THREE.OrbitControls( camera, renderer.domElement );

// Background texture
const TextureLoader = new THREE.TextureLoader();
const texture = TextureLoader.load( 'img/sky1K.jpg',
    () => {
        const rt = new THREE.WebGLCubeRenderTarget( texture.image.height );
        rt.fromEquirectangularTexture( renderer, texture );
        scene.background = rt.texture;
    });

// Sunshine
const light = new THREE.DirectionalLight( 0xFFFFFF );
light.castShadow = true;
light.position.set(7, 6, 0);
const helper = new THREE.DirectionalLightHelper( light, 5 );
scene.add( helper );
scene.add( light );

// Floor
const floor_geometry = new THREE.PlaneGeometry( 100000, 100000 );
const floor_material = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load( 'img/asphalt.jpg' )
});
floor_material.map.wrapS = THREE.RepeatWrapping;
floor_material.map.wrapT = THREE.RepeatWrapping;
floor_material.map.repeat.set(200, 200);
const floor = new THREE.Mesh( floor_geometry, floor_material );
floor.rotation.x = -Math.PI / 2
// ground.castShadow = true;
floor.receiveShadow = true;
scene.add( floor );

// Kart
const GLTFLoader = new THREE.GLTFLoader();
GLTFLoader.load( 'models/kart.glb', function ( gltf ) {
    gltf.scene.position.y = 5;
    gltf.scene.children[3].material = new THREE.MeshStandardMaterial( {
        color: 0xff0000
    } );
    gltf.scene.children[7].material = new THREE.MeshPhongMaterial( {
        color: 0x111111
    } );//7 8 12
    gltf.scene.children[17].material = new THREE.MeshStandardMaterial( {
        color: 0xaaaaaa
    } );
    gltf.scene.children[18].material = new THREE.MeshStandardMaterial( {
        color: 0xaaaaaa
    } );
    gltf.scene.children[20].material = new THREE.MeshStandardMaterial( {
        color: 0xaaaaaa
    } );
    gltf.scene.children[24].material = new THREE.MeshStandardMaterial( {
        color: 0xff0000
    } );
    gltf.scene.children[25].material = new THREE.MeshStandardMaterial( {
        color: 0xff0000
    } );
    gltf.scene.children[26].material = new THREE.MeshStandardMaterial( {
        color: 0xff0000
    } );
    gltf.scene.children[28].material = new THREE.MeshStandardMaterial( {
        color: 0xff0000
    } );
    gltf.scene.traverse( function( child ) {
        child.castShadow = true;
        // child.material = new THREE.MeshStandardMaterial( {
        //     color: 0x0000ff
        //
        // } );
    } );
    scene.add( gltf.scene );
    }, undefined, function ( error ) {
    console.error( error );
} );

//#####################################################
/*
sphereCamera = new THREE.CubeCamera(1,1000,500);
sphereCamera.position.set(0,100,0);
scene.add(sphereCamera);

let sphereMaterial = new THREE.MeshBasicMaterial({
    envMap: sphereCamera.renderTarget
});
let sphereGeo = new THREE.SphereGeometry(350,50,50);
let sphere = new THREE.Mesh(sphereGeo,sphereMaterial);
sphere.position.set(0,100,0);
scene.add(sphere);
*/
//########################################################33

// controls.update();
camera.position.y = 15;
camera.lookAt(0, 0, 0);

const animate = function () {
    requestAnimationFrame( animate );

    // sphereCamera.updateCubeMap(renderer,scene);
    renderer.render( scene, camera );
};

animate();