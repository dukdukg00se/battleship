import Player from './data/player';
import AIPlayer from './data/ai-player';
import {
  getCeiling,
  isCoordsEligible,
  getPositionCoords,
} from './data/aux-helper-fns';
import {
  removeShadows,
  changeAxis,
  removeShipPositions,
  showShipShadow,
  showShipPosition,
  showFleetPosition,
  showShipSunk,
  unlockSq,
} from './dom/aux-dom-fns';
import { createBattleGrids, markShot } from './dom/battle-section';
import { createPositUI } from './dom/positioning-section';
import playerPrompt from './dom/player-prompt';
import declareWinner from './dom/winner-section';
import startForm from './dom/start-form';

function msgPlayer(text, i = 0) {
  if (i > text.length) return;
  const headMsg = document.querySelector('.prompt');
  headMsg.textContent = text.substring(0, (i += 1));

  setTimeout(() => {
    msgPlayer(text, i);
  }, 30);
}

function startGame(plyr1, plyr2, turnCount = 0) {
  let msg;
  let player;
  let enemyWaters;
  let winner;

  if (turnCount === 0) {
    // console.log(plyr2.board.fleet);

    msg = `ENEMY DETECTED, AWAITING ORDERS ADMIRAL...`;
    msgPlayer(msg);
  }

  if (turnCount % 2 === 0) {
    player = plyr1;
    enemyWaters = document.querySelector('.plyr2');
    winner = plyr2.winner ? plyr2.name : undefined;
  } else {
    player = plyr2;
    enemyWaters = document.querySelector('.plyr1');
    winner = plyr1.winner ? plyr1.name : undefined;
  }

  if (!winner) {
    if (player === plyr1) {
      enemyWaters.onclick = (e) => {
        const targSq = e.target.closest('.sq');
        if (targSq) {
          const turn = playerAttack(player, targSq);

          if (turn !== 'repeat') {
            enemyWaters.onclick = null;
            setTimeout(() => {
              startGame(plyr1, plyr2, (turnCount += 1));
            }, 2600);
          }
        }
      };
    } else {
      msg = `THE ENEMY IS AIMING...`;
      msgPlayer(msg);

      setTimeout(() => {
        computerAttack(player, enemyWaters);
      }, 1200);

      setTimeout(() => {
        startGame(plyr1, plyr2, (turnCount += 1));
      }, 2600);
    }
  } else {
    setTimeout(() => {
      const main = document.querySelector('main');
      main.textContent = '';
      main.append(declareWinner(winner));

      const resetBtn = document.getElementById('reset-btn');
      resetBtn.onclick = () => {
        initNewGame();
      };
    }, 3000);
  }
}

// function computerAttack(plyr, grid) {
//   let msg;
//   plyr.autoAttack();
//   const attackCoord = plyr.reportAttackCoord();

//   const sq = grid.querySelector(`[data-nmbr="${attackCoord}"]`);
//   sq.append(markShot());

//   const result = plyr.reportAttackResult(attackCoord);
//   if (result === 'miss') {
//     sq.firstChild.classList.add('miss');
//     msg = 'THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND MISSES!';
//   } else {
//     sq.firstChild.classList.add('hit');
//     const ship = plyr.identifyEnemyShip(attackCoord);
//     if (result === 'hit') {
//       msg = `THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND HITS YOUR ${ship.name}!`;
//     } else {
//       showShipSunk(ship.position, sq.parentNode);
//       if (result === 'sunk') {
//         msg = `THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND SINKS YOUR ${ship.name}!`;
//       } else {
//         msg = `THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND SINKS YOUR ${ship.name}! YOU ARE DEFEATED!`;
//         plyr.winner = true;
//       }
//     }
//   }
//   msgPlayer(msg);
// }

function computerAttack(plyr, grid) {
  let msg;
  const attackCoord = plyr.getAttackCoord()
  const sq = grid.querySelector(`[data-nmbr="${attackCoord}"]`);

  plyr.attack(attackCoord);
  sq.append(markShot());

  const result = plyr.reportAttackResult(attackCoord);
  if (result === 'miss') {
    if (plyr.targets.length > 0) plyr.updateTargetingDir();

    sq.firstChild.classList.add('miss');
    msg = 'THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND MISSES!';
  } else {
    plyr.updateTargetsList(attackCoord);

    sq.firstChild.classList.add('hit');
    const ship = plyr.identifyEnemyShip(attackCoord);
    if (result === 'hit') {
      msg = `THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND HITS YOUR ${ship.name}!`;
    } else {
      showShipSunk(ship.position, sq.parentNode);
      if (result === 'sunk') {
        msg = `THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND SINKS YOUR ${ship.name}!`;
      } else {
        msg = `THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND SINKS YOUR ${ship.name}! YOU ARE DEFEATED!`;
        plyr.winner = true;
      }
    }
  }
  msgPlayer(msg);
}







