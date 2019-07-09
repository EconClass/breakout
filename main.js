const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

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


let x = canvas.width/2;
let y = canvas.height-30;
let ballRadius = 10;
let ballColor = "#0095DD";

let dx = 2;
let dy = -2;

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();

  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
    ballColor = randomColor();
    // ballRadius = randomInteger();
  }

  if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
    dy = -dy;
    ballColor = randomColor();
    // ballRadius = randomInteger();
  }

  x += dx;
  y += dy;
};

function randomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function randomInteger() {
  return Math.floor((Math.random() * 20) + 5);
}

setInterval(draw, 10);