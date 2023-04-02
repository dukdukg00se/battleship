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

  // Only called when enemy ship is targeted
  // Return attack coord based on last hit
  getGuidedCoord(ship, dir = this.targetDir, excl = this.attacks) {


    let coord;
    const indx = dir === 'back' || dir === 'down' ? ship.damage.length - 1 : 0;
    const axis = dir === 'back' || dir === 'front' ? 'x' : 'y';
    const floor = getFloor(ship.damage[indx], axis);
    const ceil = getCeiling(ship.damage[indx], axis);

    // console.log(ship.name)
    // console.log(ship.damage)
    console.log(dir)
    // console.log(indx)

    if (dir === 'back') {
      coord = ship.damage[indx] + 1;

      if (excl.includes(coord) || coord < floor || coord > ceil) {
        this.targetDir = 'front';
        return this.getGuidedCoord(ship);

      }
    } 
    
    else if (dir === 'front') {
      coord = ship.damage[indx] - 1;

      if (excl.includes(coord) || coord < floor || coord > ceil) {
        this.targetDir = 'down';
        return this.getGuidedCoord(ship);

      }
    } 
    
    else if (dir === 'down') {
      coord = ship.damage[indx] + 10;

      if (excl.includes(coord) || coord < floor || coord > ceil) {
        this.targetDir = 'up';
        return this.getGuidedCoord(ship);

      }
    } 
    
    else if (dir === 'up') {
      coord = ship.damage[indx] - 10;

      if (excl.includes(coord) || coord < floor || coord > ceil) {
        this.targetDir = 'back';
        return this.getGuidedCoord(ship);

      }
    }

    return coord;
  }


  // Check if the guided coord is a hit
  // If not, change direction of next hit (targetDir)
  // calibrateAttack(attackCoord, opp = this.opponent) {

  //   const enemyShipPosits = opp.board.fleet.reduce((coords, ship) => {
  //     coords.push(...ship.position);
  //     return coords;
  //   }, []);
  //   if (!enemyShipPosits.includes(attackCoord)) {
  //     if (this.targets.length > 0) {
  //       switch (this.targetDir) {
  //         case 'back':
  //           this.targetDir = 'front';
  //           break;
  //         case 'front':
  //           this.targetDir = 'down';
  //           break;
  //         case 'down':
  //           this.targetDir = 'up';
  //           break;
  //         default:
  //           this.targetDir = 'back';
  //       }
  //     }
  //   }


  //   // let hitShip;
  //   // opp.board.fleet.forEach((ship) => {
  //   //   ship.position.forEach((coord) => {
  //   //     if (coord === attackCoord) {
  //   //       hitShip = ship;
  //   //     }
  //   //   });
  //   // });

  //   // const targetNames = this.targets.reduce((names, oppShip) => {
  //   //   names.push(oppShip.name);
  //   //   return names;
  //   // }, []);

  //   // if (hitShip) {
  //   //   if (!targetNames.includes(hitShip.name)) {
  //   //     this.targets.push(hitShip);
  //   //   }

  //   //   if (hitShip.damage.length + 1 >= hitShip.length) {
  //   //     this.targets.shift();
  //   //   }
  //   // }
  // }


  updateTargetsList(attackCoord, targets, enemyShips = this.opponent.board.fleet) {
    let hitShip;
    enemyShips.forEach((ship) => {
      if (ship.position.includes(attackCoord)) hitShip = ship;
    });

    if (hitShip) {
      if (!targets.includes(hitShip)) {
        this.targets.push(hitShip);
      }

      if (hitShip.damage.length >= hitShip.length) {
        console.log(hitShip);
        console.log(targets);

        // MAKE SURE REMOVE RIGHT SHIP
        this.targets.shift();
      }
    }
  }

  autoAttack(targets = this.targets) {

    // If there are targets then get a guided coord, else random coord
    const attackCoord =
      targets.length < 1
        ? this.getRandomCoord()
        : this.getGuidedCoord(targets[0]);
    // this.calibrateAttack(attackCoord);
    this.attack(attackCoord);

    const result = this.reportAttackResult(attackCoord);

    if (result === 'hit' || result === 'sunk' || result === 'destroyed') {
      this.updateTargetsList(attackCoord, targets)
    }

    if (targets.length > 0) {
      if (result === 'miss') {
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

    // console.log(targets)

  }
}
