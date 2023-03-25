import Player from './data/player';
import AIPlayer from './data/ai-player';
import { getCeiling, isCoordsEligible, getPositionCoords } from './data/aux-helper-fns';
import {
  removeShadows,
  changeAxis,
  removeShipPositions,
  showShipShadow,
  showShipPosition,
  showFleetPosition,
  unlockSq,
} from './dom/aux-dom-fns';
import { createBattleGrids, markShot } from './dom/battle-section';
import { createPositUI } from './dom/positioning-section';
import playerPrompt from './dom/player-prompt';

/* eslint-disable */

function msgPlayer(text, i = 0) {
  if (i > text.length) return;
  const headMsg = document.querySelector('.prompt');
  headMsg.textContent = text.substring(0, (i += 1));

  setTimeout(() => {
    msgPlayer(text, i);
  }, 25);
}

// startAttackBy()
function playerAttack(plyr, sq) {
  const attackCoord = +sq.dataset.nmbr;
  let msg;

  if (plyr.attacks.includes(attackCoord)) {
    return;
  }

  sq.append(markShot());
  sq.classList.toggle('lock', 'target');

  plyr.attack(attackCoord);
  const result = plyr.reportAttackResult();

  if (result === 'miss') {
    sq.firstChild.classList.add('miss');
    msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND MISS!`;

  } else {
    sq.firstChild.classList.add('hit');

    if (result === 'hit') {
      msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND HIT AN ENEMY SHIP!`;
    } else if (result === 'allSunk') {
      msg = `CONGRATULATIONS, YOU SANK THE LAST ENEMY SHIP!`;
    } else {
      msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND SINK THEIR ${result}!`;
    }
  }

  msgPlayer(msg);  
}

function computerAttack(plyr, grid) {
  let msg = `THE ENEMY IS RETURNING FIRE...`;

  setTimeout(() => {
    plyr.autoAttack();
    const result = plyr.reportAttackResult();
    const attack = plyr.reportAttackCoord();
    const sq = grid.querySelector(`[data-nmbr="${attack}"]`);
    sq.append(markShot());

    if (result === 'miss') {
      sq.firstChild.classList.add('miss');
      msg = 'THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND MISSES!';

    } else {
      sq.firstChild.classList.add('hit');

      if (result === 'hit') {
        msg = `THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND HITS YOUR ${result}!`;

      } else if (result === 'allSunk') {
        msg = `THE ENEMY SANK YOUR LAST SHIP, YOU LOST!`;

      } else {
        msg = `THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND SINKS YOUR ${result}!`;
      }

    }

    msgPlayer(msg); 
  }, 2000)


  msgPlayer(msg);  
}

function startBattle(plyr1, plyr2, turnCount = 0) {

  console.log(turnCount)

  let msg;
  let player;
  let enemyWaters;


  if (turnCount === 0) {
    msg = `ENEMY DETECTED, AWAITING ORDERS ADMIRAL...`;
    msgPlayer(msg);
  }

  if (turnCount % 2 === 0) {
    player = 'plyr1';
    enemyWaters = document.querySelector('.plyr2');
  } else {
    player = 'plyr2';
    enemyWaters = document.querySelector('.plyr1');
  }

  if (player === 'plyr1') { // player1 turn
    
    enemyWaters.onclick = (e) => {
      console.log('click')
      
      const targSq = e.target.closest('.sq');
      if (targSq) {
        playerAttack(plyr1, targSq);
        // enemyWaters.onclick = null;
        setTimeout(() => {
          startBattle(plyr1, plyr2, turnCount += 1);
        }, 2000)
        
        // let attackCoord = +targSq.dataset.nmbr;

        // if (player1.attacks.includes(attackCoord)) {
        //   return;
        // }

        // targSq.append(markShot());
        // targSq.classList.add('lock');
        // targSq.classList.remove('target');

        // player1.attack(attackCoord);
        // let result = player1.report();

        // if (result === 'hit') {
        //   msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND HIT AN ENEMY SHIP!`;

        //   targSq.firstChild.classList.add('hit');

        // } else if (result === 'miss') {
        //   msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND MISS!`;

        //   targSq.firstChild.classList.add('miss');

        // } else if (result === 'allSunk') {
        //   targSq.firstChild.classList.add('hit');

        //   msg = `YOU SANK THE LAST ENEMY SHIP!!`;

        //   // winner = player1.name;
        //   // Do something
        // } else {
        //   targSq.firstChild.classList.add('hit');

        //   msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND SINK THEIR ${result}!`;
        // }

        // msgPlayer(msg);
      }
    };
  } 

  else {
    console.log('player2')
    computerAttack(plyr2, enemyWaters);

    setTimeout(() => {
      startBattle(plyr1, plyr2, turnCount += 1);
    }, 2000)
  }
  
  // if (turn === 'computer') {
  //   setTimeout(() => {
  //     msg = `THE ENEMY IS RETURNING FIRE...`;
  //     msgPlayer(msg);
  //   }, 2200);

  //   setTimeout(() => {
  //     let oppResult = opponent.autoAttack();
  //     let attack = opponent.attacks[opponent.attacks.length - 1];
  //     const playerSq = document.querySelector(
  //       `.player > [data-nmbr="${attack}"]`
  //     );
  //     playerSq.append(markShot());

  //     if (oppResult === 'hit') {
  //       playerSq.firstChild.classList.add('hit');

  //       let ship = playerSq.dataset.ship;

  //       msg = `THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND HITS YOUR ${ship}!`;
  //       msgPlayer(msg);
  //     } else if (oppResult === 'miss') {
  //       msg = 'THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND MISSES!';
  //       msgPlayer(msg);

  //       playerSq.firstChild.classList.add('miss');
  //     } else if (oppResult === 'sunk') {
  //       playerSq.firstChild.classList.add('hit');

  //       const oppLostShips = opponent.opponent.board.shipsLost;
  //       // const sunkShip = oppLostShips[oppLostShips.length - 1];

  //       let ship = playerSq.dataset.ship;

  //       msg = `THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND SINKS YOUR ${ship}!`;
  //       msgPlayer(msg);

  //       // console.log(sunkShip)
  //     } else if (oppResult === 'lost') {
  //       playerSq.firstChild.classList.add('hit');

  //       msg = `THE ENEMY SANK YOUR LAST SHIP, YOU LOST!`;
  //       msgPlayer(msg);

  //       // winner = opponent.name;
  //       // Do something
  //     }

  //     // This works
  //     oppGrid.onclick = (e) => {
  //       oppGrid.onclick = null;

  //       const targSq = e.target.closest('.sq');
  //       if (targSq) {
  //         targSq.append(shotMarker());

  //         // No styles here
  //         targSq.classList.add('locked');

  //         let attackCoord = +targSq.dataset.nmbr;
  //         let result = player1.attack(attackCoord);

  //         if (result === 'hit') {
  //           targSq.firstChild.classList.add('hit');

  //           msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND HIT AN ENEMY SHIP!`;
  //           msgPlayer(msg);
  //         } else if (result === 'miss') {
  //           msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND MISS!`;
  //           msgPlayer(msg);

  //           targSq.firstChild.classList.add('miss');
  //         } else if (result === 'sunk') {
  //           targSq.firstChild.classList.add('hit');

  //           const oppLostShips = player1.opponent.board.shipsLost;
  //           const sunkShip = oppLostShips[oppLostShips.length - 1];

  //           msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND SINK THEIR ${sunkShip.name}!`;
  //           msgPlayer(msg);

  //           console.log(sunkShip);
  //         } else if (result === 'lost') {
  //           targSq.firstChild.classList.add('hit');

  //           msg = `YOU SANK THE LAST ENEMY SHIP!!`;
  //           msgPlayer(msg);
  //           winner = player1.name;
  //           // Do something
  //         }

  //         startBattle(player1, opponent, 'computer');
  //       }
  //     };
  //   }, 4200);
  // }
}





