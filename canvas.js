const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// Basic elements
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMapEnabled = true;
document.body.appendChild( renderer.domElement );
const controls = new THREE.OrbitControls( camera, renderer.domElement );

// Background texture
const loader = new THREE.TextureLoader();
const texture = loader.load( 'img/mountain.jpg',
    () => {
        const rt = new THREE.WebGLCubeRenderTarget( texture.image.height );
        rt.fromEquirectangularTexture( renderer, texture );
        scene.background = rt.texture;
    });

// Sunshine
const light = new THREE.DirectionalLight( 0xFFFFFF );
light.castShadow = true;
light.position.set(7, 2, 0);
const helper = new THREE.DirectionalLightHelper( light, 5 );
scene.add( helper );
scene.add( light );

// Ground
const ground_geometry = new THREE.PlaneGeometry( 120, 120 );
const ground_material = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load( 'img/grass.jpg' )
});
const ground = new THREE.Mesh( ground_geometry, ground_material );
ground.lookAt(0, 1, 0)
// ground.castShadow = true;
ground.receiveShadow = true;
scene.add( ground )

// Box
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
cube.castShadow = true;
cube.position.y = 2
scene.add( cube );

// controls.update()
camera.position.z = 5;

const animate = function () {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
};

animate();