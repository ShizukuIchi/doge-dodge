class Bullets {
  constructor() {
    this.bullets = [];
  }
  add(bullet) {
    this.bullets.push(bullet);
  }
  showNext() {
    this.bullets = this.bullets.filter(bullet => {
      bullet.update();
      bullet.show();
      return bullet.x + bullet.w >= 0;
    });
  }
  countCollisions(stuff) {
    let collision = 0;
    this.bullets.forEach(bullet => {
      collision += isColliding(bullet, stuff, COLLISION_BOUNDARY) ? 1 : 0;
    });
    return collision;
  }
  clear() {
    this.bullets = [];
  }
}

class Bullet {
  constructor(x, y, w, h, xs, ys) {
    this.x = x || width;
    this.y = y || height / 2;
    this.w = w || BULLET_WIDTH;
    this.h = h || BULLET_HEIGHT;
    this.xspeed = xs || -INIT_BULLET_MIN_SPEED * bulletSpeedRate;
    this.yspeed = ys || 0;
  }
  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;
  }

  show() {
    stroke("yellow");
    strokeWeight(this.h);
    line(this.x, this.y, this.x + this.w, this.y);
  }
}

class FastAimer extends Bullet {
  constructor(rate) {
    super();
    this.w = BULLET_WIDTH + 4;
    this.h = BULLET_HEIGHT + 7;
    this.y = character ? character.y : random(this.h / 2, height - this.h / 2);
    this.xspeed = this.xspeed * rate;
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

class SlowChaser extends Bullet {
  constructor() {
    super();
    this.w = BULLET_WIDTH + 2;
    this.h = BULLET_HEIGHT + 2;
    this.y = height / 2;
    this.xspeed = this.xspeed * 0.8;
    this.yspeed = Math.abs(character.yspeed * 0.65);
  }

  update() {
    this.x += this.xspeed;
    if (this.y > character.y) {
      this.y -= this.yspeed;
    } else {
      this.y += this.yspeed;
    }
  }
}

class Stopper extends Bullet {
  constructor(block) {
    super();
    this.y = random(this.h / 2, height - this.h / 2);
    this.yspeed = 0;
    this.xspeed = this.xspeed * 1.5;
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
    stroke("red");
    strokeWeight(this.h);
    line(this.x, this.y, this.x + this.w, this.y);
  }
}

class Vanisher extends Bullet {
  constructor() {
    super();
    this.y = random(this.h / 2, height - this.h / 2);
    this.xspeed = 2 * this.xspeed;
    this.yspeed = 0;
    this.alpha = 100;
  }

  update() {
    if (this.x / width > 0.6 && this.alpha > 3.5) {
      this.alpha -= 5;
    } else if (this.x / width < 0.5 && this.alpha < 92) {
      this.alpha += 8;
    }
    this.x += this.xspeed;
    this.y += this.yspeed;
  }
  show() {
    stroke(`rgba(0,255,0,${this.alpha / 100})`);
    strokeWeight(this.h);
    line(this.x, this.y, this.x + this.w, this.y);
  }
}

class Randomer extends Bullet {
  constructor(stopRand) {
    super();
    this.y = random(this.h / 2, height - this.h / 2);
    this.xspeed = 1.7 * this.xspeed;
    this.yspeed = 0;
    this.stopRand = stopRand;
  }

  update() {
    if (this.x > width * this.stopRand && scoreCount % 10 === 0) {
      this.y = random(this.h / 2, height - this.h / 2);
    }
    this.x += this.xspeed;
    this.y += this.yspeed;
  }
  show() {
    stroke("green");
    strokeWeight(this.h);
    line(this.x, this.y, this.x + this.w, this.y);
  }
}

class Accelerator extends Bullet {
  constructor(a) {
    super();
    this.y = random(this.h / 2, height - this.h / 2);
    this.yspeed = 0;
    this.a = a;
  }

  update() {
    if (this.x < width / 2) {
      this.xspeed -= this.a;
      if (this.x < width / 3) {
        this.xspeed -= this.a;
      }
    }
    this.x += this.xspeed;
    this.y += this.yspeed;
  }
  show() {
    stroke("orange");
    strokeWeight(this.h);
    line(this.x, this.y, this.x + this.w, this.y);
  }
}

class Plumber extends Bullet {
  constructor(stopMove) {
    super();
    this.x = character.x;
    this.y = character.y > height / 2 ? height : 0 - this.h;
    this.yspeed = character.y > height / 2 ? -2 : 2;
    this.xspeed = -5;
    this.stopMove = stopMove;
  }

  update() {
    if (
      this.y < height * this.stopMove ||
      this.y > height * (1 - this.stopMove)
    ) {
      this.y += this.yspeed;
    } else {
      this.x += this.xspeed;
    }
  }
  show() {
    stroke("red");
    strokeWeight(this.h);
    line(this.x, this.y, this.x + this.w, this.y);
  }
}

class Crosser extends Bullet {
  constructor() {
    super();
    this.y = random(this.h / 2, height - this.h / 2);
    if (this.y > height / 2) {
      this.y += height / 2;
      this.yspeed = -Math.abs(character.yspeed);
    } else {
      this.y -= height / 2;
      this.yspeed = Math.abs(character.yspeed);
    }
    this.xspeed = this.xspeed * 1.3;
  }

  update() {
    this.y += this.yspeed;
    this.x += this.xspeed;
  }
  show() {
    stroke("yellow");
    strokeWeight(this.h);
    line(this.x, this.y, this.x + this.w, this.y);
  }
}
