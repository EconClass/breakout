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
let dx = 3;
let dy = -3;

// Block variables
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;


//======================= Event Listeners =======================
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);


//======================= Blocks =======================
function drawRectangle () {
  ctx.beginPath();
  ctx.rect(20, 40, 50, 50);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  // STROKE alternative to fill
  // ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
  // ctx.stroke();
  ctx.closePath();
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
function randomColor() {

  // Random HEX
  // let letters = '0123456789ABCDEF';
  // let color = '#';
  // for (let i = 0; i < 6; i++) {
  //   color += letters[Math.floor(Math.random() * 16)];
  // }

  // Random RGBA
  // let red = Math.floor(Math.random() * 255);
  // let blue = Math.floor(Math.random() * 255);
  // let green = Math.floor(Math.random() * 255);

  // let color = `rgba(${red}, ${blue}, ${green}, 0.67)`;

  // Random HSLA
  let hue = Math.floor(Math.random() * 360);
  let color = `hsla(${hue}, 100%, 50%, 0.87)`;

  return color;
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


//======================= Bricks =======================

let bricks = [];
for(let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for(let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function drawBricks() {
  for(let c = 0; c < brickColumnCount; c++) {
    for(let r = 0; r < brickRowCount; r++) {
      if(bricks[c][r].status == 1) {
        let brickX = (c * (brickWidth+brickPadding)) + brickOffsetLeft;
        let brickY = (r * (brickHeight+brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = 'hsla(330, 100%, 58%, 0.92)';
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
      if(b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          ballColor = randomColor();
          b.status = 0;
          score++;
          if(score == brickRowCount*brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
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
    } else {
      lives --;
      if(!lives) {
        // Ball not caught.
        alert("GAME OVER");
        document.location.reload();
      } else {
        x = canvas.width/2;
        y = canvas.height-30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  };

  // Update Ball position
  x += dx;
  y += dy;
  
  requestAnimationFrame(draw);
};

// let interval = setInterval(draw, 10);
draw();