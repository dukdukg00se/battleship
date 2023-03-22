function changeAxis(e) {
  if (e.target.dataset.axis === 'x') {
    e.target.dataset.axis = 'y';
    e.target.textContent = 'AXIS: Y';
  } else {
    e.target.dataset.axis = 'x';
    e.target.textContent = 'AXIS: X';
  }
}

function indicateInactive() {
  const sqs = document.querySelectorAll('.sq');
  sqs.forEach((sq) => {
    sq.classList.remove('unlock');
    sq.classList.add('lock');
  });
}

function removeShipHl() {
  const sqs = document.querySelectorAll('.sq');
  sqs.forEach((sq) => {
    sq.className = '';
    sq.classList.add('sq', 'lock');
  });
}

function addShipHl(coords) {
  coords.forEach((coord) => {
    const sq = document.querySelector(`[data-nmbr="${coord}"]`);
    sq.classList.remove('lock');
    sq.classList.add('unlock');
  });
}

function showShipPosition(coords) {
  const dir = coords[0] + 1 === coords[1] ? 'x' : 'y';
  
  let i = 1;
  coords.forEach((coord) => {
    const sq = document.querySelector(`[data-nmbr="${coord}"]`);
    sq.classList.remove('unlock');
    sq.classList.add('lock', 'placed', 'appear');

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

function returnSqNmbr(e) {
  const sq = e.target.closest('.sq');
  if (sq) return +sq.dataset.nmbr;
}

export {
  indicateInactive,
  changeAxis,
  removeShipHl,
  addShipHl,
  showShipPosition,
  returnSqNmbr,
};
