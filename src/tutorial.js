const input = message => {
  return new Promise((res, rej) => {
    function handleClick(e) {
      window.removeEventListener('click', handleClick);
      if (character.lock) res('locked');
      else if (e.offsetX < 450) res('again');
      else if (e.offsetX >= 450) res('next');
    }
    window.addEventListener('click', handleClick);
  });
};

async function tutorial() {
  scoreCount = 999;
  status = 'tutorial';
  character = new TutorialGuy();
  loop();
  character.phase = 'start';
  let flag = 'again';
  while (flag !== 'next') {
    flag = await input('start');
  }
  character.phase = 'dodge';
  flag = 'again';
  while (flag !== 'next') {
    character.dodge();
    flag = await input('dodge');
  }
  character.phase = 'heart';
  flag = 'again';
  while (flag !== 'next') {
    character.heart();
    flag = await input('heart');
  }
  character.phase = 'end';
}
function drawTutorialPhase() {
  setupText();
  textAlign(CENTER, CENTER);
  textSize(30);
  switch (character.phase) {
    case 'start':
      text(`Watch and learn!`, 450, 200);
      break;
    case 'dodge':
      text(`Dodge something like this.`, 450, 200);
      break;
    case 'heart':
      text(`This helps you survive longer.`, 450, 200);
      break;
    case 'end':
      text(`It seems you are ready.`, 450, 200);
      text(`Learn more by clicking  <選項>.`, 450, 250);
      break;
    default:
      console.log('no this phase');
  }
}
function drawTutorialEnd() {
  setupText();
  text(`Press T to watch again`, 25, 750);
  textAlign(RIGHT, TOP);
  text('Press space to start', 875, 750);
}
function drawTutorialStart() {
  setupText();
  textAlign(RIGHT, TOP);
  text(`I'm ready`, 875, 750);
}
function drawNext() {
  setupText();
  text(`Watch again`, 25, 750);
  textAlign(RIGHT, TOP);
  text(`Next tip`, 875, 750);
}
