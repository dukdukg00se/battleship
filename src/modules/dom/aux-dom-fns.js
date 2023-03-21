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
    sq.onclick = null;
    sq.classList.remove('unlock');
    sq.classList.add('lock');
  });
}

function removeShipHl() {
  const sqs = document.querySelectorAll('.sq');
  sqs.forEach((sq) => {
    sq.classList.remove('placed', 'clear', 'unlock');
    sq.classList.add('lock');
  });
}

function addShipHl(coords) {
  // console.log(e.type === 'mouseover');
  coords.forEach((coord) => {
    const sq = document.querySelector(`[data-nmbr="${coord}"]`);
    sq.classList.remove('lock');
    sq.classList.add('unlock');
  });
}

function showPlacement(coords) {
  coords.forEach((coord) => {
    const sq = document.querySelector(`[data-nmbr="${coord}"]`);
    sq.classList.remove('unlock');
    sq.classList.add('lock', 'placed', 'appear');
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
  showPlacement,
  returnSqNmbr,
};
