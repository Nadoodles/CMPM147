"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
    keyPressed
*/

let worldSeed;
let characterPosition;
let characterColor;
let spheres = [];
let steveImage;


function p3_preload() {
  steveImage = loadImage("https://cdn.glitch.global/294d2e48-919d-480f-a1e2-f5c11009c1df/steve.jpeg?v=1714507907035");
}

function p3_setup() {
  characterPosition = createVector(0, 0); // Initialize character position
  characterColor = color(255, 182, 193); // Pink color for the character
}

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}

function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  if (XXH.h32("tile:" + key, worldSeed) % 4 == 0) { // Check if the tile is brown
    clicks[key] = 1 + (clicks[key] | 0);
  }
}


function p3_drawBefore() {
}

const HILL_THRESHOLD = 0.41;
const VALLEY_THRESHOLD = 0.65;
const FOREST_THRESHOLD = 0.75;
const WATER_THRESHOLD = 0.48; 
const LAVA_THRESHOLD = 0.95; 

function p3_drawTile(i, j) {
  

  noStroke();
  

  let noiseValue = noise(i * 0.1, j * 0.1);

  let terrainHeight = map(noiseValue, 0, HILL_THRESHOLD, 0, 100); // Adjust the height range as needed

  if (noiseValue < HILL_THRESHOLD) {
    fill(139, 69, 19); // Brown color for hills
  }  
  else if (noiseValue < WATER_THRESHOLD) {
    fill(115, 155, 208); // Blue color for water
  }
  else if (noiseValue < VALLEY_THRESHOLD) {
    fill(0, 128, 0); // Green color for valleys
  } else if (noiseValue < FOREST_THRESHOLD) {
    fill(34, 139, 34); // Dark green color for forests
  }  else if (noiseValue < LAVA_THRESHOLD) {
    fill(255, 0, 0); // Red color for lava
  }
  else {
    fill(205, 133, 63); // Plains color
  }
  
  

  // Draw the tile shape with height based on the noise value
  push();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th - terrainHeight); // Adjust the terrain height
  vertex(tw, 0);
  vertex(0, -th + terrainHeight); // Adjust the terrain height
  endShape(CLOSE);
  pop();
  
  
}




function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {
  // Camera movement
  translate(-characterPosition.x + width / 2, -characterPosition.y + height / 2);

  // Check if the character is over lava
  let noiseValue = noise(characterPosition.x * 0.1, characterPosition.y * 0.1);
  if (noiseValue >= LAVA_THRESHOLD) {
    // Bring the character back to the start
    characterPosition = createVector(0, 0);
  }

  // Draw the brown square on top
  fill(139, 69, 19); // Brown color for the top square
  rectMode(CENTER);
  rect(characterPosition.x, characterPosition.y - 20, 20, 20); // Adjust position and size as needed

  // Draw the light blue square in the middle
  fill(115, 155, 208); // Light blue color for the middle square
  rect(characterPosition.x, characterPosition.y, 20, 20); // Adjust position and size as needed

  // Draw the purple square at the bottom
  fill(128, 0, 128); // Purple color for the bottom square
  rect(characterPosition.x, characterPosition.y + 20, 20, 20); // Adjust position and size as needed
}



function keyPressed() {
  // Move character based on arrow key presses
  const step = 5; // Step size for character movement

  if (keyCode === UP_ARROW) {
    characterPosition.y -= step;
  } else if (keyCode === DOWN_ARROW) {
    characterPosition.y += step;
  } else if (keyCode === LEFT_ARROW) {
    characterPosition.x -= step;
  } else if (keyCode === RIGHT_ARROW) {
    characterPosition.x += step;
  }
}

function mousePressed() {
  // Convert mouse coordinates to tile indices
  let i = floor((mouseX - width / 2 + characterPosition.x) / tw);
  let j = floor((mouseY - height / 2 + characterPosition.y) / th);

  // Check if the clicked tile is a plain terrain
  let noiseValue = noise(i * 0.1, j * 0.1);
  if (noiseValue >= FOREST_THRESHOLD && noiseValue < WATER_THRESHOLD) {
    // If it's a plain, place a red sphere at the clicked location
    let x = i * tw + tw / 2;
    let y = j * th + th / 2;
    // Assuming you have a `spheres` array to store the positions of red spheres
    spheres.push(createVector(x, y));
  }
}

