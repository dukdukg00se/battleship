import Gameboard from './board';
import Ship from './ship';
import {
  genNmbr,
  getCeiling,
  pickADir,
  getPositionCoords,
  isCoordsEligible,
} from './aux-helper-fns';

export default class Player {
  constructor(name) {
    this.name = name;
    this.board = new Gameboard();
    this.attacks = [];
    this.winner = false;
    this.opponent = null;
  }

  getRandomCoord(exclude = this.attacks, gridSize = 100) {
    let coord = genNmbr(gridSize);
    while (exclude.includes(coord)) {
      coord = genNmbr(gridSize);
    }
    return coord;
  }

  assembleFleet() {
    const allShips = [
      new Ship('CARRIER', 5),
      new Ship('BATTLESHIP', 4),
      new Ship('DESTROYER', 3),
      new Ship('SUBMARINE', 3),
      new Ship('PATROL BOAT', 2),
    ];

    const { fleet } = this.board;
    allShips.forEach((ship) => fleet.push(ship));
  }

  randomPlace(ship, exclude) {
    const startCoord = this.getRandomCoord(exclude);
    const axis = pickADir();
    const ceil = getCeiling(startCoord, axis);
    const shipPosition = [...getPositionCoords(ship, startCoord, axis)];

    if (!isCoordsEligible(exclude, shipPosition, ceil)) {
      return this.randomPlace(ship, exclude);
    }

    return shipPosition;
  }

  autoPositionFleet(ships = this.board.fleet) {
    const takenPosits = [];
    ships.forEach((ship) => {
      ship.position = this.randomPlace(ship, takenPosits);
      takenPosits.push(...ship.position);
    });
  }

  resetFleet() {
    const { fleet } = this.board;
    fleet.forEach((ship) => {
      ship.position = [];
    });
  }

  attack(coord) {
    const opp = this.opponent;
    this.attacks.push(coord);
    opp.board.receiveAttack(coord);
  }

  reportAttackResult(attackCoord) {
    const opp = this.opponent;
    const { fleet, shipsLost } = opp.board;

    let result = 'miss';

    if (fleet.some((ship) => ship.position.includes(attackCoord)))
      result = 'hit';

    if (shipsLost.some((ship) => ship.position.includes(attackCoord)))
      result = 'sunk';

    if (opp.board.fleetLost()) result = 'destroyed';

    return result;
  }

  identifyEnemyShip(attackCoord) {
    const { fleet } = this.opponent.board;
    let targetShip;
    fleet.forEach((ship) => {
      if (ship.position.includes(attackCoord)) targetShip = ship;
    });

    return targetShip;
  }
}
