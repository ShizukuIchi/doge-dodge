function genOneHole(h = 150, s = INIT_BULLET_MIN_SPEED, c = height / 2) {
  const _c = c || random(h / 2, height - h / 2);
  return oneHole.bind(this, h, s, _c);
}
function oneHole(holeHeight, speed, center) {
  const holeCenter = center || random(holeHeight / 2, height - holeHeight / 2);
  for (let i = BULLET_HEIGHT / 2; i < height; i += 5 * BULLET_HEIGHT) {
    if (i < holeCenter - holeHeight / 2 || i > holeCenter + holeHeight / 2) {
      bullets.add(new Bullet(width, i, BULLET_WIDTH, BULLET_HEIGHT, -speed, 0));
    }
  }
}

function regular(i = INIT_FRAMES_EVERY_BULLET) {
  if (scoreCount % i === 0) {
    bullets.add(
      new Bullet(
        width,
        random(BULLET_HEIGHT / 2, height - BULLET_HEIGHT / 2),
        BULLET_WIDTH,
        BULLET_HEIGHT,
      ),
    );
  }
}

function genBigChase(rate = 1.5) {
  return bigChase.bind(null, rate);
}
function bigChase(rate) {
  bulletSound.play();
  bullets.add(new FatalBullet(rate));
}

function genWave(h = 175, s = INIT_BULLET_MIN_SPEED, cycle = 10, slope = 30) {
  let waveCenter = random(
    BULLET_HEIGHT / 2 + h / 2 + (cycle / 2) * slope,
    height - BULLET_HEIGHT / 2 - h / 2 - (cycle / 2) * slope,
  );
  let firstShot = true;
  return function wave() {
    let yOffset = (scoreCount % (cycle * cycle)) / cycle - cycle / 2;
    if (yOffset < 0) yOffset = -yOffset;
    if (scoreCount % cycle === 0) {
      if (firstShot) {
        oneHole(h, s, waveCenter + slope * yOffset - BULLET_HEIGHT);
        firstShot = false;
      } else {
        bullets.add(
          new Bullet(
            width,
            waveCenter - h / 2 + slope * yOffset,
            BULLET_WIDTH,
            BULLET_HEIGHT,
            -s,
            0,
          ),
        );
        bullets.add(
          new Bullet(
            width,
            waveCenter + h / 2 + slope * yOffset,
            BULLET_WIDTH,
            BULLET_HEIGHT,
            -s,
            0,
          ),
        );
      }
    }
  };
}

function genStopper(t) {
  return stopper.bind(null, t);
}

function stopper(till) {
  bullets.add(new Stopper(till));
}

function genVanisher() {
  return vanisher;
}
function vanisher() {
  bullets.add(new Vanisher());
}

function genRandomer() {
  return randomer;
}
function randomer() {
  bullets.add(new Randomer());
}

function genAccelerator(a) {
  return accelerator.bind(null, a);
}
function accelerator(a) {
  bullets.add(new Accelerator(a));
}

function genPlumber() {
  return plumber;
}
function plumber() {
  bullets.add(new Plumber());
}

function genCrosser() {
  return crosser;
}
function crosser() {
  bullets.add(new Crosser());
}
