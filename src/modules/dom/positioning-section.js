import '../../styles/positioning-section.css';
import { msgPlayer } from './player-prompt';
import {
  getCeiling,
  isCoordsEligible,
  getPositionCoords,
} from '../data/aux-helper-fns';

function addClassToSqs(grid, ...classNames) {
  const classesToAdd = [...classNames];
  const sqs = grid.querySelectorAll('.sq');
  sqs.forEach((sq) => {
    classesToAdd.forEach((newClass) => {
      sq.classList.add(newClass);
    });
  });
}

function changeAxis(e) {
  if (e.target.dataset.axis === 'x') {
    e.target.dataset.axis = 'y';
    e.target.textContent = 'AXIS: Y';
  } else {
    e.target.dataset.axis = 'x';
    e.target.textContent = 'AXIS: X';
  }
}

function unlockSq(sq) {
  sq.classList.toggle('lock');
  sq.classList.toggle('unlock');
}

function removeShadows() {
  const sqs = document.querySelectorAll('.sq');
  sqs.forEach((sq) => {
    sq.classList.remove('unlock', 'ship-shadow');
    sq.classList.add('lock');
  });
}

function showShipShadow(coords) {
  coords.forEach((coord) => {
    const sq = document.querySelector(`[data-nmbr="${coord}"]`);
    sq.classList.add('ship-shadow');
  });
}

function removeShipPositions() {
  const sqs = document.querySelectorAll('.sq');
  sqs.forEach((sq) => {
    sq.className = '';
    sq.classList.add('sq', 'lock');
  });
}

function showShipPosition(coords, grid = document.querySelector('.grid')) {
  const dir = coords[0] + 1 === coords[1] ? 'x' : 'y';

  let i = 1;
  coords.forEach((coord) => {
    const sq = grid.querySelector(`[data-nmbr="${coord}"]`);
    sq.className = '';
    sq.classList.add('sq', 'ship-position');

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

function createGrid(maxSqs = 100) {
  const gridContainer = document.createElement('div');
  for (let i = 1; i <= maxSqs; i += 1) {
    const sq = document.createElement('div');
    sq.dataset.nmbr = i;
    sq.classList.add('sq');
    gridContainer.append(sq);
  }
  return gridContainer;
}

function createBtns() {
  const btnsContainer = document.createElement('div');
  const axisBtn = document.createElement('button');
  const randomBtn = document.createElement('button');
  const battleBtn = document.createElement('button');
  const clearBtn = document.createElement('button');

  btnsContainer.classList.add('btns-container');

  axisBtn.id = 'axis';
  axisBtn.textContent = 'AXIS: X';
  axisBtn.type = 'button';
  axisBtn.dataset.axis = 'x';

  randomBtn.id = 'random';
  randomBtn.textContent = 'RANDOM';
  randomBtn.type = 'button';

  battleBtn.id = 'battle';
  battleBtn.textContent = 'BATTLE';
  battleBtn.type = 'button';

  clearBtn.id = 'clear';
  clearBtn.textContent = 'CLEAR';
  clearBtn.type = 'button';

  btnsContainer.append(axisBtn, randomBtn, battleBtn, clearBtn);

  return btnsContainer;
}

function createPositUI() {
  const uIContainer = document.createElement('div');
  const grid = createGrid();
  grid.classList.add('grid');
  addClassToSqs(grid, 'lock');

  uIContainer.classList.add('posit-container', 'appear');
  uIContainer.append(createBtns(), grid);
  return uIContainer;
}

export {
  createGrid,
  addClassToSqs,
  createPositUI,
  changeAxis,
  unlockSq,
  removeShadows,
  showShipShadow,
  showShipPosition,
  removeShipPositions,
  placePlayerShips,
};
