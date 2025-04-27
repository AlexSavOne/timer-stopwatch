/* stopwatch.js */
export class Stopwatch {
  constructor(onUpdate) {
    this.elapsed = 0;
    this.running = false;
    this.onUpdate = onUpdate;
    this._startTime = 0;
    this._raf = null;
  }
  start() {
    if (!this.running) {
      this.running = true;
      this._startTime = performance.now() - this.elapsed;
      this._loop();
    }
  }
  _loop() {
    this.elapsed = performance.now() - this._startTime;
    this.onUpdate(this.elapsed);
    if (this.running) this._raf = requestAnimationFrame(() => this._loop());
  }
  pause() {
    this.running = false;
    cancelAnimationFrame(this._raf);
  }
  reset() {
    this.pause();
    this.elapsed = 0;
    this.onUpdate(this.elapsed);
  }
}
