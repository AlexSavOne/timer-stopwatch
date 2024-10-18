let timerInterval;
let elapsedTime = 0;
let isRunning = false;

const display = document.querySelector('.display');
const startStopButton = document.getElementById('start-stop');
const resetButton = document.getElementById('reset');

function formatTime(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateDisplay() {
  display.textContent = formatTime(elapsedTime);
}

startStopButton.addEventListener('click', () => {
  if (isRunning) {
    clearInterval(timerInterval);
    startStopButton.textContent = 'Старт';
  } else {
    const startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      updateDisplay();
    }, 100);
    startStopButton.textContent = 'Пауза';
  }
  isRunning = !isRunning;
});

resetButton.addEventListener('click', () => {
  clearInterval(timerInterval);
  elapsedTime = 0;
  updateDisplay();
  startStopButton.textContent = 'Старт';
  isRunning = false;
});
