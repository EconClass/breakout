// Canvas initialization
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let score = 0;
let lives = 3;

// Paddle variables
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

// Ball variables
let ballRadius = 10;
let ballColor = "#0095DD";
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = randomNonZeroInteger(-5,5);
let dy = -5;

// Block variables
const brickRowCount = 3;
const brickColumnCount = Math.floor(canvas.width / 100);
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;


//======================= Event Listeners =======================
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);


//======================= Bricks =======================
let bricks = [];
let levelCap = 0;
for(let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for(let r = 0; r < brickRowCount; r++) {
    let brickLives = randomNonZeroInteger(1,4);
    bricks[c][r] = { x: 0, y: 0, status: brickLives };
    levelCap += brickLives;
  }
}

function drawBricks() {
  const brickColors = [
    'hsla(330, 100%, 58%, 0.92)',
    'hsla(147, 100%, 58%, 0.92)',
    'hsla(57, 100%, 58%, 0.92)'
  ];

  for(let c = 0; c < brickColumnCount; c++) {
    for(let r = 0; r < brickRowCount; r++) {
      if(bricks[c][r].status > 0) {
        let brickX = (c * (brickWidth+brickPadding)) + brickOffsetLeft;
        let brickY = (r * (brickHeight+brickPadding)) + brickOffsetTop;
        let color = brickColors[bricks[c][r].status - 1];
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for(let c = 0; c < brickColumnCount; c++) {
    for(let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if(b.status > 0) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          ballColor = randomColor();
          b.status--;
          score++;
          if(score == levelCap) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
  }
}


//======================= Ball =======================
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
};


//======================= Randomizers =======================
function randomHex() {
  let letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  
  return color;
}

function randomRGBA() {
  let red = Math.floor(Math.random() * 255);
  let blue = Math.floor(Math.random() * 255);
  let green = Math.floor(Math.random() * 255);

  let color = `rgba(${red}, ${blue}, ${green}, 0.87)`;

  return color;
}

function randomHSLA() {
  let hue = Math.floor(Math.random() * 360);
  let color = `hsla(${hue}, 100%, 50%, 0.87)`;

  return color;
}

function randomColor() {
  return randomHSLA();
}

function randomNonZeroInteger(min, max) {
  let value = Math.floor(Math.random() * (max - min) + min)
  if (value == 0) {
    value++
  }

  return value;
}


//======================= Paddle =======================
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function keyDownHandler(e) {
  if(e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if(e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}


//======================= Game Mechanics =======================
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}


//======================= Draw =======================
function draw() {
  // Initial game state
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawPaddle();
  drawBall();
  drawScore();
  drawLives();
  collisionDetection();

  // Paddle movement
  if(rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  }
  else if(leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  // Ball Horizontal Movement
  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
    ballColor = randomColor();
  }

  // Ball Vertical Movement
  if(y + dy < ballRadius) {
    dy = -dy;
    ballColor = randomColor();
  } else if(y + dy > canvas.height - ballRadius) {

    // Bounce off of paddle
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      ballColor = randomColor();
    } else {
      lives --;
      if(!lives) {
        // Ball not caught.
        alert("GAME OVER");
        document.location.reload();
      } else {
        x = canvas.width/2;
        y = canvas.height-30;
        dx = randomNonZeroInteger(-5,5);
        dy = -5;
        paddleX = (canvas.width-paddleWidth) / 2;
      }
    }
  };

  // Update Ball position
  x += dx;
  y += dy;
  
  // Update frame if changes detected by browser
  requestAnimationFrame(draw);
};

draw();