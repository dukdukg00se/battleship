export default class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
    this.position = [];
    this.damage = [];
  }

  hit(coord) {
    this.damage.push(coord);
    this.damage.sort((a, b) => a - b);
  }

  isSunk() {
    return this.damage.length >= this.position.length;
  }
}
