function push50() {
  bullets.push(new Bullet(0, 50, 0, 0, 0, 0));
}

function oneHole() {
  const holeCenter = random(BULLET_HEIGHT / 2, height - BULLET_HEIGHT / 2);
  for (let i = BULLET_HEIGHT / 2; i < height; i += BULLET_HEIGHT) {
    if (
      i < holeCenter - BULLET_HEIGHT * 5 ||
      i > holeCenter + BULLET_HEIGHT * 5
    ) {
      bullets.push(new Bullet(0, i, 0, 0, -5, 0));
    }
  }
}
