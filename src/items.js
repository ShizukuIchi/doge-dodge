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
    this.xspeed = xs || -14;
    this.yspeed = ys || 0;
  }
  effect() {
    console.log("item contact");
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
    character.lives += 1;
  }
  show() {
    fill("pink");
    noStroke();
    ellipse(this.x, this.y, this.w);
  }
}
