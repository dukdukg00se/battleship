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

function lockSqs() {
  const sqs = document.querySelectorAll('.sq');
  sqs.forEach((sq) => {
    sq.onclick = null;
    sq.classList.remove('unlock');
    sq.classList.add('lock');
  });
}

function isSqEligible(selectArr, excludeArr, max) {
  if (selectArr.some((element) => excludeArr.includes(element))) return false;
  if (selectArr[selectArr.length - 1] > max) return false;
  return true;
} 

export default function initNewGame(name) {
  const player1 = new Player(name);
  const computer = new AIPlayer();

  player1.assembleFleet();
  computer.assembleFleet();
  computer.positionFleet();

  const currentShipIndex = 0;
  const excludeCoords = [];

  changeAxis();
  placeShip(currentShipIndex, player1, excludeCoords)
  

}

function placeShip(index, player, exclude) {
  const name = player.name;
  const ships = player.board.fleet
  const grid = document.querySelector('.grid');
  let shipLocation = [];
  let ship = ships[index]
  

  console.log(ships)

  if (index >= ships.length) {
    // run the game
    grid.onmouseover = null;
    console.log('start game')
    return;
  } 
  
  else {
    const msg = `Admiral ${name}, position your ${ship.name}.`
    typeWriter(msg);

    grid.onmouseover = (e) => {
      const sq = e.target.closest('.sq');
      if (sq) {
        const reqCoords = [];
        const startCoord = +sq.dataset.nmbr;
        const axis = document.querySelector('.info-wrap + button').dataset.axis;
        const max = getCeiling(startCoord, axis === 'x');


    
        for (let i = 0; i < ship.length; i += 1) {
          const coord = axis === 'x' ? startCoord + i : startCoord + i * 10;
          reqCoords.push(coord);
        }
    
        shipLocation = [...reqCoords]
    
        if (
          isSqEligible(shipLocation, exclude, max)
        ) {
          shipLocation.forEach((coord) => {
            let targSq = document.querySelector(`[data-nmbr="${coord}"]`);
            targSq.classList.remove('lock');
            targSq.classList.add('unlock');
          });
  
          sq.onclick = () => {
            ship.position = shipLocation;
            index += 1;
            exclude.push(...ship.position)

            shipLocation.forEach((coord) => {
              let targSq = document.querySelector(`[data-nmbr="${coord}"]`);
              targSq.classList.remove('unlock');
              targSq.classList.add('lock');
              targSq.classList.add('placed');
            });

            placeShip(index, player, exclude)
          }
        }
      }
    }

    grid.addEventListener('mouseout', lockSqs);
  }
  
}

// function placeShip(ship, exclude) {
//   let shipLocation = [];

//   const grid = document.querySelector('.grid');
//   grid.addEventListener('mouseover', (e) => {
//     const sq = e.target.closest('.sq');
  
//     if (sq) {
//       const axis = document.querySelector('.info-wrap + button').dataset.axis;
//       const startCoord = +sq.dataset.nmbr;
//       const max = getCeiling(startCoord, axis === 'x');
//       const reqCoords = [];
  
//       for (let i = 0; i < ship.length; i += 1) {
//         const coord = axis === 'x' ? startCoord + i : startCoord + i * 10;
//         reqCoords.push(coord);
//       }
  
//       shipLocation = [...reqCoords]
  
//       if (
//         isSqEligible(shipLocation, exclude, max)
//       ) {

//         sq.onclick = () => {
//           ship.shipLocation = shipLocation;
//           // return shipLocation;
//         };

//         shipLocation.forEach((coord) => {
//           let targSq = document.querySelector(`[data-nmbr="${coord}"]`);
//           targSq.classList.remove('lock');
//           targSq.classList.add('unlock');
//         });
//       }
//     }
//   })

//   grid.addEventListener('mouseout', lockSqs);
// }

function placeShip2(ship, exclude) {
  let position = [];
  let axis;
  let max;

  const grid = document.querySelector('.grid');
  grid.onmouseover = (e) => {
    const sq = e.target.closest('.sq');
    if (sq) {
      const reqCoords = [];
      const startCoord = +sq.dataset.nmbr;
      axis = document.querySelector('.info-wrap + button').dataset.axis;
      
      max = getCeiling(startCoord, axis === 'x');
  
      for (let i = 0; i < ship.length; i += 1) {
        const coord = axis === 'x' ? startCoord + i : startCoord + i * 10;
        reqCoords.push(coord);
      }
  
      position = [...reqCoords]
  
      if (
        isSqEligible(position, exclude, max)
      ) {
        position.forEach((coord) => {
          let targSq = document.querySelector(`[data-nmbr="${coord}"]`);
          targSq.classList.remove('lock');
          targSq.classList.add('unlock');
        });

        sq.onclick = () => {
          console.log('test')
          ship.position = position;
          console.log(ship)
        }
      }
    }
  }

  grid.onmouseout = lockSqs;

}

function positionFleet(ships, name) {
  let takenPosits = [];

  ships.forEach(async ship => {
    let shipName = ship.name;
    let prompt = `Admiral ${name}, position your ${shipName} for battle.`
    typeWriter(prompt);

    placeShip2(ship, takenPosits);
       
    takenPosits.push(...ship.position);
    
  })

}

