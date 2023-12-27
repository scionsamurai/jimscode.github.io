let image;
let ctx;
let squareSize = 100;
let gapPosition;

document.getElementById('imageInput').addEventListener('change', handleImageSelect);

function handleImageSelect(event) {
  const fileInput = event.target;
  const file = fileInput.files[0];

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function (e) {
      loadImage(e.target.result);
    };
    reader.readAsDataURL(file);
  }
}

function loadImage(src) {
  image = new Image();
  image.onload = function () {
    drawImage();
  };
  image.src = src;
}

function drawImage() {
  const canvas = document.getElementById('imageCanvas');
  ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}

function shuffleSquares() {
  const canvas = document.getElementById('imageCanvas');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  gapPosition = {
    x: Math.floor(Math.random() * (canvas.width / squareSize)),
    y: Math.floor(Math.random() * (canvas.height / squareSize)),
  };

  for (let x = 0; x < canvas.width; x += squareSize) {
    for (let y = 0; y < canvas.height; y += squareSize) {
      // Skip the square at the gap position
      if (x === gapPosition.x * squareSize && y === gapPosition.y * squareSize) {
        continue;
      }

      drawSquare(imageData, x, y);
    }
  }
}

function drawSquare(imageData, startX, startY) {
  const pixels = imageData.data;

  // Draw the square on the canvas
  for (let y = 0; y < squareSize; y++) {
    for (let x = 0; x < squareSize; x++) {
      const pixelIndex = ((startY + y) * imageData.width + (startX + x)) * 4;
      ctx.fillStyle = `rgb(${pixels[pixelIndex]}, ${pixels[pixelIndex + 1]}, ${pixels[pixelIndex + 2]})`;
      ctx.fillRect(startX + x, startY + y, 1, 1);
    }
  }
}

function handleClick(event) {
  const canvas = document.getElementById('imageCanvas');
  const clickX = Math.floor(event.offsetX / squareSize);
  const clickY = Math.floor(event.offsetY / squareSize);

  // Check if the clicked square is adjacent to the gap
  if (
    (Math.abs(clickX - gapPosition.x) === 1 && clickY === gapPosition.y) ||
    (Math.abs(clickY - gapPosition.y) === 1 && clickX === gapPosition.x)
  ) {
    swapSquares(clickX, clickY);
  }
}

function swapSquares(clickX, clickY) {
  const canvas = document.getElementById('imageCanvas');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Swap the clicked square with the gap
  const temp = { x: gapPosition.x, y: gapPosition.y };
  gapPosition.x = clickX;
  gapPosition.y = clickY;
  clickX = temp.x;
  clickY = temp.y;

  // Redraw the clicked square and the gap
  drawSquare(imageData, clickX * squareSize, clickY * squareSize);
  ctx.clearRect(gapPosition.x * squareSize, gapPosition.y * squareSize, squareSize, squareSize);

  // Check if the puzzle is solved
  checkPuzzleSolved(imageData);
}

function checkPuzzleSolved(imageData) {
  const canvas = document.getElementById('imageCanvas');
  const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  if (compareImageData(imageData, originalImageData)) {
    alert('Congratulations! Puzzle solved!');
  }
}

function compareImageData(imageData1, imageData2) {
  const pixels1 = imageData1.data;
  const pixels2 = imageData2.data;

  for (let i = 0; i < pixels1.length; i++) {
    if (pixels1[i] !== pixels2[i]) {
      return false;
    }
  }

  return true;
}


