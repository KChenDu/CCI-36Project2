const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// Basic elements
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMapEnabled = true;
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
const floor_geometry = new THREE.PlaneGeometry( 1000, 1000 );
const floor_material = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load( 'img/asphalt.jpg' )
});
floor_material.map.wrapS = THREE.RepeatWrapping;
floor_material.map.wrapT = THREE.RepeatWrapping;
floor_material.map.repeat.set( 200, 200 );
const floor = new THREE.Mesh( floor_geometry, floor_material );
floor.rotation.x = -Math.PI / 2
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
    let i = 0;
    gltf.scene.traverse( function( child ) {
        if( child.isMesh ) {
            console.log(i);
            child.castShadow = true;
            child.material = new THREE.MeshPhysicalMaterial( {
                color: 0xffffff,
                // roughness: 0.5,
                envMap: texture,
            } );
        }
        i++;
    } );
    scene.add( gltf.scene );
    }, undefined, function ( error ) {
    console.error( error );
} );

//#####################################################

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
///////////////////////////////////////
    cubeCamera.position.copy( sphere.position );
    cubeCamera.update( renderer, scene );
    /////////////////////////////
    renderer.render( scene, camera );
};

animate();