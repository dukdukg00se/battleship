import { createGrid, addClassToSqs } from "./positioning-section";

/* eslint-disable */

function markShot() {
  const circle = document.createElement('div');
  circle.classList.add('shot');
  return circle;
}

function createBattleGrids(player, opponent) {
  const gridsContainer = document.createElement('div');
  const playerWrapper = document.createElement('div');
  const oppWrapper = document.createElement('div');
  const playerHeader = document.createElement('h3');
  const oppHeader = document.createElement('h3'); 
  const playerGrid = createGrid()
  const oppGrid = createGrid();

  gridsContainer.classList.add('grid-container');
  playerWrapper.classList.add('player-wrapper');
  playerHeader.textContent = 'FRIENDLY WATERS';
  playerGrid.classList.add(player.name, 'battle-grid');
  oppWrapper.classList.add('opp-wrapper')
  oppHeader.textContent = 'ENEMY WATERS';
  oppGrid.classList.add(opponent.name, 'battle-grid');
  addClassToSqs(oppGrid, 'target');

  playerWrapper.append(playerHeader, playerGrid);
  oppWrapper.append(oppHeader, oppGrid);
  gridsContainer.append(playerWrapper, oppWrapper);
  
  return gridsContainer;
}

export { markShot, createBattleGrids }
