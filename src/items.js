class Items {
  constructor() {
    this.items = [];
  }
  add(item) {
    this.items.push(item);
  }
  showNext() {
    for (let i = this.items.length - 1; i >= 0; i -= 1) {
      let item = this.items[i];
      item.update();
      item.show();
      if (isColliding(item, character, COLLISION_BOUNDARY)) {
        item.effect();
        this.items.splice(i, 1);
      } else if (item.x + item.w <= 0) this.items.splice(i, 1);
    }
  }
  clear() {
    this.items = [];
  }
}
class Item {
  constructor(x, y, w, h, xs, ys) {
    this.x = x || width;
    this.y = y || height / 2;
    this.w = w || 40;
    this.h = h || 20;
    this.xspeed = xs || -12;
    this.yspeed = ys || 0;
  }
  effect() {
    console.log('item contact');
  }
  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;
  }
}
class Life extends Item {
  constructor(y = 0.5) {
    super();
    this.y = height * y;
  }
  effect() {
    character.lives += 1;
    character.setStatus('good', 2000);
  }
  show() {
    fill('pink');
    noStroke();
    ellipse(this.x, this.y, this.w);
  }
}
class Stun extends Item {
  constructor(y = 0.5) {
    super();
    this.y = height * y;
  }
  effect() {
    character.status = 'stunned';
    character.click2Move = 5;
  }
  show() {
    noStroke();
    fill('purple');
    ellipse(this.x, this.y, this.w);
  }
}

class Unknown extends Item {
  constructor(y = 0.5) {
    super();
    this.y = height * y;
  }
  effect() {
    itemTypes.pick().prototype.effect();
  }
  show() {
    stroke(255);
    strokeWeight(2);
    textSize(25);
    fill(255);
    text('?', this.x - 6, this.y - 20);
    noFill();
    ellipse(this.x, this.y, this.w);
  }
}
class Sick extends Item {
  constructor(y = 0.5) {
    super();
    this.y = height * y;
  }
  effect() {
    character.setStatus('sicked', 5000);
  }
  show() {
    noStroke();
    fill('green');
    ellipse(this.x, this.y, this.w);
  }
}
class Fast extends Item {
  constructor(y = 0.5) {
    super();
    this.y = height * y;
  }
  effect() {
    character.setStatus('fast', 5000);
  }
  show() {
    noStroke();
    fill('orange');
    ellipse(this.x, this.y, this.w);
  }
}
class Grow extends Item {
  constructor(y = 0.5) {
    super();
    this.y = height * y;
  }
  effect() {
    character.h = CHARACTER_HEIGHT + 12;
    character.w = CHARACTER_WIDTH + 12;
    character.x -= 6;
    character.y -= 6;
    setTimeout(() => {
      character.w = CHARACTER_WIDTH;
      character.h = CHARACTER_HEIGHT;
      character.x += 6;
      character.y += 6;
    }, 5000);
    character.setStatus('big', 5000);
  }
  show() {
    noStroke();
    fill('brown');
    ellipse(this.x, this.y, this.w);
  }
}
class Shrink extends Item {
  constructor(y = 0.5) {
    super();
    this.y = height * y;
  }
  effect() {
    character.h = CHARACTER_HEIGHT - 16;
    character.w = CHARACTER_WIDTH - 16;
    character.x += 8;
    character.y += 8;
    setTimeout(() => {
      character.w = CHARACTER_WIDTH;
      character.h = CHARACTER_HEIGHT;
      character.x -= 8;
      character.y -= 8;
    }, 5000);
    character.setStatus('small', 5000);
  }
  show() {
    noStroke();
    fill('burlywood');
    ellipse(this.x, this.y, this.w);
  }
}

const itemTypes = [Life, Stun, Sick, Unknown, Fast, Grow, Shrink];
