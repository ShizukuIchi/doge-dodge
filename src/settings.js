let menuVisibility = false;

const menu = document.querySelector('#menu');
const settings = document.querySelector('#settings');
const sound = document.querySelector('#sound');
const difficultyOption = document.querySelector('#difficulties');
const difficulty = new Difficulty(difficultyOption);

settings.onclick = () => {
  if (status !== 'stopped') return;
  menu.classList.toggle('menu-active');
};

menu.onclick = e => {
  if (e.target === menu) {
    menu.classList.toggle('menu-active');
  }
};

sound.onclick = e => {
  if (!e.target.checked) {
    try {
      bgm.setVolume(0);
    } catch (error) {
      e.target.checked = true;
    }
  } else {
    try {
      bgm.setVolume(1);
    } catch (error) {
      e.target.checked = false;
    }
  }
};
