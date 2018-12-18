class Barrages {
  constructor() {
    this.barrages = [];
  }
  add(fn, tillScore) {
    this.barrages.push(new Barrage(fn, tillScore));
  }
  remove(fn) {
    this.barrages = this.barrages.filter(b => {
      let name = b.fn.name;
      name = name.startsWith('bound ') ? name.split(' ')[1] : name;
      let _name = fn.name;
      _name = _name.startsWith('bound ') ? _name.split(' ')[1] : _name;
      return name !== _name;
    });
  }
  generate() {
    this.barrages.forEach(barrage => {
      if (barrage.stopScore > 0 && barrage.stopScore + 1 <= scoreCount) {
        dispatch({ type: 'remove', barrage: barrage.fn });
      } else {
        barrage.fn();
      }
    });
  }
  clear() {
    this.barrages = [new Barrage(regular, -1)];
  }
}

class Barrage {
  constructor(fn, stopScore) {
    this.fn = fn;
    this.stopScore = stopScore;
  }
}

function genOneHole(h = 150, c = height / 2) {
  const _c = c || random(h / 2, height - h / 2);
  return oneHole.bind(this, h, _c);
}
function oneHole(holeHeight, center) {
  const holeCenter = center || random(holeHeight / 2, height - holeHeight / 2);
  for (let i = BULLET_HEIGHT / 2; i < height; i += 4 * BULLET_HEIGHT) {
    if (i <= holeCenter - holeHeight / 2 || i >= holeCenter + holeHeight / 2) {
      bullets.add(new Bullet(width, i));
    }
  }
}

function regular(i = INIT_FRAMES_EVERY_BULLET) {
  if (scoreCount % i === 0) {
    bullets.add(
      new Bullet(width, random(BULLET_HEIGHT / 2, height - BULLET_HEIGHT / 2)),
    );
  }
}

function genBigChase(rate) {
  return bigChase.bind(null, rate);
}
function bigChase(rate) {
  bulletSound.play();
  bullets.add(new FastAimer(rate));
}

function genSlowChaser(rate) {
  return slowChaser.bind(null, rate);
}
function slowChaser(rate) {
  bullets.add(new SlowChaser(rate));
}

function genWave(h, slope = 45) {
  let array = [-2, -1, 0, 1, 2, 1, 0, -1];
  let cycling = 2;
  let waveCenter = random(
    BULLET_HEIGHT / 2 + h / 2 + cycling * slope,
    height - BULLET_HEIGHT / 2 - h / 2 - cycling * slope,
  );
  let firstShot = true;

  return function wave() {
    if (scoreCount % 6 === 0) {
      if (firstShot) {
        oneHole(h, waveCenter);
        firstShot = false;
      } else {
        cycling = cycling % array.length;
        bullets.add(
          new Bullet(width, waveCenter + h / 2 + slope * array[cycling]),
        );
        bullets.add(
          new Bullet(width, waveCenter - h / 2 + slope * array[cycling]),
        );
        cycling = cycling + 1;
      }
    }
  };
}

function genStopper(t) {
  return stopper.bind(null, t);
}

function stopper(till) {
  bullets.add(new Stopper(till));
}

function genVanisher() {
  return vanisher;
}
function vanisher() {
  bullets.add(new Vanisher());
}

function genRandomer(percentage) {
  return randomer.bind(null, percentage);
}
function randomer(percentage) {
  bullets.add(new Randomer(percentage));
}

function genAccelerator(a) {
  return accelerator.bind(null, a);
}
function accelerator(a) {
  bullets.add(new Accelerator(a));
}

function genPlumber(percentage) {
  return plumber.bind(null, percentage);
}
function plumber(percentage) {
  bullets.add(new Plumber(percentage));
}

function genCrosser() {
  return crosser;
}
function crosser() {
  bullets.add(new Crosser());
}

const barrageTypes = [
  {
    fn: genOneHole,
    arguments: [170, 160, 150, 130, 80],
    stopTill: [1],
  },
  {
    fn: genWave,
    arguments: [200, 200, 200, 180, 150],
    stopTill: [100, 120, 140, 160, 180],
  },
  {
    fn: genStopper,
    arguments: [120, 120, 120, 135, 150],
    stopTill: [3, 4, 5, 6, 7],
  },
  {
    fn: genBigChase,
    arguments: [2.1, 2.3, 2.5, 2.7, 3],
    stopTill: [1],
  },
  {
    fn: genSlowChaser,
    arguments: [0.7, 0.75, 0.8, 0.83, 0.87],
    stopTill: [1],
  },
  {
    fn: genVanisher,
    arguments: [0],
    stopTill: [3, 4, 5, 7, 10],
  },
  {
    fn: genAccelerator,
    arguments: [2, 2, 2, 3, 4],
    stopTill: [3, 4, 5, 7, 10],
  },
  {
    fn: genRandomer,
    arguments: [0.6, 0.6, 0.5, 0.4, 0.3],
    stopTill: [3, 4, 5, 7, 10],
  },
  {
    fn: genPlumber,
    arguments: [0.2, 0.225, 0.25, 0.3, 0.4],
    stopTill: [1],
  },
  {
    fn: genCrosser,
    arguments: [0],
    stopTill: [3, 4, 5, 7, 10],
  },
];
