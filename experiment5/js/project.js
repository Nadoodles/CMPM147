/* exported getInspirations, initDesign, renderDesign, mutateDesign */

function getInspirations() {
  return [
    { name: "messi-world-cup", assetUrl: "https://cdn.glitch.global/c5572afc-abee-4cfc-89f9-1ad807538cac/messi.jpeg?v=1714799580354" },
    { name: "straw-hat-pirates", assetUrl: "https://cdn.glitch.global/c5572afc-abee-4cfc-89f9-1ad807538cac/strawhats.png?v=1714899624508" },
    { name: "sen-vs-100t", assetUrl: "https://cdn.glitch.global/c5572afc-abee-4cfc-89f9-1ad807538cac/senvs100t.jpg?v=1714899853695" },
  ];
}

function initDesign(inspiration) {
  resizeCanvas(inspiration.image.width / 4, inspiration.image.height / 4);
  let circles = [];
  let diameter = 20; // Initial diameter of circles
  let padding = 40; // Padding between circles

  // Loop through the width and height of the canvas
  for (let x = 0; x < inspiration.image.width; x += diameter + padding) {
    for (let y = 0; y < inspiration.image.height; y += diameter + padding) {
      // Sample color from the image at the current position
      let imageColor = inspiration.image.get(x, y);
      // Create a circle with the sampled color
      circles.push({ x: x * 0.25, y: y * 0.25, diameter: diameter, color: imageColor });
    }
  }

  return { circles: circles };
}


function renderDesign(design, inspiration) {
  randomSeed(0);
  image(inspiration.image, 0, 0, width, height);

  for (let circle of design.circles) {
    fill(circle.color); // Set the fill color to the sampled color
    ellipse(circle.x, circle.y, circle.diameter);
  }
}

function mutateDesign(design, inspiration, rate) {
  for (let circle of design.circles) {
    // Randomly mutate circle position within the canvas bounds
    circle.x = mut(circle.x, 0, width, rate);
    circle.y = mut(circle.y, 0, height, rate);
    
    // Randomly mutate circle diameter
    circle.diameter = mut(circle.diameter, 10, 100, rate);
  }
}


function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
}