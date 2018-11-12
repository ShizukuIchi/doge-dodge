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
const INIT_FRAMES_EVERY_BULLET = 10;
const INIT_BULLET_MAX_SPEED = 8;
const INIT_BULLET_MIN_SPEED = 8;
const BULLET_WIDTH = 20;
const BULLET_HEIGHT = 13;
const BULLET_SRC = './assets/bullet.png';
const BULLET_B_SRC = './assets/bullet-b.png';
const BULLET_R_SRC = './assets/bullet-r.png';
const BULLET_G_SRC = './assets/bullet-g.png';
const COLLISION_BOUNDARY = 5;
const CHARACTER_WIDTH = 35;
const CHARACTER_HEIGHT = 35;
const CHARACTER_SPEED = 6;
const CHARACTER_IMG_SRC = './assets/man.png';
const CHARACTER_SOUND_SRC = './assets/dead.mp3';
const BGM_SRC = './assets/yexi.mp3';
const ADD_SPEED_MUSIC_SRC = './assets/wolf.mp3';
const BULLET_SOUND_SRC = './assets/shoot.mp3';
const FONT_SRC = 'assets/NotoSansTC-Regular.otf';

function preload() {
  soundFormats('mp3');
  font = loadFont(FONT_SRC);
  addSpeedHint = loadSound(ADD_SPEED_MUSIC_SRC);
  bulletSound = loadSound(BULLET_SOUND_SRC);
  characterSound = loadSound(CHARACTER_SOUND_SRC);
}

// invoke one time to setup canvas
function setup() {
  frameRate(28);
  bgm = loadSound(BGM_SRC, () => bgm.loop());

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
      arguments: [150],
      stopTill: [1],
    },
    {
      fn: genWave,
      arguments: [200, 190, 180],
      stopTill: [130, 140, 150],
    },
    {
      fn: genStopper,
      arguments: [120, 135, 150],
      stopTill: [3, 4],
    },
    {
      fn: genBigChase,
      arguments: [2.1, 2.3, 2.5],
      stopTill: [1],
    },
    {
      fn: genSlowChaser,
      arguments: [0],
      stopTill: [1],
    },
    {
      fn: genVanisher,
      arguments: [0],
      stopTill: [5, 6, 7],
    },
    {
      fn: genAccelerator,
      arguments: [2],
      stopTill: [5, 6, 7],
    },
    {
      fn: genRandomer,
      arguments: [0.6, 0.5, 0.45],
      stopTill: [5, 6, 7],
    },
    {
      fn: genPlumber,
      arguments: [0.33],
      stopTill: [1],
    },
    {
      fn: genCrosser,
      arguments: [0],
      stopTill: [5],
    },
  ];
  mapPlugins = ['turnX', 'turnY', 'turnZ1', 'turnZ2', 'turnZ3'];
  status = 'stopped';
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
  map = mapChanger(1000);
  Array.prototype.pick = function() {
    return this[Math.floor(random(0, this.length))];
  };
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
    text(`分數：${String(scoreCount).replace(/./g, ' ')}　（暫停）`, 5, 0);
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
    addBarrages();
    fill(255);
    textSize(20);
    textAlign(LEFT, TOP);
    text(`分數：${scoreCount}`, 5, 0);
    text(`生命：${remainsLivesString()}`, 5, 25);
    map();
    bullets.showNext();
    // bullets.show();
    if (checkCharacterCollision() > 0) {
      character.lives -= 1;
      character.setStatus('slow', 2000);
      character.setInvincible(2000);
    }
    if (character.lives <= 0) {
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
  if (scoreCount && scoreCount % 250 === 0) {
    let barrage = plugins.pick();
    let arg = barrage.arguments.pick();
    let stopTill = barrage.stopTill.pick();
    listeners.emitEvent({
      type: 'add',
      barrage: barrage.fn(arg),
      till: scoreCount + stopTill,
    });
  }
}
function mapChanger(interval) {
  let mapPlugin = '';
  let timer, reverseTimer;
  return function() {
    if (scoreCount && scoreCount % interval === 0) {
      addSpeedHint.play();
      mapPlugin = mapPlugins[floor(random(0, mapPlugins.length))];
      timer = setTimeout(() => {
        if (status === 'started') changeMap(mapPlugin);
        else clearTimeout(timer);
      }, 1800);
      reverseTimer = setTimeout(() => {
        if (status === 'started') changeMap(mapPlugin + '-r');
        else clearTimeout(reverseTimer);
      }, 8000);
    }
  };
}
function changeMap(plugin) {
  game.style.animation = plugin + ' 1s forwards';
}

function checkHighScore() {
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  if (highest < scoreCount) {
    highest = scoreCount;
    localStorage.setItem('highest', highest);
    text(`分數：${highest}　新高！`, 5, 0);
  } else {
    text(`分數：${scoreCount}　最高：${highest}`, 5, 0);
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
    character.changeDirection();
  }
}
function touchStarted() {
  if (screen.width >= 768) return;
  if (status === 'started') {
    character.changeDirection();
  } else {
    reset();
  }
}

function remainsLivesString() {
  let s = '';
  for (let i = 0; i < character.lives; i += 1) s += '＊';
  return s;
}
function checkCharacterCollision() {
  if (character.isInvincible) return 0;
  return bullets.countCollisions(character);
}
function isColliding(a, b, boundary) {
  return (
    a.x - b.x < b.w - boundary &&
    b.x - a.x < a.w - boundary &&
    a.y - b.y < b.h - boundary &&
    b.y - a.y < a.h - boundary
  );
}
