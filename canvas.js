const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75,
    window.innerWidth / window.innerHeight, 0.1, 1000 );

// Basic elements
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
document.body.appendChild( renderer.domElement );
const controls = new THREE.OrbitControls( camera, renderer.domElement );

// Background texture
const texture = new THREE.TextureLoader().load( 'img/sky1K.jpg',
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
const floorLength = 1000;
const floorResolutionFactor = 4e-2;
const floorTextureRepetitions = floorLength * floorResolutionFactor;

const floorGeometry = new THREE.PlaneGeometry( floorLength, floorLength );
const floorMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load( 'img/asphalt.jpg' )
});
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
floorMaterial.map.anisotropy = maxAnisotropy;
floorMaterial.map.wrapS = THREE.RepeatWrapping;
floorMaterial.map.wrapT = THREE.RepeatWrapping;
floorMaterial.map.repeat.set(floorTextureRepetitions, floorTextureRepetitions);
const floor = new THREE.Mesh( floorGeometry, floorMaterial );
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true;
scene.add( floor );

// Kart
const GLTFLoader = new THREE.GLTFLoader();
GLTFLoader.load( 'models/kart.glb', function ( gltf ) {
    gltf.scene.position.y = 5;
    let i = 0;
    gltf.scene.traverse( function( child ) {
        if( child.isMesh ) {
            console.log(i);
            child.castShadow = true;
            child.material = new THREE.MeshLambertMaterial( {
                // fill color
            } );
        }
        i++;
    } );
    scene.add( gltf.scene );
    }, undefined, function ( error ) {
    console.error( error );
} );

//##################################################### TEST ZONE dont remove

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
const cubeCamera = new THREE.CubeCamera( 1, 100000, cubeRenderTarget );
scene.add( cubeCamera );

const geometry = new THREE.SphereGeometry(2, 100, 50);
const material = new THREE.MeshLambertMaterial({
    envMap: cubeCamera.renderTarget.texture
});
const sphere = new THREE.Mesh( geometry, material );
sphere.position.y = 2;
scene.add( sphere );

//########################################################33

camera.position.y = 15;
camera.lookAt(0, 0, 0);

const animate = function () {
    requestAnimationFrame( animate );
    //########################## TEST ZONE dont remove
    cubeCamera.position.copy( sphere.position );
    cubeCamera.update( renderer, scene );
    //##########################
    renderer.render( scene, camera );
};

animate();