import '../../styles/position.css';

function createInfoSection() {
  const infoContainer = document.createElement('div');
  const headingWrapper = document.createElement('div');
  const heading = document.createElement('h2');
  const axisBtn = document.createElement('button');

  headingWrapper.classList.add('info-wrap');
  heading.textContent = 'Admiral A, position your carrier for battle.';

  // Class to test typewriter effect
  heading.classList.add('typewriter');

  axisBtn.textContent = 'Axis: X';
  axisBtn.type = 'button';
  axisBtn.dataset.axis = 'x';

  headingWrapper.append(heading);
  infoContainer.append(headingWrapper, axisBtn);
  return infoContainer;
}

function createGrid(maxSqs = 100) {
  const gridContainer = document.createElement('div');
  gridContainer.classList.add('grid');
  for (let i = 1; i <= maxSqs; i += 1) {
    const sq = document.createElement('div');
    sq.dataset.nmbr = i;
    sq.classList.add('sq');
    sq.classList.add('lock');
    gridContainer.append(sq);
  }
  return gridContainer;
}

export default function createPositPage() {
  const positContainer = document.createElement('div');

  positContainer.classList.add('posit-container');
  positContainer.append(createInfoSection(), createGrid());
  return positContainer;
}
