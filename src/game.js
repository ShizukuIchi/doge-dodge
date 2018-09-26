let score = document.querySelector('#score');
let highest = 0;
let looping = false;
let bullets;
let bulletImg;
let bulletSpeedRate
let character;
let characterImg;
let scoreCount
let bgm;

// game configuration
const FRAMES_EVERY_BULLET = 8;
const BULLET_MAX_SPEED = 6;
const BULLET_MIN_SPEED = 3;
const BULLET_WIDTH = 15;
const BULLET_HEIGHT = 10;
const BULLET_IMG_SRC = './assets/bullet.png';
const CHARACTER_WIDTH = 30;
const CHARACTER_HEIGHT = 30;
const CHARACTER_SPEED = 4;
const CHARACTER_IMG_SRC = './assets/doge.jpg';
const BGM_SRC = './assets/yeshi.mp3';

function preload() {
  soundFormats('mp3');
  bgm = loadSound(BGM_SRC);
}

// invoke one time to setup canvas
function setup() {
  // global width, height!!
  createCanvas(600, 600).parent('game');
  background(51);
  characterImg = loadImage(CHARACTER_IMG_SRC);
  bulletImg = loadImage(BULLET_IMG_SRC);
  reset();
}

function reset() {
  bullets = [];
  character = new Character();
  scoreCount = 0;
  looping = true;
  bulletSpeedRate = 1
  !bgm.isPlaying() && bgm.play();
  loop();
}

// invoke every frame by loop function
function draw() {
  if (looping) {
    bulletSpeedRate = 1 + scoreCount/800 
    background(51);
    character.update();
    character.show();

    if (frameCount % FRAMES_EVERY_BULLET === 0) {
      bullets.push(new Bullet());
    }
    scoreCount += 1;
    score.innerHTML = scoreCount;
    for (let i = 0; i < bullets.length; i++) {
      let bullet = bullets[i];
      if (bullet.x + bullet.w < 0) {
        bullets.splice(i, 1);
        i -= 1;
        continue;
      }
      bullet.update();
      bullet.show();
      // judging collision
      if (
        bullet.x - character.x < character.w &&
        character.x - bullet.x < bullet.w &&
        bullet.y - character.y < character.h &&
        character.y - bullet.y < bullet.h
      ) {
        if (highest < scoreCount) {
          highest = scoreCount;
          score.innerHTML += ` <span class="red bold">NEW BEST: ${highest}!!!</span>`;
        } else {
          score.innerHTML += ` BEST: <span class="bold">${highest}</span>`;
        }
        setTimeout(function() {
          score.innerHTML += ' Press Space to play again~';
        }, 1000);
        looping = false;
        bgm.isPlaying() && bgm.stop();
        noLoop(); // stop loop
      }
    }
  }
}

function keyPressed() {
  if (key === ' ') {
    if (!looping) {
      reset();
    }
  }
}
function mouseClicked() {
  if (looping) {
    character.yspeed = -character.yspeed;
  }
}

class Bullet {
  constructor() {
    this.x = width;
    this.y = random(height);
    this.w = BULLET_WIDTH;
    this.h = BULLET_HEIGHT;
    this.xspeed = -random(BULLET_MAX_SPEED * bulletSpeedRate, BULLET_MIN_SPEED * bulletSpeedRate);
    this.yspeed = 0
  }
  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;
  }

  // draw bullet
  show() {
    fill(255);
    image(bulletImg, this.x, this.y, this.w, this.h);
  }
}

class Character {
  constructor() {
    // start position
    this.x = 50;
    this.y = 100;
    this.w = CHARACTER_WIDTH;
    this.h = CHARACTER_HEIGHT;
    this.xspeed = 0;
    this.yspeed = CHARACTER_SPEED;
  }

  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;

    // map boundary = 1
    if (this.y + this.h > height - 1) {
      this.y = height - 1 - this.h;
      this.yspeed = -this.yspeed;
    }
    if (this.y < 1) {
      this.y = 1;
      this.yspeed = -this.yspeed;
    }
  }

  // draw character
  show() {
    fill(255);
    image(characterImg, this.x, this.y, this.w, this.h);
  }
}
