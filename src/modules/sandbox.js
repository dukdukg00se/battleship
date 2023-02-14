/* eslint-disable */

function arryHund() {
  let arr = [];
  let i = 0;
  while (i < 100) {
    arr.push(i);
    i++;
  }
  return arr;
}

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

class Gameboard {
  constructor() {
    this.ships = [];
    this.attacks = [];
    this.madeAttacks = [];
    this.missedAttacks = [];
    this.availSqs = arryHund();
  }

  receiveAttack() {}

  placeShip(ship) {
    this.ships.push(ship);
  }
}

class Player {
  constructor(name) {
    this.name = name;
    this.board = new Gameboard();
  }

  placeShip(ship) {
    this.board.placeShip(ship);
  }

  attack(player, coord) {
    player.receiveAttack(coord);
    this.madeAttacks.push(coord);
  }
}

// const board = {
//   ships: [],
//   attacks: [],
//   missedAttacks: [],
// };

// board.ships.push(carrier, battleship, destroyer, submarine);
// console.log(board);

// const carrier = {
//   length: 5,
//   position: [1, 2, 3, 4, 5],
//   hits: 0,
//   sunk: false,
// };
// const battleship = {
//   length: 4,
//   position: [6, 7, 8, 9],
//   hits: 0,
//   sunk: false,
// };
// const destroyer = {
//   length: 3,
//   position: [10, 11, 12],
//   hits: 0,
//   sunk: false,
// };
// const submarine = {
//   length: 3,
//   position: [13, 14, 14],
//   hits: 0,
//   sunk: false,
// };
