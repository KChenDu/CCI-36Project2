const PI2 = 2 * Math.PI;


/******************************************
* Track Parameters - CHANGE THE PATH HERE *
******************************************/

const width = 5;
const nCtrlPoints = 300;
const curveResolution = 1000;

// Control points definition
const controlPoints = []
const controlAngles = []

function getPathPoints(p) {
  p = p * PI2;

  const x = Math.sin( p * 3 ) * Math.cos( p * 4 ) * 50;
  const y = Math.sin( p * 10 ) * 6 + Math.cos( p * 33/2 ) * 2 + 10;
  const z = Math.sin( p ) * Math.sin( p * 4 ) * 50;

  return new THREE.Vector3().set( x, y, z ).multiplyScalar( 2 );
  //return new THREE.Vector3().setFromCylindricalCoords(50, 2*PI2*p, 40*p);
}

function getPathAngles(p) {
  return Math.sin(p*40) * PI2/6;
  return 0;
}

for(let i=0; i<nCtrlPoints; i+=1) {
  const u = i/nCtrlPoints;

  controlPoints.push(getPathPoints(u))
  controlAngles.push(getPathAngles(u))
}

// By here, the track is defined.


/******************
* Curve formation *
******************/

const middleCurve = new THREE.CatmullRomCurve3(controlPoints)

const leftCtrlPoints = []
const rightCtrlPoints = []

const tanVec = new THREE.Vector3();
const correctedUpVec = new THREE.Vector3();
const normalVec = new THREE.Vector3();
const tiltedVec = new THREE.Vector3();

for(let i=0; i<nCtrlPoints; i+=1) {
  const u = i / nCtrlPoints;

  middleCurve.getTangent(u, tanVec);
  tanVec.normalize();
  correctedUpVec.crossVectors(THREE.Object3D.DefaultUp, tanVec)
    .normalize().cross(tanVec).negate();
  
  normalVec.copy(correctedUpVec).applyAxisAngle(tanVec, -controlAngles[i])
  tiltedVec.crossVectors(normalVec, tanVec)

  const centerPoint = controlPoints[i];
  const leftPoint = centerPoint.clone()
    .addScaledVector(tiltedVec, width/2);
  const rightPoint = centerPoint.clone()
    .addScaledVector(tiltedVec, -width/2);

  leftCtrlPoints.push(leftPoint)
  rightCtrlPoints.push(rightPoint)
}

export const leftCurve = new THREE.CatmullRomCurve3(leftCtrlPoints);
export const rightCurve = new THREE.CatmullRomCurve3(rightCtrlPoints);


/**************************
* Get component functions *
**************************/

export function trackGetPoint(p) {
  // return leftCurve.getPointAt(p).clone()
  //   .add(rightCurve.getPointAt(p))
  //   .divideScalar(2);
  return leftCurve.getPoint(p).clone()
    .add(rightCurve.getPoint(p))
    .divideScalar(2);
}

export function trackGetNormal(p) {
  // const tangent = middleCurve.getTangentAt(p);
  // const cross = leftCurve.getPointAt(p).clone().sub(rightCurve.getPointAt(p))
  // return tangent.cross(cross).normalize()
  const tangent = middleCurve.getTangent(p);
  const cross = leftCurve.getPoint(p).clone().sub(rightCurve.getPoint(p))
  return tangent.cross(cross).normalize()
}

export function trackGetTangent(p) {
  // return middleCurve.getTangentAt(p).normalize();
  return middleCurve.getTangent(p).normalize();
}


/**************************************
* Calculate mesh vertices and normals *
**************************************/

const vertices = [];
const normals = [];

// const leftSpacedPoints = leftCurve.getSpacedPoints(curveResolution)
// const rightSpacedPoints = rightCurve.getSpacedPoints(curveResolution)
const leftSpacedPoints = leftCurve.getPoints(curveResolution)
const rightSpacedPoints = rightCurve.getPoints(curveResolution)

for(let i = 0; i < curveResolution-1; i++) {
  const point1 = leftSpacedPoints[i]
  const point2 = rightSpacedPoints[i]
  const point3 = leftSpacedPoints[i+1]
  const point4 = rightSpacedPoints[i+1]

  const normal = new THREE.Vector3().crossVectors(
    point2.clone().sub(point1),
    point3.clone().sub(point1)
  ).normalize()

  vertices.push( point1.x, point1.y, point1.z );
  vertices.push( point2.x, point2.y, point2.z );
  vertices.push( point4.x, point4.y, point4.z );

  vertices.push( point1.x, point1.y, point1.z );
  vertices.push( point4.x, point4.y, point4.z );
  vertices.push( point3.x, point3.y, point3.z );

  for(let i = 0; i < 6; i++) { 
    normals.push( normal.x, normal.y, normal.z );
  }
}


/**************************
* Create Track Geometries *
**************************/

export const trackGeometry = new THREE.BufferGeometry()
  .setAttribute('position', new THREE.BufferAttribute( 
    new Float32Array(vertices), 3
  ))
  .setAttribute('normal', new THREE.BufferAttribute(
    new Float32Array(normals), 3
  ))

