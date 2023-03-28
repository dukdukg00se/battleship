import Gameboard from './board';
import Ship from './ship';
import {
  genNmbr,
  getCeiling,
  isRedundant,
  pickADir,
  getPositionCoords,
} from './aux-helper-fns';

export default class Player {
  constructor(name) {
    this.name = name;
    this.board = new Gameboard();
    this.attacks = [];
    this.winner = false;
    this.opponent = null;
  }

  attack(coord, opp = this.opponent) {
    this.attacks.push(coord);
    opp.board.receiveAttack(coord);
  }

  reportAttackResult(
    attack = this.attacks[this.attacks.length - 1],
    opp = this.opponent
  ) {
    const { board } = opp;
    const oppFleetCoords = board.fleet.reduce((coords, ship) => {
      coords.push(...ship.position);
      return coords;
    }, []);
    const oppLostShipsCoords = board.shipsLost.reduce((coords, ship) => {
      coords.push(...ship.position);
      return coords;
    }, []);
    let attackResult;

    if (board.fleetLost()) attackResult = 'allSunk';
    else if (oppLostShipsCoords.includes(attack))
      attackResult = board.shipsLost[board.shipsLost.length - 1].name;
    else if (oppFleetCoords.includes(attack)) attackResult = 'hit';
    else attackResult = 'miss';

    return attackResult;
  }

  // Work on this to return hit ships name
  // For computer attack msg
  reportAttackResult2(attack, opp = this.opponent) {
    const { fleet, shipsLost } = opp.board;

    let attackResult = 'miss';

    fleet.forEach((ship) => {
      if (ship.position.includes(attack)) {
        // attackResult = `hit ${ship.name}`;
        attackResult = `hit`;
      }
    });

    shipsLost.forEach((ship) => {
      // if (ship.position.includes(attack)) attackResult = `sunk ${ship.name}`;
      if (ship.position.includes(attack)) attackResult = `sunk`;
    });

    if (opp.board.fleetLost()) attackResult = 'destroyed';

    return attackResult;
  }

  reportAttackCoord(attacks = this.attacks) {
    return attacks[attacks.length - 1];
  }

  identifyEnemyShip(attackCoord, oppFleet = this.opponent.board.fleet) {
    let targetShip;
    oppFleet.forEach(ship => {
      ship.position.forEach(coord => {
        if (coord === attackCoord) targetShip = ship; 
      })
    })

    return targetShip;
  } 





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

  resetFleet(fleet = this.board.fleet) {
    fleet.forEach((ship) => {
      ship.position = [];
    });
  }

  getRandomCoord(exclude = this.attacks, gridSize = 100) {
    let coord = genNmbr(gridSize);
    while (exclude.includes(coord)) {
      coord = genNmbr(gridSize);
    }
    return coord;
  }

  place(ship, exclude) {
    const startCoord = this.getRandomCoord(exclude);
    const axis = pickADir();
    const max = getCeiling(startCoord, axis);
    const shipPosition = [...getPositionCoords(ship, startCoord, axis)];

    // for (let i = 0; i < ship.length; i += 1) {
    //   const coord = axis === 'x' ? startCoord + i : startCoord + i * 10;
    //   shipPosition.push(coord);
    // }

    if (
      isRedundant(exclude, shipPosition) ||
      shipPosition[shipPosition.length - 1] > max
    ) {
      return this.place(ship, exclude);
    }

    return shipPosition;
  }

  autoPositionFleet(ships = this.board.fleet) {
    const takenPosits = [];
    ships.forEach((ship) => {
      ship.position = this.place(ship, takenPosits);
      takenPosits.push(...ship.position);
    });
  }
}
