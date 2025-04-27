/* main.js */
import { Stopwatch } from './stopwatch.js';
import { Timer } from './timer.js';

const display = document.querySelector('.display');
const startBtn = document.getElementById('start-stop');
const lapBtn = document.getElementById('lap');
const resetBtn = document.getElementById('reset');
const inputsDiv = document.querySelector('.time-inputs');
const [inputH, inputM, inputS] = [
  document.getElementById('hours'),
  document.getElementById('minutes'),
  document.getElementById('seconds')
];
const modeStopwatchBtn = document.getElementById('mode-stopwatch');
const modeTimerBtn = document.getElementById('mode-timer');
const lapsList = document.querySelector('.laps');
const progressBar = document.querySelector('.progress');
const themeToggle = document.getElementById('theme-toggle');
const alarmAudio = document.getElementById('alarm-audio');

let mode = localStorage.getItem('mode') || 'stopwatch';
let stopwatch = new Stopwatch(updateDisplay);
let timer = new Timer(updateDisplay, onTimerComplete);
let duration = 0;
let laps = JSON.parse(localStorage.getItem('laps') || '[]');

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateDisplay(ms) {
  display.textContent = formatTime(ms);
  if (mode === 'timer') {
    const pct = duration ? ((duration - ms) / duration) * 100 : 0;
    progressBar.style.width = pct + '%';
  } else {
    progressBar.style.width = '0%';
  }
}

function onTimerComplete() {
  alarmAudio.play();
  if (Notification.permission === 'granted') new Notification('⏰ Время вышло!');
  startBtn.textContent = 'Старт';
  lapBtn.disabled = true;
}

function saveState() {
  localStorage.setItem('mode', mode);
  localStorage.setItem('hours', inputH.value);
  localStorage.setItem('minutes', inputM.value);
  localStorage.setItem('seconds', inputS.value);
  localStorage.setItem('laps', JSON.stringify(laps));
}

function loadState() {
  if (localStorage.getItem('hours')) inputH.value = localStorage.getItem('hours');
  if (localStorage.getItem('minutes')) inputM.value = localStorage.getItem('minutes');
  if (localStorage.getItem('seconds')) inputS.value = localStorage.getItem('seconds');
  laps.forEach(t => addLapItem(t));
}

function setMode(m) {
  mode = m;
  if (mode === 'stopwatch') {
    modeStopwatchBtn.classList.add('active');
    modeTimerBtn.classList.remove('active');
    inputsDiv.style.display = 'none';
    lapBtn.disabled = false;
    timer.reset();
  } else {
    modeTimerBtn.classList.add('active');
    modeStopwatchBtn.classList.remove('active');
    inputsDiv.style.display = 'flex';
    lapBtn.disabled = true;
    stopwatch.reset();
  }
  resetAll();
  saveState();
}

modeStopwatchBtn.addEventListener('click', () => setMode('stopwatch'));
modeTimerBtn.addEventListener('click', () => setMode('timer'));

startBtn.addEventListener('click', () => {
  if (mode === 'stopwatch') {
    if (stopwatch.running) { stopwatch.pause(); startBtn.textContent = 'Старт'; }
    else { stopwatch.start(); startBtn.textContent = 'Пауза'; }
  } else {
    if (!timer.running) {
      if (duration === 0) {
        const h = parseInt(inputH.value) || 0;
        const m = parseInt(inputM.value) || 0;
        const s = parseInt(inputS.value) || 0;
        duration = (h * 3600 + m * 60 + s) * 1000;
        timer.set(duration);
      }
      timer.start(); startBtn.textContent = 'Пауза';
    } else {
      timer.pause(); startBtn.textContent = 'Старт';
    }
  }
  toggleInputs();
});

lapBtn.addEventListener('click', () => {
  if (mode === 'stopwatch') {
    laps.unshift(stopwatch.elapsed);
    addLapItem(stopwatch.elapsed);
    saveState();
  }
});

resetBtn.addEventListener('click', resetAll);

function resetAll() {
  stopwatch.reset(); timer.reset();
  startBtn.textContent = 'Старт'; lapBtn.disabled = (mode === 'timer');
  duration = 0; laps = [];
  lapsList.innerHTML = '';
  inputH.value = inputM.value = inputS.value = '';
  progressBar.style.width = '0%';
  saveState();
  toggleInputs(true);
}

function toggleInputs(forceEnable = false) {
  const running = stopwatch.running || timer.running;
  [...inputsDiv.querySelectorAll('input')].forEach(i => i.disabled = running && !forceEnable);
}

function addLapItem(ms) {
  const li = document.createElement('li');
  li.textContent = formatTime(ms);
  lapsList.appendChild(li);
}

[inputH, inputM, inputS].forEach((input, idx, arr) => {
  input.addEventListener('wheel', e => {
    e.preventDefault();
    let val = parseInt(input.value) || 0;
    val += e.deltaY < 0 ? 1 : -1;
    const min = parseInt(input.min), max = parseInt(input.max);
    if (val < min) val = max; if (val > max) val = min;
    input.value = val;
    saveState();
  });
  input.addEventListener('input', () => {
    let val = parseInt(input.value) || 0;
    const min = parseInt(input.min), max = parseInt(input.max);
    if (val < min) val = min; if (val > max) val = max;
    input.value = val;
    if (input.value.length === 2 && arr[idx + 1]) arr[idx + 1].focus();
    saveState();
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') startBtn.click();
  });
});

document.addEventListener('keydown', e => {
  if (e.code === 'Space' && !['INPUT', 'BUTTON'].includes(document.activeElement.tagName)) {
    e.preventDefault(); startBtn.click();
  }
});

const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const t = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
});

if (Notification.permission === 'default') Notification.requestPermission();
setMode(mode);
loadState();
