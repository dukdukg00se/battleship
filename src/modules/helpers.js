function getFloor(num, horizontal) {
  if (horizontal) {
    return num % 10 === 0 ? num - 9 : Math.floor(num / 10) * 10 + 1;
  }
  if (num % 10 === 0) return 10;
  if (num <= 10) return num;
  return num - Math.floor(num / 10) * 10;
}

function getCeiling(num, horizontal) {
  if (horizontal) return Math.ceil(num / 10) * 10;
  if (num % 10 === 0) return 100;
  return num + (100 - Math.ceil(num / 10) * 10);
}

function isRedundant(parentArr, childArr) {
  return childArr.some((element) => parentArr.includes(element));
}

function genNmbr(limit) {
  return Math.floor(Math.random() * limit) + 1;
}

export { getFloor, getCeiling, isRedundant, genNmbr };
