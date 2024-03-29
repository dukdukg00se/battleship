export default class Gameboard {
  constructor() {
    this.fleet = [];
    this.shipsLost = [];
  }

  receiveAttack(incoming) {
    this.fleet.forEach((ship) => {
      ship.position.forEach((coord) => {
        if (coord === incoming) {
          ship.hit(incoming);
          if (ship.isSunk()) {
            this.shipsLost.push(ship);
          }
        }
      });
    });
  }

  fleetLost() {
    return this.shipsLost.length >= this.fleet.length;
  }
}