function startGame(name) {
  const player1 = new Player(name);
  const player2 = new AIPlayer();

  player1.opponent = player2;
  player2.opponent = player1;
  player1.assembleFleet();
  player2.assembleFleet();
  player2.autoPositionFleet();

  placePlayerShips(player1);

  const btns = document.querySelectorAll('button');
  btns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      selectAction(player1, player2, e);
    });
  });
}

function selectAction(player, opponent, event) {
  const playerShips = player.board.fleet;
  
  if (event.target.id === 'axis') {
    changeAxis(event);
  } else if (event.target.id === 'clear') {
    player.resetFleet();
    removeShipPositions();
    placePlayerShips(player);
  } else if (event.target.id === 'battle') {
    if (playerShips[playerShips.length - 1].position.length > 0) {
      const positContainer = document.querySelector('.posit-container');
      positContainer.style.animation = '.5s ease-in 0s 1 normal forwards running fadeout';

      event.target.disabled = true;
      event.target.classList.add('undisable');

      setTimeout(() => {
        positContainer.parentNode.append(createBattleGrids(player, opponent))
        positContainer.remove();

        showFleetPosition(player);
        startBattle(player, opponent);
        // msg = `ENEMY DETECTED, AWAITING ORDERS ADMIRAL...`;
        // msgPlayer(msg);
      }, 500);

      return;
    }

    let msg = `Admiral ${player.name}, you must prepare your fleet for battle. Please position your ships.`;
    msgPlayer(msg.toUpperCase());
  } else { // random btn
    
    removeShipPositions();
    player.autoPositionFleet();
    playerShips.forEach((ship) => {
      showShipPosition(ship.position);
    });

    // Shows msg to press battle, add index
    placePlayerShips(player, playerShips.length);
  }
}


