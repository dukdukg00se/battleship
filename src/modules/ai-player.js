import Player from './player';
import { getCeiling, getFloor, genNmbr, isCoordsEligible, isRedundant } from './helpers';

export default class AIPlayer extends Player {
  name = 'COMPUTER';

  targets = [];

  targetDir = 'back';

  getGuidedCoord(ship, dir = this.targetDir, excl = this.attacks) {
    let coord;
    const indx = dir === 'back' || dir === 'down' ? ship.damage.length - 1 : 0;
    const isXAxis = dir === 'back' || dir === 'front';
    const floor = getFloor(ship.damage[indx], isXAxis);
    const ceil = getCeiling(ship.damage[indx], isXAxis);

    if (dir === 'back') {
      coord = ship.damage[indx] + 1;

      if (excl.includes(coord) || coord < floor || coord > ceil) {
        return this.getGuidedCoord(ship, 'front');
      }
    }

    if (dir === 'front') {
      coord = ship.damage[indx] - 1;

      if (excl.includes(coord) || coord < floor || coord > ceil) {
        return this.getGuidedCoord(ship, 'down');
      }
    }

    if (dir === 'down') {
      coord = ship.damage[indx] + 10;

      if (excl.includes(coord) || coord < floor || coord > ceil) {
        return this.getGuidedCoord(ship, 'up');
      }
    }

    if (dir === 'up') {
      coord = ship.damage[0] - 10;

      if (excl.includes(coord) || coord < floor || coord > ceil) {
        return this.getGuidedCoord(ship, 'back');
      }
    }

    return coord;
  }

  getRandomCoord(exclude = this.attacks, gridSize = 100) {
    let coord = genNmbr(gridSize);
    while (exclude.includes(coord)) {
      coord = genNmbr(gridSize);
    }
    return coord;
  }

  calibrateAttack(opp, targetCoord) {
    const targetNames = this.targets.reduce((names, oppShip) => {
      names.push(oppShip.name);
      return names;
    }, []);
    const enemyShipPosits = opp.board.fleet.reduce((coords, ship) => {
      coords.push(...ship.position);
      return coords;
    }, []);

    if (!enemyShipPosits.includes(targetCoord)) {
      if (this.targets.length > 0) {
        switch (this.targetDir) {
          case 'back':
            this.targetDir = 'front';
            break;
          case 'front':
            this.targetDir = 'down';
            break;
          case 'down':
            this.targetDir = 'up';
            break;
          default:
            this.targetDir = 'back';
        }
      }
    }

    opp.board.fleet.forEach((ship) => {
      ship.position.forEach((coord) => {
        if (coord === targetCoord) {
          if (!targetNames.includes(ship.name)) {
            this.targets.push(ship);
          }

          if (ship.isSunk()) {
            this.targets.shift(); // check if shift will work
          }
        }
      });
    });
  }

  autoAttack(opp, targets = this.targets) {
    const targetCoord =
      targets.length < 1
        ? this.getRandomCoord()
        : this.getGuidedCoord(targets[0]);

    this.attack(opp, targetCoord);
    this.calibrateAttack(opp, targetCoord);
  }

  place(ship, exclude) {
    const isXAxis = !!Math.round(Math.random());
    const startCoord = this.getRandomCoord(exclude);
    const max = getCeiling(startCoord, isXAxis);
    const position = [];

    for (let i = 0; i < ship.length; i += 1) {
      const coord = isXAxis ? startCoord + i : startCoord + i * 10;
      position.push(coord);
    }

   
      if (
        isRedundant(exclude, position) ||
        position[position.length - 1] > max
      ) {
        return this.place(ship, exclude);
      }

    return position;
  }

  positionFleet(ships = this.board.fleet) {
    const takenPosits = [];
    ships.forEach((ship) => {
      ship.position = this.place(ship, takenPosits);
      takenPosits.push(...ship.position);
    });
  }
}
