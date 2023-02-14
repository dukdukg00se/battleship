import Ship from './ship';

class Gameboard {
  constructor() {
    this.ships = [];
    this.attacks = [];
    this.madeAttacks = [];
    this.missedAttacks = [];
  }

  receiveAttack() {}

  placeShip() {
    const shipType = new Ship();
    this.ships.push(shipType);
  }
}

export default Gameboard;
