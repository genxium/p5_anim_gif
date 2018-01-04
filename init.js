var domReady = function(callback) {
  document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};

domReady(function() {
  var canvas = document.getElementById("cvs");
  var p = new Processing(canvas, sketch);
// p.exit(); // To detach it.
});

function Rocket(imgRef) {
  this.x = 200;
  this.y = 200;
  this.angleDegrees = 0; // In ProcessingJs, 0 degree is oriented processing.UP.
  this.bodyLength = 50;
  this.bodyHeight = 60;
  this.speed = 4;
  this.imgRef = imgRef;
  this.setAngle = function(angleDegrees) {
    this.angleDegrees = angleDegrees;
  }
}

var drawRocket = function(processing, rocket) {
  var radianPerDegree = (processing.PI / 180);
  // Translate the origin of coordinate system to the current rocket.
  processing.translate(rocket.x, rocket.y);
  processing.rotate(rocket.angleDegrees * radianPerDegree);

  var translatedAnchorX = 0;
  var translatedAnchorY = 0;
  processing.image(rocket.imgRef, translatedAnchorX, translatedAnchorY, rocket.bodyLength, rocket.bodyHeight);

  // Reset the "accumulated rotation angle" and "accumulated translation".
  processing.rotate(-rocket.angleDegrees * radianPerDegree);
  processing.translate(-rocket.x, -rocket.y);
};

Window.prototype.Rocket = Rocket;

function initRocketControls(processing, rocket) {
  if (!processing.__keyPressed) return;
  if (processing.keyCode === processing.UP) {
    rocket.setAngle(0);
    rocket.y = rocket.y - rocket.speed;
  }

  if (processing.keyCode === processing.DOWN) {
    rocket.setAngle(180);
    rocket.y = rocket.y + rocket.speed;
  }

  if (processing.keyCode === processing.LEFT) {
    rocket.setAngle(270);
    rocket.x = rocket.x - rocket.speed;
  }

  if (processing.keyCode === processing.RIGHT) {
    rocket.setAngle(90);
    rocket.x = rocket.x + rocket.speed;
  }
}

Window.prototype.initRocketControls = initRocketControls;

var sketch = new Processing.Sketch();
Window.prototype.sketch = sketch;
