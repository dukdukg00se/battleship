import Player from './player';
import AIPlayer from './ai-player';
import { getCeiling, isCoordsEligible } from './helpers';
import createBattlePage from './display/battle';

/* eslint-disable */

function changeAxis() {
  const axisBtn = document.querySelector('#axis');
  axisBtn.onclick = (e) => {
    if (e.target.dataset.axis === 'x') {
      e.target.dataset.axis = 'y';
      e.target.textContent = 'AXIS: Y';
    } else {
      e.target.dataset.axis = 'x';
      e.target.textContent = 'AXIS: X';
    }
  };
}

function createCircle() {
  const circle = document.createElement('div');
  circle.classList.add('circle');
  return circle;
}

function msgPlayer(text, i = 0) {
  if (i > text.length) return;
  const headMsg = document.querySelector('.prompt');
  headMsg.textContent = text.substring(0, (i += 1));

  setTimeout(() => {
    msgPlayer(text, i);
  }, 30);
}

function lockSqs() {
  const sqs = document.querySelectorAll('.sq');
  sqs.forEach((sq) => {
    sq.onclick = null;
    sq.classList.remove('unlock');
    sq.classList.add('lock');
  });
}

function placeShips(index, player, exclude) {
  const { name } = player;
  const ships = player.board.fleet;
  const grid = document.querySelector('.grid');
  let shipLocation = [];
  const ship = ships[index];
  let msg;

  if (index >= ships.length) {
    msg = `Admiral ${name}, fleet ready. Press battle to continue.`;
    msgPlayer(msg.toUpperCase());

    grid.onmouseover = null;

    return;
  } else {
    msg = `Admiral ${name}, position your ${ship.name}.`;
    msgPlayer(msg.toUpperCase());

    let startCoord;
    let axis;
    let max;
    let sq;

    grid.onmouseover = (e) => {
      sq = e.target.closest('.sq');
      if (sq) {
        const reqCoords = [];
        startCoord = +sq.dataset.nmbr;
        axis = document.querySelector('#axis').dataset.axis;
        max = getCeiling(startCoord, axis === 'x');

        for (let i = 0; i < ship.length; i += 1) {
          const coord = axis === 'x' ? startCoord + i : startCoord + i * 10;
          reqCoords.push(coord);
        }

        shipLocation = [...reqCoords];

        if (isCoordsEligible(shipLocation, exclude, max)) {
          shipLocation.forEach((coord) => {
            const targSq = document.querySelector(`[data-nmbr="${coord}"]`);
            targSq.classList.remove('lock');
            targSq.classList.add('unlock');
          });
        }
      }
    };

    grid.onclick = () => {
      if (isCoordsEligible(shipLocation, exclude, max)) {
        ship.position = shipLocation;
        exclude.push(...ship.position);

        shipLocation.forEach((coord) => {
          const targSq = document.querySelector(`[data-nmbr="${coord}"]`);
          targSq.classList.remove('unlock');
          targSq.classList.add('lock');
          targSq.classList.add('placed');
        });

        if (ship.position.length > 0) {
          index += 1;
          placeShips(index, player, exclude);
        }
      }
    };

    grid.onmouseout = lockSqs;
  }
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
//         targSq.append(createCircle());

//         // No styles here
//         targSq.classList.add('locked');

//         targSq.style.pointerEvents = 'none';

//         let attackCoord = +targSq.dataset.nmbr;
//         let playerResult = player1.attack(attackCoord);

//         if (playerResult === 'hit') {
//           targSq.firstChild.classList.add('hit');

//           msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND HIT AN ENEMY SHIP!`;
//           msgPlayer(msg);
//         } 
        
//         else if (playerResult === 'miss') {
//           msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND MISS!`;
//           msgPlayer(msg);

//           targSq.firstChild.classList.add('miss');
//         } 
        
//         else if (playerResult === 'sunk') {
//           targSq.firstChild.classList.add('hit');

//           const oppLostShips = player1.opponent.board.shipsLost;
//           const sunkShip = oppLostShips[oppLostShips.length - 1];

//           msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND SINK THEIR ${sunkShip.name}!`;
//           msgPlayer(msg);

//           console.log(sunkShip)
//         }

//         else if (playerResult === 'lost') {
//           targSq.firstChild.classList.add('hit');

//           msg = `YOU SANK THE LAST ENEMY SHIP!!`;
//           msgPlayer(msg);
//           winner = player1.name;
//           // Do something
//         }

//         setTimeout(() => {
//           // currentTurn = 'player';
//           // oppGrid.style.pointerEvents = 'auto';

//           let oppResult = opponent.autoAttack();
//           let attack = opponent.attacks[opponent.attacks.length - 1];

//           const playerSq = document.querySelector(`.player > [data-nmbr="${attack}"]`);
//           playerSq.append(createCircle())

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

function startBattle(player1, opponent, turn = 'player') {
  // console.log('start')
  let winner;


  // Change below, msg is getting overwritten on play!!!!!
  let msg = `ENEMY DETECTED, AWAITING ORDERS ADMIRAL...`;
  msgPlayer(msg);
  // Change above

  const oppGrid = document.querySelector('.opponent');

  if (!winner) {
    if (turn === 'player') {
      oppGrid.onclick = (e) => {
        console.log('player')

       oppGrid.onclick = null;

        const targSq = e.target.closest('.sq');
        if (targSq) {
          targSq.append(createCircle());
  
          // No styles here
          targSq.classList.add('locked');
  
          let attackCoord = +targSq.dataset.nmbr;
          let playerResult = player1.attack(attackCoord);
  
          if (playerResult === 'hit') {
            targSq.firstChild.classList.add('hit');
  
            msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND HIT AN ENEMY SHIP!`;
            msgPlayer(msg);
          } 
          
          else if (playerResult === 'miss') {
            msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND MISS!`;
            msgPlayer(msg);
  
            targSq.firstChild.classList.add('miss');
          } 
          
          else if (playerResult === 'sunk') {
            targSq.firstChild.classList.add('hit');
  
            const oppLostShips = player1.opponent.board.shipsLost;
            const sunkShip = oppLostShips[oppLostShips.length - 1];
  
            msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND SINK THEIR ${sunkShip.name}!`;
            msgPlayer(msg);
  
            console.log(sunkShip)
          }
  
          else if (playerResult === 'lost') {
            targSq.firstChild.classList.add('hit');
  
            msg = `YOU SANK THE LAST ENEMY SHIP!!`;
            msgPlayer(msg);
            winner = player1.name;
            // Do something
          }
  
          startBattle(player1, opponent, 'computer')
          
        }
      };
    } 
    
    else if (turn === 'computer') {
      // console.log('comp')

      msg = `THE ENEMY IS PREPARING TO RETURN FIRE.`;

      setTimeout(msgPlayer(msg), 5000);

      setTimeout(() => {
        let oppResult = opponent.autoAttack();
        let attack = opponent.attacks[opponent.attacks.length - 1];

        // This works
        oppGrid.onclick = (e) => {

          oppGrid.onclick = null;
   
           const targSq = e.target.closest('.sq');
           if (targSq) {
             targSq.append(createCircle());
     
             // No styles here
             targSq.classList.add('locked');
     
             let attackCoord = +targSq.dataset.nmbr;
             let playerResult = player1.attack(attackCoord);
     
             if (playerResult === 'hit') {
               targSq.firstChild.classList.add('hit');
     
               msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND HIT AN ENEMY SHIP!`;
               msgPlayer(msg);
             } 
             
             else if (playerResult === 'miss') {
               msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND MISS!`;
               msgPlayer(msg);
     
               targSq.firstChild.classList.add('miss');
             } 
             
             else if (playerResult === 'sunk') {
               targSq.firstChild.classList.add('hit');
     
               const oppLostShips = player1.opponent.board.shipsLost;
               const sunkShip = oppLostShips[oppLostShips.length - 1];
     
               msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND SINK THEIR ${sunkShip.name}!`;
               msgPlayer(msg);
     
               console.log(sunkShip)
             }
     
             else if (playerResult === 'lost') {
               targSq.firstChild.classList.add('hit');
     
               msg = `YOU SANK THE LAST ENEMY SHIP!!`;
               msgPlayer(msg);
               winner = player1.name;
               // Do something
             }
     
             startBattle(player1, opponent, 'computer')
             
           }
        };

        const playerSq = document.querySelector(`.player > [data-nmbr="${attack}"]`);
        playerSq.append(createCircle())

        if (oppResult === 'hit') {
          playerSq.firstChild.classList.add('hit');

          let ship = playerSq.dataset.ship;

          msg = `THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND HIT YOUR ${ship}!`;
          msgPlayer(msg);
        } 
        
        else if (oppResult === 'miss') {
          msg = 'THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND MISSES!';
          msgPlayer(msg);

          playerSq.firstChild.classList.add('miss');
        } 
        
        else if (oppResult === 'sunk') {
          playerSq.firstChild.classList.add('hit');

          const oppLostShips = opponent.opponent.board.shipsLost;
          // const sunkShip = oppLostShips[oppLostShips.length - 1];

          let ship = playerSq.dataset.ship;

          msg = `THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND SINKS YOUR ${ship}!`;
          msgPlayer(msg);

          // console.log(sunkShip)
        }

        else if (oppResult === 'lost') {
          playerSq.firstChild.classList.add('hit');

          msg = `THE ENEMY SANK YOUR LAST SHIP, YOU LOST!`;
          msgPlayer(msg);

          winner = opponent.name;
          console.log('Winner')

          // Do something
        }

        // Not needed
        // startBattle(player1, opponent, 'player')
      
      }, 10000)
          
    }

  }
}