function placePlayerShips(player, index = 0, exclude = []) {
  const grid = document.querySelector('.grid');
  const { name } = player;
  const ships = player.board.fleet;
  const currentShip = ships[index];
  let msg;

  if (index >= ships.length) {
    msg = `Admiral ${name}, fleet ready. Press battle to continue.`;
    grid.onmouseover = null;
    grid.onclick = null;
  } else {
    msg = `Admiral ${name}, position your ${currentShip.name}.`;

    let shipPosition = [];
    grid.onmouseover = (e) => {
      let sq = e.target.closest('.sq');
      if (sq) {
        const startCoord = +sq.dataset.nmbr;
        const axis = document.querySelector('#axis').dataset.axis;
        const max = getCeiling(startCoord, axis);
        shipPosition = [...getPositionCoords(currentShip, startCoord, axis)];

        if (isCoordsEligible(exclude, shipPosition, max)) {
          unlockSq(sq);
          showShipShadow(shipPosition);
        }
      }
    };

    grid.onclick = (e) => {
      if (e.target.classList.contains('unlock')) {
        currentShip.position = shipPosition;
        exclude.push(...currentShip.position);

        showShipPosition(shipPosition);

        if (currentShip.position.length > 0) {
          placePlayerShips(player, index += 1, exclude);
        }
      }
    };

    grid.onmouseout = removeShadows;
  }

  msgPlayer(msg.toUpperCase());
}

// Initialize a new game by setting listener to submit btn
export default function initNewGame() {
  const submitBtn = document.querySelector('form > button');
  submitBtn.addEventListener('click', processForm);
}

// Process start form
// If name missing show err msg
// Else remove form, add posit page and start game
function processForm(e) {
  const main = document.querySelector('main');
  const form = document.querySelector('form');
  const nameInput = document.getElementById('input-name');
  const errMsg = document.querySelector('form > p');

  if (nameInput.validity.valueMissing) {
    errMsg.style.visibility = 'visible';
    return;
  }

  e.target.disabled = true;
  e.target.classList.add('undisable');
  errMsg.style.visibility = 'hidden';
  form.classList.add('disappear');

  setTimeout(() => {
    form.remove();
    main.append(playerPrompt(), createPositUI());
    startGame(nameInput.value);
  }, 900);
}

// function startBattle(player1, opponent) {
//   let winner;
//   let msg = `ENEMY DETECTED, AWAITING ORDERS ADMIRAL...`;
//   msgPlayer(msg);

//   const oppGrid = document.querySelector('.opponent');

