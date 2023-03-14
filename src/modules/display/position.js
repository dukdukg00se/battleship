import '../../styles/position.css';

function createPlayerPrompt() {
  const promptWrapper = document.createElement('div');
  const heading = document.createElement('h2');

  promptWrapper.classList.add('prompt-wrapper');
  heading.classList.add('prompt');

  promptWrapper.append(heading);
  return promptWrapper;
}

function createBtns() {
  const btnsContainer = document.createElement('div')
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

  btnsContainer.append(axisBtn, randomBtn, battleBtn, clearBtn)

  return btnsContainer;
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
  positContainer.append(createPlayerPrompt(), createBtns(), createGrid());
  return positContainer;
}
