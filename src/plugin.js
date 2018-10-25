function oneHole(h = 150, s = INIT_BULLET_MIN_SPEED, center) {
  return function() {
    const holeCenter = center || random(h / 2, height - h / 2);
    for (let i = BULLET_HEIGHT / 2; i < height; i += BULLET_HEIGHT) {
      if (i < holeCenter - h / 2 || i > holeCenter + h / 2) {
        bullets.add(new Bullet(width, i, BULLET_WIDTH, BULLET_HEIGHT, -s, 0));
      }
    }
  };
}
function regular(interval = INIT_FRAMES_EVERY_BULLET) {
  if (scoreCount % interval === 0) {
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

function bigChase(interval = 300) {
  return function() {
    if (scoreCount % interval === 0) {
      bullets.add(new FatalBullet());
    }
  };
}
function wave(h = 175, s = INIT_BULLET_MIN_SPEED, cycle = 10, slope = 30) {
  let waveCenter = random(
    BULLET_HEIGHT / 2 + h / 2 + (cycle / 2) * slope,
    height - BULLET_HEIGHT / 2 - h / 2 - (cycle / 2) * slope,
  );
  let firstShot = true;
  return function() {
    let yOffset = (scoreCount % (cycle * cycle)) / cycle - cycle / 2;
    if (yOffset < 0) yOffset = -yOffset;
    if (scoreCount % cycle === 0) {
      if (firstShot) {
        oneHole(h, s, waveCenter + slope * yOffset - BULLET_HEIGHT)();
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

function stopper(stopFor = 150) {
  return function() {
    bullets.add(new BulletR(stopFor));
  };
}
