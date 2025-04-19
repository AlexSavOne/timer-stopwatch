let timerInterval;
let elapsedTime = 0;
let timeLeft = 0;
let isRunning = false;
let mode = 'stopwatch';

const display = document.querySelector('.display');
const startStopButton = document.getElementById('start-stop');
const resetButton = document.getElementById('reset');
const inputH = document.getElementById('hours');
const inputM = document.getElementById('minutes');
const inputS = document.getElementById('seconds');
const modeStopwatchBtn = document.getElementById('mode-stopwatch');
const modeTimerBtn = document.getElementById('mode-timer');
const inputs = document.querySelector('.time-inputs');

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateDisplay() {
  const time = mode === 'timer' ? timeLeft : elapsedTime;
  display.textContent = formatTime(time);
}

startStopButton.addEventListener('click', () => {
  if (isRunning) {
    clearInterval(timerInterval);
    startStopButton.textContent = 'Старт';
  } else {
    if (mode === 'timer') {
      if (timeLeft <= 0) {
        const h = parseInt(inputH.value) || 0;
        const m = parseInt(inputM.value) || 0;
        const s = parseInt(inputS.value) || 0;
        timeLeft = (h * 3600 + m * 60 + s) * 1000;
        updateDisplay();
      }

      const endTime = Date.now() + timeLeft;
      timerInterval = setInterval(() => {
        timeLeft = endTime - Date.now();
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          timeLeft = 0;
          updateDisplay();
          alert('⏰ Время вышло!');
          startStopButton.textContent = 'Старт';
          isRunning = false;
        } else {
          updateDisplay();
        }
      }, 200);
    } else {
      const startTime = Date.now() - elapsedTime;
      timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        updateDisplay();
      }, 100);
    }

    startStopButton.textContent = 'Пауза';
  }

  isRunning = !isRunning;
});

resetButton.addEventListener('click', () => {
  clearInterval(timerInterval);
  if (mode === 'timer') {
    timeLeft = 0;
  } else {
    elapsedTime = 0;
  }
  updateDisplay();
  startStopButton.textContent = 'Старт';
  isRunning = false;
});

modeStopwatchBtn.addEventListener('click', () => {
  mode = 'stopwatch';
  modeStopwatchBtn.classList.add('active');
  modeTimerBtn.classList.remove('active');
  inputs.style.display = 'none';
  resetAll();
});

modeTimerBtn.addEventListener('click', () => {
  mode = 'timer';
  modeTimerBtn.classList.add('active');
  modeStopwatchBtn.classList.remove('active');
  inputs.style.display = 'flex';
  resetAll();
});

function resetAll() {
  clearInterval(timerInterval);
  isRunning = false;
  elapsedTime = 0;
  timeLeft = 0;
  startStopButton.textContent = 'Старт';
  inputH.value = '';
  inputM.value = '';
  inputS.value = '';
  updateDisplay();
}

inputs.style.display = 'none';
updateDisplay();
