let canvas, context, frames;

class Coord {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }
}
// each coord will make a square that has a width and height of 20

const getRandomInt = (upTo) => Math.floor(upTo * Math.random());
const getRandomColor = () => '#' + Math.floor((1<<24) * Math.random()).toString(16);

let snake = [new Coord(getRandomInt(15), getRandomInt(15))]; 
// list of the "coordinates" of the squares which will make up the snake shape. Will get multiplied to find the x and y locations
let fruit = new Coord(1, 1);
let gameover = false;
const size = 20;
const gridSize = 15;

const loop = () => {
  // window.requestAnimationFrame(loop); //runs every animation frame

  context.fillStyle = '#000000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = '#ff0000';
  drawSquare(fruit.x, fruit.y);

  context.fillStyle = '#ffffff';
  drawSquare(snake[0].x, snake[0].y);
  context.fillStyle = '#d3d3d3';
  for (let i = 1; i < snake.length; i++) {
    drawSquare(snake[i].x, snake[i].y);
  }
  // draws the snake and the fruit

  let head = new Coord(snake[0].x, snake[0].y);
  switch (direction) {
    case 2: head.y--; break; // up
    case 4: head.y++; break; // down
    case 1: head.x--; break; // left
    case 3: head.x++; break; // right
    default: break;
  }
  // changes the next head according to the direction

  if (head.x >= gridSize) head.x = 0;
  if (head.x < 0) head.x = gridSize;
  if (head.y >= gridSize) head.y = 0;
  if (head.y < 0) head.y = gridSize;
  // loop onto the other side if head goes off the grid

  if (head.x === fruit.x && head.y === fruit.y) {
    snake[snake.length] = snake[snake.length - 1];
    fruit.x = getRandomInt(15);
    fruit.y = getRandomInt(15);
  }
  // when the head runs into fruit

  for (i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameover = true;
      clearInterval(refreshIntervalId);
    }
  }
  // checks if the snake is running into itself

  shiftUp();
  snake[0] = head;
};

const drawSquare = (x, y) => context.fillRect(x * size, y * size, size, size);
// shifts the snake
const shiftUp = () => {
  for (let i = snake.length - 2; i >= 0; i--) snake[i + 1] = snake[i];
}

const keyMap = {
  38: 2,  // up
  40: 4,  // down
  37: 1,  // left
  39: 3   // right
};

let direction = 0; // not a real direction

document.onkeydown = (e) => {
  if (isOppositeDir(direction, keyMap[e.keyCode])) return;
  direction = keyMap[e.keyCode] || direction;
  if (e.keyCode === 32) window.stopAnim();
}

const isOppositeDir = (dir1, dir2) => (dir1 + dir2) % 2 === 0;

window.stopAnim = () => {
  if (animating || gameover) clearInterval(refreshIntervalId);
  else refreshIntervalId = setInterval(loop, 1000 / fps);
  animating = !animating;
}

let refreshIntervalId = 0;
let animating = true;
const fps = 15;

window.onload = () => {
  canvas = $('#canvas')[0];
  context = canvas.getContext('2d');
  frames = $('#frames')[0];
  loop();
  refreshIntervalId = setInterval(loop, 1000 / fps);
};