export default function initNewGame(name) {
  const player1 = new Player(name);
  const computer = new AIPlayer();
  player1.opponent = computer;
  computer.opponent = player1;

  player1.assembleFleet();
  computer.assembleFleet();
  computer.positionFleet();

  let currentShipIndex = 0;
  let excludeCoords = [];

  placeShips(currentShipIndex, player1, excludeCoords);

  const btns = document.querySelectorAll('button');
  btns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (e.target.id === 'axis') {
        if (e.target.dataset.axis === 'x') {
          e.target.dataset.axis = 'y';
          e.target.textContent = 'AXIS: Y';
        } else {
          e.target.dataset.axis = 'x';
          e.target.textContent = 'AXIS: X';
        }
      }

      if (e.target.id === 'clear') {
        currentShipIndex = 0;
        excludeCoords = [];

        const sqs = document.querySelectorAll('.sq');
        sqs.forEach((sq) => {
          if (sq.classList.contains('placed')) {
            sq.classList.add('cleared');
          }

          setTimeout(() => {
            sq.classList.remove('placed');
            sq.classList.remove('cleared');
            sq.classList.remove('unlock');
            sq.classList.add('lock');
          }, 500);

        });

        placeShips(currentShipIndex, player1, excludeCoords);
      }

      if (e.target.id === 'battle') {
        if (player1.board.fleet[4].position.length > 0) {
          const grid = document.querySelector('.grid');
          const btnsContainer = document.querySelector('.btns-container');
          const positContainer = document.querySelector('.posit-container');

          // Blocks btn from being clicked more than once
          // Prevents adding multiple grids
          e.target.disabled = true;
          // Removes default disabled btn styles
          e.target.classList.add('undisable');

          grid.style.animation =
            '.5s ease-in 0s 1 normal forwards running fadeout';
          btnsContainer.style.animation =
            '.5s ease-in 0s 1 normal forwards running fadeout';

          setTimeout(() => {
            grid.remove();
            btnsContainer.remove();
            positContainer.append(createBattlePage(player1, computer));
            startBattle(player1, computer);
          }, 600);

          return;
        }

        let msg = `Admiral ${name}, you must prepare your fleet for battle. Please position your ships.`;
        msgPlayer(msg.toUpperCase());
      }
    });
  });
}
