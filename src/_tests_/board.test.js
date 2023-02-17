import Gameboard from '../modules/board';

const mockShip = jest
  .fn()
  .mockReturnValue({
    name: 'Destroyer',
    position: [1, 2, 3],
    hits: 0,
  })
  .mockReturnValueOnce({
    name: 'Patrol Boat',
    position: [4, 5],
    hits: 0,
  })
  .mockReturnValueOnce({
    name: 'Submarine',
    position: [6, 7, 8],
    hits: 0,
  });

describe('Gameboard object', () => {
  let board;

  beforeAll(() => {
    board = new Gameboard();
  });

  test('placeShip method', () => {
    board.placeShip(mockShip());
    board.placeShip(mockShip());
    board.placeShip(mockShip());

    expect(board).toEqual({
      ships: [
        {
          name: 'Patrol Boat',
          position: [4, 5],
          hits: 0,
        },
        {
          name: 'Submarine',
          position: [6, 7, 8],
          hits: 0,
        },
        {
          name: 'Destroyer',
          position: [1, 2, 3],
          hits: 0,
        },
      ],
      hits: [],
      shipsLost: 0,
    });
  });
});

// test placeShip places ship into ships array
// mock a ships obj

// test receiveAttack has attack coord
// searches ships coords within ships arr
// If attack coord found
// add a hit to the ship
// check if sunk
// if yes, shipsLost++
// check if all ships sunk
