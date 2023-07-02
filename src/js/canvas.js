import platform from '../img/platform.png';
import hills from '../img/hills.png';
import background from '../img/background.png';

const canvas = document.querySelector("canvas");
const canvasCtx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576; 

// Define your game variables here

// Player object
let gravity = 0.5;

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.width = 30;
    this.height = 30;
  }

  draw() {
    canvasCtx.fillStyle = "red";
    canvasCtx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity;
    else this.velocity.y = 0;
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;    
  }
  draw() { 
    canvasCtx.drawImage(this.image,this.position.x,this.position.y);
  }
}

class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;       
  }
  draw() { 
    canvasCtx.drawImage(this.image,this.position.x,this.position.y);
  }
}

function createImage( imageSrc){
  const image = new Image();
  image.src = imageSrc;
  return image;  
}

const platformImage = createImage(platform);
// Load player image

const platforms = [
  new Platform({ x: -1, y: 470, image:platformImage}),
  new Platform({ x: platformImage.width-3, y: 470, image:platformImage }),
  new Platform({ x: platformImage.width * 2 -3, y: 470, image:platformImage })
];

const genericObjects = [
  new GenericObject({x:-1,y:-1,image:createImage(background)}),
  new GenericObject({x:-1,y:-1,image:createImage(hills)})
];

//playerImage.src = "mario-right.jpeg"; // Replace "player.png" with your image file

const player = new Player();
//player.draw();

// Event listeners for keyboard controls
const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 37:
      console.log("left");
      keys.left.pressed = true;
      break;
    case 39:
      console.log("right");
      keys.right.pressed = true;
      break;
    case 32:
      console.log("jump");
      player.velocity.y -= 10;
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 37:
      console.log("left");
      keys.left.pressed = false;
      break;
    case 39:
      console.log("right");
      keys.right.pressed = false;
      break;
    case 32:
      console.log("jump");
      player.velocity.y -= 10;
      break;
  }
});

let scrollOffset = 0;
// Game loop function
function gameLoop() {
  requestAnimationFrame(gameLoop);
  canvasCtx.fillStyle='white';
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
 
  genericObjects.forEach((genericObject)=>{
    genericObject.draw();
  })

  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();  

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = 5;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed) {
      scrollOffset += 5;
      platforms.forEach((platform) => {
        platform.position.x -= 5;
      });
      genericObjects.forEach((genericObject)=>{
        genericObject.position.x-=3;
      })
    } else if (keys.left.pressed) {
      scrollOffset -= 5;
      platforms.forEach((platform) => {
        platform.position.x += 5;
      });
      genericObjects.forEach((genericObject)=>{
        genericObject.position.x+=3;
      })      
    }
  }

  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  if(scrollOffset>2000){
    console.log("Winner");
  }
  //update();
  //render();
}

// Start the game loop
gameLoop();
