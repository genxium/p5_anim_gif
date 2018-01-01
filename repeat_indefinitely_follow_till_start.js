sketch.attachFunction = function(processing) {
  // Processingjs script here, and ES6 syntax is supported by built-in polyfill.

  var anchorRocket = null;
  var singleAnimator = null;

  processing.setup = function() {
    processing.size(screen.width, screen.height);
    rocketImg = processing.loadImage("./space/rocket.png");
    anchorRocket = new Rocket(rocketImg);

    processing.imageMode(processing.CENTER);
    
    setInterval(function() {
      if (!singleAnimator || !singleAnimator.hasStarted || singleAnimator.isStopped) {
        singleAnimator = new Animator(processing, "./space/", "explosion", 15, 3, 24, -150);
        singleAnimator.start(anchorRocket.x, anchorRocket.y, anchorRocket.angleDegrees + 180);
      }
    }, 1000);
  };

  processing.draw = function() {
    processing.background(255, 255, 255);
    drawRocket(processing, anchorRocket);
    if (singleAnimator) {
      singleAnimator.display();
    }
    initRocketControls(processing, anchorRocket);
  };
};
