import {
  createGrid,
  addClassToSqs,
  showShipPosition,
} from './positioning-section';
import { msgPlayer } from './player-prompt';

/* eslint-disable consistent-return, no-param-reassign */

function markShot() {
  const circle = document.createElement('div');
  circle.classList.add('shot');
  return circle;
}

function showShipSunk(coords, grid) {
  const dir = coords[0] + 1 === coords[1] ? 'x' : 'y';

  let i = 1;
  coords.forEach((coord) => {
    const sq = grid.querySelector(`[data-nmbr="${coord}"]`);
    sq.className = '';
    sq.classList.add('sq', 'sunk');

    if (i === 1) {
      if (dir === 'x') {
        sq.classList.add('ship-start-x');
      } else {
        sq.classList.add('ship-start-y');
      }
    } else if (i === coords.length) {
      if (dir === 'x') {
        sq.classList.add('ship-end-x');
      } else {
        sq.classList.add('ship-end-y');
      }
    }

    i += 1;
  });
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

function computerAttack(plyr, grid) {
  let msg;
  const attackCoord = plyr.getAttackCoord();
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

function showFleetPosition(player) {
  const playerGrid = document.querySelector(`.plyr1`);
  const ships = player.board.fleet;
  ships.forEach((ship) => {
    showShipPosition(ship.position, playerGrid);
  });
}

function createBattleGrids() {
  const gridsContainer = document.createElement('div');
  const playerWrapper = document.createElement('div');
  const oppWrapper = document.createElement('div');
  const playerHeader = document.createElement('h3');
  const oppHeader = document.createElement('h3');
  const playerGrid = createGrid();
  const oppGrid = createGrid();

  gridsContainer.classList.add('grid-container');
  playerWrapper.classList.add('player-wrapper');
  playerHeader.textContent = 'FRIENDLY WATERS';
  playerGrid.classList.add('plyr1', 'battle-grid');
  oppWrapper.classList.add('opp-wrapper');
  oppHeader.textContent = 'ENEMY WATERS';
  oppGrid.classList.add('plyr2', 'battle-grid');
  addClassToSqs(oppGrid, 'target');

  playerWrapper.append(playerHeader, playerGrid);
  oppWrapper.append(oppHeader, oppGrid);
  gridsContainer.append(playerWrapper, oppWrapper);

  return gridsContainer;
}

export {
  markShot,
  showShipSunk,
  showFleetPosition,
  createBattleGrids,
  computerAttack,
  playerAttack,
};
