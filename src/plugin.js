function push50() {
  bullets.add(new Bullet(0, 50, 0, 0, 0, 0));
}

function oneHole(h = BULLET_HEIGHT * 10, s = 5, center) {
  const holeCenter = center || random(h / 2, height - h / 2);
  for (let i = BULLET_HEIGHT / 2; i < height; i += BULLET_HEIGHT) {
    if (i < holeCenter - h / 2 || i > holeCenter + h / 2) {
      bullets.add(new Bullet(width, i, BULLET_WIDTH, BULLET_HEIGHT, -s, 0));
    }
  }
}
function normal() {
  if (frameCount % framesEveryBullet === 0) {
    bullets.add(new Bullet());
  }
}

function bigChase() {
  if (scoreCount % 300 === 0) {
    setTimeout(() => {
      bullets.add(new FatalBullet());
    }, 100);
    bulletSound.play();
  }
}
function wave2(h = BULLET_HEIGHT * 10, s = 5) {
  let waveCenter = random(
    BULLET_HEIGHT / 2 + 100,
    height - BULLET_HEIGHT / 2 - 100,
  );
  let first = true;
  return function() {
    let yOffset = (scoreCount % 100) / 10 - 5;
    if (yOffset < 0) yOffset = -yOffset;

    if (scoreCount % 10 === 0) {
      console.log(yOffset);
      if (first && yOffset === 0) {
        oneHole(h, s, waveCenter);
        first = false;
      } else if (!first) {
        bullets.add(
          new Bullet(
            width,
            waveCenter - h / 2 + 10 * yOffset,
            BULLET_WIDTH,
            BULLET_HEIGHT,
            -s,
            0,
          ),
        );
        bullets.add(
          new Bullet(
            width,
            waveCenter + h / 2 + 10 * yOffset,
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