function playerAttack(plyr, sq) {
  let msg;
  const attackCoord = +sq.dataset.nmbr;

  if (plyr.attacks.includes(attackCoord)) {
    return 'repeat';
  }

  plyr.attack(attackCoord);
  sq.append(markShot());
  sq.classList.toggle('lock');
  sq.classList.toggle('target');

  const result = plyr.reportAttackResult(attackCoord);
  if (result === 'miss') {
    sq.firstChild.classList.add('miss');
    msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND MISS!`;
  } else {
    sq.firstChild.classList.add('hit');
    const ship = plyr.identifyEnemyShip(attackCoord);
    if (result === 'hit') {
      msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND HIT AN ENEMY SHIP!`;
    } else {
      showShipSunk(ship.position, sq.parentNode);
      if (result === 'sunk') {
        msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND SINK THEIR ${ship.name}!`;
      } else {
        msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND SINK THEIR ${ship.name}! CONGRATULATIONS, YOU SANK THE LAST ENEMY SHIP!`;
        plyr.winner = true;
      }
    }
  }
  msgPlayer(msg);
}

function setBoard(name) {
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

function selectAction(plyr1, plyr2, e) {
  const playerShips = plyr1.board.fleet;

  if (e.target.id === 'axis') {
    changeAxis(e);
  } else if (e.target.id === 'clear') {
    plyr1.resetFleet();
    removeShipPositions();
    placePlayerShips(plyr1);
  } else if (e.target.id === 'battle') {
    if (playerShips[playerShips.length - 1].position.length > 0) {
      const positContainer = document.querySelector('.posit-container');
      positContainer.style.animation =
        '.5s ease-in 0s 1 normal forwards running fadeout';

      e.target.disabled = true;

      setTimeout(() => {
        positContainer.parentNode.append(createBattleGrids());
        positContainer.remove();
        showFleetPosition(plyr1);
        startGame(plyr1, plyr2);
      }, 500);

      return;
    }

    const msg = `Admiral ${plyr1.name}, you must prepare your fleet for battle. Please position your ships.`;
    msgPlayer(msg.toUpperCase());
  } else {
    removeShipPositions();
    plyr1.autoPositionFleet();
    playerShips.forEach((ship) => {
      showShipPosition(ship.position);
    });
    placePlayerShips(plyr1, playerShips.length);
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
      const sq = e.target.closest('.sq');
      if (sq) {
        const startCoord = +sq.dataset.nmbr;
        const { axis } = document.querySelector('#axis').dataset;
        const max = getCeiling(startCoord, axis);
        shipPosition = [...getPositionCoords(currentShip, startCoord, axis)];

        if (isCoordsEligible(exclude, shipPosition, max)) {
          unlockSq(sq);
          showShipShadow(shipPosition);
          shipPosition.forEach;
        }
      }
    };

    grid.onclick = (e) => {
      if (e.target.classList.contains('unlock')) {
        currentShip.position = shipPosition;
        exclude.push(...currentShip.position);

        showShipPosition(shipPosition);

        if (currentShip.position.length > 0) {
          placePlayerShips(player, (index += 1), exclude);
        }
      }
    };

    grid.onmouseout = removeShadows;
  }

  msgPlayer(msg.toUpperCase());
}

export default function initNewGame() {
  const main = document.querySelector('main');
  main.textContent = '';
  main.append(startForm());

  const submitBtn = document.querySelector('form > button');
  const form = document.querySelector('form');
  const nameInput = document.getElementById('input-name');
  const errMsg = document.querySelector('form > p');

  submitBtn.addEventListener('click', (e) => {
    if (nameInput.validity.valueMissing) {
      errMsg.style.visibility = 'visible';
      return;
    }

    e.target.disabled = true;
    errMsg.style.visibility = 'hidden';
    form.classList.add('disappear');

    setTimeout(() => {
      form.remove();
      main.append(playerPrompt(), createPositUI());
      setBoard(nameInput.value);
    }, 900);
  });
}
