export default class Ship {
  constructor(name, coord = []) {
    this.name = name;
    this.position = coord;
    this.damage = 0;
    // Keep track of sunk ships in board module
    // this.sunk = false;
  }

  hit() {
    this.damage += 1;
  }

  isSunk() {
    return this.damage >= this.position.length;
  }
}