//   if (!winner) {
//     oppGrid.onclick = (e) => {
//       console.log(currentTurn);
//       // oppGrid.style.pointerEvents = 'none';

//       const targSq = e.target.closest('.sq');
//       if (targSq) {
//         targSq.append(shotMarker());

//         // No styles here
//         targSq.classList.add('locked');

//         targSq.style.pointerEvents = 'none';

//         let attackCoord = +targSq.dataset.nmbr;
//         let result = player1.attack(attackCoord);

//         if (result === 'hit') {
//           targSq.firstChild.classList.add('hit');

//           msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND HIT AN ENEMY SHIP!`;
//           msgPlayer(msg);
//         }

//         else if (result === 'miss') {
//           msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND MISS!`;
//           msgPlayer(msg);

//           targSq.firstChild.classList.add('miss');
//         }

//         else if (result === 'sunk') {
//           targSq.firstChild.classList.add('hit');

//           const oppLostShips = player1.opponent.board.shipsLost;
//           const sunkShip = oppLostShips[oppLostShips.length - 1];

//           msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND SINK THEIR ${sunkShip.name}!`;
//           msgPlayer(msg);

//           console.log(sunkShip)
//         }

//         else if (result === 'lost') {
//           targSq.firstChild.classList.add('hit');

//           msg = `YOU SANK THE LAST ENEMY SHIP!!`;
//           msgPlayer(msg);
//           winner = player1.name;
//           // Do something
//         }

//         setTimeout(() => {
//           // currentTurn = 'player';

//           let oppResult = opponent.autoAttack();
//           let attack = opponent.attacks[opponent.attacks.length - 1];

//           const playerSq = document.querySelector(`.player > [data-nmbr="${attack}"]`);
//           playerSq.append(shotMarker())

//           if (oppResult === 'hit') {
//             playerSq.firstChild.classList.add('hit');

//             let ship = playerSq.dataset.ship;

//             msg = `THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND HIT YOUR ${ship}!`;
//             msgPlayer(msg);
//           }

//           else if (oppResult === 'miss') {
//             msg = 'THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND MISSES!';
//             msgPlayer(msg);

//             playerSq.firstChild.classList.add('miss');
//           }

//           else if (oppResult === 'sunk') {
//             playerSq.firstChild.classList.add('hit');

//             const oppLostShips = opponent.opponent.board.shipsLost;
//             // const sunkShip = oppLostShips[oppLostShips.length - 1];

//             let ship = playerSq.dataset.ship;

//             msg = `THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND SINKS YOUR ${ship}!`;
//             msgPlayer(msg);

//             // console.log(sunkShip)
//           }

//           else if (oppResult === 'lost') {
//             playerSq.firstChild.classList.add('hit');

//             msg = `THE ENEMY SANK YOUR LAST SHIP, YOU LOST!`;
//             msgPlayer(msg);

//             winner = opponent.name;
//             console.log('Winner')

//             // Do something
//           }

//         }, 2500)

//         // console.log(player1, opponent);
//       }

//     };
//   }
// }

// Belongs in display
// function shotMarker() {
//   const circle = document.createElement('div');
//   circle.classList.add('circle');
//   return circle;
// }

// function lockSqs() {
//   const sqs = document.querySelectorAll('.sq');
//   sqs.forEach((sq) => {
//     sq.onclick = null;
//     sq.classList.remove('unlock');
//     sq.classList.add('lock');
//   });
// }

// function changeAxis() {
//   const axisBtn = document.querySelector('#axis');
//   axisBtn.onclick = (e) => {
//     if (e.target.dataset.axis === 'x') {
//       e.target.dataset.axis = 'y';
//       e.target.textContent = 'AXIS: Y';
//     } else {
//       e.target.dataset.axis = 'x';
//       e.target.textContent = 'AXIS: X';
//     }
//   };
// }

// function showShipShadow(coords) {
//   coords.forEach((coord) => {
//     const sq = document.querySelector(`[data-nmbr="${coord}"]`);
//     sq.classList.remove('lock');
//     sq.classList.add('unlock');
//   });
// }
