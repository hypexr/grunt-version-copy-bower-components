(function(name, definition) {
  var hasDefine = typeof define === 'function',
      hasExports = typeof module !== 'undefined' && module.exports;

  if (hasDefine) {
    define(name, definition);
  } else if (hasExports) {
    module.exports = definition();
  } else {
    this[name] = definition();
  };

}('Timer', function() {
  'use strict';

  /**
   * Simple timer to schedule callback execution.
   *
   * @param {function} callback The function that will be called when after delay
   * @param {number} delay The time in milliseconds after which callback called
   */
  function Timer(callback, delay) {
    // Keep reference to internal timer, so we can cancel or reset the execution
    // of the scheduled callback at any time.
    this._timer;

    this.start;
    this.callback = callback;
    this.remaining = this.delay = delay;
    this.paused = false;

    this.resume();
  };

  /**
   * Pause the timer
   */
  Timer.prototype.pause = function() {
    if (!this.paused) {
      this.stop();
      this.remaining -= new Date - this.start;
      this.paused = true;
    };

    // Returns current instance to allow chaining
    return this;
  };

  /**
   * Resume the timer
   */
  Timer.prototype.resume = function() {
    this.start = new Date;
    this._timer = setTimeout(this.callback, this.remaining);
    this.paused = false;

    // Returns current instance to allow chaining
    return this;
  };

  /**
   * Restart timer and scheduled callback
   */
  Timer.prototype.restart = function() {
    this.stop();
    this.resume();

    // Returns current instance to allow chaining
    return this;
  };

  /**
   * Stop timer. Stop execution of all scheduled callbacks.
   */
  Timer.prototype.stop = function() {
    clearTimeout(this._timer);
    this.remaining = this.delay;

    // Returns current instance to allow chaining
    return this;
  };

  return Timer;

}));
