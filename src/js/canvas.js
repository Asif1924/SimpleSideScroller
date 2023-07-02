import platformImageSrc from "../img/platform.png";
import platformImageSmallTallSrc from "../img/platformSmallTall.png";
import hills from "../img/hills.png";
import background from "../img/background.png";
import spriteRunLeft from "../img/spriteRunLeft.png";
import spriteRunRight from "../img/spriteRunRight.png";
import spriteStandLeft from "../img/spriteStandLeft.png";
import spriteStandRight from "../img/spriteStandRight.png";



const canvas = document.querySelector("canvas");
const canvasCtx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;

// Define your game variables here
function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}
// Player object
let gravity = 0.5;

let spriteStandRightImage = createImage(spriteStandRight);
let spriteStandLeftImage = createImage(spriteStandLeft);
let spriteRunRightImage = createImage(spriteRunRight);
let spriteRunLeftImage = createImage(spriteRunLeft);

//let spriteStandRightImage = createImage(spriteStandRight);

class Player {
  constructor() {
    this.speed = 10;
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.width = 66;
    this.height = 150;
    this.image = spriteStandRightImage;
    this.frames = 0;
    this.sprites ={
      stand:{
        right: spriteStandRightImage,
        left: spriteStandLeftImage,
        cropWidth: 177,
        width: 66
      },
      run:{
        right: spriteRunRightImage,
        left: spriteRunLeftImage,
        cropWidth: 341,
        width: 127.875
      }
    }
    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 177;
  }

  draw() {
    canvasCtx.drawImage(
      this.currentSprite, 
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x, 
      this.position.y,
      this.width,
      this.height
      // this.currentSprite, 
      // 177 * this.frames,
      // 0,
      // 177,
      // 400,
      // this.position.x, 
      // this.position.y,
      // this.width,
      // this.height      
    );

  }

  update() {
    this.frames++;
    if(this.frames> 59 && (this.currentSprite===this.sprites.stand.right || this.currentSprite===this.sprites.stand.left) ){
      this.frames = 0;
    } 
    else if(this.frames>29 && (this.currentSprite===this.sprites.run.right || this.currentSprite===this.sprites.run.left) ){
      this.frames = 0;
    }
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }
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
    canvasCtx.drawImage(this.image, this.position.x, this.position.y);
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
    canvasCtx.drawImage(this.image, this.position.x, this.position.y);
  }
}

let platformImage = createImage(platformImageSrc);
let platformImageSmallTall = createImage(platformImageSmallTallSrc);
let player = new Player();
let platforms = [];
let genericObjects = [];
let lastKey = '';
let keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

let scrollOffset = 0;

function init() {
  platformImage = createImage(platformImageSrc);
  platformImageSmallTall = createImage(platformImageSmallTallSrc);
  // Load player image
  player = new Player();
  platforms = [
    new Platform({
      x: (platformImage.width * 4) + 300 -2 + platformImage.width - platformImageSmallTall.width,
      y: 270,
      image: platformImageSmallTall,
    }),    
    new Platform({
      x: -1,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width - 3,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: (platformImage.width * 2) + 100,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: (platformImage.width * 3) + 300,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: (platformImage.width * 4) + 300 -2,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: (platformImage.width * 5) + 700 -2,
      y: 470,
      image: platformImage,
    })
  ];

  genericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(background),
    }),
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(hills),
    }),
  ];

  keys = {
    right: {
      pressed: false,
    },
    left: {
      pressed: false,
    },
  };
}


// Game loop function
function gameLoop() {
  requestAnimationFrame(gameLoop);
  canvasCtx.fillStyle = "white";
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });

  player.update();

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if ((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrollOffset===0 && player.position.x>0) ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });
    } else if (keys.left.pressed && scrollOffset>0) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66;
      });
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

  //Sprite switching conditional
  if( keys.right.pressed && lastKey==='right' && player.currentSprite !== player.sprites.run.right){
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth=player.sprites.run.cropWidth;
    player.width=player.sprites.run.width;    
  }else if( keys.left.pressed && lastKey==='left' && player.currentSprite!==player.sprites.run.left){
    player.currentSprite=player.sprites.run.left;
    player.currentCropWidth=player.sprites.run.cropWidth;
    player.width=player.sprites.run.width;  
  }else if( !keys.left.pressed && lastKey==='left' && player.currentSprite!==player.sprites.stand.left){
    player.currentSprite=player.sprites.stand.left;
    player.currentCropWidth=player.sprites.stand.cropWidth;
    player.width=player.sprites.stand.width;  
  }else if( !keys.right.pressed && lastKey==='right' && player.currentSprite!==player.sprites.stand.right){
    player.currentSprite=player.sprites.stand.right;
    player.currentCropWidth=player.sprites.stand.cropWidth;
    player.width=player.sprites.stand.width;  
  }

  if (scrollOffset > platformImage.width * 5 + 300 -2) {
    console.log("Winner");
  }

  if (player.position.y > canvas.height) {
    console.log("Loser");
    init();
  }
}

// Start the game loop
init();
gameLoop();

addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 37:
      console.log("left");
      keys.left.pressed = true;
      lastKey='left';
      break;
    case 39:
      console.log("right");
      keys.right.pressed = true;
      lastKey = 'right';
      break;
    case 32:
      console.log("jump");
      player.velocity.y -= 15;
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
      break;
  }
});
