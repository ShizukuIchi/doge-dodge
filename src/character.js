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
    this.speechText = ''
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
      case 'sicked':
        this.x += this.xspeed;
        this.y += this.yspeed * random() * 2;
        break;
      case 'fast':
        this.x += this.xspeed;
        this.y += this.yspeed * 2.3;
        break;
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
  setStatus(status, ms) {
    this.status = status;
    if (ms) {
      setTimeout(() => {
        if (this.status === status)
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
  setSpeech(s) {
    if (this.speechText.length) return
    this.speechText = s
    setTimeout(() => {
      this.speechText = ''
    }, 2000);
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
  speak() {
    stroke(255)
    strokeWeight(1)
    textSize(15)
    fill(255)
    let statusText = this.textFromStatus()
    if (statusText.length)
      text(statusText, this.x + this.w, this.y - 10)
    if (this.speechText.length)
      text(this.speechText, this.x + this.w, this.y + 20)
  }
  textFromStatus() {
    switch (this.status) {
      case 'normal':
        return ''
      case 'slow':
        return 'so slow...'
      case 'stunned':
        return String(this.click2Move)
      case 'sicked':
        return 'Bluuuh!'
      case 'big':
        return 'Mario!'
      case 'small':
        return 'Can you see me?'
      case 'fast':
        return 'too fast!!!'
      case 'good':
        return 'yummy ^_^'
      case 'lucky':
        return 'not even close'
      case 'dead':
        return 'Oh no!'
      default:
        return 'something wrong..'
    }
  }
  show() {
    if (this.isInvincible) {
      tint(255, 125);
      image(characterImg, this.x, this.y, this.w, this.h);
      tint(255, 255);
      return
    }
    image(characterImg, this.x, this.y, this.w, this.h);
  }
}
