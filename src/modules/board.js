class Gameboard {
  constructor() {
    this.ships = [];
    this.hits = [];

    // Add this for AI smart target coord?
    // Remove sunk property from ship and add shiplsLost?
    this.shipsLost = 0;
    // this.danger = false;
  }

  placeShip(ship) {
    this.ships.push(ship);
  }

  receiveAttack(oppCoord) {
    this.ships.forEach((ship) => {
      ship.position.forEach((coord) => {
        if (coord === oppCoord) {
          this.hits.push(oppCoord);
          ship.hit();
          if (ship.isSunk()) {
            this.shipsLost += 1;
            if (this.isAllSunk()) {
              console.log('No ships left');
            }
          }
        }
      });
    });
  }

  // isAllSunk() {
  //   return this.ships.every((ship) => ship.sunk === true);
  // }

  isAllSunk() {
    return this.shipsLost.length === this.ships.length;
  }
}

export default Gameboard;
