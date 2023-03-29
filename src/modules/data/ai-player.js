import Player from './player';
import {
  getCeiling,
  getFloor,
  genNmbr,
  isCoordsEligible,
  isRedundant,
  pickADir,
} from './aux-helper-fns';

export default class AIPlayer extends Player {
  name = 'COMPUTER';

  targets = [];

  targetDir = 'back';

  getGuidedCoord(ship, dir = this.targetDir, excl = this.attacks) {
    let coord;
    const indx = dir === 'back' || dir === 'down' ? ship.damage.length - 1 : 0;
    const axis = dir === 'back' || dir === 'front' ? 'x' : 'y';
    const floor = getFloor(ship.damage[indx], axis);
    const ceil = getCeiling(ship.damage[indx], axis);

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

  calibrateAttack(targetCoord, opp = this.opponent) {
    let hitShip;

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
          hitShip = ship;
        }
      });
    });

    if (hitShip) {
      if (!targetNames.includes(hitShip.name)) {
        this.targets.push(hitShip);
      }

      // Need to fix below later
      // damage length not accurate, need to add 1 to make this work
      if (hitShip.damage.length + 1 >= hitShip.length) {
        // Below not working? try splice
        this.targets.shift();
      }
    }
  }

  autoAttack(targets = this.targets) {
    const targetCoord =
      targets.length < 1
        ? this.getRandomCoord()
        : this.getGuidedCoord(targets[0]);

    this.calibrateAttack(targetCoord);
    this.attack(targetCoord);
  }
}
