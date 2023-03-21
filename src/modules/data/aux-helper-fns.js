function getFloor(num, dir) {
  if (dir === 'x') {
    return num % 10 === 0 ? num - 9 : Math.floor(num / 10) * 10 + 1;
  }
  if (num % 10 === 0) return 10;
  if (num <= 10) return num;
  return num - Math.floor(num / 10) * 10;
}

function getCeiling(num, dir) {
  if (dir === 'x') return Math.ceil(num / 10) * 10;
  if (num % 10 === 0) return 100;
  return num + (100 - Math.ceil(num / 10) * 10);
}

function pickADir() {
  return Math.round(Math.random()) === 0 ? 'x' : 'y';
}

function isRedundant(parentArr, childArr) {
  return childArr.some((element) => parentArr.includes(element));
}

function isCoordsEligible(parentArr, childArr, maxVal) {
  if (childArr.some((element) => parentArr.includes(element))) return false;
  if (childArr[childArr.length - 1] > maxVal) return false;
  return true;
}

function genNmbr(limit) {
  return Math.floor(Math.random() * limit) + 1;
}

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
  isRedundant,
  genNmbr,
  pickADir,
  getPositionCoords,
};
