let score;
let highest;
let looping;
let bullets;
let bulletImg;
let bulletSpeedRate;
let character;
let characterImg;
let scoreCount;
let bgm;
let framesEveryBullet;
let bulletMaxSpeed;
let bulletMinSpeed;

// game configuration
const INIT_BULLET_SPEED_RATE = 1;
const INIT_FRAMES_EVERY_BULLET = 15;
const INIT_BULLET_MAX_SPEED = 6;
const INIT_BULLET_MIN_SPEED = 4;
const BULLET_WIDTH = 20;
const BULLET_HEIGHT = 13;
const BULLET_IMG_SRC = './assets/bullet.png';
const COLLISION_BOUNDARY = 3;
const CHARACTER_WIDTH = 30;
const CHARACTER_HEIGHT = 30;
const CHARACTER_SPEED = 4;
const CHARACTER_IMG_SRC = './assets/doge.jpg';
const BGM_SRC = './assets/yexi.mp3';

function preload() {
  soundFormats('mp3');
  bgm = loadSound(BGM_SRC);
}

// invoke one time to setup canvas
function setup() {
  // global width, height!!
  createCanvas(1000, 800).parent('game');
  background(51);
  characterImg = loadImage(CHARACTER_IMG_SRC);
  bulletImg = loadImage(BULLET_IMG_SRC);
  looping = false;
  score = document.querySelector('#score');
  bgm.loop();
  if (!localStorage.getItem('highest')) {
    highest = 0;
    localStorage.setItem('highest', 0);
  } else {
    highest = localStorage.getItem('highest');
  }
  reset();
}

function reset() {
  bullets = [];
  character = new Character();
  scoreCount = 0;
  looping = true;
  bulletSpeedRate = INIT_BULLET_SPEED_RATE;
  framesEveryBullet = INIT_FRAMES_EVERY_BULLET;
  bulletMaxSpeed = INIT_BULLET_MAX_SPEED;
  bulletMinSpeed = INIT_BULLET_MIN_SPEED;
  loop();
}

// invoke every frame by loop function
function draw() {
  if (looping) {
    background(51);
    if (scoreCount !== 0) {
      if (framesEveryBullet && scoreCount % 400 === 0) {
        console.log('more bullets');
        framesEveryBullet -= 1;
      }
      if (scoreCount % 1200 === 0) {
        console.log('speed up');
        bulletSpeedRate += 0.5;
      }
    }
    character.update();
    character.show();
    if (frameCount % framesEveryBullet === 0) {
      bullets.push(new Bullet());
    }
    scoreCount += 1;
    score.innerHTML = scoreCount;
    for (let i = 0; i < bullets.length; i++) {
      let bullet = bullets[i];
      if (bullet.x + bullet.w < 1) {
        bullets.splice(i, 1);
        i -= 1;
        continue;
      }
      bullet.update();
      bullet.show();
      // judging collision
      if (
        bullet.x - character.x < character.w - COLLISION_BOUNDARY &&
        character.x - bullet.x < bullet.w - COLLISION_BOUNDARY &&
        bullet.y - character.y < character.h - COLLISION_BOUNDARY &&
        character.y - bullet.y < bullet.h - COLLISION_BOUNDARY
      ) {
        if (highest < scoreCount) {
          highest = scoreCount;
          localStorage.setItem('highest', highest);
          score.innerHTML += ` <span class="red bold">NEW BEST: ${highest}!!!</span>`;
        } else {
          score.innerHTML += ` BEST: <span class="bold">${highest}</span>`;
        }
        setTimeout(function() {
          score.innerHTML += ' Press Space to play again~';
        }, 1000);
        looping = false;
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
function mouseClicked(e) {
  if (e.target.className === 'p5Canvas' && looping) {
    character.yspeed = -character.yspeed;
  }
}

class Bullet {
  constructor() {
    this.w = BULLET_WIDTH;
    this.h = BULLET_HEIGHT;
    this.x = width;
    this.y = random(this.h / 2, height - this.h / 2);
    this.xspeed = -random(bulletMinSpeed, bulletMaxSpeed) * bulletSpeedRate;
    this.yspeed = 0;
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
