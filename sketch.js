var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var forest, invisibleforest;

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;

function preload(){

  boy = loadImage("assets/boy.jpg")
  forestImage = loadImage("assets/forest.jpg");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
}

function setup() {
  createCanvas(800, 400);

  forest = createSprite(400,400,400,400);
  forest.addImage("forest",forestImage);
  forest.scale=0.3
  forest.x = width /2;

  boy = createSprite(50,200,20,50);
  boy.scale = 0.15;
  boy.setCollider("circle",0,0,300)
    
  invisibleGround = createSprite(400,350,1600,10);
  invisibleGround.visible = false;

  gameOver = createSprite(400,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(550,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  
  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw() {
  background(255);
  
  boy.x=camera.position.x-270;
   
  if (gameState===PLAY){

    forest.velocityX=-3

    if(forest.x<100)
    {
      forest.x=400
    }
   console.log(boy.y)
    if(keyDown("space")&& boy.y>270) {
      boy.velocityY = -16;
    }
  
    boy.velocityY = boy.velocityY + 0.8
    spawnShrubs();
    spawnObstacles();

    boy.collide(invisibleGround);
    //escreva uma condição para que o estado do jogo mude para end (fim).
    if(obstaclesGroup.isTouching(boy)){
      collidedSound.play();
      gameState = END;
    }
    //escreva uma condição para a pontuação aumentar
    if(shrubsGroup.isTouching(boy)){
      score = score + 1;
      shrubsGroup.destroyEach();
    }
  }
  else if (gameState === END) {
    gameOver.x=camera.position.x;
    restart.x=camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    boy.velocityY = 0;
    forest.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);
    

    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
        reset();
    }
  }

  else if (gameState === WIN) {
    forest.velocityX = 0;
    boy.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);


    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
  }
  
  
  drawSprites();

  textSize(20);
  stroke(3);
  fill("black")
  text("Pontuação: "+ score, camera.position.x,50);
  
  if(score >= 5){
    boy.visible = false;
    textSize(30);
    stroke(3);
    fill("black");
    text("Parabéns! Você venceu o jogo! ", 70,200);
    gameState = WIN;
  }
}

function spawnShrubs() {
 
  if (frameCount % 150 === 0) {

    var shrub = createSprite(camera.position.x+500,330,40,10);

    shrub.velocityX = -(6 + 3*score/100)
    shrub.scale = 0.6;

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: shrub.addImage(shrub1);
              break;
      case 2: shrub.addImage(shrub2);
              break;
      case 3: shrub.addImage(shrub3);
              break;
      default: break;
    }
       
    shrub.scale = 0.05;
    shrub.lifetime = 400;
    
    shrub.setCollider("rectangle",0,0,shrub.width/2,shrub.height/2)
    shrubsGroup.add(shrub);
    
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {

    var obstacle = createSprite(camera.position.x+400,330,40,40);
    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3*score/100)
    obstacle.scale = 0.15;      

    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
    
  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  boy.visible = true;
  

  obstaclesGroup.destroyEach();
  shrubsGroup.destroyEach();
  
  score = 0;
}