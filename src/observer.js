const { Observable, merge, Subject } = rxjs;
const { mapTo, filter, delay } = rxjs.operators;

const rootEpic = combineEpics(
  addLongBarrageEpic,
  removeShortBarrageEpic,
  removeLongBarrageEpic,
  shineRedEpic,
);

const $eventEmitter = new Subject();
function dispatch(evt) {
  $eventEmitter.next(evt);
}
const observer = {
  next: handler,
};
$eventEmitter.subscribe(observer);
rootEpic($eventEmitter).subscribe(observer);

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
function shineRedEpic($event) {
  return $event.pipe(
    ofType('hit'),
    mapTo({ type: 'mapColor', color: 'black' }),
    delay(70),
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
    case 'hit':
      return (mapColor = [255, 0, 0]);
    case 'mapColor':
      return (mapColor = [51, 51, 51]);
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
