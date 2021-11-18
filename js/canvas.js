import { trackGeometry, middleLineGeometry,
  trackGetPoint, trackGetNormal, trackGetTangent,
  leftCurve
} from "./track.js";


/*****************
* Basic elements *
*****************/

// Scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75,
  window.innerWidth / window.innerHeight, 0.1, 1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
document.body.appendChild( renderer.domElement );

// OrbitControls
const controls = new THREE.OrbitControls( camera, renderer.domElement );
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128,
  { format: THREE.RGBFormat, generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter }
);
const cubeCamera = new THREE.CubeCamera( 1, 100000, cubeRenderTarget );
scene.add( cubeCamera );

// Background texture
const texture = new THREE.TextureLoader().load( 'js/img/sky1K.jpg', () => {
  const rt = new THREE.WebGLCubeRenderTarget( texture.image.height );
  rt.fromEquirectangularTexture( renderer, texture );
  scene.background = rt.texture;
});

// Sunshine
const light = new THREE.DirectionalLight( 0xFFFFFF );

light.position.set(0.7, 0.6, 0).multiplyScalar(100);

light.castShadow = true;
light.shadow.mapSize.width = 8192;
light.shadow.mapSize.height = 8192;
light.shadow.bias = -0.001
light.shadow.camera.zoom = 0.01;
light.shadow.radius = 1
//light.shadow.camera.position.set(0,100,0)
//light.shadow.camera.position.set(0,100,0)
//console.log(light.shadow.getFrustum())
scene.add( light );
//scene.add( light.target )
// helper
const helper = new THREE.DirectionalLightHelper( light, 5 );
scene.add( helper );

// Floor
const floorLength = 1000;
const floorResolutionFactor = 4e-2;
const floorTextureRepetitions = floorLength * floorResolutionFactor;

const floorGeometry = new THREE.PlaneGeometry( floorLength, floorLength );
const floorMaterial = new THREE.MeshLambertMaterial({
  map: new THREE.TextureLoader().load( 'js/img/asphalt.jpg' ),
  //shadowSide: THREE.DoubleSide
});
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
floorMaterial.map.anisotropy = maxAnisotropy;
floorMaterial.map.wrapS = THREE.RepeatWrapping;
floorMaterial.map.wrapT = THREE.RepeatWrapping;
floorMaterial.map.repeat.set(floorTextureRepetitions, floorTextureRepetitions);
const floor = new THREE.Mesh( floorGeometry, floorMaterial );
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add( floor );


/********** 
* Vehicle *
**********/

let kart;
const GLTFLoader = new THREE.GLTFLoader();

// Kart
GLTFLoader.load('js/models/kart.glb',
  function ( gltf ) {
    gltf.scene.children[8].material = new THREE.MeshLambertMaterial( {
      envMap: cubeCamera.renderTarget.texture
    } );
    gltf.scene.children[9].material = new THREE.MeshLambertMaterial( {
      envMap: cubeCamera.renderTarget.texture
    } );
    gltf.scene.children[13].material = new THREE.MeshLambertMaterial( {
      envMap: cubeCamera.renderTarget.texture
    } );
    gltf.scene.children[26].material = new THREE.MeshLambertMaterial( {
      envMap: cubeCamera.renderTarget.texture
    } );
    gltf.scene.traverse( function( child ) {
      if( child.isMesh ) {
        child.castShadow = true;
      }
    } );
    kart = gltf.scene;
    trackObject.add( gltf.scene );
    // scene.add( gltf.scene );
  },
  undefined, 
  function ( error ) { console.error( error ); }
);


/********************
* Keyboard Controls *
********************/

document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case '1':
      scene.add(camera);
      camera.position.set(1, 1, 1).multiplyScalar(90);
      // camera.position.set(150, 350, 200);
      camera.lookAt(0, 0, 0);
      break;
    case '2':
      kart.add(camera);
      camera.position.set(0,3,0);
      camera.setRotationFromAxisAngle(new THREE.Vector3( 0, 1, 0), Math.PI);
      break;
    case '3':
      kart.add(camera);
      camera.position.set(0,8,-20);
      camera.setRotationFromAxisAngle(new THREE.Vector3( 0, 1, 0), Math.PI);
      break;
    default:
  }
})


/********
* Track *
********/

// Macedo
// Track
const trackMaterial = new THREE.MeshLambertMaterial(
  {color: 0xff0000, side: THREE.DoubleSide, shadowSide: THREE.FrontSide}
);
const trackObject = new THREE.Mesh(trackGeometry, trackMaterial);
trackObject.castShadow = true;
trackObject.receiveShadow = true;

// Middle white line
const middleLineMaterial = new THREE.LineBasicMaterial(
  {color: 0xffffff, linewidth: 2}
);
const upMiddleLineObject = new THREE.Line(middleLineGeometry,
  middleLineMaterial);
const downMiddleLineObject = new THREE.Line(middleLineGeometry, 
  middleLineMaterial);
upMiddleLineObject.position.y += 0.04
downMiddleLineObject.position.y -= 0.04

trackObject.add(upMiddleLineObject);
trackObject.add(downMiddleLineObject);
trackObject.position.y += 20;

trackObject.castShadow = true;
trackObject.receiveShadow = true;

scene.add(trackObject);

/************
* Animation *
************/

// Macedo
let progress = 0;
const position = new THREE.Vector3();
const normal = new THREE.Vector3();
const tangent = new THREE.Vector3();
const cross = new THREE.Vector3();
const matrix = new THREE.Matrix4();
const trackLength = leftCurve.getLength()

const velocityFactor = 1/2;

const animate = function () {
  if(kart){
    
    progress += velocityFactor/trackLength
    progress %= 1
    
    position.copy(trackGetPoint(progress));
    normal.copy(trackGetNormal(progress));
    tangent.copy(trackGetTangent(progress));
    cross.crossVectors(normal, tangent).normalize();

    matrix.set(
      cross.x, normal.x, tangent.x, 0,
      cross.y, normal.y, tangent.y, 0,
      cross.z, normal.z, tangent.z, 0,
      0, 0, 0, 1
    )

    kart.position.copy(position)
    kart.setRotationFromMatrix(matrix)
    // kart.position.set(0,0,0);
    //kart.lookAt(0,0,1);
    cubeCamera.position.copy( kart.position );
    cubeCamera.update( renderer, scene );
    renderer.render( scene, camera );
  }
};

renderer.setAnimationLoop(animate);


/*****************
* Initial camera *
*****************/

camera.position.set(1, 1, 1).multiplyScalar(90);
camera.lookAt(0, 0, 0);
