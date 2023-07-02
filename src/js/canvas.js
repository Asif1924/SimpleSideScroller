import platform from '../img/platform.png';

const canvas = document.querySelector("canvas");
const canvasCtx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight; 

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
  constructor({ x, y }) {
    this.position = {
      x,
      y,
    };
    this.width = 200;
    this.height = 20;
  }
  draw() {
    canvasCtx.fillStyle = "blue";
    canvasCtx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}
// Load player image
const playerImage = new Image();

const platforms = [
  new Platform({ x: 200, y: 100 }),
  new Platform({ x: 500, y: 200 }),
];
playerImage.src = "mario-right.jpeg"; // Replace "player.png" with your image file

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
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  platforms.forEach((platform) => {
    platform.draw();
  });

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
    } else if (keys.left.pressed) {
      scrollOffset -= 5;
      platforms.forEach((platform) => {
        platform.position.x += 5;
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

  if(scrollOffset>2000){
    console.log("Winner");
  }
  //update();
  //render();
}

// Update game state
function update() {
  // Update player position based on keyboard input
  if (keys[37]) {
    // Left arrow key
    Player.velocityX = -Player.speed;
  } else if (keys[39]) {
    // Right arrow key
    Player.velocityX = Player.speed;
  } else {
    Player.velocityX = 0;
  }

  // Jumping logic
  if (keys[32] && Player.grounded) {
    // Up arrow key
    Player.velocityY = -Player.speed * 2;
    Player.jumping = true;
    Player.grounded = false;
  }

  // Apply gravity to player
  Player.velocityY += 1.5;
  Player.x += Player.velocityX;
  Player.y += Player.velocityY;

  // Collision detection with ground (assuming ground level at canvas height)
  if (Player.y > canvas.height - Player.height) {
    Player.y = canvas.height - Player.height;
    Player.velocityY = 0;
    Player.jumping = false;
    Player.grounded = true;
  }
}

// Render game objects on the canvas
function render() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Render player on the canvas
  //   ctx.fillStyle = "red";
  //   ctx.fillRect(player.x, player.y, player.width, player.height);

  // Render player image on the canvas
  ctx.drawImage(playerImage, Player.x, Player.y, Player.width, Player.height);
}

// Start the game loop
gameLoop();
