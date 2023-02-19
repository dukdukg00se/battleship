export default class Gameboard {
  constructor() {
    this.fleet = [];
    this.hits = [];

    // Add this for AI smart target coord?
    // Remove sunk property from ship and add shiplsLost?
    this.shipsLost = 0;
    // this.danger = false;
  }

  addShip(ship) {
    this.fleet.push(ship);
  }

  receiveAttack(oppCoord) {
    this.fleet.forEach((ship) => {
      ship.position.forEach((coord) => {
        if (coord === oppCoord) {
          this.hits.push(oppCoord);
          ship.hit();
          if (ship.isSunk()) {
            this.shipsLost += 1;
            if (this.isAllSunk()) {
              // console.log('No ships left');
            }
          }
        }
      });
    });
  }

  isAllSunk() {
    return this.shipsLost >= this.fleet.length;
  }
}
