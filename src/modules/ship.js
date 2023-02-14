class Ship {
  constructor(length, coord) {
    this.length = length;
    this.position = coord;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    this.hits += 1;
  }

  isSunk() {
    if (this.hits >= this.length) {
      this.sunk = true;
      return this.sunk;
    }
    return false;
  }
}

export default Ship;
