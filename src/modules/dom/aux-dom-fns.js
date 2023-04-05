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

function showFleetPosition(player) {
  const playerGrid = document.querySelector(`.plyr1`);
  const ships = player.board.fleet;
  ships.forEach((ship) => {
    showShipPosition(ship.position, playerGrid);
  });
}

export {
  removeShadows,
  changeAxis,
  removeShipPositions,
  showShipShadow,
  showShipPosition,
  showFleetPosition,
  showShipSunk,
  unlockSq,
};
