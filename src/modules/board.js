export default class Gameboard {
  constructor() {
    this.fleet = [];
    this.shipsLost = [];
  }

  receiveAttack(incoming) {
    let result = 'miss';
    this.fleet.forEach((ship) => {
      ship.position.forEach((coord) => {
        if (coord === incoming) {
          ship.hit(incoming);
          result = 'hit';
          if (ship.isSunk()) {
            this.shipsLost.push(ship);
            result = 'sunk';
            if (this.fleetLost()) {
              result = 'lost';
            }
          }
        }
      });
    });
    return result;
  }

  fleetLost() {
    return this.shipsLost.length >= this.fleet.length;
  }
}
