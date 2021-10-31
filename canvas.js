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

// Ground
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
// const GLTFLoader = new GLTFLoader();
/*GLTFLoader.load(
    'models/kart.blend',
    function ( gltf ) {
        //scene.add( gltf.scene );
    },
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) {
        console.log( 'An error happened' );
    }
);
*/
// Box
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
cube.castShadow = true;
cube.position.y = 2;
scene.add( cube );

// controls.update();
camera.position.z = 5;

const animate = function () {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
};

animate();