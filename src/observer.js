const { Observable, of, empty, interval } = rxjs;
const { mapTo, filter, delay, endWith, mergeMap, takeUntil } = rxjs.operators;

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
addBarrageEpic($event).subscribe(handler);
removeBarrageEpic($event).subscribe(handler);

function addBarrageEpic($event) {
  return $event.pipe(
    filter(evt => evt.type === 'add' && evt.barrage !== regular),
    mapTo({ type: 'remove', barrage: regular }),
  );
}
function removeBarrageEpic($event) {
  return $event.pipe(
    filter(evt => evt.type === 'remove' && evt.barrage !== regular),
    mapTo({ type: 'add', barrage: regular }),
  );
}

function addHandler(evt) {
  console.log('add', evt.barrage);
}
function removeHandler(evt) {
  console.log('remove', evt.barrage);
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
