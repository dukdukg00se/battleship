import Gameboard from './board';
import Ship from './ship';

export default class Player {
  constructor(name) {
    this.name = name;
    this.board = new Gameboard();
    this.attacks = [];
    this.opponent = null;
  }

  attack(coord, opp = this.opponent) {
    this.attacks.push(coord);
    return opp.board.receiveAttack(coord);
  }

  // hitEnemy(
  //   attack = this.attacks[this.attacks.length - 1],
  //   opp = this.opponent
  // ) {
  //   const oppShips = opp.board.fleet.reduce((coords, ship) => {
  //     coords.push(...ship.position);
  //     return coords;
  //   }, []);

  //   return oppShips.includes(attack);
  // }

  assembleFleet(fleet = this.board.fleet) {
    const allShips = [
      new Ship('CARRIER', 5),
      new Ship('BATTLESHIP', 4),
      new Ship('PATROL BOAT', 2),
      new Ship('DESTROYER', 3),
      new Ship('SUBMARINE', 3),
    ];

    allShips.forEach((ship) => fleet.push(ship));
  }
}
