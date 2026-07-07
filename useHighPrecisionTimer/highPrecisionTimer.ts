
import type { optionsType } from "./hp-time"
class HighPrecisionTimer {
  options: optionsType;
  isRunning: boolean;
  startTime: number;
  pausedTime: number;
  animationFrameId: number | null;
  remaining: number;
  constructor(options: optionsType) {
    this.options = options;
    this.isRunning = false;
    this.startTime = 0;
    this.pausedTime = 0;
    this.animationFrameId = null;
    this.remaining = options.duration || 0;
  }

  start() {
    if (this.isRunning) return;

    if (this.pausedTime > 0) {
      this.startTime = performance.now() - (this.remaining - this.pausedTime);
    } else {
      this.startTime = performance.now();
    }

    this.isRunning = true;
    this._update();
  }

  pause() {
    if (!this.isRunning) return;

    this.isRunning = false;
    this.pausedTime = this.remaining;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  reset() {
    this.isRunning = false;
    this.startTime = 0;
    this.pausedTime = 0;
    this.remaining = this.options.duration || 0;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.options.onUpdate) {
      this.options.onUpdate(this.remaining);
    }
  }

  _update() {
    if (!this.isRunning) return;

    const elapsed = performance.now() - this.startTime;
    this.remaining = Math.max(0, (this.options.duration || 0) - elapsed);

    if (this.options.onUpdate) {
      this.options.onUpdate(this.remaining);
    }

    if (this.remaining <= 0) {
      this.isRunning = false;
      if (this.options.onEnd) {
        this.options.onEnd();
      }
      return;
    }

    this.animationFrameId = requestAnimationFrame(() => this._update());
  }
}

export default HighPrecisionTimer;
