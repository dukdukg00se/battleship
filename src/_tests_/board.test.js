import Gameboard from '../modules/board';
import Ship from '../modules/ship';

describe('Gameboard object', () => {
  let board;
  let ship1;
  let ship2;

  beforeEach(() => {
    board = new Gameboard();
    ship1 = new Ship('a', [1, 2]);
    ship2 = new Ship('b', [3, 4]);
  });

  describe('Board', () => {
    test('Properties', () => {
      expect(board).toEqual({
        fleet: [],
        hits: [],
        shipsLost: 0,
      });
    });
  });

  describe('Adding ships', () => {
    test('Fleet property', () => {
      board.addShip(ship1);
      board.addShip(ship2);

      expect(board).toEqual({
        fleet: [
          {
            name: 'a',
            position: [1, 2],
            damage: 0,
          },
          {
            name: 'b',
            position: [3, 4],
            damage: 0,
          },
        ],
        hits: [],
        shipsLost: 0,
      });
    });
  });

  describe('What happens when attacked', () => {
    beforeEach(() => {
      board.addShip(ship1);
    });

    test('Correctly log hits', () => {
      board.receiveAttack(21);
      board.receiveAttack(2);
      expect(board).toHaveProperty('hits', [2]);
    });

    test('Check if ship sunk after a hit', () => {
      const isSunkCalled = jest.spyOn(ship1, 'isSunk');
      board.receiveAttack(2);
      expect(isSunkCalled).toHaveBeenCalled();
    });

    test('Checks fleet only after ship is sunk', () => {
      const allSunk = jest.spyOn(board, 'isAllSunk');
      board.receiveAttack(1);
      board.receiveAttack(2);
      expect(allSunk).toHaveBeenCalledTimes(1);
    });

    test('Correctly tell when fleet eliminated', () => {
      board.receiveAttack(1);
      let allSunk = board.isAllSunk();
      expect(allSunk).toBe(false);

      board.receiveAttack(2);
      allSunk = board.isAllSunk();
      expect(allSunk).toBe(true);
    });
  });
});
