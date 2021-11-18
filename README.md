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

Com relação à textura, além da prática já feita no item anterior para o piso. Fez se também uma textura metálica para os turbos do kart. Basicamente, a ideia é utilizar um cubeCamera e posicionar ele sempre em onde está o kart e depois configurar a textura dos turbos com as imagens capturados pela cubeCamera.

Sobre o sombreamento, a ideia é mais simples ainda. Basta configurar os parâmetros correspondentes. No caso, o grupo teve que configurar os `shadow.mapSize`, `shadow.bias`, `shadow.cameraZoom` e `shadow.Radius` para mostrar o efeito visual confome o exemplar do link.


## Posições da Câmeras ##

Foram predifinidos três câmeras (campos de visão) para o trabalho, cujo trocas são baseados no teclado. Aqui, o teclado '1' muda para o campo de visão distante, observando a cena inteira o trabalho. O  teclado '2' muda a visão para a visão de piloto, observando em cima do kart em movimento. O teclado '3' muda a visão para fora do kart, acompanhando seu movimento e olhando sempre para ele.