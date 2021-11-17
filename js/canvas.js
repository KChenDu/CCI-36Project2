import { trackGeometry, middleLineGeometry,
  trackGetPoint, trackGetNormal, trackGetTangent 
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
const texture = new THREE.TextureLoader().load( '../img/sky1K.jpg', () => {
  const rt = new THREE.WebGLCubeRenderTarget( texture.image.height );
  rt.fromEquirectangularTexture( renderer, texture );
  scene.background = rt.texture;
});

// Sunshine
const light = new THREE.DirectionalLight( 0xFFFFFF );
light.castShadow = true;
light.position.set(7, 6, 0);
scene.add( light );
// helper
// const helper = new THREE.DirectionalLightHelper( light, 5 );
// scene.add( helper );

// Floor
const floorLength = 1000;
const floorResolutionFactor = 4e-2;
const floorTextureRepetitions = floorLength * floorResolutionFactor;

const floorGeometry = new THREE.PlaneGeometry( floorLength, floorLength );
const floorMaterial = new THREE.MeshLambertMaterial({
  map: new THREE.TextureLoader().load( '../img/asphalt.jpg' )
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
GLTFLoader.load('../models/kart.glb',
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

/*
// Cup
GLTFLoader.load( '../models/cup.glb',
  function ( gltf ) {
    let c = 0;
    // gltf.scene.position.set(points[i].x, points[i].y, points[i].z);
    // gltf.scene.lookAt( points[i + 1].x - points[i - 1].x,
    //   points[i + 1].y - points[i - 1].y,
    //   points[i + 1].z - points[i - 1].z );
    gltf.scene.traverse( function( child ) {
      // group.add( child );
      if( child.isMesh ) {
        console.log(c);
        child.castShadow = true;
        // child.receiveShadow = true;
        // child.material = new THREE.MeshLambertMaterial( {
        //   fill color
        // } );
      }
      c++;
    } );
    kart = gltf.scene;
    // kart.add( sphere );
    scene.add( gltf.scene );
  },
  undefined,
  function ( error ) {console.error( error );}
);
*/
// kart.children[1].position.set(3, 3, 3);


/********************
* Keyboard Controls *
********************/

document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case '1':
      scene.add(camera);
      camera.position.set(70, 70, 70);
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

/*
// Chen
// Track
const curve = new THREE.CatmullRomCurve3( [
  new THREE.Vector3( 0, 300, 30 ),
  new THREE.Vector3( 50, 30, 0 ),
  new THREE.Vector3( 80, 70, 70 ),
  new THREE.Vector3( 150, 40, -30 ),
  new THREE.Vector3( 190, 150, 0 ),
  new THREE.Vector3( 250, 250, 0 ),
  new THREE.Vector3( 300, 20, 0 ),
  new THREE.Vector3( 380, 0, 0 )
] );

const points = curve.getPoints( 10000 );
const trackGeometry = new THREE.BufferGeometry().setFromPoints( points );
const trackMaterial = new THREE.LineBasicMaterial( { color : 0xffffff } );
const track = new THREE.Line( trackGeometry, trackMaterial );
scene.add( track );

// Metal cube
const cubeGeometry = new THREE.SphereGeometry();
const cubeMaterial = new THREE.MeshLambertMaterial( {
  envMap: cubeCamera.renderTarget.texture
} );
const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
cube.castShadow = true;
cube.position.y = 2;
scene.add( cube );
*/

// Macedo
// Track
const trackMaterial = new THREE.MeshLambertMaterial(
  {color: 0xff0000, side: THREE.DoubleSide}
);
const trackObject = new THREE.Mesh(trackGeometry, trackMaterial);

// Middle white line
const middleLineMaterial = new THREE.LineBasicMaterial(
  {color: 0xffffff, linewidth: 6}
);
const middleLineObject = new THREE.Line(middleLineGeometry, middleLineMaterial);

trackObject.add(middleLineObject);

trackObject.position.y += 10;
scene.add(trackObject);


/************
* Animation *
************/

/*
// Chen

let i = 1;

const animate = function () {
  requestAnimationFrame( animate );
  //########################## TEST ZONE dont remove
  // kart.children[1].position.set(3,3,3);
  // updateKart(i);
  kart.position.copy( points[i] );
  cube.position.copy( points[i] );
  cube.position.y += 3;
  cube.lookAt( points[i + 1].x - points[i - 1].x,
               points[i + 1].y - points[i - 1].y,
               points[i + 1].z - points[i - 1].z );
  kart.rotation.y += 0.1;
  // cube.rotation.x += 0.1;
  // cube.rotation.z += 0.1;
  cubeCamera.position.copy( cube.position );
  cubeCamera.update( renderer, scene );
  // camera.position.copy( sphere.position );
  //##########################
  renderer.render( scene, camera );
  if ( i < 9999 )
    ++i;
  else
    i = 1;
}

animate()
*/

// Macedo
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


/*****************
* Initial camera *
*****************/

camera.position.set(70, 70, 70);
camera.lookAt(0, 0, 0);