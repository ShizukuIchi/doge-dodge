let menuVisibility = false;
const menu = document.querySelector('#menu');

document.querySelector('#settings').onclick = () => {
  menu.classList.toggle('menu-active');
};

menu.onclick = e => {
  if (e.target === menu) {
    menu.classList.toggle('menu-active');
  }
};

document.querySelector('#sound').onclick = e => {
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
