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
const floor_geometry = new THREE.PlaneGeometry( 100, 100 );
const floor_material = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load( 'img/asphalt.jpg' )
});
floor_material.map.wrapS = THREE.RepeatWrapping;
floor_material.map.wrapT = THREE.RepeatWrapping;
floor_material.map.repeat.set(20, 20);
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
    gltf.scene.traverse( function( child ) {
        child.castShadow = true;
    } );
    scene.add( gltf.scene );
    }, undefined, function ( error ) {
    console.error( error );
} );

const cubeCamera = new THREE.CubeCamera(1, 1000, 50);
cubeCamera.position.y = 2;
scene.add(cubeCamera);

// const sphereMaterial = new THREE.MeshBasicMaterial();
const sphereMaterial = new THREE.MeshBasicMaterial( { envMap: cubeCamera.renderTarget } );
const sphereGeo =  new THREE.SphereGeometry();
const mirrorSphere = new THREE.Mesh(sphereGeo, sphereMaterial);
mirrorSphere.position.set(0, 2, 0);
scene.add(mirrorSphere);

// Punctual light
const p = new THREE.PointLight( 0xFFFFFF );
scene.add( p );

// controls.update();
camera.position.y = 15;
camera.lookAt(0, 0, 0);

const animate = function () {
    requestAnimationFrame( animate );

    renderer.render( scene, camera );

    mirrorSphere.visible=false;
    cubeCamera.position.copy(mirrorSphere.position);
    cubeCamera.updateCubeMap(renderer, scene);
    mirrorSphere.visible = true;
};

animate();