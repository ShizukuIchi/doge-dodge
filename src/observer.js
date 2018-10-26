const { Observable, of, empty, interval } = rxjs;
const {
  mapTo,
  map,
  filter,
  delay,
  endWith,
  mergeMap,
  takeUntil,
} = rxjs.operators;

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

$event.subscribe(handler);
addLongBarrageEpic($event).subscribe(handler);
removeShortBarrageEpic($event).subscribe(handler);
removeLongBarrageEpic($event).subscribe(handler);

function addLongBarrageEpic($event) {
  return $event.pipe(
    ofType('add'),
    ofBarrage('wave', 'oneHole'),
    mapTo({ type: 'remove', barrage: regular }),
  );
}
function removeShortBarrageEpic($event) {
  return $event.pipe(
    ofType('remove'),
    ofBarrage('oneHole'),
    mapTo({ type: 'add', barrage: regular, till: -1 }),
    delay(500),
  );
}
function removeLongBarrageEpic($event) {
  return $event.pipe(
    ofType('remove'),
    ofBarrage('wave'),
    mapTo({ type: 'add', barrage: regular, till: -1 }),
    delay(500),
  );
}

function addHandler(evt) {
  barrages.add(evt.barrage, evt.till);
}
function removeHandler(evt) {
  barrages.remove(evt.barrage);
}

function handler(evt) {
  switch (evt.type) {
    case 'add':
      return addHandler(evt);
    case 'remove':
      return removeHandler(evt);
    default:
      console.log(evt);
  }
}

function ofType(...types) {
  return filter(evt => types.includes(evt.type));
}
function notOfBarrage(name) {
  return filter(evt => evt.barrage.name !== name);
}
function ofBarrage(...names) {
  return filter(evt => {
    let name = evt.barrage.name;
    name = name.startsWith('bound ') ? name.split(' ')[1] : name;
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
