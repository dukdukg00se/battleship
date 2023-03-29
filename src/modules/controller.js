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

/* eslint-disable */

function msgPlayer(text, i = 0) {
  if (i > text.length) return;
  const headMsg = document.querySelector('.prompt');
  headMsg.textContent = text.substring(0, (i += 1));

  setTimeout(() => {
    msgPlayer(text, i);
  }, 30);
}

// startAttackBy()
function playerAttack(plyr, sq) {
  const attackCoord = +sq.dataset.nmbr;
  let msg;

  const promptWrapper = document.querySelector('.prompt-wrapper');
  const gridContainer = document.querySelector('.grid-container');
  const main = document.querySelector('main');

  if (plyr.attacks.includes(attackCoord)) {
    return 'repeat';
  }

  sq.append(markShot());
  sq.classList.toggle('lock', 'target');

  plyr.attack(attackCoord);
  const result = plyr.reportAttackResult2(attackCoord);

  if (result === 'miss') {
    sq.firstChild.classList.add('miss');
    msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND MISS!`;
  } else {
    sq.firstChild.classList.add('hit');

    const ship = plyr.identifyEnemyShip(attackCoord);

    if (result === 'hit') {
      msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND HIT AN ENEMY SHIP!`;
    } else if (result === 'sunk') {
      msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND SINK THEIR ${ship.name}!`;

      showShipSunk(ship.position, sq.parentNode);
    } else {
      msg = `YOU FIRE A SHOT INTO ENEMY WATERS... AND SINK THEIR ${ship.name}! CONGRATULATIONS, YOU SANK THE LAST ENEMY SHIP!`;

      showShipSunk(ship.position, sq.parentNode);

      plyr.winner = true;

      setTimeout(() => {
        promptWrapper.classList.add('disappear');
        gridContainer.classList.add('disappear');
      }, 5000);
      setTimeout(() => {
        promptWrapper.remove();
        gridContainer.remove();
        main.append(declareWinner(plyr.name));

        const resetBtn = document.getElementById('reset-btn');
        resetBtn.onclick = () => {
          const main = document.querySelector('main');
          const winnerSection = document.querySelector('.winner-section');
          winnerSection.remove();
          main.append(startForm());
          initNewGame();
        };
      }, 5900);
    }
  }

  msgPlayer(msg);
}

function computerAttack(plyr, grid) {
  const promptWrapper = document.querySelector('.prompt-wrapper');
  const gridContainer = document.querySelector('.grid-container');
  const main = document.querySelector('main');

  setTimeout(() => {
    let msg;
    plyr.autoAttack();
    const attackCoord = plyr.reportAttackCoord();
    const result = plyr.reportAttackResult2(attackCoord);

    const sq = grid.querySelector(`[data-nmbr="${attackCoord}"]`);
    sq.append(markShot());

    if (result === 'miss') {
      sq.firstChild.classList.add('miss');
      msg = 'THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND MISSES!';
    } else {
      sq.firstChild.classList.add('hit');

      const ship = plyr.identifyEnemyShip(attackCoord);

      if (result === 'hit') {
        msg = `THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND HITS YOUR ${ship.name}!`;
      } else if (result === 'sunk') {
        msg = `THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND SINKS YOUR ${ship.name}!`;

        showShipSunk(ship.position, sq.parentNode);
      } else {
        msg = `THE ENEMY FIRES A SHOT INTO YOUR WATERS... AND SINKS YOUR ${ship.name}! YOU ARE DEFEATED!`;

        showShipSunk(ship.position, sq.parentNode);

        plyr.winner = true;

        setTimeout(() => {
          promptWrapper.classList.add('disappear');
          gridContainer.classList.add('disappear');
        }, 5000);
        setTimeout(() => {
          promptWrapper.remove();
          gridContainer.remove();
          main.append(declareWinner(plyr.name));

          const resetBtn = document.getElementById('reset-btn');
          resetBtn.onclick = () => {
            const main = document.querySelector('main');
            const winnerSection = document.querySelector('.winner-section');
            winnerSection.remove();
            main.append(startForm());
            initNewGame();
          };
        }, 5900);
      }
    }

    msgPlayer(msg);
  }, 1200);
}

function startBattle(plyr1, plyr2, turnCount = 0) {
  let msg;
  let player;
  let enemyWaters;

  let winnerDeclared;

  if (turnCount === 0) {
    console.log(plyr2.board.fleet);

    msg = `ENEMY DETECTED, AWAITING ORDERS ADMIRAL...`;
    msgPlayer(msg);
  }

  if (turnCount % 2 === 0) {
    player = plyr1;
    enemyWaters = document.querySelector('.plyr2');

    winnerDeclared = plyr2.winner;
  } else {
    player = plyr2;
    enemyWaters = document.querySelector('.plyr1');

    winnerDeclared = plyr1.winner;
  }

  if (player === plyr1) {
    if (!winnerDeclared) {
      enemyWaters.onclick = (e) => {
        const targSq = e.target.closest('.sq');
        if (targSq) {
          const turn = playerAttack(player, targSq);

          if (turn != 'repeat') {
            enemyWaters.onclick = null;

            setTimeout(() => {
              startBattle(plyr1, plyr2, (turnCount += 1));
            }, 2600);
          }
        }
      };
    }
  } else {
    if (!winnerDeclared) {
      msg = `THE ENEMY IS AIMING...`;
      msgPlayer(msg);

      computerAttack(player, enemyWaters);

      setTimeout(() => {
        startBattle(plyr1, plyr2, (turnCount += 1));
      }, 2600);
    }
  }
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
      positContainer.style.animation =
        '.5s ease-in 0s 1 normal forwards running fadeout';

      event.target.disabled = true;
      event.target.classList.add('undisable');

      setTimeout(() => {
        positContainer.parentNode.append(createBattleGrids());
        positContainer.remove();

        showFleetPosition(player);
        startBattle(player, opponent);
      }, 500);

      return;
    }

    let msg = `Admiral ${player.name}, you must prepare your fleet for battle. Please position your ships.`;
    msgPlayer(msg.toUpperCase());
  } else {
    // random btn

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
          shipPosition.forEach;
        }
      }
    };

    grid.onclick = (e) => {
      if (e.target.classList.contains('unlock')) {
        currentShip.position = shipPosition;
        exclude.push(...currentShip.position);

        showShipPosition(shipPosition);
        // showShipOutline(shipPosition);

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
  const submitBtn = document.querySelector('form > button');
  submitBtn.addEventListener('click', processForm);
}

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
