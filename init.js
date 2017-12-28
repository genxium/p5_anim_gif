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
  // Processingjs script here, and ES6 syntax is supported by built-in polyfill.
  function rocket() {
    this.x = 200;
    this.y = 200;
    this.angleDegrees = 0; // In ProcessingJs, 0 degree is oriented processing.UP.
    this.bodyLength = 50;
    this.bodyHeight = 60;
    this.speed = 4;
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
    processing.size(screen.width, screen.height);
    rocketImg = processing.loadImage("./space/rocket.png");

    processing.imageMode(processing.CENTER);
    anchorRocket.setAngle(0);
    
    setInterval(function() {
      if (!singleAnimator || !singleAnimator.hasStarted || singleAnimator.isStopped) {
        singleAnimator = new Animator(processing, "./space/", "explosion", 15, 3, 24);
        singleAnimator.start(anchorRocket.x, anchorRocket.y);
      }
    }, 3000);
  };

  processing.draw = function() {
    processing.background(255, 255, 255);
    drawRocket(anchorRocket);
    if (singleAnimator) {
      singleAnimator.display();
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
