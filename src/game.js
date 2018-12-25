let highest;
let status;
let bullets;
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
let game;
let map;
let mapColor;
let items;
let level;

// game configuration
const INIT_BULLET_SPEED_RATE = 1;
const INIT_FRAMES_EVERY_BULLET = 7;
const INIT_BULLET_MAX_SPEED = 8;
const INIT_BULLET_MIN_SPEED = 8;
const BULLET_WIDTH = 15;
const BULLET_HEIGHT = 10;
const COLLISION_BOUNDARY = 1;
const CHARACTER_WIDTH = 35;
const CHARACTER_HEIGHT = 35;
const CHARACTER_SPEED = 6;
const CHARACTER_IMG_SRC = './assets/man.png';
const CHARACTER_SOUND_SRC = './assets/dead.mp3';
const BGM_SRC = './assets/yexi.mp3';
const ADD_SPEED_MUSIC_SRC = './assets/wolf.mp3';
const BULLET_SOUND_SRC = './assets/shoot.mp3';
const FONT_SRC = 'assets/NotoSansTC-Regular.otf';
const INIT_MAP_COLOR = [51, 51, 51];

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
  createCanvas(900, 800).parent('game');
  game = document.querySelector('#game');
  game.style.opacity = '100';
  background(...INIT_MAP_COLOR);
  barrages = new Barrages();
  bullets = new Bullets();
  items = new Items();
  mapColor = INIT_MAP_COLOR;
  characterImg = loadImage(CHARACTER_IMG_SRC);
  mapPlugins = ['turnX', 'turnY', 'turnZ1', 'turnZ2', 'turnZ3'];
  status = 'stopped';
  if (!localStorage.getItem('highest')) {
    highest = 0;
    localStorage.setItem('highest', 0);
  } else {
    highest = localStorage.getItem('highest');
  }
  stroke('white');
  strokeWeight(1);
  fill(255);
  textFont(font);
  textAlign(CENTER, CENTER);
  textSize(80);
  text(
    '控制（滑鼠）\n開始（空白鍵）\n教學（Ｔ）',
    width * 0.5 + 30,
    height * 0.5,
  );
  textAlign(LEFT, TOP);
  textSize(20);
  Array.prototype.pick = function() {
    return this[Math.floor(random(0, this.length))];
  };
}

function reset() {
  game.style.animation = '';
  map = mapChanger(1000);
  barrages.clear();
  bullets.clear();
  items.clear();
  character = new Character();
  scoreCount = 0;
  status = 'started';
  bulletSpeedRate = INIT_BULLET_SPEED_RATE;
  framesEveryBullet = INIT_FRAMES_EVERY_BULLET;
  bulletMaxSpeed = INIT_BULLET_MAX_SPEED;
  bulletMinSpeed = INIT_BULLET_MIN_SPEED;
  map = mapChanger(1000);
  level = difficulty.getLevel();
  loop();
}

function pause() {
  if (status === 'started') {
    status = 'paused';
    drawPause();
  } else if (status === 'paused') {
    status = 'started';
  }
}

function draw() {
  if (status === 'started') {
    background(...mapColor);
    barrages.generate();
    character.update();
    character.show();
    addBarrages();
    addItems();
    drawScore();
    drawLevel();
    map();
    bullets.showNext();
    items.showNext();
    let bulletCollision = checkCharacterCollision();
    if (bulletCollision.length > 0) {
      dispatch({
        type: 'hit',
        bullets: bulletCollision,
      });
    } else if (bullets.checkClose(character)) {
      if (!character.isInvincible) character.setStatus('lucky', 500);
    }
    character.speak();
    if (character.status === 'dead') {
      drawGameOver();
      character.clearTimers();
      fetch(`${location.href}score?score=${scoreCount}&level=${level}`);
      status = 'stopped';
      dispatch({ type: 'mouseup' });
      if (level === '1') {
        if (scoreCount >= 1500) {
          difficulty.openLevelTo(2);
          drawNewLevel();
        }
      } else if (level !== '8') {
        if (scoreCount >= 2500) {
          difficulty.openLevelTo(Number(level) + 1);
          drawNewLevel();
        }
      }
      noLoop();
    } else {
      scoreCount += 1;
    }
  } else if (status === 'tutorial') {
    background(...mapColor);
    character.update();
    character.show();
    character.processItem();
    character.drawTips();
    drawScore();
    if (character.phase === 'end') {
      status = 'stopped';
      noLoop();
    }
  }
}

