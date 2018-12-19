const initDifficultyData = [
  {
    active: true,
    available: true,
    difficultyLevel: '1',
    displayLevel: '1',
  },
  {
    active: false,
    available: false,
    difficultyLevel: '2',
    displayLevel: '2',
  },
  {
    active: false,
    available: false,
    difficultyLevel: '3',
    displayLevel: '3',
  },
  {
    active: false,
    available: false,
    difficultyLevel: '4',
    displayLevel: '4',
  },
  {
    active: false,
    available: false,
    difficultyLevel: '5',
    displayLevel: '5',
  },
  {
    active: false,
    available: false,
    difficultyLevel: '6',
    displayLevel: '6',
  },
  {
    active: false,
    available: false,
    difficultyLevel: '7',
    displayLevel: '7',
  },
  {
    active: false,
    available: false,
    difficultyLevel: '8',
    displayLevel: '∞',
  },
];

class Difficulty {
  constructor(entry) {
    this.data = [...initDifficultyData];
    this.entry = entry;
    this.levelOpened = '1';
  }
  setListener() {
    const difficultyOptions = this.entry.querySelectorAll('.difficulty');
    Array.from(difficultyOptions).forEach(
      d =>
        (d.onclick = e => {
          difficulty.setDifficulty(e.target.dataset.level);
        }),
    );
  }
  setDifficulty(level) {
    const d = this.data.filter(d => d.difficultyLevel === level)[0];
    if (d.available) {
      this.data = this.data.map(d => {
        if (d.difficultyLevel === level) {
          d.active = true;
        } else {
          d.active = false;
        }
        return d;
      });
    }
    this.render();
  }
  setAvailable(level) {
    this.data = this.data.map(d => {
      if (d.difficultyLevel === level) {
        d.available = true;
      }
      return d;
    });
    this.render();
  }
  getLevel() {
    return this.data.find(d => d.active).difficultyLevel;
  }
  getDisplayLevel() {
    return this.data.find(d => d.active).displayLevel;
  }
  openLevelTo(level) {
    let changed = false;
    if (Number(this.levelOpened) >= Number(level)) {
      level = this.levelOpened;
    } else {
      this.levelOpened = level;
      changed = true;
    }
    this.data = this.data.map(d => {
      d.available = Number(d.difficultyLevel) <= Number(level);
      return d;
    });
    this.render();
    return changed;
  }
  log() {
    console.table(this.data);
  }
  render() {
    this.entry.innerHTML = this.data
      .map(d => {
        let className = 'difficulty';
        className += d.active ? ' active' : '';
        className += d.available ? ' available' : '';
        return `<div class="${className}" data-level="${d.difficultyLevel}">${
          d.displayLevel
        }</div>`;
      })
      .join('');
    this.setListener();
  }
}
