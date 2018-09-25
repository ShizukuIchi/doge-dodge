let character
let bullets
let score = document.querySelector("#score span")
let scoreCount = 0
let looping = false
let highest = 0
let characterImg
let bulletImg
let bgm

// game configuration
const FRAMES_EVERY_BULLET = 8
const BULLET_MAX_SPEED = 6
const BULLET_MIN_SPEED = 3
const BULLET_WIDTH = 15
const BULLET_HEIGHT = 10
const BULLET_IMG_SRC = './assets/bullet.png'
const CHARACTER_WIDTH = 30
const CHARACTER_HEIGHT = 30
const CHARACTER_SPEED = 4
const CHARACTER_IMG_SRC = './assets/doge.jpg'
const BGM_SRC = './assets/yeshi.mp3'

function preload() {
  soundFormats('mp3');
  bgm = loadSound(BGM_SRC);
}

// invoke one time to setup canvas
function setup(){
  // global width, height!!
  createCanvas(600, 600).parent('game')
  background(51)  
  characterImg = loadImage(CHARACTER_IMG_SRC);
  bulletImg = loadImage(BULLET_IMG_SRC)
  reset()
}

function reset(){
  bullets = []
  character = new Character()  
  scoreCount = 0
  looping = true
  !bgm.isPlaying() && bgm.play()
  loop()
}

// invoke every frame by loop function
function draw(){
  if(looping){
    background(51)
    character.update()
    character.show()

    if(frameCount % FRAMES_EVERY_BULLET == 0){
      bullets.push(new Bullet())
    }
    scoreCount += 1
    score.innerHTML = scoreCount
    for(let i = 0; i<bullets.length;i++){
      let bullet = bullets[i]
      if(bullet.x + BULLET_WIDTH < 0){
        bullets.splice(i,1)
        i-=1
        continue
      }
      bullet.update()
      bullet.show()
      // judging collision
      if(bullet.x - character.x < CHARACTER_WIDTH && character.x - bullet.x < BULLET_WIDTH && bullet.y - character.y < CHARACTER_HEIGHT && character.y - bullet.y < BULLET_HEIGHT){
        if(highest<scoreCount){
          highest = scoreCount
          score.innerHTML += `  NEW BEST:${highest}!!!`
        }else{
          score.innerHTML += `  BEST:${highest}`
        }
        setTimeout(function(){score.innerHTML += '  Press Space to play again~'},1000)
        looping = false
        bgm.isPlaying() && bgm.stop()
        noLoop() // stop loop
      } 
    }
  }
}

function keyPressed(){
  if(key == ' '){
    if(!looping){
      reset()
    }
  }
}
function mouseClicked(){
  if(looping){
    character.yspeed = -character.yspeed 
  }
}

class Bullet{
  constructor(){
    this.x = width
    this.y = random(height)
    this.xspeed = -random(BULLET_MAX_SPEED, BULLET_MIN_SPEED)
  }
  update(){
    this.x += this.xspeed
  }

  // draw bullet
  show(){
    fill(255)
    // rect(this.x, this.y, BULLET_WIDTH, BULLET_HEIGHT)
    image(bulletImg, this.x, this.y, BULLET_WIDTH, BULLET_HEIGHT)
  }
}

class Character{
  constructor(){
    // start position
    this.x = 50 
    this.y = 100
    this.xspeed = 0
    this.yspeed = CHARACTER_SPEED
  }

  update(){
    this.x += this.xspeed
    this.y += this.yspeed
    
    // map boundary = 10
    if (this.y > height-10){
      this.y = height-10
      this.yspeed = -this.yspeed
     }
    if (this.y < 10){
      this.y = 10
      this.yspeed = -this.yspeed
    }
  }

  // draw character
  show(){
    fill(255)
    // rect(this.x,this.y,CHARACTER_WIDTH,CHARACTER_HEIGHT)
    image(characterImg, this.x, this.y, CHARACTER_WIDTH, CHARACTER_HEIGHT);
  }
}