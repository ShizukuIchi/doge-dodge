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
    displayLevel: '∞',
  },
];

class Difficulty {
  constructor(entry) {
    this.data = [...initDifficultyData];
    this.entry = entry;
    this.levelOpened = '1';
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
    return this.data.filter(d => d.active)[0].difficultyLevel;
  }
  openLevelTo(level) {
    if (Number(this.levelOpened) > Number(level)) {
      level = this.levelOpened;
    } else {
      this.levelOpened = level;
    }
    this.data = this.data.map(d => {
      d.available = Number(d.difficultyLevel) <= Number(level);
      return d;
    });
    this.render();
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
  }
}
