class Character {
  constructor() {
    // start position
    this.x = 50;
    this.y = 20;
    this.w = CHARACTER_WIDTH;
    this.h = CHARACTER_HEIGHT;
    this.xspeed = 0;
    this.yspeed = CHARACTER_SPEED;
    this.lives = 2;
    this.energy = 0;
    this.status = 'normal';
    this.isInvincible = false;
    this.click2Move = 0;
    this.speechText = '';
    this.speechTimeout = 0;
    this.statusTimeout = 0;
    this.invisibleTimeout = 0;
    this.coolDown = false;
  }

  update() {
    switch (this.status) {
      case 'slow':
        this.y += this.yspeed * 0.5;
        this.x += this.xspeed;
        break;
      case 'stunned':
        if (!this.click2Move) this.status = 'normal';
        break;
      case 'sicked':
        this.x += this.xspeed;
        this.y += this.yspeed * random() * 2;
        break;
      case 'fast':
        this.x += this.xspeed;
        this.y += this.yspeed * 2.2;
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
    clearTimeout(this.statusTimeout);
    if (ms) {
      this.statusTimeout = setTimeout(() => {
        if (this.status === status) this.status = 'normal';
      }, ms);
    }
  }
  setInvincible(ms = 2000) {
    this.isInvincible = true;
    clearTimeout(this.invisibleTimeout);
    this.invisibleTimeout = setTimeout(() => {
      this.isInvincible = false;
    }, ms);
  }
  setSpeech(s) {
    this.speechText = s;
    clearTimeout(this.speechTimeout);
    this.speechTimeout = setTimeout(() => {
      this.speechText = '';
    }, 2000);
  }
  changeDirection() {
    switch (this.status) {
      case 'stunned':
        this.click2Move -= 1;
        break;
      default:
        this.yspeed = -this.yspeed;
    }
  }
  speak() {
    stroke(255);
    strokeWeight(1);
    textSize(15);
    fill(255);
    textAlign(LEFT, TOP);
    let statusText = this.textFromStatus();
    if (statusText.length) text(statusText, this.x + this.w, this.y - 10);
    if (this.speechText.length)
      text(this.speechText, this.x + this.w, this.y + 20);
  }
  textFromStatus() {
    switch (this.status) {
      case 'normal':
        return '';
      case 'slow':
        return 'so slow...';
      case 'stunned':
        return String(this.click2Move);
      case 'sicked':
        return 'Bluuuh!';
      case 'big':
        return 'Mario!';
      case 'small':
        return 'Can you see me?';
      case 'fast':
        return 'too fast!!!';
      case 'good':
        return 'yummy ^_^';
      case 'lucky':
        return 'not even close';
      case 'dead':
        return 'Oh no!';
      default:
        return 'something wrong..';
    }
  }
  addEnergy() {
    if (this.coolDown) this.setSpeech('Ultimate cool down...');
    if (this.energy === 2) {
      this.ultimate();
    } else {
      this.energy += 1;
      this.setSpeech(`Charging energy (${this.energy})`);
    }
  }
  ultimate() {
    this.setSpeech('Power Over 9k!');
    this.energy = 0;
    this.coolDown = true;
    setTimeout(() => {
      try {
        this.coolDown = false;
      } catch {}
    }, 10000);
    bullets.changeUpdate(function() {
      this.x -= this.xspeed;
    });
  }
  show() {
    if (this.isInvincible) {
      tint(255, 125);
      image(characterImg, this.x, this.y, this.w, this.h);
      tint(255, 255);
      return;
    }
    image(characterImg, this.x, this.y, this.w, this.h);
  }
  clearTimers() {
    clearTimeout(this.invisibleTimeout);
    clearTimeout(this.statusTimeout);
    clearTimeout(this.speechTimeout);
  }
}

class TutorialGuy {
  constructor() {
    this.x = 420;
    this.y = 370;
    this.w = 60;
    this.h = 60;
    this.xspeed = 0;
    this.yspeed = 0;
    this.item = null;
    this.lock = false;
    this.lives = 1;
    this.phase = 'start';
  }
  async dodge() {
    if (this.lock) return;
    this.lock = true;
    this.item = new Bullet(0, 0, 20, 20);
    this.yspeed = -5;
    this.item.x = 700;
    this.item.y = 400;
    this.item.xspeed = -12;
    await this.sleep(700);
    this.yspeed = 5;
    await this.sleep(700);
    this.y = 370;
    this.yspeed = 0;
    this.item = null;
    this.lock = false;
  }
  sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
  }
  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;
  }
  async heart() {
    if (this.lock) return;
    this.lock = true;
    let item = new Life();
    item.y = 400;
    item.x = 700;
    item.width = 40;
    item.height = 40;
    item.xspeed = -7;
    item.yspeed = 0;
    this.item = item;
    await this.sleep(1200);
    this.item = null;
    this.lives += 1;
    this.lock = false;
  }

  processItem() {
    if (this.item) {
      this.item.update();
      this.item.show();
    }
  }
  drawTips() {
    drawTutorialPhase();
    if (this.phase === 'end') {
      drawTutorialEnd();
    } else if (this.phase === 'start') {
      drawTutorialStart();
    } else {
      drawNext();
    }
  }
  show() {
    image(characterImg, this.x, this.y, this.w, this.h);
  }
}