export const middleLineGeometry = new THREE.BufferGeometry().setFromPoints(
  (()=>{
    // const arrLeft = leftCurve.getSpacedPoints(curveResolution);
    // const arrRight = rightCurve.getSpacedPoints(curveResolution);
    const arrLeft = leftCurve.getPoints(curveResolution);
    const arrRight = rightCurve.getPoints(curveResolution);
    const arrCenter = arrLeft.map((lv, i)=>(
      lv.clone().add(arrRight[i]).divideScalar(2)
    ))
    return arrCenter
  })()
);

/*
// Old Version
const PI2 = 2 * Math.PI

// Parametros da curva
const radius = 70;
const circleCenter = new THREE.Vector3(radius, 0, 0);
const coneHeight = 100;
const nVoltas = 6;
const trackSecWidth = 10;
const trackSecHeight = 1;

// Optimização
const secWidthUlen = 0.5 * trackSecWidth / (trackSecWidth+trackSecHeight);
const secHeightUlen = 0.5 - secWidthUlen;

const plane1Ubegin = 0;
const plane2Ubegin = secWidthUlen;
const plane3Ubegin = 0.5;
const plane4Ubegin = 0.5 + secWidthUlen;

const plane1Umid = (plane1Ubegin + plane2Ubegin) / 2
const plane2Umid = (plane2Ubegin + plane3Ubegin) / 2
const plane3Umid = (plane3Ubegin + plane4Ubegin) / 2
const plane4Umid = (plane4Ubegin + 1) / 2

const track = function(){
  const secCenter = new THREE.Vector3();
  const normal = new THREE.Vector3();

  return {
    getPointAt(p) {
      const secAng = p * PI2 * nVoltas

      return secCenter
      .setFromCylindricalCoords(radius, secAng, p*coneHeight)
      .add(circleCenter)
    },

    getTangentAt(p) {
      const secAng = p * PI2 * nVoltas

    },

    getNormalAt(p) {
      const secAng = p * PI2 * nVoltas
      const secRoll = -30 / 180 * Math.PI;

      const normal = new THREE.Vector3(0,1,0);
  normal.applyAxisAngle(new THREE.Vector3(0,0,1), secRoll)
  normal.applyAxisAngle(new THREE.Vector3(1,0,0),
    -coneHeight/((1-progress)*radius) * PI2 * nVoltas
  )
  normal.applyAxisAngle(new THREE.Vector3(0,1,0), secAng)
  return normal
    }
  }
}()

export function trackGetPointAt(progress) {
  const secAng = progress * PI2 * nVoltas
  
  const secCenter = new THREE.Vector3(
    -((1-progress)*radius)*Math.cos(secAng),
    progress*coneHeight,
    ((1-progress)*radius)*Math.sin(secAng)
  )

  return secCenter.add(circleCenter);
}

export function trackGetNormalAt(progress) {
  const secAng = progress * PI2 * nVoltas
  const secRoll = -30 / 180 * Math.PI; // Mudar

  const normal = new THREE.Vector3(0,1,0);
  normal.applyAxisAngle(new THREE.Vector3(0,0,1), secRoll)
  normal.applyAxisAngle(new THREE.Vector3(1,0,0),
    -coneHeight/((1-progress)*radius) * PI2 * nVoltas
  )
  normal.applyAxisAngle(new THREE.Vector3(0,1,0), secAng)
  return normal
}

function trackFunction(u, v, target) {
  const secAng = v * PI2 * nVoltas
  const secRoll = -30 / 180 * Math.PI; // Mudar

  // const secCenter = new THREE.Vector3(
  //   -((1-v)*radius)*Math.cos(secAng),
  //   v*coneHeight,
  //   ((1-v)*radius)*Math.sin(secAng)
  // )
  const secCenter = new THREE.Vector3(
    radius*Math.cos(secAng),
    v*coneHeight,
    radius*Math.sin(secAng)
  )
  secCenter.add(circleCenter);


  let secWidthOffset;
  let secHeightOffset;

  if(u < plane2Ubegin) {
    // plane1: top plane
    secWidthOffset = ((u-plane1Umid)/secWidthUlen)*trackSecWidth
    secHeightOffset = 0.5*trackSecHeight
  }
  else if (u < plane3Ubegin) {
    // plane2: left plane
    secWidthOffset = 0.5*trackSecWidth
    secHeightOffset = ((plane2Umid-u)/secHeightUlen)*trackSecHeight
  }
  else if (u < plane4Ubegin) {
    // plane3: bottom plane
    secWidthOffset = ((plane3Umid-u)/secWidthUlen)*trackSecWidth
    secHeightOffset = -0.5*trackSecHeight
  }
  else {
    // plane4: right plane
    secWidthOffset = -0.5*trackSecWidth
    secHeightOffset = ((u-plane4Umid)/secHeightUlen)*trackSecHeight
  }
  
  const secVector = new THREE.Vector3(
    secWidthOffset, secHeightOffset, 0
  )
  secVector.applyAxisAngle(new THREE.Vector3(0,0,1), secRoll)
  secVector.applyAxisAngle(new THREE.Vector3(0,1,0), secAng)

  target.addVectors(secCenter, secVector);
}

export const trackGeometry = new THREE.ParametricGeometry(trackFunction, 10, 300);
*/