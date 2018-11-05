class Items {
  constructor() {
    this.items = [];
  }
  add(item) {
    this.items.push(item);
  }
  update() {
    this.items.forEach(item => item.update());
    this.clearDead();
  }
  judgeCollision(stuff) {
    this.items.forEach(item => {
      isColliding(item, stuff, COLLISION_BOUNDARY) ? item.effect() : null;
    });
  }
  show() {
    this.items.forEach(item => item.show());
  }
  clearDead() {
    this.items = this.items.filter(item => item.x + item.w >= 0);
  }
  clear() {
    this.items = [];
  }
}
class Item {
  constructor(x, y, w, h, xs, ys) {
    this.x = x || width;
    this.y = y || height / 2;
    this.w = w || 20;
    this.h = h || 20;
    this.xspeed = xs || -20;
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
  constructor() {
    super();
  }
  effect() {
    console.log('life contact');
  }
  show() {
    console.log('show life');
  }
}

function life() {
  items.add(new Life());
}
