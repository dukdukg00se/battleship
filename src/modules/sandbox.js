/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty */
/* eslint-disable no-console */
/* eslint-disable max-classes-per-file */

/* Helper functions */
function getFloor(num, horizontal) {
  if (horizontal) {
    return num % 10 === 0 ? num - 9 : Math.floor(num / 10) * 10 + 1;
  }
  if (num % 10 === 0) return 10;
  if (num <= 10) return num;
  return num - Math.floor(num / 10) * 10;
}

function getCeiling(num, horizontal) {
  if (horizontal) return Math.ceil(num / 10) * 10;
  if (num % 10 === 0) return 100;
  return num + (100 - Math.ceil(num / 10) * 10);
}

function isRedundant(parentArr, childArr) {
  return childArr.some((element) => parentArr.includes(element));
}

function genNmbr(limit) {
  return Math.floor(Math.random() * limit) + 1;
}
/* Helper functions */

class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
    this.position = [];
    this.damage = [];
  }

  hit(coord) {
    this.damage.push(coord);
    this.damage.sort((a, b) => a - b);
  }

  isSunk() {
    return this.damage.length >= this.position.length;
  }
}

class Gameboard {
  constructor() {
    this.fleet = [];
    this.shipsLost = [];
  }

  // addShip(ship) {
  //   this.fleet.push(ship);
  // }

  receiveAttack(incoming) {
    this.fleet.forEach((ship) => {
      ship.position.forEach((coord) => {
        if (coord === incoming) {
          ship.hit(incoming);
          if (ship.isSunk()) {
            this.shipsLost.push(ship);
            if (this.fleetLost()) {
              // console.log('No ships left');
            }
          }
        }
      });
    });
  }

  fleetLost() {
    return this.shipsLost.length >= this.fleet.length;
  }
}

class Player {
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
      new Ship('patrol', 2),
      new Ship('destroyer', 3),
      new Ship('submarine', 3),
    ];

    allShips.forEach((ship) => fleet.push(ship));
  }
}

class AIPlayer extends Player {
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

