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

function startBattle() {
  

  let positGrid = document.querySelector('.grid');
  positGrid.style.animation = '1s ease-in 0s 1 normal none running fadeout';

  setTimeout(() => {
    positGrid.remove();
    const main = document.querySelector('main');
    main.append(createBattlePage());
    initNewGame(name);
  }, 980)
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
    console.log('start game');


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

    setTimeout(() => {
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
    }, 1400);

    grid.onmouseout = lockSqs;
  }
}

export default function initNewGame(name) {
  const player1 = new Player(name);
  const computer = new AIPlayer();

  player1.assembleFleet();
  computer.assembleFleet();
  computer.positionFleet();

  let currentShipIndex = 0;
  let excludeCoords = [];

  placeShips(currentShipIndex, player1, excludeCoords);

  const btns = document.querySelectorAll('button');
  btns.forEach(btn => {
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
          }, 500)

          // sq.classList.remove('placed');
          // sq.classList.remove('unlock');
          // sq.classList.add('lock');
        
        });

        placeShips(currentShipIndex, player1, excludeCoords);
      }

      if (e.target.id === 'random') {
        
      }

    })
  })
}