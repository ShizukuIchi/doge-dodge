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
const CHARACTER_SOUND_SRC = './assets/dead.mp3';
const BGM_SRC = './assets/yexi.mp3';
const ADD_SPEED_MUSIC_SRC = './assets/wolf.mp3';
const BULLET_SOUND_SRC = './assets/shoot.mp3';

function game(parent) {
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
  let addSpeedHint;
  let framesEveryBullet;
  let bulletMaxSpeed;
  let bulletMinSpeed;
  let bulletSound;
  let canvasHeight = 800;
  let canvasWidth = 1000;
  const newP5 = new p5(function(sketch) {
    sketch.preload = function() {
      sketch.soundFormats('mp3');
      bgm = sketch.loadSound(BGM_SRC);
      addSpeedHint = sketch.loadSound(ADD_SPEED_MUSIC_SRC);
      bulletSound = sketch.loadSound(BULLET_SOUND_SRC);
      characterSound = sketch.loadSound(CHARACTER_SOUND_SRC);
    };
    sketch.setup = function() {
      sketch.createCanvas(canvasWidth, canvasHeight).parent(parent);
      sketch.background(51);
      characterImg = sketch.loadImage(CHARACTER_IMG_SRC);
      bulletImg = sketch.loadImage(BULLET_IMG_SRC);
      looping = false;
      score = parent.querySelector('.score');
      console.log(score)
      bgm.loop();
      if (!localStorage.getItem('highest')) {
        highest = 0;
        localStorage.setItem('highest', 0);
      } else {
        highest = localStorage.getItem('highest');
      }
      sketch.reset();
    };
    sketch.reset = function() {
      bullets = [];
      character = new Character({
        canvasHeight,
      });
      scoreCount = 0;
      looping = true;
      bulletSpeedRate = INIT_BULLET_SPEED_RATE;
      framesEveryBullet = INIT_FRAMES_EVERY_BULLET;
      bulletMaxSpeed = INIT_BULLET_MAX_SPEED;
      bulletMinSpeed = INIT_BULLET_MIN_SPEED;
      sketch.loop();
    };
    sketch.draw = function() {
      if (looping) {
        sketch.background(51);
        if (scoreCount !== 0) {
          if (framesEveryBullet && scoreCount % 300 === 0) {
            console.log('more bullets');
            framesEveryBullet -= 1;
            setTimeout(() => {
              if (looping) {
                bullets.push(
                  new FatalBullet({
                    canvasHeight,
                    character,
                    canvasWidth,
                    bulletMinSpeed,
                    bulletMaxSpeed,
                    bulletSpeedRate,
                  }),
                );
              }
            }, 100);
            bulletSound.play();
          }
          if (scoreCount % 1000 === 0) {
            console.log('speed up');
            addSpeedHint.play();
            bulletSpeedRate += 0.5;
          }
        }
        character.update();
        character.show();
        if (sketch.frameCount % framesEveryBullet === 0) {
          bullets.push(
            new Bullet({
              canvasWidth,
              bulletMinSpeed,
              bulletMaxSpeed,
              bulletSpeedRate,
              canvasHeight,
            }),
          );
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
            characterSound.play();
            looping = false;
            sketch.noLoop(); // stop loop
          }
        }
      }
    };
    sketch.keyPressed = function(e) {
      if (e.key === ' ') {
        if (!looping) {
          sketch.reset();
        }
      }
    };
    sketch.mouseClicked = function(e) {
      if (e.target.className === 'p5Canvas' && looping) {
        character.yspeed = -character.yspeed;
      }
    };
    Bullet.prototype.show = function() {
      sketch.fill(255);
      sketch.image(bulletImg, this.x, this.y, this.w, this.h);
    };
    Character.prototype.show = function() {
      sketch.fill(255);
      sketch.image(characterImg, this.x, this.y, this.w, this.h);
    };
  }, parent.id);
  return newP5;
}

class Bullet {
  constructor(options) {
    this.w = BULLET_WIDTH;
    this.h = BULLET_HEIGHT;
    this.x = options.canvasWidth;
    this.y = random(this.h / 2, options.canvasHeight - this.h / 2);
    this.xspeed =
      -random(options.bulletMinSpeed, options.bulletMaxSpeed) *
      options.bulletSpeedRate;
    this.yspeed = 0;
  }
  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;
  }

  // // draw bullet
  // show() {
  //   fill(255);
  //   image(bulletImg, this.x, this.y, this.w, this.h);
  // }
}

class FatalBullet extends Bullet {
  constructor(options) {
    super(options);
    this.w = BULLET_WIDTH + 10;
    this.h = BULLET_HEIGHT + 10;
    this.canvasHeight = options.canvasHeight;
    this.y = options.character
      ? options.character.y
      : random(this.h / 2, options.canvasHeight - this.h / 2);
    this.yspeed = options.character ? options.character.yspeed : 0;
  }

  update() {
    this.x += 2 * this.xspeed;
    this.y += this.yspeed;

    // map boundary = 1
    if (this.y + this.h > this.canvasHeight - 1) {
      this.y = this.canvasHeight - 1 - this.h;
      this.yspeed = -this.yspeed;
    }
    if (this.y < 1) {
      this.y = 1;
      this.yspeed = -this.yspeed;
    }
  }
}

class Character {
  constructor(options) {
    // start position
    this.x = 50;
    this.y = 100;
    this.w = CHARACTER_WIDTH;
    this.h = CHARACTER_HEIGHT;
    this.xspeed = 0;
    this.yspeed = CHARACTER_SPEED;
    this.canvasHeight = options.canvasHeight;
  }

  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;

    // map boundary = 1
    if (this.y + this.h > this.canvasHeight - 1) {
      this.y = this.canvasHeight - 1 - this.h;
      this.yspeed = -this.yspeed;
    }
    if (this.y < 1) {
      this.y = 1;
      this.yspeed = -this.yspeed;
    }
  }
  // draw character
  // show() {
  //   fill(255);
  //   image(characterImg, this.x, this.y, this.w, this.h);
  // }
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
p6 = game(document.querySelector('#game'));