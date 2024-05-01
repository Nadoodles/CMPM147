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
*/

function p3_preload() {}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 5;
}
function p3_tileHeight() {
  return 5;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();

  let hash = XXH.h32("tile:" + [i, j], worldSeed) % 7;

  switch (hash) {
    case 0:
      fill(255, 255, 0); // Yellow
      break;
    case 1:
      fill(255, 0, 0); // Red
      break;
    case 2:
      fill(0, 230, 255); // Blue
      break;
    case 3:
      fill(255, 105, 180); // Pink
      break;
    case 4:
      fill(255, 255, 255); // White
      break;
    case 5:
      fill(0, 255, 0); // Green
      break;
    case 6:
      fill(0, 0, 0); // Black
      break;
    default:
      fill(255); // Default color (white)
  }
  
  let tvVert = sin(frameCount * 0.1 + i * 1.3 + j * 1.5);
  
  // Creates TV static effect
  let tvHori = tan(frameCount * 0.1 + i * 1.3 + j * 1.3);
  translate(tvVert, tvHori);

  push();

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    fill(0, 0, 0, 32);
    ellipse(0, 0, 10, 5);
    translate(0, -10);
    fill(255, 255, 100, 128);
    ellipse(0, 0, 10, 10);
  }

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

function p3_drawAfter() {}
