let highest;
let status;
let bullets;
let bulletImg;
let bulletRImg;
let bulletBImg;
let bulletGImg;
let bulletPImg;
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
let font;
let barrages;
let plugins;
let game;
let map;

// game configuration
const INIT_BULLET_SPEED_RATE = 1;
const INIT_FRAMES_EVERY_BULLET = 18;
const INIT_BULLET_MAX_SPEED = 6;
const INIT_BULLET_MIN_SPEED = 4;
const BULLET_WIDTH = 20;
const BULLET_HEIGHT = 13;
const BULLET_SRC = './assets/bullet.png';
const BULLET_B_SRC = './assets/bullet-b.png';
const BULLET_P_SRC = './assets/bullet-p.png';
const BULLET_R_SRC = './assets/bullet-r.png';
const BULLET_G_SRC = './assets/bullet-g.png';
const COLLISION_BOUNDARY = 5;
const CHARACTER_WIDTH = 35;
const CHARACTER_HEIGHT = 35;
const CHARACTER_SPEED = 4;
const CHARACTER_IMG_SRC = './assets/man.png';
const CHARACTER_SOUND_SRC = './assets/dead.mp3';
const BGM_SRC = './assets/yexi.mp3';
const ADD_SPEED_MUSIC_SRC = './assets/wolf.mp3';
const BULLET_SOUND_SRC = './assets/shoot.mp3';
const FONT_SRC = 'assets/NotoSansTC-Regular.otf';

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
  game = document.querySelector('#game');
  game.style.opacity = '100';
  background(51);
  barrages = new Barrages();
  bullets = new Bullets();
  characterImg = loadImage(CHARACTER_IMG_SRC);
  bulletImg = loadImage(BULLET_SRC);
  bulletRImg = loadImage(BULLET_R_SRC);
  bulletBImg = loadImage(BULLET_B_SRC);
  bulletGImg = loadImage(BULLET_G_SRC);
  bulletPImg = loadImage(BULLET_P_SRC);
  plugins = [
    {
      fn: genOneHole,
      arguments: [190, 180, 170, 160],
      stopTill: [1],
    },
    {
      fn: genWave,
      arguments: [200, 195, 190, 185, 180],
      stopTill: [150, 162.5, 175, 187.5, 200],
    },
    {
      fn: genStopper,
      arguments: [100, 125, 150, 175],
      stopTill: [3, 4],
    },
    {
      fn: genBigChase,
      arguments: [2.5, 2.7, 2.9],
      stopTill: [1],
    },
    {
      fn: genVanisher,
      arguments: [0],
      stopTill: [5, 6, 7],
    },
    {
      fn: genAccelerator,
      arguments: [1, 1, 1, -2],
      stopTill: [5, 6, 7],
    },
    {
      fn: genRandomer,
      arguments: [0],
      stopTill: [5, 6, 7],
    },
    {
      fn: genPlumber,
      arguments: [0],
      stopTill: [1],
    },
    {
      fn: genCrosser,
      arguments: [0],
      stopTill: [6],
    },
  ];
  mapPlugins = ['turnX', 'turnY', 'turnZ1', 'turnZ2', 'turnZ3'];
  status = 'stopped';
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
  text('閃避（點擊）\n暫停（P）\n開始（空白鍵）', width * 0.5, height * 0.5);
  textAlign(LEFT, TOP);
  textSize(20);
  text('分數：0', 0, 0);
  map = mapChanger(1000);
}

function reset() {
  game.style.animation = '';
  map = mapChanger(1000);
  barrages.clear();
  bullets.clear();
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
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  if (status === 'started') {
    status = 'paused';
    text(`分數：${String(scoreCount).replace(/./g, ' ')}　（暫停）`, 0, 0);
  } else if (status === 'paused') {
    status = 'started';
  }
}

// invoke every frame by loop function
function draw() {
  if (status === 'started') {
    background(51);
    barrages.generate();
    character.update();
    character.show();
    wolfSound();
    addBarrages();
    fill(255);
    textSize(20);
    textAlign(LEFT, TOP);
    text(`分數：${scoreCount}`, 0, 0);
    map();
    if (!bullets.next() && status === 'started') {
      checkHighScore();
      fetch(`${location.href}score?score=${scoreCount}`);
      characterSound.play();
      status = 'stopped';
      noLoop(); // stop loop
    }
    scoreCount += 1;
  }
}

function addBarrages() {
  if (scoreCount === 1) {
    barrages.add(regular, -1);
  }
  if (scoreCount && scoreCount % 300 === 0) {
    let barrage = plugins[floor(random(0, plugins.length))];
    let arg = barrage.arguments[floor(random(0, barrage.arguments.length))];
    let stopTill = barrage.stopTill[floor(random(0, barrage.stopTill.length))];
    listeners.emitEvent({
      type: 'add',
      barrage: barrage.fn(arg),
      till: scoreCount + stopTill,
    });
  }
}
function mapChanger(interval) {
  let mapPlugin = '';
  let reverseScore = -1;
  return function() {
    if (scoreCount && scoreCount % interval === 0) {
      reverseScore = scoreCount + 300;
      mapPlugin = mapPlugins[floor(random(0, mapPlugins.length))];
      changeMap(mapPlugin);
    }
    if (reverseScore === scoreCount) {
      changeMap(mapPlugin + '-r');
      mapPlugin = '';
    }
  };
}
function changeMap(plugin) {
  game.style.animation = plugin + ' 1s forwards';
}

function wolfSound() {
  if (scoreCount && scoreCount % 1000 === 0) {
    addSpeedHint.play();
  }
}

function checkHighScore() {
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  if (highest < scoreCount) {
    highest = scoreCount;
    localStorage.setItem('highest', highest);
    text(`分數：${highest}　新高！`, 0, 0);
  } else {
    text(`分數：${scoreCount}　最高：${highest}`, 0, 0);
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

function isColliding(a, b, boundary) {
  return (
    a.x - b.x < b.w - boundary &&
    b.x - a.x < a.w - boundary &&
    a.y - b.y < b.h - boundary &&
    b.y - a.y < a.h - boundary
  );
}

class Barrages {
  constructor() {
    this.barrages = [];
  }
  add(fn, tillScore) {
    this.barrages.push(new Barrage(fn, tillScore));
  }
  remove(fn) {
    this.barrages = this.barrages.filter(b => {
      let name = b.fn.name;
      name = name.startsWith('bound ') ? name.split(' ')[1] : name;
      let _name = fn.name;
      _name = _name.startsWith('bound ') ? _name.split(' ')[1] : _name;
      return name !== _name;
    });
  }
  generate() {
    this.barrages
      .filter(b => {
        // b.fn();
        if (b.stopScore > 0 && b.stopScore + 1 <= scoreCount) {
          listeners.emitEvent({ type: 'remove', barrage: b.fn });
          return false;
        }
        return true;
      })
      .forEach(b => b.fn());
  }
  clear() {
    this.barrages = [];
  }
}

class Barrage {
  constructor(fn, stopScore) {
    this.fn = fn;
    this.stopScore = stopScore;
  }
}
