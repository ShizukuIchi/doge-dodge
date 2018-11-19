const { Observable, merge } = rxjs;
const { mapTo, filter, delay } = rxjs.operators;

function RxFromListeners(listeners) {
  return Observable.create(observer => {
    listeners.addListener(data => {
      observer.next(data);
    });
  });
}

class Listeners {
  constructor() {
    this.listeners = [];
  }
  addListener(cb) {
    this.listeners.push(cb);
  }
  emitEvent(data) {
    this.listeners.forEach(cb => cb(data));
  }
}
const listeners = new Listeners();
const $event = RxFromListeners(listeners);

const rootEpic = combineEpics(
  addLongBarrageEpic,
  removeShortBarrageEpic,
  removeLongBarrageEpic,
  shineRedEpic
);
$event.subscribe(handler);
rootEpic($event).subscribe(handler);

function addLongBarrageEpic($event) {
  return $event.pipe(
    ofType("add"),
    ofBarrage("wave", "oneHole"),
    mapTo({ type: "remove", barrage: regular })
  );
}
function removeShortBarrageEpic($event) {
  return $event.pipe(
    ofType("remove"),
    ofBarrage("oneHole"),
    mapTo({ type: "add", barrage: regular, till: -1 }),
    delay(500)
  );
}
function removeLongBarrageEpic($event) {
  return $event.pipe(
    ofType("remove"),
    ofBarrage("wave"),
    mapTo({ type: "add", barrage: regular, till: -1 }),
    delay(500)
  );
}
function shineRedEpic($event) {
  return $event.pipe(
    ofType("hit"),
    mapTo({ type: "mapColor", color: [51, 51, 51] }),
    delay(70)
  );
}

function addHandler(evt) {
  barrages.add(evt.barrage, evt.till);
}
function removeHandler(evt) {
  barrages.remove(evt.barrage);
}
function addItemHandler({ item }) {
  items.add(item);
}
function hitHandler({ bullets }) {
  if (character.isInvincible) return
  character.lives -= 1;
  if (character.lives <= 0) {
    character.setStatus('dead')
    character.speechText = ''
    characterSound.play();
    return
  }
  character.setStatus("slow", 2000);
  character.setInvincible(2000);
  listeners.emitEvent({
    type: 'mapColor',
    color: [255, 0, 0]
  })
  
}

function handler(evt) {
  switch (evt.type) {
    case "add":
      return addHandler(evt);
    case "remove":
      return removeHandler(evt);
    case "hit":
      return hitHandler(evt)
    case "mapColor":
      return (mapColor = evt.color);
    case "addItem":
      return addItemHandler(evt);
    default:
      console.log(evt);
  }
}
function combineEpics(...epics) {
  return event$ => merge(...epics.map(epic => epic(event$)));
}

function ofType(...types) {
  return filter(evt => types.includes(evt.type));
}
function ofBarrage(...names) {
  return filter(evt => {
    let name = evt.barrage.name;
    name = name.startsWith("bound ") ? name.split(" ")[1] : name;
    return names.includes(name);
  });
}

// ─────────▄──────────────▄
// ────────▌▒█───────────▄▀▒▌
// ────────▌▒▒▀▄───────▄▀▒▒▒▐
// ───────▐▄▀▒▒▀▀▀▀▄▄▄▀▒▒▒▒▒▐
// ─────▄▄▀▒▒▒▒▒▒▒▒▒▒▒█▒▒▄█▒▐
// ───▄▀▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▀██▀▒▌
// ──▐▒▒▒▄▄▄▒▒▒▒▒▒▒▒▒▒▒▒▒▀▄▒▒▌
// ──▌▒▒▐▄█▀▒▒▒▒▄▀█▄▒▒▒▒▒▒▒█▒▐
// ─▐▒▒▒▒▒▒▒▒▒▒▒▌██▀▒▒▒▒▒▒▒▒▀▄▌
// ─▌▒▀▄██▄▒▒▒▒▒▒▒▒▒▒▒░░░░▒▒▒▒▌
// ─▌▀▐▄█▄█▌▄▒▀▒▒▒▒▒▒░░░░░░▒▒▒▐
// ▐▒▀▐▀▐▀▒▒▄▄▒▄▒▒▒▒▒░░░░░░▒▒▒▒▌
// ▐▒▒▒▀▀▄▄▒▒▒▄▒▒▒▒▒▒░░░░░░▒▒▒▐
// ─▌▒▒▒▒▒▒▀▀▀▒▒▒▒▒▒▒▒░░░░▒▒▒▒▌
// ─▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐
// ──▀▄▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▄▒▒▒▒▌
// ────▀▄▒▒▒▒▒▒▒▒▒▒▄▄▄▀▒▒▒▒▄▀
// ───▐▀▒▀▄▄▄▄▄▄▀▀▀▒▒▒▒▒▄▄▀
// ──▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▀▀
