import Player from './player';
import { getCeiling, getFloor } from './aux-helper-fns';

/* eslint-disable default-case */
export default class AIPlayer extends Player {
  name = 'COMPUTER';

  targets = [];

  targetDir = 'back';

  updateTargetsList(
    coord,
    targs = this.targets,
    enemyShips = this.opponent.board.fleet
  ) {
    let hitShip;

    enemyShips.forEach((ship) => {
      if (ship.position.includes(coord)) hitShip = ship;
    });

    if (hitShip) {
      // Below checks if same obj in arr;
      // Reminder to self, objs are structured data not primitives

      // If ship obj reference not in targ arr then add
      if (!targs.includes(hitShip)) {
        targs.push(hitShip);
      }

      if (hitShip.damage.length >= hitShip.length) {
        // Due to how ai targeting currently implemented,
        // most times, sunk ship will be first ship in targ array.
        // However, in case it's not, search for index of hitship
        // then splice it out
        const index = targs.indexOf(hitShip);
        targs.splice(index, 1);
      }
    }
  }

  updateTargetingDir(dir = this.targetDir) {
    switch (dir) {
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

  getGuidedCoord(ship, dir = this.targetDir, excl = this.attacks) {
    const indx = dir === 'back' || dir === 'down' ? ship.damage.length - 1 : 0;
    const axis = dir === 'back' || dir === 'front' ? 'x' : 'y';
    const floor = getFloor(ship.damage[indx], axis);
    const ceil = getCeiling(ship.damage[indx], axis);
    let coord;

    switch (dir) {
      case 'back':
        coord = ship.damage[indx] + 1;
        break;
      case 'front':
        coord = ship.damage[indx] - 1;
        break;
      case 'down':
        coord = ship.damage[indx] + 10;
        break;
      case 'up':
        coord = ship.damage[indx] - 10;
    }

    if (excl.includes(coord) || coord < floor || coord > ceil) {
      this.updateTargetingDir(dir);
      return this.getGuidedCoord(ship);
    }

    return coord;
  }

  getAttackCoord(targets = this.targets) {
    const coord =
      targets.length < 1
        ? this.getRandomCoord()
        : this.getGuidedCoord(targets[0]);

    return coord;
  }
}
