import { trackGeometry, middleLineGeometry,
  trackGetPoint, trackGetNormal, trackGetTangent 
} from "./track.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75,
  window.innerWidth / window.innerHeight, 0.1, 1000
);

// Basic elements
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
document.body.appendChild( renderer.domElement );
const controls = new THREE.OrbitControls( camera, renderer.domElement );
const axeshelp = new THREE.AxesHelper(5);
scene.add(axeshelp)

// Background texture
const texture = new THREE.TextureLoader().load( 'img/sky1K.jpg', () => {
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
let kart;
GLTFLoader.load('models/kart.glb',
  function ( gltf ) {
    //gltf.scene.position.y = 5;
    let i = 0;
    gltf.scene.traverse( function( child ) {
      if( child.isMesh ) {
        //console.log(i);
        child.castShadow = true;
        child.material = new THREE.MeshLambertMaterial({
            // fill color
        });
      }
      i++;
    } );
    kart = gltf.scene;
    trackObject.add( gltf.scene );
  }, 
  undefined, 
  function ( error ) {onsole.error( error );}
);

// Keyboard Controls
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case '1':
      scene.add(camera);
      camera.position.set(70, 70, 70);
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

// Track
const trackMaterial = new THREE.MeshLambertMaterial(
  {color: 0xff0000, side: THREE.DoubleSide}
);
const trackObject = new THREE.Mesh(trackGeometry, trackMaterial);

const middleLineMaterial = new THREE.LineBasicMaterial(
  {color: 0xffffff, linewidth: 6}
);
const middleLineObject = new THREE.Line(middleLineGeometry, middleLineMaterial);

trackObject.add(middleLineObject);

trackObject.position.y += 10;
scene.add(trackObject);

// Animation

let progress = 0;
const position = new THREE.Vector3();
const normal = new THREE.Vector3();
const tangent = new THREE.Vector3();
const cross = new THREE.Vector3();
const matrix = new THREE.Matrix4();

const animate = function () {
  if(kart){
    
    progress += 1/400
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
    
    renderer.render( scene, camera );
  }
};

renderer.setAnimationLoop(animate);

camera.position.set(70, 70, 70);
camera.lookAt(0, 0, 0);