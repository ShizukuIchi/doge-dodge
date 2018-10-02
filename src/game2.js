'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var score = void 0;
var highest = void 0;
var status = void 0;
var bullets = void 0;
var bulletImg = void 0;
var bulletSpeedRate = void 0;
var character = void 0;
var characterImg = void 0;
var characterSound = void 0;
var scoreCount = void 0;
var bgm = void 0;
var addSpeedHint = void 0;
var framesEveryBullet = void 0;
var bulletMaxSpeed = void 0;
var bulletMinSpeed = void 0;
var bulletSound = void 0;
var font = void 0;

// game configuration
var INIT_BULLET_SPEED_RATE = 1;
var INIT_FRAMES_EVERY_BULLET = 18;
var INIT_BULLET_MAX_SPEED = 6;
var INIT_BULLET_MIN_SPEED = 4;
var BULLET_WIDTH = 20;
var BULLET_HEIGHT = 13;
var BULLET_IMG_SRC = './assets/bullet.png';
var COLLISION_BOUNDARY = 5;
var CHARACTER_WIDTH = 35;
var CHARACTER_HEIGHT = 35;
var CHARACTER_SPEED = 4;
var CHARACTER_IMG_SRC = './assets/man.png';
var CHARACTER_SOUND_SRC = './assets/dead.mp3';
var BGM_SRC = './assets/yexi.mp3';
var ADD_SPEED_MUSIC_SRC = './assets/wolf.mp3';
var BULLET_SOUND_SRC = './assets/shoot.mp3';
var FONT_SRC = 'assets/NotoSansTC-Regular.otf';

function preload() {
  soundFormats('mp3');
  bgm = loadSound(BGM_SRC);
  font = loadFont(FONT_SRC);
  addSpeedHint = loadSound(ADD_SPEED_MUSIC_SRC);
  bulletSound = loadSound(BULLET_SOUND_SRC);
  characterSound = loadSound(CHARACTER_SOUND_SRC);
}

// invoke one time to setup canvas
function setup() {
  // global width, height!!
  createCanvas(1000, 800).parent('game');
  background(51);
  characterImg = loadImage(CHARACTER_IMG_SRC);
  bulletImg = loadImage(BULLET_IMG_SRC);
  status = 'stopped';
  score = document.querySelector('#score');
  bgm.loop();
  if (!localStorage.getItem('highest')) {
    highest = 0;
    localStorage.setItem('highest', 0);
  } else {
    highest = localStorage.getItem('highest');
  }
  fill(255);
  textFont(font);
  textAlign(CENTER, CENTER);
  textSize(80);
  text('閃避（點擊）\n暫停（P）\n開始（空白鍵）', width * .5, height * .5);
}

function reset() {
  bullets = [];
  character = new Character();
  scoreCount = 0;
  status = 'started';
  bulletSpeedRate = INIT_BULLET_SPEED_RATE;
  framesEveryBullet = INIT_FRAMES_EVERY_BULLET;
  bulletMaxSpeed = INIT_BULLET_MAX_SPEED;
  bulletMinSpeed = INIT_BULLET_MIN_SPEED;
  loop();
}

function pause() {
  if (status === 'started') {
    status = 'paused';
    score.innerHTML += ' （暫停）';
  } else if (status === 'paused') {
    status = 'started';
  }
}

// invoke every frame by loop function
function draw() {
  if (status === 'started') {
    background(51);
    if (scoreCount !== 0) {
      if (framesEveryBullet && scoreCount % 300 === 0) {
        console.log('more bullets');
        framesEveryBullet -= 1;
        setTimeout(function () {
          if (status === 'started') {
            bullets.push(new FatalBullet());
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
    if (frameCount % framesEveryBullet === 0) {
      bullets.push(new Bullet());
    }
    scoreCount += 1;
    score.innerHTML = scoreCount;
    for (var i = 0; i < bullets.length; i++) {
      var bullet = bullets[i];
      if (bullet.x + bullet.w < 1) {
        bullets.splice(i, 1);
        i -= 1;
        continue;
      }
      bullet.update();
      bullet.show();
      // judging collision
      if (bullet.x - character.x < character.w - COLLISION_BOUNDARY && character.x - bullet.x < bullet.w - COLLISION_BOUNDARY && bullet.y - character.y < character.h - COLLISION_BOUNDARY && character.y - bullet.y < bullet.h - COLLISION_BOUNDARY) {
        if (highest < scoreCount) {
          highest = scoreCount;
          localStorage.setItem('highest', highest);
          score.innerHTML += ' <span class="red bold">NEW BEST: ' + highest + '!!!</span>';
        } else {
          score.innerHTML += ' \u6700\u9AD8: <span class="bold">' + highest + '</span>';
        }
        setTimeout(function () {
          score.innerHTML += ' 鍵入空白再來一把';
        }, 1000);
        fetch(location.href + 'score?score=' + scoreCount);
        characterSound.play();
        status = 'stopped';
        noLoop(); // stop loop
      }
    }
  }
}

function keyPressed() {
  switch (key) {
    case ' ':
      if (status === 'stopped') {
        reset();
      }
      break;
    case 'p':
      pause();
      break;
  }
}
function mouseClicked(e) {
  if (e.target.className === 'p5Canvas' && status === 'started') {
    character.yspeed = -character.yspeed;
  }
}
function touchStarted() {
  if (screen.width >= 768) return;
  if (status === 'started') {
    character.yspeed = -character.yspeed;
  } else {
    reset();
  }
}

var Bullet = function () {
  function Bullet() {
    _classCallCheck(this, Bullet);

    this.w = BULLET_WIDTH;
    this.h = BULLET_HEIGHT;
    this.x = width;
    this.y = random(this.h / 2, height - this.h / 2);
    this.xspeed = -random(bulletMinSpeed, bulletMaxSpeed) * bulletSpeedRate;
    this.yspeed = 0;
  }

  _createClass(Bullet, [{
    key: 'update',
    value: function update() {
      this.x += this.xspeed;
      this.y += this.yspeed;
    }

    // draw bullet

  }, {
    key: 'show',
    value: function show() {
      fill(255);
      image(bulletImg, this.x, this.y, this.w, this.h);
    }
  }]);

  return Bullet;
}();

var FatalBullet = function (_Bullet) {
  _inherits(FatalBullet, _Bullet);

  function FatalBullet() {
    _classCallCheck(this, FatalBullet);

    var _this = _possibleConstructorReturn(this, (FatalBullet.__proto__ || Object.getPrototypeOf(FatalBullet)).call(this));

    _this.w = BULLET_WIDTH + 10;
    _this.h = BULLET_HEIGHT + 10;
    _this.y = character ? character.y : random(_this.h / 2, height - _this.h / 2);
    _this.yspeed = character ? character.yspeed : 0;
    return _this;
  }

  _createClass(FatalBullet, [{
    key: 'update',
    value: function update() {
      this.x += 2 * this.xspeed;
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
  }]);

  return FatalBullet;
}(Bullet);

var Character = function () {
  function Character() {
    _classCallCheck(this, Character);

    // start position
    this.x = 50;
    this.y = 100;
    this.w = CHARACTER_WIDTH;
    this.h = CHARACTER_HEIGHT;
    this.xspeed = 0;
    this.yspeed = CHARACTER_SPEED;
  }

  _createClass(Character, [{
    key: 'update',
    value: function update() {
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

  }, {
    key: 'show',
    value: function show() {
      fill(255);
      image(characterImg, this.x, this.y, this.w, this.h);
    }
  }]);

  return Character;
}();