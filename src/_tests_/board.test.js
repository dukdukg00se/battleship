import Gameboard from '../modules/data/board';
import Ship from '../modules/data/ship';

describe('Gameboard object', () => {
  let board;
  let ship1;

  beforeEach(() => {
    board = new Gameboard();
    ship1 = new Ship('a', 3);
    ship1.position = [3, 4, 5];
  });

  describe('Board', () => {
    test('Properties', () => {
      expect(board).toEqual({
        fleet: [],
        shipsLost: [],
      });
    });
  });

  describe('What happens when attacked', () => {
    beforeEach(() => {
      board.fleet.push(ship1);
    });

    test('Correctly log hits', () => {
      board.receiveAttack(5);
      expect(board).toHaveProperty('fleet', [
        { name: 'a', length: 3, position: [3, 4, 5], damage: [5] },
      ]);
    });

    test('Check if ship sunk after a hit', () => {
      const isSunkCalled = jest.spyOn(ship1, 'isSunk');
      board.receiveAttack(79);
      expect(isSunkCalled).toHaveBeenCalledTimes(0);
    });

    test("Don't check if ship sunk after a miss", () => {
      const isSunkCalled = jest.spyOn(ship1, 'isSunk');
      board.receiveAttack(5);
      expect(isSunkCalled).toHaveBeenCalled();
    });

    test('Correctly tell when fleet eliminated', () => {
      board.receiveAttack(3);
      board.receiveAttack(4);
      let allSunk = board.fleetLost();
      expect(allSunk).toBe(false);

      board.receiveAttack(5);
      allSunk = board.fleetLost();
      expect(allSunk).toBe(true);
    });
  });
});
