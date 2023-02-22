import Player from './player';

export default class AIPlayer extends Player {
  name = 'COMPUTER';

  shipsDestroyed;

  prevTarget;

  genAttackCoord(gridSize = 100) {
    let coord = Math.floor(Math.random() * gridSize);

    while (this.attacks.includes(coord)) {
      coord = Math.floor(Math.random() * gridSize);
    }

    // Add this for AI smart target coord?
    this.prevTarget = coord;
    return coord;
  }
}
