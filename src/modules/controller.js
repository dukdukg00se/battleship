import * as domBattle from './dom/battle-section';
import * as domPosit from './dom/positioning-section';
import * as domPrompt from './dom/player-prompt';
import declareWinner from './dom/winner-section';
import startForm from './dom/start-form';
import Player from './data/player';
import AIPlayer from './data/ai-player';

/* eslint-disable no-param-reassign, no-use-before-define */

function respondToBtn(plyr1, plyr2, e) {
  const playerShips = plyr1.board.fleet;

  if (e.target.id === 'axis') {
    domPosit.changeAxis(e);
  } else if (e.target.id === 'clear') {
    plyr1.resetFleet();
    domPosit.removeShipPositions();
    domPosit.placePlayerShips(plyr1);
  } else if (e.target.id === 'battle') {
    if (playerShips[playerShips.length - 1].position.length > 0) {
      const positContainer = document.querySelector('.posit-container');
      positContainer.style.animation =
        '.5s ease-in 0s 1 normal forwards running fadeout';
      e.target.disabled = true;

      setTimeout(() => {
        positContainer.parentNode.append(domBattle.createBattleGrids());
        positContainer.remove();
        domBattle.showFleetPosition(plyr1);
        startBattle(plyr1, plyr2);
      }, 500);

      return;
    }

    const msg = `Admiral ${plyr1.name}, you must prepare your fleet for battle. Please position your ships.`;
    domPrompt.msgPlayer(msg.toUpperCase());
  } else {
    domPosit.removeShipPositions();
    plyr1.autoPositionFleet();
    playerShips.forEach((ship) => {
      domPosit.showShipPosition(ship.position);
    });
    domPosit.placePlayerShips(plyr1, playerShips.length);
  }
}

function setBoard(name) {
  const player1 = new Player(name);
  const player2 = new AIPlayer();

  player1.opponent = player2;
  player2.opponent = player1;
  player1.assembleFleet();
  player2.assembleFleet();
  player2.autoPositionFleet();

  domPosit.placePlayerShips(player1);

  const btns = document.querySelectorAll('button');
  btns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      respondToBtn(player1, player2, e);
    });
  });
}

function initNewGame() {
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
      main.append(domPrompt.createPlayerPrompt(), domPosit.createPositUI());
      setBoard(nameInput.value);
    }, 900);
  });
}

function startBattle(plyr1, plyr2, turnCount = 0) {
  let msg;
  let player;
  let enemyWaters;
  let winner;

  if (turnCount === 0) {
    msg = `ENEMY DETECTED, AWAITING ORDERS ADMIRAL...`;
    domPrompt.msgPlayer(msg);
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
          const turn = domBattle.playerAttack(player, targSq);

          if (turn !== 'repeat') {
            enemyWaters.onclick = null;
            setTimeout(() => {
              startBattle(plyr1, plyr2, (turnCount += 1));
            }, 2600);
          }
        }
      };
    } else {
      msg = `THE ENEMY IS AIMING...`;
      domPrompt.msgPlayer(msg);

      setTimeout(() => {
        domBattle.computerAttack(player, enemyWaters);
      }, 1200);

      setTimeout(() => {
        startBattle(plyr1, plyr2, (turnCount += 1));
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

export default initNewGame;
