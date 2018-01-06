function AnimatorManager(processing, dirWithSlash) {
  this.cache = {};
  this.processing = processing;
  this.dirWithSlash = dirWithSlash;

  this.lazyStart = function(key, imageNamePrefix, count, ndigits, fps, offsetInOrientation, width, height, cx, cy, orientationDegrees, scheduledRepeatedly, maxDurationMillis, excludeStopped) {
    var singleAnimator = this.cache[key];
    if (!singleAnimator) {
      singleAnimator = new Animator(this.processing, this.dirWithSlash, imageNamePrefix, count, ndigits, fps, offsetInOrientation, width, height);
      this.cache[key] = singleAnimator;
    } 
    if (singleAnimator.isStopped && true == excludeStopped) {
      return;
    }
    if (!singleAnimator.hasStarted || singleAnimator.isStopped) {
      singleAnimator.start(cx, cy, orientationDegrees, scheduledRepeatedly, maxDurationMillis);
    }
  }

  this.lazyStop = function(key) {
    var singleAnimator = this.cache[key];
    if (!singleAnimator) return;
    singleAnimator.stop();
  }

  this.lazyDisplay = function(key, cx, cy, orientationDegrees) {
    var singleAnimator = this.cache[key];
    if (!singleAnimator) {
      console.log("Missing cached animator to display for key " + key + "!");
      return;
    }
    singleAnimator.display(cx, cy, orientationDegrees);
  }
}

Window.prototype.AnimatorManager = AnimatorManager;
