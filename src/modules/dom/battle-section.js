/* eslint-disable */
function createGrid(maxSqs = 100) {
  const gridContainer = document.createElement('div');
  gridContainer.classList.add('grid');
  for (let i = 1; i <= maxSqs; i += 1) {
    const sq = document.createElement('div');
    sq.dataset.nmbr = i;
    sq.classList.add('sq');
    gridContainer.append(sq);
  }
  return gridContainer;
}

function createOppGrid(maxSqs = 100) {
  const gridContainer = document.createElement('div');
  gridContainer.classList.add('grid');
  for (let i = 1; i <= maxSqs; i += 1) {
    const sq = document.createElement('div');
    sq.dataset.nmbr = i;
    sq.classList.add('sq');
    sq.classList.add('target');
    gridContainer.append(sq);
  }
  return gridContainer;
}

function markShot() {
  const circle = document.createElement('div');
  circle.classList.add('shot');
  return circle;
}

function createBattlePage(player) {
  const gridsContainer = document.createElement('div');
  const playerWrapper = document.createElement('div');
  const oppWrapper = document.createElement('div');
  const playerHeader = document.createElement('h3');
  const oppHeader = document.createElement('h3'); 
  const playerGrid = createGrid()
  const oppGrid = createOppGrid();

  playerWrapper.classList.add('player-wrapper');
  oppWrapper.classList.add('opp-wrapper')
  playerHeader.textContent = 'FRIENDLY WATERS';
  oppHeader.textContent = 'ENEMY WATERS';
  gridsContainer.classList.add('grid-container');
  playerGrid.classList.add('player');
  oppGrid.classList.add('opponent');

  // Move this to the DOM module
  player.board.fleet.forEach(ship => {
    ship.position.forEach(coord => {
      const targSq = playerGrid.querySelector(`[data-nmbr="${coord}"]`);
      targSq.classList.add('placed');
      targSq.dataset.ship = ship.name;
    })
  })

  // const playerShips = player.board.fleet.reduce((coords, ship) => {
  //   coords.push(...ship.position);
  //   return coords;
  // }, []);
  // playerShips.forEach(coord => {
  //   const targSq = playerGrid.querySelector(`[data-nmbr="${coord}"]`);
  //   targSq.classList.add('placed');
  // })

  playerWrapper.append(playerHeader, playerGrid);
  oppWrapper.append(oppHeader, oppGrid);
  gridsContainer.append(playerWrapper, oppWrapper);
  
  return gridsContainer;
}

export { markShot, createBattlePage }
