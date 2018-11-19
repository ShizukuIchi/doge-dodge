class Character {
  constructor() {
    // start position
    this.x = 50;
    this.y = 20;
    this.w = CHARACTER_WIDTH;
    this.h = CHARACTER_HEIGHT;
    this.xspeed = 0;
    this.yspeed = CHARACTER_SPEED;
    this.lives = 1;
    this.status = "normal";
    this.isInvincible = false;
    this.click2Move = 0
  }

  update() {
    switch (this.status) {
      case "slow":
        this.y += this.yspeed * 0.5;
        this.x += this.xspeed;
        break;
      case 'stunned':
        if (!this.click2Move) this.status = 'normal'
        break
      default:
        this.x += this.xspeed;
        this.y += this.yspeed;
    }
    if (this.y + this.h > height - 1) {
      this.y = height - 1 - this.h;
      this.yspeed = -this.yspeed;
    }
    if (this.y < 1) {
      this.y = 1;
      this.yspeed = -this.yspeed;
    }
  }
  setStatus(status, ms = 0) {
    this.status = status;
    if (ms) {
      setTimeout(() => {
        this.status = "normal";
      }, ms);
    }
  }
  setInvincible(ms = 2000) {
    this.isInvincible = true;
    setTimeout(() => {
      this.isInvincible = false;
    }, ms);
  }
  changeDirection() {
    switch (this.status) {
      case 'stunned':
        this.click2Move -= 1
        break
      default:
        this.yspeed = -this.yspeed;
    }
  }
  show() {
    if (this.isInvincible) {
      tint(255, 125);
      image(characterImg, this.x, this.y, this.w, this.h);
      tint(255, 255);
      return
    }
    switch (this.status) {
      case 'normal':
        image(characterImg, this.x, this.y, this.w, this.h);
        break
      case 'stunned':
        stroke(255)
        strokeWeight(1)
        textSize(15)
        fill(255)
        text(this.click2Move, this.x + this.w, this.y - 10)
        image(characterImg, this.x, this.y, this.w, this.h);
        break
    }
  }
}
