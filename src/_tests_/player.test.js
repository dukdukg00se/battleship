import Player from '../modules/data/player';

/* eslint-disable */

describe('Player object', () => {
  let player1;

  beforeAll(() => {
    player1 = new Player('player1');
  });

  describe('Player', () => {
    test('Properties', () => {
      expect(player1).toEqual({
        name: 'player1',
        board: {
          fleet: [],
          shipsLost: [],
        },
        attacks: [],
        winner: false,
        opponent: null,
      });
    });
  });

  describe('Get random num', () => {
    test('Return random num', () => {
      expect(player1.getRandomCoord()).toBeLessThanOrEqual(100);
    });

    test('Return random num within limit', () => {
      expect(player1.getRandomCoord([], 5)).toBeLessThanOrEqual(5);
    });

    test('Return random num not within exclude array', () => {
      expect(player1.getRandomCoord([1, 2, 3, 4], 5)).toEqual(5);
    });
  });

  describe('What happens when attacking', () => {
    test('Opponent receives attack', () => {
      const player2 = new Player('player2');
      player1.opponent = player2;

      const receiveAttack = jest.spyOn(player2.board, 'receiveAttack');
      player1.attack(2);
      expect(receiveAttack).toHaveBeenCalled();
    });

    test('Attack is logged', () => {
      expect(player1.attacks).toEqual([2]);
    });
  });

  describe('Player ships', () => {
    test('Player has all ships', () => {
      player1.assembleFleet();
      expect(player1.board.fleet).toEqual([
        { damage: [], length: 5, name: 'CARRIER', position: [] },
        { damage: [], length: 4, name: 'BATTLESHIP', position: [] },
        { damage: [], length: 3, name: 'DESTROYER', position: [] },
        { damage: [], length: 3, name: 'SUBMARINE', position: [] },
        { damage: [], length: 2, name: 'PATROL BOAT', position: [] },
      ]);
    });
  });

  // Combine with above
  describe.only('Preparing fleet', () => {
    let fleet;
    let fleetCoords;

    beforeAll(() => {
      player1.assembleFleet();
      player1.autoPositionFleet();

      fleet = player1.board.fleet;

      console.log(player1);
      fleetCoords = fleet.reduce((coordArr, ship) => {
        coordArr.push(...ship.position);
        return coordArr;
      }, []);
    });

    test('Correct number of coords', () => {
      // player1.autoPositionFleet();
      // const fleet = player1.board.fleet;
      // const fleetCoords = fleet.reduce((coordArr, ship) => {
      //   coordArr.push(...ship.position);
      //   return coordArr;
      // }, []);

      expect(fleetCoords).toHaveLength(17);
    });

    test('Ship positions are unique', () => {
      console.log(fleetCoords);
    });
  });

  // describe('Assembling fleet', () => {
  //   test('Correct number of ships', () => {
  //     player1.assembleFleet();
  //     expect(player1.board.fleet).toHaveLength(5);
  //   });

  //   test('Fleet has a carrier', () => {
  //     expect(player1.board.fleet).toContainEqual({
  //       name: 'carrier',
  //       length: 5,
  //       position: [],
  //       damage: [],
  //     });
  //   });
  // });
});
