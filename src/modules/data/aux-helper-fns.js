// Return lowest num in row/column
function getFloor(num, dir) {
  if (dir === 'x') {
    return num % 10 === 0 ? num - 9 : Math.floor(num / 10) * 10 + 1;
  }
  if (num % 10 === 0) return 10;
  if (num <= 10) return num;
  return num - Math.floor(num / 10) * 10;
}

// Returns max num in row/column
function getCeiling(num, dir) {
  if (dir === 'x') return Math.ceil(num / 10) * 10;
  if (num % 10 === 0) return 100;
  return num + (100 - Math.ceil(num / 10) * 10);
}

// Randomly return x or y
// For choosing axis
function pickADir() {
  return Math.round(Math.random()) === 0 ? 'x' : 'y';
}

// Check if array of coords is allowed
// Use to check if a ship's position is allowed
function isCoordsEligible(parentArr, childArr, maxVal) {
  if (childArr.some((element) => parentArr.includes(element))) return false;
  if (childArr[childArr.length - 1] > maxVal) return false;
  return true;
}

function genNmbr(limit) {
  return Math.floor(Math.random() * limit) + 1;
}

// Returns a ship's occupied coords(squares)
// based on start coord and length
function getPositionCoords(shipObj, start, axis) {
  const positionCoords = [];

  for (let i = 0; i < shipObj.length; i += 1) {
    const coord = axis === 'x' ? start + i : start + i * 10;
    positionCoords.push(coord);
  }
  return positionCoords;
}

export {
  getFloor,
  getCeiling,
  isCoordsEligible,
  genNmbr,
  pickADir,
  getPositionCoords,
};