  getAttackResults(opp, targetCoord) {
    const targetNames = this.targets.reduce((names, oppShip) => {
      names.push(oppShip.name);
      return names;
    }, []);
    const oppShipCoords = opp.board.fleet.reduce((coords, ship) => {
      coords.push(...ship.position);
      return coords;
    }, []);
    // Already logged in Player attack method
    // this.attacks.push(targetCoord);

    if (!oppShipCoords.includes(targetCoord)) {
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
            // console.log(ship);
            this.targets.shift(); // check if shift will work
          }
        }
      });
    });
  }

  autoAttack(opp, targets = this.targets) {
    let targetCoord;

    if (targets.length < 1) targetCoord = this.getRandomCoord();
    else targetCoord = this.getGuidedCoord(targets[0]);

    this.attack(opp, targetCoord);
    this.getAttackResults(opp, targetCoord);
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

    if (isRedundant(exclude, position) || position[position.length - 1] > max) {
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

// class AIPlayer extends Player {
//   name = 'COMPUTER';

//   targets = [];

//   targetDir = 'back';

//   getFloor(num, xAxis) {
//     if (xAxis) {
//       if (num % 10 === 0) return num - 9;
//       return Math.floor(num / 10) * 10 + 1;
//     }
//     if (num % 10 === 0) return 10;
//     if (num <= 10) return num;
//     return num - Math.floor(num / 10) * 10;
//   }

//   getCeiling(num, xAxis) {
//     if (xAxis) return Math.ceil(num / 10) * 10;
//     if (num % 10 === 0) return 100;
//     return num + (100 - Math.ceil(num / 10) * 10);
//   }

//   getGuidedCoord(ship, dir = this.targetDir, excl = this.attacks) {
//     let coord;
//     const indx = dir === 'back' || dir === 'down' ? ship.damage.length - 1 : 0;
//     const isXAxis = dir === 'back' || dir === 'front';
//     console.log('Index and val ', indx, ship.damage[indx]);
//     const floor = this.getFloor(ship.damage[indx], isXAxis);
//     const ceil = this.getCeiling(ship.damage[indx], isXAxis);
//     console.log('X-axis: ', isXAxis);
//     console.log('Floor and ceil: ', floor, ceil);

//     if (dir === 'back') {
//       coord = ship.damage[indx] + 1;

//       if (excl.includes(coord) || coord < floor || coord > ceil) {
//         return this.getGuidedCoord(ship, 'front');
//       }
//     }

//     if (dir === 'front') {
//       coord = ship.damage[indx] - 1;

//       if (excl.includes(coord) || coord < floor || coord > ceil) {
//         return this.getGuidedCoord(ship, 'down');
//       }
//     }

//     if (dir === 'down') {
//       coord = ship.damage[indx] + 10;

//       if (excl.includes(coord) || coord < floor || coord > ceil) {
//         return this.getGuidedCoord(ship, 'up');
//       }
//     }

//     if (dir === 'up') {
//       coord = ship.damage[0] - 10;

//       if (excl.includes(coord) || coord < floor || coord > ceil) {
//         return this.getGuidedCoord(ship, 'back');
//       }
//     }
//     console.log('coord: ', coord);
//     return coord;
//   }

//   getRandomCoord(exclude = this.attacks, gridSize = 100) {
//     let coord = Math.floor(Math.random() * gridSize);
//     while (exclude.includes(coord)) {
//       coord = Math.floor(Math.random() * gridSize);
//     }
//     return coord;
//   }

//   getAttackResults(opp, targetCoord) {
//     const targetNames = this.targets.reduce((names, oppShip) => {
//       names.push(oppShip.name);
//       return names;
//     }, []);
//     const oppShipCoords = opp.board.fleet.reduce((coords, ship) => {
//       coords.push(...ship.position);
//       return coords;
//     }, []);
//     // Already logged in Player attack method
//     // this.attacks.push(targetCoord);

//     if (!oppShipCoords.includes(targetCoord)) {
//       if (this.targets.length > 0) {
//         switch (this.targetDir) {
//           case 'back':
//             this.targetDir = 'front';
//             break;
//           case 'front':
//             this.targetDir = 'down';
//             break;
//           case 'down':
//             this.targetDir = 'up';
//             break;
//           default:
//             this.targetDir = 'back';
//         }
//       }
//     }

//     opp.board.fleet.forEach((ship) => {
//       ship.position.forEach((coord) => {
//         if (coord === targetCoord) {
//           if (!targetNames.includes(ship.name)) {
//             this.targets.push(ship);
//           }

//           if (ship.isSunk()) {
//             console.log(ship);
//             this.targets.shift(); // check if shift will work
//           }
//         }
//       });
//     });
//   }

//   autoAttack(opp, targets = this.targets) {
//     let targetCoord;

//     if (targets.length < 1) targetCoord = this.getRandomCoord();
//     // if (targets.length < 1) targetCoord = 30;
//     else targetCoord = this.getGuidedCoord(targets[0]);

//     this.attack(opp, targetCoord);
//     this.getAttackResults(opp, targetCoord);
//   }

//   assembleFleet() {
//     const takenPosits = [];
//     const allShips = [
//       new Ship('carrier', 5),
//       new Ship('battleship', 4),
//       new Ship('patrol', 2),
//       new Ship('destroyter', 3),
//       new Ship('submarine', 3),
//     ];

//     allShips.forEach((ship) => {
//       const xAxis = !!Math.round(Math.random());
//       let startCoord = this.getRandomCoord(takenPosits);
//       let ceil = this.getCeiling(startCoord, xAxis);

//       if (xAxis) {
//         while (startCoord + ship.length - 1 > ceil) {
//           startCoord = this.getRandomCoord(takenPosits);
//           ceil = this.getCeiling(startCoord, xAxis);
//         }
//       } else {
//         while (startCoord + ship.length * 10 > ceil) {
//           startCoord = this.getRandomCoord(takenPosits);
//           ceil = this.getCeiling(startCoord, xAxis);
//         }
//       }

//       for (let i = 0; i < ship.length; i += 1) {
//         let coord;

//         if (xAxis) {
//           coord = startCoord + i;
//         } else {
//           coord = startCoord + i * 10;
//         }
//         takenPosits.push(coord);
//         ship.position.push(coord);
//       }

//       this.board.addShip(ship);
//     });
//   }
// }

/* ---------------------------------- */

const player1 = Player('Will');
const player2 = new AIPlayer();
player1.assembleFleet();
player1.positionFleet();
player2.assembleFleet();
player2.positionFleet();

// const carrier1 = new Ship('Carrier', 5);
// const battleship1 = new Ship('Battleship', 4);
// const patrolBoat1 = new Ship('Patrol', 2);
// const destroyer1 = new Ship('Destroyter', 3);
// const sub1 = new Ship('Submarine', 3);

// carrier1.position = [1, 2, 3, 4, 5];
// battleship1.position = [6, 7, 8, 9];
// patrolBoat1.position = [36, 46];
// destroyer1.position = [33, 34, 35];
// sub1.position = [17, 27, 37];

// const player1 = new Player('Will');
// player1.board.addShip(carrier1);
// player1.board.addShip(battleship1);
// player1.board.addShip(patrolBoat1);
// player1.board.addShip(destroyer1);
// player1.board.addShip(sub1);

// player2.board.addShip(battleship2);
// player2.board.addShip(patrolBoat2);

// player1.attack(player2, 15);
// player1.attack(player2, 16);
// player1.attack(player2, 6);
// player1.attack(player2, 7);
// player1.attack(player2, 8);
// player1.attack(player2, 9);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);
player2.autoAttack(player1);

// console.log(player2.board.shipsLost);
// console.log('Player2: ', player2.board.fleet);
console.log(player1);
console.log('--------------------------------');
console.log(player2);
console.log('--------------------------------');
console.log(player1.board.fleet);
// console.log('--------------------------------');
// console.log(player2.board.fleet);
// console.log('Player1: ', player1.board.fleet);
// console.log(player2.board.isAllSunk());

// player1.board.fleet.forEach((ship) => {
//   console.log(ship.position);
// });
// console.log('--------------------------------');
// player2.board.fleet.forEach((ship) => {
//   console.log(ship.position);
// });
