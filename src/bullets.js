class Bullets {
  constructor() {
    this.bullets = [];
  }
  add(bullet) {
    this.bullets.push(bullet);
  }
  next() {
    let collision = 0;
    for (let i = 0; i < this.bullets.length; i++) {
      let bullet = this.bullets[i];
      if (bullet.x + bullet.w < 1) {
        this.bullets.splice(i, 1);
        i -= 1;
        continue;
      }
      bullet.update();
      bullet.show();
      collision += isColliding(bullet, character, COLLISION_BOUNDARY) ? 1 : 0;
    }
    return collision === 0;
  }
  clear() {
    this.bullets = [];
  }
}

class Bullet {
  constructor(x, y, w, h, xs, ys) {
    this.w = w || BULLET_WIDTH;
    this.h = h || BULLET_HEIGHT;
    this.x = x || width;
    this.y = y || height / 2;
    this.xspeed = xs || -INIT_BULLET_MIN_SPEED * bulletSpeedRate;
    this.yspeed = ys || 0;
  }
  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;
  }

  // draw bullet
  show() {
    image(bulletImg, this.x, this.y, this.w, this.h);
  }
}

class FatalBullet extends Bullet {
  constructor() {
    super();
    this.w = BULLET_WIDTH + 10;
    this.h = BULLET_HEIGHT + 10;
    this.y = character ? character.y : random(this.h / 2, height - this.h / 2);
    this.yspeed = character ? character.yspeed : 0;
  }

  update() {
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
}

class BulletR extends Bullet {
  constructor(block) {
    super();
    this.w = BULLET_WIDTH + 10;
    this.h = BULLET_HEIGHT + 10;
    this.y = random(this.h / 2, height - this.h / 2);
    this.yspeed = 0;
    this.block = block;
  }

  update() {
    if (
      this.x + this.w / 2 >= character.x &&
      this.x + this.w / 2 <= character.x + character.w &&
      this.block > 0
    ) {
      this.block -= 1;
    } else {
      this.x += this.xspeed;
    }
    this.y += this.yspeed;
  }
  show() {
    image(bulletRImg, this.x, this.y, this.w, this.h);
  }
}
