// Retro Garden Maze Game

// Define the canvas and context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

// Define the characters' positions
let character1X = 50;
let character1Y = 50;
let character2X = 150;
let character2Y = 150;

// Define the maze walls
const walls = [
  { x: 0, y: 0, width: canvas.width, height: 10 },
  { x: 0, y: canvas.height - 10, width: canvas.width, height: 10 },
  { x: 0, y: 0, width: 10, height: canvas.height },
  { x: canvas.width - 10, y: 0, width: 10, height: canvas.height }
];

// Define the collectible dots
let dots = [];

// Define the game duration in seconds
const gameDuration = 120; // 2 minutes

// Define the timer variables
let startTime;
let elapsedTime;

// Define the players' scores
let player1Score = 0;
let player2Score = 0;

// Generate dots with random positions
function generateDots() {
  const numDots = 20;

  for (let i = 0; i < numDots; i++) {
    let dotX, dotY;
    do {
      dotX = Math.random() * (canvas.width - 20) + 10;
      dotY = Math.random() * (canvas.height - 20) + 10;
    } while (checkCollision(dotX, dotY));

    const dot = {
      x: dotX,
      y: dotY,
      radius: 5 // Updated dot radius to match player size
    };

    dots.push(dot);
  }
}

// Generate initial dots
generateDots();

// Add keyboard event listeners
document.addEventListener('keydown', handleKeyDown);

// Handle keyboard input
function handleKeyDown(event) {
  const key = event.key;
  let deltaX1 = 0;
  let deltaY1 = 0;
  let deltaX2 = 0;
  let deltaY2 = 0;

  if (key === 'ArrowUp') {
    deltaY1 = -10;
  } else if (key === 'ArrowDown') {
    deltaY1 = 10;
  } else if (key === 'ArrowLeft') {
    deltaX1 = -10;
  } else if (key === 'ArrowRight') {
    deltaX1 = 10;
  } else if (key === 'w') {
    deltaY2 = -10;
  } else if (key === 's') {
    deltaY2 = 10;
  } else if (key === 'a') {
    deltaX2 = -10;
  } else if (key === 'd') {
    deltaX2 = 10;
  }

  const newCharacter1X = character1X + deltaX1;
  const newCharacter1Y = character1Y + deltaY1;
  const newCharacter2X = character2X + deltaX2;
  const newCharacter2Y = character2Y + deltaY2;

  if (!checkCollision(newCharacter1X, newCharacter1Y)) {
    character1X = newCharacter1X;
    character1Y = newCharacter1Y;
    checkCollectDots(character1X, character1Y, 1);
  }

  if (!checkCollision(newCharacter2X, newCharacter2Y)) {
    character2X = newCharacter2X;
    character2Y = newCharacter2Y;
    checkCollectDots(character2X, character2Y, 2);
  }
}

// Check for collisions with walls
function checkCollision(x, y) {
  for (let i = 0; i < walls.length; i++) {
    const wall = walls[i];

    if (x >= wall.x && x < wall.x + wall.width && y >= wall.y && y < wall.y + wall.height) {
      return true;
    }
  }

  return false;
}

// Check for collecting dots
function checkCollectDots(x, y, player) {
  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    const dotCenterX = dot.x;
    const dotCenterY = dot.y;
    const distance = Math.sqrt((x - dotCenterX) ** 2 + (y - dotCenterY) ** 2);

    if (distance <= dot.radius) {
      dots.splice(i, 1);

      if (player === 1) {
        player1Score++;
      } else if (player === 2) {
        player2Score++;
      }

      break;
    }
  }
}

// Reset the game
function resetGame() {
  character1X = 50;
  character1Y = 50;
  character2X = 150;
  character2Y = 150;
  dots = [];
  generateDots();
  player1Score = 0;
  player2Score = 0;
  startTimer();
}

// Draw the game
function drawGame() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the walls
  context.fillStyle = 'black';
  walls.forEach(wall => {
    context.fillRect(wall.x, wall.y, wall.width, wall.height);
  });

  // Draw the dots
  context.fillStyle = 'yellow';
  dots.forEach(dot => {
    context.beginPath();
    context.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    context.fill();
  });

  // Draw character 1
  context.fillStyle = 'red';
  context.fillRect(character1X, character1Y, 10, 10);

  // Draw character 2
  context.fillStyle = 'blue';
  context.fillRect(character2X, character2Y, 10, 10);

  // Draw scores
  context.fillStyle = 'white';
  context.font = '16px Arial';
  context.fillText(`Player 1 Score: ${player1Score}`, 10, 20);
  context.fillText(`Player 2 Score: ${player2Score}`, 10, 40);

  // Draw timer
  const remainingTime = Math.max(0, gameDuration - elapsedTime);
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  context.fillText(`Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`, 10, 60);

  // Request the next animation frame
  requestAnimationFrame(drawGame);
}

// Start the timer
function startTimer() {
  startTime = Date.now();
  elapsedTime = 0;
  updateTimer();
}

// Update the timer
function updateTimer() {
  const currentTime = Date.now();
  elapsedTime = Math.floor((currentTime - startTime) / 1000);

  if (elapsedTime >= gameDuration) {
    endGame();
  } else {
    requestAnimationFrame(updateTimer);
  }
}

// End the game
function endGame() {
  let winner = '';

  if (player1Score > player2Score) {
    winner = 'Player 1 wins!';
  } else if (player2Score > player1Score) {
    winner = 'Player 2 wins!';
  } else {
    winner = "It's a draw!";
  }

  // Display the winner or draw message
  alert(`Game Over!\n${winner}`);

  // Reset the game
  resetGame();
}

// Start the game
startTimer();
drawGame();
