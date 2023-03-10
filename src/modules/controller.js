import Player from './player';
import AIPlayer from './ai-player';
import { getCeiling, isRedundant } from './helpers';

/* eslint-disable */

const testShip = {
  name: 'carrier',
  length: 5,
  position: [],
  damage: [],
};

function changeAxis() {
  const axisBtn = document.querySelector('.info-wrap + button');
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

function typeWriter(text, i = 0) {
  if (i > text.length) return;
  const typeWriterElement = document.querySelector('.typewriter');
  typeWriterElement.textContent = text.substring(0, (i += 1));

  setTimeout(() => {
    typeWriter(text, (i += 1));
  }, 150);
}

export default function initNewGame(name) {
  const player1 = new Player(name);
  const computer = new AIPlayer();

  player1.assembleFleet();
  computer.assembleFleet();
  computer.positionFleet();

  const { fleet } = player1.board;
  const excludeCoords = [];

  changeAxis();
  showEligibleAndPlace(testShip, []);
}

function showEligibleAndPlace(ship, exclude) {
  const grid = document.querySelector('.grid');
  let startCoord;
  let max;
  let position = [];

  grid.addEventListener('mouseover', (e) => {
    const isXAxis =
      document.querySelector('.info-wrap + button').dataset.axis === 'x'
        ? true
        : false;
    const sq = e.target.closest('.sq');
    if (sq) {
      startCoord = +sq.dataset.nmbr;
      max = getCeiling(startCoord, isXAxis);
      let subPos = [];

      for (let i = 0; i < ship.length; i += 1) {
        const coord = isXAxis ? startCoord + i : startCoord + i * 10;
        subPos.push(coord);
      }

      position = [...subPos];

      if (
        !isRedundant(exclude, position) &&
        position[position.length - 1] <= max
      ) {
        sq.onclick = (e) => {
          console.log(e.target);
          console.log(position);
          return position;
        };

        position.forEach((coord) => {
          let targSq = document.querySelector(`[data-nmbr="${coord}"]`);
          targSq.classList.remove('lock');
          targSq.classList.add('unlock');
        });
      }
    }
  });

  grid.addEventListener('mouseout', (e) => {
    const squares = document.querySelectorAll('.sq');
    squares.forEach((sq) => {
      sq.onclick = null;
      sq.classList.remove('unlock');
      sq.classList.add('lock');
    });
  });
}

function placeShips(shipsArr) {
  const takenPosits = [];
}

function getSqNmbr() {
  return new Promise((resolve) => {
    const grid = document.querySelector('.grid');
    grid.onclick = (e) => {
      const sq = e.target.closest('.sq');
      let num = sq.dataset.nmbr;

      resolve(num);
    };
  });
}
