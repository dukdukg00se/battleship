import Gameboard from './board';

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
}
