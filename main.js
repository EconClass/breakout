const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

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
let dx = 2;
let dy = -2;


//======================= Event Listeners =======================
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


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
  let color = `hsla(${hue}, 100%, 50%, 0.67)`;

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


//======================= Draw =======================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();

  // Ball Horizontal Movement
  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
    ballColor = randomColor();
  }

  // Ball Vertical Movement
  if(y + dy < ballRadius) {
    dy = -dy;
    ballColor = randomColor();
  } else if(y + dy > canvas.height-ballRadius) {

    // Bounce off of paddle
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      // Ball not caught.
      alert("GAME OVER");
      document.location.reload();
      clearInterval(interval);
    }
  };

  x += dx;
  y += dy;
  
  // Paddle movement
  drawPaddle();
  
  if(rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  }
  else if(leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
};

let interval = setInterval(draw, 10);