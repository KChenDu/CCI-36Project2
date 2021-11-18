Relatório Project2 CCI-36
========
Grupo:  
* Ricardo Macedo Pacheco
* Kelven Yi Chen Du

Link da pagina hospedada:
[https://kchendu.github.io/CCI-36Project2/index.html](https://kchendu.github.io/CCI-36Project2/index.html).

--------

## Curvas utilizadas e criação da pista ##

Foi usada para fitar os pontos de controle uma spline catmull-rom. A partir de uma lista de pontos de controle e angulos de controle (isto é, com que angulo a pista deve passar por cada ponto de controle), foi feita uma extrusão para gerar dois splines que representam as curvas esquerda e direita da pista e uma geometria customizada foi criada a partir dos pontos desses splines.

Como o modelo de carrinho que o grupo escolheu foi um kart, decidimos substituir os trilhos da montanha russa por uma pista de corrida; o resultado ficou semelhante a uma pista da hot wheels.

## Inlucsão da mapa do ambiente ##

A mapa da ambiente deste trabalho é composto por duas partes. A primeira é a mapa ambiental (enviroment map) feito de uma imagem celeste e a segunda de um piso implementado usando plane geometry do THREE.js. Para tornar a cena mais realista, colocou-se em adição uma textura asfalto para o piso.

## Uso de texturas e sombreamentos ##

Com relação à textura, além da prática já feita no item anterior para o piso. Fez se também uma textura metálica para os turbos do kart. Basicamente, a ideia é utilizar 

[Examples](https://threejs.org/examples/) &mdash;
[Documentation](https://threejs.org/docs/) &mdash;
[Wiki](https://github.com/mrdoob/three.js/wiki) &mdash;
[Migrating](https://github.com/mrdoob/three.js/wiki/Migration-Guide) &mdash;
[Questions](http://stackoverflow.com/questions/tagged/three.js) &mdash;
[Forum](https://discourse.threejs.org/) &mdash;
[Slack](https://join.slack.com/t/threejs/shared_invite/zt-rnuegz5e-FQpc6YboDVW~5idlp7GfDw) &mdash;
[Discord](https://discordapp.com/invite/HF4UdyF)

### Usage ###

This code creates a scene, a camera, and a geometric cube, and it adds the cube to the scene. It then creates a `WebGL` renderer for the scene and camera, and it adds that viewport to the `document.body` element. Finally, it animates the cube within the scene for the camera.

```javascript
import * as THREE from './js/three.module.js';
let camera, scene, renderer;
let geometry, material, mesh;
init();
function init() {
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	camera.position.z = 1;
	scene = new THREE.Scene();
	geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
	material = new THREE.MeshNormalMaterial();
	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setAnimationLoop( animation );
	document.body.appendChild( renderer.domElement );
}
function animation( time ) {
	mesh.rotation.x = time / 2000;
	mesh.rotation.y = time / 1000;
	renderer.render( scene, camera );
}
```

If everything went well, you should see [this](https://jsfiddle.net/vy29n6aj/).

### Cloning this repository ###

Cloning the repo with all its history results in a ~2 GB download. If you don't need the whole history you can use the `depth` parameter to significantly reduce download size.

```sh
git clone --depth=1 https://github.com/mrdoob/three.js.git
```

### Change log ###

[Releases](https://github.com/mrdoob/three.js/releases)


[npm]: https://img.shields.io/npm/v/three
[npm-url]: https://www.npmjs.com/package/three
[build-size]: https://badgen.net/bundlephobia/minzip/three
[build-size-url]: https://bundlephobia.com/result?p=three
[npm-downloads]: https://img.shields.io/npm/dw/three
[npmtrends-url]: https://www.npmtrends.com/three
[lgtm]: https://img.shields.io/lgtm/alerts/github/mrdoob/three.js
[lgtm-url]: https://lgtm.com/projects/g/mrdoob/three.js/