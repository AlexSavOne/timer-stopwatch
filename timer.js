/* timer.js */
export class Timer {
  constructor(onUpdate, onComplete) {
    this.timeLeft = 0;
    this.running = false;
    this.onUpdate = onUpdate;
    this.onComplete = onComplete;
    this._endTime = 0;
    this._raf = null;
  }
  set(ms) {
    this.timeLeft = ms;
    this.onUpdate(this.timeLeft);
  }
  start() {
    if (!this.running && this.timeLeft > 0) {
      this.running = true;
      this._endTime = performance.now() + this.timeLeft;
      this._loop();
    }
  }
  _loop() {
    this.timeLeft = this._endTime - performance.now();
    if (this.timeLeft <= 0) {
      this.running = false;
      this.timeLeft = 0;
      this.onUpdate(this.timeLeft);
      this.onComplete();
    } else {
      this.onUpdate(this.timeLeft);
      this._raf = requestAnimationFrame(() => this._loop());
    }
  }
  pause() {
    this.running = false;
    cancelAnimationFrame(this._raf);
  }
  reset() {
    this.pause();
    this.timeLeft = 0;
    this.onUpdate(this.timeLeft);
  }
}