function addBarrages() {
  // if (scoreCount === 1) {
  // barrages.add(fn, 5);
  // }
  if (!scoreCount) return;
  if (scoreCount % 250 === 0) {
    let barrage = barrageTypes.pick();
    let arg =
      barrage.arguments[level - 1] ||
      barrage.arguments[barrage.arguments.length - 1];
    let stopTill =
      barrage.stopTill[level - 1] ||
      barrage.stopTill[barrage.stopTill.length - 1];
    dispatch({
      type: 'add',
      barrage: barrage.fn(arg),
      till: scoreCount + stopTill,
    });
  }
}
function addItems() {
  if (!scoreCount) return;
  switch (Number(level)) {
    case 1:
    case 2:
    case 3:
      interval = 750;
      break;
    case 4:
      interval = 700;
      break;
    default:
      interval = 600;
  }
  if (scoreCount % interval === 0) {
    itemsGeneratorFor(level)();
  }
}
function mapChanger(interval) {
  let mapPlugin = '';
  let timer, reverseTimer;
  return function() {
    if (scoreCount && scoreCount % interval === 0) {
      addSpeedHint.play();
      mapPlugin = mapPlugins.pick();
      timer = setTimeout(() => {
        if (status === 'started' && scoreCount > interval) changeMap(mapPlugin);
        else clearTimeout(timer);
      }, 1800);
      reverseTimer = setTimeout(() => {
        if (status === 'started' && scoreCount > interval)
          changeMap(mapPlugin + '-r');
        else clearTimeout(reverseTimer);
      }, 8000);
    }
  };
}
function changeMap(plugin) {
  game.style.animation = plugin + ' 1s forwards';
}

function keyPressed() {
  switch (key) {
    case ' ':
      if (status === 'stopped') {
        reset();
      }
      break;
    case 't':
      if (status === 'stopped') {
        tutorial();
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
function mousePressed(e) {
  if (status !== 'started' || e.target.className !== 'p5Canvas') return;
  switch (e.which) {
    case 3:
      character.setSpeech(document.querySelector('#taunt').value);
      break;
    case 1:
      dispatch({
        type: 'mousedown',
      });
      break;
    default:
      return;
  }
}
function mouseReleased(e) {
  if (status !== 'started') return;
  if (e.which === 1) {
    dispatch({
      type: 'mouseup',
    });
  }
}
window.oncontextmenu = () => false;
function touchStarted(e) {
  if (status === 'started') {
    if (touches.length > 1) {
      character.setSpeech(document.querySelector('#taunt').value);
    } else {
      character.changeDirection();
      dispatch({
        type: 'mousedown',
      });
    }
  } else if (e.target.className === 'p5Canvas') {
    reset();
  }
}
function touchEnded() {
  if (touches > 1) return;
  dispatch({
    type: 'mouseup',
  });
}

function remainsLivesString() {
  let s = '';
  for (let i = 0; i < character.lives; i += 1) s += '＊';
  return s;
}
function checkCharacterCollision() {
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

function drawScore() {
  setupText();
  text(`分數：${scoreCount}`, 5, 0);
  text(`生命：${remainsLivesString()}`, 5, 25);
}
function drawLevel() {
  setupText();
  textAlign(RIGHT, TOP);
  text(`難度：${difficulty.getDisplayLevel()}`, width - 5, 0);
}
function drawNewLevel() {
  setupText();
  textAlign(RIGHT, TOP);
  text(`新難度已解鎖！`, width - 5, 25);
}
function drawPause() {
  setupText();
  text(`分數：${String(scoreCount).replace(/./g, ' ')}　（暫停）`, 5, 0);
}
function drawGameOver() {
  setupText();
  if (highest < scoreCount) {
    highest = scoreCount;
    localStorage.setItem('highest', highest);
    text(`分數：${highest}　新高！`, 5, 0);
  } else {
    text(`分數：${scoreCount}　最高：${highest}`, 5, 0);
  }
}
function setupText() {
  fill(255);
  stroke(255);
  strokeWeight(1);
  textSize(20);
  textAlign(LEFT, TOP);
}
