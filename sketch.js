var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;

var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;

var zombieGroup;

var bullets = 70;

var gameState = "fight"

var score=0;
var life =3;
var lose, winning, explosionSound;


function preload(){
  
  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")

  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  zombieImg = loadImage("assets/zombie.png")

  bgImg = loadImage("assets/bg.jpeg")

  lose = loadSound("assets/lose.mp3")
  winning = loadSound("assets/win.mp3")
  explosionSound = loadSound("assets/explosion.mp3")

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  // Agregando las imagenes de fondo
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 1.1
  

// Creando el sprite del jugador
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3
   player.debug = true
   player.setCollider("rectangle",0,0,300,300)


   // Creando sprites para representar la vida restante 
   heart1 = createSprite(displayWidth-150,40,20,20)
   heart1.visible = false
    heart1.addImage("heart1",heart1Img)
    heart1.scale = 0.4

    heart2 = createSprite(displayWidth-100,40,20,20)
    heart2.visible = false
    heart2.addImage("heart2",heart2Img)
    heart2.scale = 0.4

    heart3 = createSprite(displayWidth-150,40,20,20)
    heart3.addImage("heart3",heart3Img)
    heart3.scale = 0.4
   

    // Creando los grupos para los zombis y las balas
    bulletGroup = new Group()
    zombieGroup = new Group()



}

function draw() {
  background(0); 


if(gameState === "fight"){
  // Mostrar la imagen apropiada segun la vida restante 
  if(life===3){
    heart3.visible = true
    heart1.visible = false
    heart2.visible = false
  }
  if(life===2){
    heart2.visible = true
    heart1.visible = false
    heart3.visible = false
  }
  if(life===1){
    heart1.visible = true
    heart3.visible = false
    heart2.visible = false
  }

  // Ir al estado de juego (gameState) "lost" cuando quedan 0 vidas
  if(life===0){
    gameState = "lost"
    heart1.visible = false
    heart3.visible = false
    heart2.visible = false
    
  }

  // Ir al estado "won" si la puntuación es 100
  if(score==100){
    gameState = "won"
    winning.play();
  }

  // Mover al jugador arriba y abajo. Haciendo el juego compatible con entrada táctil
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}

if(keyDown("LEFT_ARROW")||touches.length>0){
  player.x = player.x-30
 }

 if(keyDown("RIGHT_ARROW")||touches.length>0){
  player.x = player.x+30
 }
 




// Liberar balas y cambiar la imagen del tirador a posición de tiro cuando se presiona la barra espaciadora.
if(keyWentDown("space")){
  bullet = createSprite(player.x-20,player.y-30,20,10)
  bullet.velocityX = 20
  
  bulletGroup.add(bullet)
  player.depth = bullet.depth
  player.depth = player.depth+2
  player.addImage(shooter_shooting)
  bullets = bullets-1
  explosionSound.play();
}

// El jugador regresa a la posición original una vez qeu se deja de presionar la barra espaciadora 
else if(keyWentUp("space")){
  player.addImage(shooterImg)
}

// Inicia el estado de juego (gameState) "bullet" cuando el jugador se queda sin balas. 
if(bullets==0){
  gameState = "bullet"
  lose.play();
    
}

// Destruye al zombi cuando una bala lo toca
if(zombieGroup.isTouching(bulletGroup)){
  for(var i=0;i<zombieGroup.length;i++){     
      
   if(zombieGroup[i].isTouching(bulletGroup)){
        zombieGroup[i].destroy()
        bulletGroup.destroyEach()

        explosionSound.play();
        score=score+2;
       
        } 
  
  }
}

// Destruye al zombi cuando el jugador lo toca 
if(zombieGroup.isTouching(player)){
  lose.play();

 for(var i=0;i<zombieGroup.length;i++){     
      
  if(zombieGroup[i].isTouching(player)){
       zombieGroup[i].destroy();
       life=life-1;
       } 
 
 }
}

// Llama a la función para generar zombis
enemy();
}

drawSprites();
// Mostrar la puntuación, las vidas y balas restantes 
textSize(20)
fill("white")
text("Balas = " + bullets,displayWidth-200,displayHeight/2-250)
text("Puntuación = " + score,displayWidth-200,displayHeight/2-220)
text("Vidas = " + life,displayWidth-200,displayHeight/2-280)



// Destruye al jugador y al zombi. Muestra el mensaje en el estado de juego "lost"
if(gameState == "lost"){
  
  textSize(100)
  fill("red")
  text("You Lost ",400,400)
  zombieGroup.destroyEach();
  player.destroy();

}

// Destruye al jugador y al zombi. Muestra el mensaje en el estado de juego "won"
else if(gameState == "won"){
 
  textSize(100)
  fill("yellow")
  text("You Won ",400,400)
  zombieGroup.destroyEach();
  player.destroy();

}

// Destruye al jugador, al zombi y a las balas. Muestra el mensaje en el estado de juego "bullet"
else if(gameState == "bullet"){
 
  textSize(50)
  fill("yellow")
  text("You ran out of bullets!!!",470,410)
  zombieGroup.destroyEach();
  player.destroy();
  bulletGroup.destroyEach();

}

}


// Creando la función para generar zombis
function enemy(){
  if(frameCount%50===0){

    // Da posiciones aleatorias "x" e "y" para que aparezca el zombi
    zombie = createSprite(random(500,1100),random(100,500),40,40)

    zombie.addImage(zombieImg)
    zombie.scale = 0.15
    zombie.velocityX = -3
    zombie.debug= true
    zombie.setCollider("rectangle",0,0,400,400)
   
    zombie.lifetime = 400
   zombieGroup.add(zombie)
  }

}
