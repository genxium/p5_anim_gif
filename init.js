var domReady = function(callback) {
  document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};

domReady(function() {
  var canvas = document.getElementById("cvs");
  var p = new Processing(canvas, sketch);
// p.exit(); // To detach it.
});

var sketch = new Processing.Sketch();
sketch.attachFunction = function(processing) {
  function Animator(dirWithSlash, imageNamePrefix, count, ndigits, fps) {
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

    for (let i = 0; i < this.imageCount; i++) {
      // Use nf() to number format 'i' into four digits
      const filename = dirWithSlash + imageNamePrefix + processing.nf(i, ndigits) + ".gif";
      this.images.push(processing.loadImage(filename));
    }

    this.start = function() {
      const ins = this;
      const startedTs = Date.now();
      ins.startedTs = startedTs;
      ins.hasStarted = true;
      const millisPerFrame = parseInt(1000/fps);
      const itv = setInterval(function() {
        const elapsedMs = (Date.now() - startedTs); 
        ins.frame = parseInt(elapsedMs/millisPerFrame); 
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

  // Processingjs script here, and ES6 syntax is supported by built-in polyfill.
  function rocket() {
    this.x = 200;
    this.y = 200;
    this.angleDegrees = 0; // In ProcessingJs, 0 degree is oriented processing.UP.
    this.bodyLength = 50;
    this.bodyHeight = 60;
    this.speed = 1;
    this.setAngle = function(angleDegrees) {
      this.angleDegrees = (0 + angleDegrees);
    }
  }

  const radianPerDegree = (processing.PI / 180);
  const drawRocket = function(rocket) {
    // Translate the origin of coordinate system to the current rocket.
    processing.translate(rocket.x, rocket.y);
    processing.rotate(rocket.angleDegrees * radianPerDegree);

    const translatedAnchorX = 0;
    const translatedAnchorY = 0;
    processing.image(rocketImg, translatedAnchorX, translatedAnchorY, anchorRocket.bodyLength, anchorRocket.bodyHeight);

    // Reset the "accumulated rotation angle" and "accumulated translation".
    processing.rotate(-rocket.angleDegrees * radianPerDegree);
    processing.translate(-rocket.x, -rocket.y);
  };


  var anchorRocket = new rocket();
  var singleAnimator = null;

  processing.setup = function() {
    processing.size(400, 400);
    rocketImg = processing.loadImage("./space/rocket.png");

    processing.imageMode(processing.CENTER);
    anchorRocket.setAngle(0);
    
    setInterval(function() {
      if (!singleAnimator || !singleAnimator.hasStarted || singleAnimator.isStopped) {
        singleAnimator = new Animator("./space/", "explosion", 15, 3, 24);
        singleAnimator.start();
      }
    }, 3000);
  };

  processing.draw = function() {
    processing.background(255, 255, 255);
    drawRocket(anchorRocket);
    if (singleAnimator) {
      singleAnimator.display(anchorRocket.x, anchorRocket.y);
    }
    if (processing.__keyPressed) {
      if (processing.keyCode === processing.UP) {
        anchorRocket.setAngle(0);
        anchorRocket.y = anchorRocket.y - anchorRocket.speed;
      }

      if (processing.keyCode === processing.DOWN) {
        anchorRocket.setAngle(180);
        anchorRocket.y = anchorRocket.y + anchorRocket.speed;
      }

      if (processing.keyCode === processing.LEFT) {
        anchorRocket.setAngle(270);
        anchorRocket.x = anchorRocket.x - anchorRocket.speed;
      }

      if (processing.keyCode === processing.RIGHT) {
        anchorRocket.setAngle(90);
        anchorRocket.x = anchorRocket.x + anchorRocket.speed;
      }
    }
  };
};
