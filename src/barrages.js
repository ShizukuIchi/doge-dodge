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
        listeners.emitEvent({ type: 'remove', barrage: barrage.fn });
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
