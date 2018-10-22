function push50() {
  bullets.push(new Bullet(0, 50, 0, 0, 0, 0));
}

function oneHole(h = BULLET_HEIGHT * 8, s = 5) {
  const holeCenter = random(BULLET_HEIGHT / 2, height - BULLET_HEIGHT / 2);
  for (let i = BULLET_HEIGHT / 2; i < height; i += BULLET_HEIGHT) {
    if (i < holeCenter - h / 2 || i > holeCenter + h / 2) {
      bullets.push(new Bullet(width, i, BULLET_WIDTH, BULLET_HEIGHT, -s, 0));
    }
  }
}
function normal() {
  if (frameCount % framesEveryBullet === 0) {
    bullets.push(new Bullet());
  }
}

function wave(h = BULLET_HEIGHT * 7, s = 5) {
  let waveCenter = random(
    BULLET_HEIGHT / 2 + 100,
    height - BULLET_HEIGHT / 2 - 100,
  );
  bullets.push(
    new Bullet(width, waveCenter - 50, BULLET_WIDTH, BULLET_HEIGHT, -s, 0),
  );
  bullets.push(
    new Bullet(width, waveCenter + 50, BULLET_WIDTH, BULLET_HEIGHT, -s, 0),
  );
}
