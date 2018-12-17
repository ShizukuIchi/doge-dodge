let menuVisibility = false;
let difficulty = 1;

const menu = document.querySelector('#menu');
const settings = document.querySelector('#settings');
const sound = document.querySelector('#sound');
const difficultyOption = document.querySelector('#difficulties');

settings.onclick = () => {
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

difficultyOption.onclick = e => {
  const target = e.target.closest('.difficulty');
  if (!target) return;
  const clickedDifficulty = target.dataset.value;
  console.log(clickedDifficulty);
};
