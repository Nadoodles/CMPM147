class Shape {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

let topColor = '#EDE2DC';
let bottomColor = '#EDE2DC';
let sun;
let mountainRanges = [];
let maxMountainRanges = 6;
let time = 0; // Time variable for time-lapse effect

function setup() {
  createCanvas(1024, 600);
  colorMode(HSB, 255);

  sun = new Sun(color('#F2B39F'));

  for (let i = 0; i < maxMountainRanges; i++) {
    let baseColor;
    if (i == 0) {
      baseColor = color('#315256');
    }
    if (i < 2) {
      baseColor = color('#76AFC7');
    } else if (i < 4) {
      baseColor = color('#AFC8D7');
    } else {
      baseColor = color('#057C98');
    }
    let mountainRange = new MountainRange(i, baseColor);
    mountainRanges.push(mountainRange);
  }

  smooth();
}

function draw() {
  drawBackground(topColor, bottomColor);

  // Update time for time-lapse effect
  time += 0.01;

  // Update sun position and color
  sun.update();
  sun.draw();

  // Draw mountains with changing colors
  for (let i = 0; i < mountainRanges.length; i++) {
    mountainRanges[i].update(time);
    mountainRanges[i].draw();
  }
}

function drawBackground(top, bottom) {
  background(top);
}

class Sun extends Shape {
  constructor(baseColor) {
    super(0, 0, 100, 100);
    this.baseColor = baseColor;
    this.fillColor = this.baseColor;
    this.x = random(width);
    this.y = random(height * 0.1, height * 0.3);
    this.direction = random([-1, 1]); // Direction of horizontal movement
    this.speed = random(1, 3); // Speed of horizontal movement
  }

  update() {
    // Move the sun horizontally
    this.x += this.direction * this.speed;

    // Wrap around to the opposite side when reaching the edge
    if (this.x < -this.width / 2) {
      this.x = width + this.width / 2;
    } else if (this.x > width + this.width / 2) {
      this.x = -this.width / 2;
    }
  }

  draw() {
    noStroke();
    fill(this.fillColor);
    ellipse(this.x, this.y, this.width, this.height);
  }
}

class MountainRange extends Shape {
  constructor(zIndex, baseColor) {
    super(0, 0, 0, 0);
    this.baseColor = baseColor;
    this.fillColor = this.baseColor;
    this.startNoise = random(0, width / 2);
    this.endNoise = this.startNoise + random(5, 30);
    this.zIndex = zIndex;
    this.speed = random(0.001, 0.005); // Adjust speed as needed
  }

  update() {
    // Shift mountains from left to right
    this.startNoise += this.speed;
    this.endNoise += this.speed;

    // Generate more mountains over time
    if (this.endNoise >= width + 20) {
      this.startNoise = random(0, width / 2);
      this.endNoise = this.startNoise + random(5, 30);
    }

    // Change mountain color over time
    let alpha = map(this.zIndex, 0, maxMountainRanges - 1, 255, 100); // Adjust alpha based on zIndex
    this.fillColor = color(hue(this.baseColor), saturation(this.baseColor), brightness(this.baseColor), alpha);
  }

  draw() {
    fill(this.fillColor);
    beginShape();
    vertex(-20, height);
    for (let x = 1; x < width + 20; x++) {
      let nx = map(x, 0, width, this.startNoise, this.endNoise);
      let y = height * noise(nx);
      vertex(x, height - y);
    }
    vertex(width + 21, height);
    endShape();
  }
}
