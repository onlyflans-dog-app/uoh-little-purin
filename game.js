// Game setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Background image setup
const bgImage = new Image();
bgImage.src = "./assets/bg.png";

// Player image setup
const playerImage = new Image();
playerImage.src = "./assets/player.png";

// Enemy image setup
const enemyImage = new Image();
enemyImage.src = "./assets/enemy.png";

const gameOverImage = new Image();
gameOverImage.src = "./assets/gameOver.png";

// Wait for all images to load
let imagesLoaded = 0;

let gameOver = false;


let ground = 720 - 95 - 50;

bgImage.onload = () => {
  imagesLoaded++;

  canvas.width = bgImage.width;
  canvas.height = bgImage.height;
  bgImage.height - 95 - 50;

  if (imagesLoaded === 4) {
    startGame();
  }
};


playerImage.onload = () => {
    imagesLoaded++;
    player.x = 200;
    player.y = ground;
    if (imagesLoaded === 4) {
        startGame();
    }
};

enemyImage.onload = () => {
  imagesLoaded++;

    enemy.x = 1000;
    enemy.y = ground;
  if (imagesLoaded === 4) {
    startGame();
  }
};

gameOverImage.onload = () => {
  imagesLoaded++;
  if (imagesLoaded === 4) {
    startGame();
  }
};


// Player setup
const player = {
  width: 50,
  height: 50,

  dir: 0,
  dirL: 0,

  x: 200,
  y: ground,

  isJumping: false,
  jumpForce: 11,
  gravity: 0.5,

  speed: 2,
  walkSpeed: 2,
  runSpeed: 3,

  jumpSpeed: 0,
};

// Enemy setup
const enemy = {
  width: 50,
  height: 50,

  dir: 0,

  x: 1000,
  y: ground,

  isJumping: false,
  xSpeed: 0,
  ySpeed: 0,

  jumpForce: 11,

  gravity: 0.5,
  speed: 2,
};

// Handle key press
document.addEventListener("keydown", handleKeyPress);
document.addEventListener("keyup", handleKeyRelease);

function handleKeyPress(e) {
  // Move player based on arrow key pressed
  if (e.key === "ArrowUp" && !player.isJumping) {
    player.isJumping = true;
    player.jumpSpeed = -player.jumpForce;
  }

  if (e.key === "ArrowLeft") {
    player.dir = -1;
    player.dirL = -1;
  } else if (e.key === "ArrowRight") {
    player.dir = 1;
    player.dirL = 1;
  }

    // Run player
    if (e.key === "Shift") {
        player.speed = player.runSpeed;
    }
}

function handleKeyRelease(e) {
  if (e.key === "ArrowUp") {
    // nothing for now
  }

  if (e.key === "ArrowLeft") {
    player.dir = 0;
  } else if (e.key === "ArrowRight") {
    player.dir = 0;
  }
  // Run player
  if (e.key === "Shift") {
      player.speed = player.walkSpeed;
  }
}

// Start the game
function startGame() {
  update();
}

function update() {
    if (!gameOver) {
      playerUpdate();
    } else {
        player.speed = 0;
        player.dir = 0;
        player.dirL = 0;
    }
  
    // Draw game objects
    draw();
  
    // Repeat update function
    requestAnimationFrame(update);
  }
  
  
  function playerUpdate() {
    const playableAreaLeft = 160;
    const playableAreaRight = canvas.width - 160;

    // Move player
    player.x += player.dir * player.speed;
  
    // Keep the player within the playable area
    if (player.x < playableAreaLeft) {
      player.x = playableAreaLeft;
    } else if (player.x + player.width > playableAreaRight) {
      player.x = playableAreaRight - player.width;
    }
  
    // Jump player
    if (player.isJumping) {
      player.y += player.jumpSpeed;
      player.jumpSpeed += player.gravity;
  
      // Check if player has landed
      if (player.y > ground) {
        player.y = ground;
        player.isJumping = false;
      }
    }
  
    // Check for collision between player and enemy
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      console.log("collided");
      gameOver = true;
    }
  
    // Move enemy
    enemy.x -= enemy.speed;
  
    // Check if enemy has reached the left side of the playable area and turn around, same for the right side
    if (enemy.x < playableAreaLeft) {
      enemy.speed = -enemy.speed;
      enemy.x = playableAreaLeft;
    } else if (enemy.x + enemy.width > playableAreaRight) {
      enemy.speed = -enemy.speed;
      enemy.x = playableAreaRight - enemy.width;
    }
  }

setInterval(function() {

  // add randomness to direction
  let rand = Math.floor(Math.random() * 6)+1;
  if(rand < 3) {
    if (player.x < enemy.x && enemy.speed < 0) {
        enemy.speed = -enemy.speed;
    } else if (player.x > enemy.x && enemy.speed > 0) {
        enemy.speed = -enemy.speed;
    }
  } else if(rand < 6){
    // nothing
  } else {
    //enemy.speed = -enemy.speed;
  }

  // add randomness to speed
  rand = Math.floor(Math.random() * 2)+1;
  if(enemy.speed > 0) {
    enemy.speed = rand*player.runSpeed;
  } else {
    enemy.speed = -(rand*player.runSpeed);
  }

}, 1000);

// Draw game objects
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw background image
    ctx.drawImage(bgImage, 0, 0);
  
    // Draw enemy
    if (enemy.speed < 0) {
      // Flip the enemy sprite horizontally
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(
        enemyImage,
        -enemy.x - enemy.width,
        enemy.y,
        enemy.width,
        enemy.height
      );
      ctx.restore();
    } else {
      ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    }
  
    // Draw player
    if(!gameOver){    
        if (player.dirL === -1) {
        // Flip the player sprite horizontally
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(
            playerImage,
            -player.x - player.width,
            player.y,
            player.width,
            player.height
        );
        ctx.restore();
        } else {
        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
        }
        
    }
  
    // Display game over image
    if (gameOver) {
      ctx.drawImage(
        gameOverImage,
        canvas.width / 2 - gameOverImage.width / 2,
        canvas.height / 2 - gameOverImage.height / 2
      );
    }
  }
  
