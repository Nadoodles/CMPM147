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
let cloudPosition;
let characterColor;

function p3_preload() {
  
}

function p3_setup() {
  cloudPosition = createVector(10, 10); // Initialize character position
  noStroke();
  characterColor = color(255, 255, 255); // Pink color for the character
}

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 8;
}

function p3_tileHeight() {
  return 8;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  if (XXH.h32("tile:" + key, worldSeed) % 4 == 0) { // Check if the tile is brown
    clicks[key] = 1 + (clicks[key] | 0);
  }
}

function p3_drawBefore() {}

const LAVA_THRESHOLD = 0.2;
const VOLCANO_THRESHOLD = 0.25;
const STONE_THRESHOLD = 0.3;
const ISLAND_THRESHOLD = 0.4; 
const SHALLOW_THRESHOLD = 0.55;

function p3_drawTile(i, j) {

  let noiseValue = noise(i * 0.1, j * 0.1);

  if (noiseValue < LAVA_THRESHOLD) {
    noStroke();
    fill(255, random(255), 19); 
  } else if (noiseValue < VOLCANO_THRESHOLD) {
    strokeWeight(2);
    stroke(90, 90, 90);
    fill(90, 90, 90); 
  } else if (noiseValue < STONE_THRESHOLD) {
    strokeWeight(2);
    stroke(130, 130, 34);
    fill(130, 130, 34); 
  } else if (noiseValue < ISLAND_THRESHOLD) {
    strokeWeight(2);
    stroke(130, 255, 34);
    fill(130, 255, 34);
  } else if (noiseValue < SHALLOW_THRESHOLD) {
    fill(30, 160, 255)
  }
  else {
    noStroke();
    fill(30, 130, 255); // Black color
  }
  // Moves ocean up and down, (follows a sin() graph)
  let oceanVert = sin(frameCount * 0.1 + i * 1.3 + j * 1.3);
  
  // Moves ocean side to side, (follows a cos() graph)
  let oceanHori = cos(frameCount * 0.1 + i * 1.3 + j * 1.3);
  translate(oceanHori, oceanVert);
  
  // Draw the tile shape
  push();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
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
}

function mousePressed() {
  // Convert mouse coordinates to tile indices
  let i = floor((mouseX - width / 2 + cloudPosition.x) / tw);
  let j = floor((mouseY - height / 2 + cloudPosition.y) / th);

  // Check if the clicked tile is a plain terrain
  let noiseValue = noise(i * 0.1, j * 0.1);
  if (noiseValue >= FOREST_THRESHOLD && noiseValue < ICE_THRESHOLD) {
    // If it's a plain, place a red sphere at the clicked location
    let x = i * tw + tw / 2;
    let y = j * th + th / 2;
    spheres.push(createVector(x, y));
  }
}
