import Player from './player';
import AIPlayer from './ai-player';

/* eslint-disable */

function typeWriter(text, i = 0) {
  if (i > text.length) return;
  const typeWriterElement = document.querySelector('.typewriter');
  typeWriterElement.textContent = text.substring(0, (i += 1));

  setTimeout(() => {
    typeWriter(text, (i += 1));
  }, 150);
}

export default async function initNewGame(name) {
  const player1 = new Player(name);
  const computer = new AIPlayer();

  player1.assembleFleet();
  computer.assembleFleet();
  computer.positionFleet();

  const { fleet } = player1.board;

  showEligible();

  // const num = await getSqNmbr();
  // console.log(num);

  // console.log(player1);
  // console.log(player1.board.fleet);
  // console.log(computer);
  // console.log(computer.board.fleet);
  // let selectedSq;
  // grid.addEventListener('click', (e) => {
  //   selectedSq = e.target.closest('div');
  //   console.log(selectedSq);
  // });

  // fleet.forEach((ship) => {
  //   if (ship.position.length < 1) {
  //     const shipName = ship.name;
  //     const msg = `Admiral ${player1.name}, position your ${shipName} for battle.`;
  //     typeWriter(msg);
  //     console.log(selectedSq);
  //   }
  // });
}

function placeShip(shipsArr) {}

function showEligible() {
  const grid = document.querySelector('.grid');
  grid.addEventListener('mouseover', (e) => {
    const sq = e.target.closest('.sq');
    console.log(sq);
  });
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
