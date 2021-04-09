const refs = {
  startStopBtn: document.querySelector('button[data-action-startStop]'),
  waitBtn: document.querySelector('button[data-action-wait]'),
  resetBtn: document.querySelector('button[data-action-reset]'),
  clockface: document.querySelector('.js-clockface'),
};

let isActive = false;
let isWait = false;
let intervalId = null;
let time = null;
let deltaTime = null;
let waitTime = null;
let clickCount = null;

function start() {
  if (isActive) {
    isWait = false;

    stop();

    return;
  }

  const startTime = Date.now();
  isActive = true;

  intervalId = setInterval(() => {
    const currentTime = Date.now();

    isWait && waitTime
      ? (deltaTime = currentTime - startTime + waitTime)
      : (deltaTime = currentTime - startTime);

    time = getTimeComponents(deltaTime);
    updateClockface(time);
  }, 1000);
}

function stop() {
  clearInterval(intervalId);

  isActive = false;
  isWait = false;

  time = getTimeComponents(0);
  updateClockface(time);
}

function wait() {
  if (clickCount === 1) {
    clearInterval(intervalId);

    isActive = false;
    isWait = true;

    waitTime = deltaTime;

    clickCount = null;
  }

  clickCount += 1;

  setTimeout(() => (clickCount = null), 300);
}

function reset() {
  clearInterval(intervalId);

  isActive = false;
  waitTime = null;

  time = getTimeComponents(0);
  updateClockface(time);

  start();
}

function getTimeComponents(time) {
  const hours = pad(
    Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
  );
  const mins = pad(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
  const secs = pad(Math.floor((time % (1000 * 60)) / 1000));

  return { hours, mins, secs };
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function updateClockface({ hours, mins, secs }) {
  refs.clockface.textContent = `${hours}:${mins}:${secs}`;
}

refs.startStopBtn.addEventListener('click', start);
refs.waitBtn.addEventListener('click', wait);
refs.resetBtn.addEventListener('click', reset);
