import Gameboard from './board';
import Ship from './ship';

export default class Player {
  constructor(name) {
    this.name = name;
    this.board = new Gameboard();
    this.attacks = [];
  }

  attack(opp, coord) {
    opp.board.receiveAttack(coord);
    this.attacks.push(coord);
  }

  assembleFleet(fleet = this.board.fleet) {
    const allShips = [
      new Ship('carrier', 5),
      new Ship('battleship', 4),
      new Ship('patrol boat', 2),
      new Ship('destroyer', 3),
      new Ship('submarine', 3),
    ];

    allShips.forEach((ship) => fleet.push(ship));
  }
}
