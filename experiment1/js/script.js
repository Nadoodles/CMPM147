const fillers = {
  adventurer: ["My dude", "Bro", "WesBot", "Adventurer", "Traveller", "Fellow", "Citizen", "Ashen One", "Dragonborn", "Cool person", "Tarnished", "勇者", "$adventurer and $adventurer", "$adventurer, $adventurer, and $adventurer", "Geoff"],
  pre: ["Fra", "Tro", "Gre", "Pan", "Ast", "Ara"],
  post: ["gria", "ston", "gott","-on-the-lee", "ora", "Ara", "uwu"],
  people: ["kindly", "meek", "brave", "wise", "sacred", "cherished", "honored", "forgotten", "apathetic", "mystic", "orca", "帥氣"],
  item: ["axe", "staff", "book", "cloak", "shield", "club", "sword", "magic gloves", "galvel", "fists", "mace", "potato"],
  num: ["two", "three", "eleven", "so many", "too many", "an unsatisfying number of", "barely any", "an unspecified amount of", "surely a satisfactory number of"],
  looty: ["gleaming", "valuable", "esteemed", "rare", "exalted", "scintillating", "kinda gross but still usefull", "complete garbage"],
  loots: ["coins", "chalices", "ingots", "hides", "victory points", "gems","scrolls", "bananas", "noodles", "goblins", "CS Majors", "college credits"],
  baddies: ["orcs", "glubs", "fishmen", "cordungles", "mountain trolls", "college professors", "dragon", "evil $adventurer", "agents of chaos"],
  message: ["call", "txt", "post", "decree", "shoutz", "tweets", "choiche", "hearkens", "harkening", "harkenening", "harkenenening", "...wait, no! Come back", "Watermelon"],
  shoes: ["reverse grinches", "mochas", "reverse mochas", "travis scott low golf", "off white jordan 4", "power puffs", "pandas", "lost and found"],
  homies: ["Jose", "Brent", "Fern", "Luis", "Elmer", "Anthony", "Brian", "Gordon", "Aditya", "Gio", "Ellie", "Josh", "Batu"],
  trends: ["prize picks", "bitcoin", "crypto", "ai", "reselling", "dropshipping"], 
  
  
  colors: ["red", "blue", "green", "yellow", "purple", "orange"], 
  animals: ["dog", "cat", "lion", "elephant", "tiger", "monkey"],
  fruits: ["apple", "banana", "orange", "strawberry", "kiwi", "pineapple"],
  vehicles: ["car", "truck", "motorcycle", "bicycle", "airplane", "boat"],
  countries: ["USA", "Canada", "France", "Japan", "Australia", "Brazil"],

};


const template = `$adventurer, heed my $message!

I have just come from $pre$post where the $people folk are in desperate need. Their town has been overrun by $baddies. You must venture forth at once, taking my $item, and help them.

It is told that the one who can rescue them will be awarded with $num $looty $loots. Surely this must tempt one such as yourself!
`;

const template2 = `$adventurer, It's me $homies! Nice to see you again! Okay I see you with the $shoes! 

How did you get them bad bois? I heard they were sold out everywhere! Did you use $trends to get them?

Whatever you did, I need to do that to. I need to get me some $shoes! Maybe even $num pairs!
`;

const template3 = `$homies, I have a new quest for you! I need you to go to $countries and get me a $colors $animals.'; 

I know this is a weird request, but I need it for my collection. I will reward you with $num $fruits $vehicles.

If that doesn't tempt you, I don't know what will! I will also throw in a $looty $loots! or some $shoes`;


// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  let story2 = template2;
  let story3 = template3;

  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }
  while (story2.match(slotPattern)) {
    story2 = story2.replace(slotPattern, replacer);
  }
  while (story3.match(slotPattern)) {
    story3 = story3.replace(slotPattern, replacer);
  }

  /* global box */
  box.innerText = story;
  box2.innerText = story2;
  box3.innerText = story3;
}

/* global clicker */
clicker.onclick = generate;

generate();
