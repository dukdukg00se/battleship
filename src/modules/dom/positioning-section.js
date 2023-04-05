import '../../styles/positioning-section.css';

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

function addClassToSqs(grid, ...classNames) {
  const classesToAdd = [...classNames];
  const sqs = grid.querySelectorAll('.sq');
  sqs.forEach(sq => {
    classesToAdd.forEach(newClass => {
      sq.classList.add(newClass);
    })
  })
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

export { createGrid, addClassToSqs, createPositUI };
