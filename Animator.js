function Animator(processing, dirWithSlash, imageNamePrefix, count, ndigits, fps) {
  this.fps = fps;
  if (undefined === this.fps || null === this.fps) {
    this.fps = 24;
  }
  this.frame = 0;
  this.imageCount = count;
  this.images = [];
  this.hasStarted = false;
  this.isStopped = false;
  this.startedTs = null;
  this.cx = null;
  this.cy = null;

  for (let i = 0; i < this.imageCount; i++) {
    // Use nf() to number format 'i' into four digits
    const filename = dirWithSlash + imageNamePrefix + processing.nf(i, ndigits) + ".gif";
    this.images.push(processing.loadImage(filename));
  }

  this.start = function(cx, cy) {
    const ins = this;
    const startedTs = Date.now();
    ins.startedTs = startedTs;
    ins.hasStarted = true;
    if (undefined !== cx && null !== cx && undefined !== cy && null !== cy) {
      this.cx = cx;
      this.cy = cy;
    }
    const millisPerFrame = parseInt(1000 / fps);
    const itv = setInterval(function() {
      const elapsedMs = (Date.now() - startedTs);
      ins.frame = parseInt(elapsedMs / millisPerFrame);
      if (ins.frame >= ins.imageCount) {
        ins.isStopped = true;
        clearInterval(itv);
      }
    }, millisPerFrame);
  };

  this.display = function(cx, cy) {
    const ins = this;
    if (ins.isStopped) {
      return;
    }
    if (undefined === ins.startedTs || null === ins.startedTs) {
      return;
    }
    if (ins.frame >= ins.imageCount) {
      // Redundant ensurance.
      return;
    }
    if (undefined === cx || null === cx) {
      cx = this.cx;
    }
    if (undefined === cy || null === cy) {
      cy = this.cy;
    }
    // W.r.t. current origin.
    processing.imageMode(processing.CENTER);
    processing.translate(cx, cy);
    processing.image(ins.images[ins.frame], 0, 0);
    processing.translate(-cx, -cy);
  };

  this.getWidth = function() {
    return this.images[0].width;
  };
}

Window.prototype.Animator = Animator;
