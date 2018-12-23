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
    this.y = height * y - this.h / 2;
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
    this.y = height * y - this.h / 2;
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
    this.y = height * y - this.h / 2;
  }
  effect() {
    itemTypes.pick().prototype.effect();
  }
  show() {
    stroke(255);
    strokeWeight(2);
    textAlign(CENTER, CENTER);
    textSize(25);
    fill(255);
    text('?', this.x, this.y - 6);
    noFill();
    ellipse(this.x, this.y, this.w);
  }
}
class Sick extends Item {
  constructor(y = 0.5) {
    super();
    this.y = height * y - this.h / 2;
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
    this.y = height * y - this.h / 2;
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
    this.y = height * y - this.h / 2;
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
    this.y = height * y - this.h / 2;
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

const itemTypes = [Life, Stun, Sick, Fast, Grow, Shrink];
function itemsGeneratorFor(level) {
  const levelItemSettings = [
    {
      amount: 3,
      types: [Life, Shrink],
    },
    {
      amount: 3,
      types: [Life, ...Array(2).fill(Fast), ...Array(5).fill(Grow), ...Array(5).fill(Shrink)],
    },
    {
      amount: 5,
      types: [Life, ...Array(3).fill(Stun), ...Array(3).fill(Sick), ...Array(3).fill(Fast), ...Array(3).fill(Grow), ...Array(3).fill(Shrink), ... Array(3).fill(Unknown)],
    },
    {
      amount: 7,
      types: [Life, ...Array(5).fill(Stun), ...Array(4).fill(Sick), ...Array(4).fill(Fast), ...Array(4).fill(Grow), ...Array(4).fill(Shrink), ... Array(4).fill(Unknown) ],
    },
    {
      amount: 10,
      types: [...Array(3).fill(Stun), ...Array(3).fill(Sick), ...Array(3).fill(Fast), Unknown],
    },
  ];
  return function() {
    const itemSettings =
      levelItemSettings[Number(level) - 1] ||
      levelItemSettings[levelItemSettings.length - 1];
    Array(itemSettings.amount)
      .fill()
      .forEach((_, index) => {
        dispatch({
          type: 'addItem',
          item: new (itemSettings.types.pick())(
            (1 / (itemSettings.amount + 1)) * (index + 1),
          ),
        });
      });
  };
}
