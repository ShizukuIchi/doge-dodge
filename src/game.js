let score;
let highest;
let looping;
let bullets;
let bulletImg;
let bulletSpeedRate;
let character;
let characterImg;
let characterSound;
let scoreCount;
let bgm;
let addSpeedHint
let framesEveryBullet;
let bulletMaxSpeed;
let bulletMinSpeed;
let bulletSound

// game configuration
const INIT_BULLET_SPEED_RATE = 1;
const INIT_FRAMES_EVERY_BULLET = 18;
const INIT_BULLET_MAX_SPEED = 6;
const INIT_BULLET_MIN_SPEED = 4;
const BULLET_WIDTH = 20;
const BULLET_HEIGHT = 13;
const BULLET_IMG_SRC = './assets/bullet.png';
const COLLISION_BOUNDARY = 5;
const CHARACTER_WIDTH = 35;
const CHARACTER_HEIGHT = 35;
const CHARACTER_SPEED = 4;
const CHARACTER_IMG_SRC = './assets/man.png';
const CHARACTER_SOUND_SRC = './assets/dead.mp3'
const BGM_SRC = './assets/yexi.mp3';
const ADD_SPEED_MUSIC_SRC = './assets/wolf.mp3'
const BULLET_SOUND_SRC = './assets/shoot.mp3'

function preload() {
  soundFormats('mp3');
  bgm = loadSound(BGM_SRC);
  addSpeedHint = loadSound(ADD_SPEED_MUSIC_SRC)
  bulletSound = loadSound(BULLET_SOUND_SRC)
  characterSound = loadSound(CHARACTER_SOUND_SRC)
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
      if (framesEveryBullet && scoreCount % 300 === 0) {
        console.log('more bullets');
        framesEveryBullet -= 1;
        setTimeout(() => {
          if (looping) {
            bullets.push(new FatalBullet());
          }
        }, 100)
        bulletSound.play()
      }
      if (scoreCount % 1000 === 0) {
        console.log('speed up');
        addSpeedHint.play()
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
        characterSound.play()
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

class FatalBullet extends Bullet {
  constructor() {
    super()
    this.w = BULLET_WIDTH + 10;
    this.h = BULLET_HEIGHT + 10;
    this.y = character ? character.y : random(this.h / 2, height - this.h / 2);
    this.yspeed = character ? character.yspeed : 0
  }

  update() {
    this.x += 2*this.xspeed;
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
