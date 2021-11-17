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
