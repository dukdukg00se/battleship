import Player from '../modules/data/player';
import { getCeiling } from '../modules/data/aux-helper-fns';

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

  describe('Get random Coord', () => {
    test('Return random Coord', () => {
      expect(player1.getRandomCoord()).toBeLessThanOrEqual(100);
    });

    test('Return random num within limit', () => {
      expect(player1.getRandomCoord([], 5)).toBeLessThanOrEqual(5);
    });

    test('Return random num not within exclude array', () => {
      expect(player1.getRandomCoord([1, 2, 3, 4], 5)).toEqual(5);
    });
  });

  describe('Player ships', () => {
    beforeAll(() => {
      player1.assembleFleet();
    });

    test('Player has all ships', () => {
      expect(player1.board.fleet).toEqual([
        { damage: [], length: 5, name: 'CARRIER', position: [] },
        { damage: [], length: 4, name: 'BATTLESHIP', position: [] },
        { damage: [], length: 3, name: 'DESTROYER', position: [] },
        { damage: [], length: 3, name: 'SUBMARINE', position: [] },
        { damage: [], length: 2, name: 'PATROL BOAT', position: [] },
      ]);
    });

    describe('Fleet positioning', () => {
      let fleet;
      let fleetCoords;

      beforeAll(() => {
        player1.autoPositionFleet();
        fleet = player1.board.fleet;
        fleetCoords = fleet.reduce((coordArr, ship) => {
          coordArr.push(...ship.position);
          return coordArr;
        }, []);
      });

      test('Correct number of coords', () => {
        expect(fleetCoords).toHaveLength(17);
      });

      test('Ship positions are unique', () => {
        const hasDupCoords = (arr) => arr.length !== new Set(arr).size;

        expect(hasDupCoords(fleetCoords)).toBe(false);
      });

      test('Ship positions within max value (not off board)', () => {
        // Returns last ship coord <= max val
        const withinMax = (arr) => {
          const dir = arr[0] + 1 === arr[1] ? 'x' : 'y';
          const lastIndex = arr.length - 1;
          const lastNum = arr[lastIndex];
          const maxNum = getCeiling(arr[0], dir);
          return lastNum <= maxNum;
        };
        // Test array with 1 ship position over max val
        const badFleetPos = [
          {
            position: [1, 2, 3],
          },
          {
            position: [4, 5, 11],
          },
        ];

        expect(
          badFleetPos.every((ship) => withinMax(ship.position) === true)
        ).toBe(false);

        expect(fleet.every((ship) => withinMax(ship.position) === true)).toBe(
          true
        );
      });

      test('Ship coords are sequential', () => {
        // Checks if vals are consecutive by 1 or 10
        const isSequential = (arr) => {
          const toAdd = arr[0] + 1 === arr[1] ? 1 : 10;
          for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] + toAdd != arr[i + 1]) return false;
          }
          return true;
        };

        // Test array with 1 ship position not consecutive
        const badFleetPos = [
          {
            position: [1, 2, 3],
          },
          {
            position: [10, 20, 30],
          },
          {
            position: [10, 11, 20],
          },
        ];

        expect(
          badFleetPos.every((ship) => isSequential(ship.position) === true)
        ).toBe(false);

        expect(
          fleet.every((ship) => isSequential(ship.position) === true)
        ).toBe(true);
      });

      test('Clear ship positions', () => {
        expect(fleet.every((ship) => ship.position.length < 1)).toBe(false);

        player1.resetFleet();

        expect(fleet.every((ship) => ship.position.length < 1)).toBe(true);
      });
    });
  });

  describe('What happens when attacking', () => {
    let player2;

    beforeAll(() => {
      player2 = new Player('player2');
      player2.board.fleet = [
        {
          name: 'Submarine',
          position: [4, 5, 6],
        },
        {
          name: 'Destroyer',
          position: [11, 12, 13],
        },
      ];
      player2.board.shipsLost = [
        {
          name: 'Submarine',
          position: [4, 5, 6],
        },
      ];
      player1.opponent = player2;
    });

    test('Opponent receives attack', () => {
      const receiveAttack = jest.spyOn(player2.board, 'receiveAttack');
      player1.attack(2);
      expect(receiveAttack).toHaveBeenCalled();
    });

    test('Attack is logged', () => {
      expect(player1.attacks).toEqual([2]);
    });

    test('Report a miss', () => {
      expect(player1.reportAttackResult(2)).toEqual('miss');
    });

    test('Report a hit', () => {
      expect(player1.reportAttackResult(11)).toEqual('hit');
    });

    test('Report sunk', () => {
      expect(player1.reportAttackResult(4)).toEqual('sunk');
    });

    test('Report destroyed', () => {
      player2.board.fleet = [
        {
          name: 'Submarine',
          position: [4, 5, 6],
        },
      ];
      expect(player1.reportAttackResult(4)).toEqual('destroyed');
    });

    test('Identify hit ship', () => {
      expect(player1.identifyEnemyShip(4)).toEqual({
        name: 'Submarine',
        position: [4, 5, 6],
      });
    });
  });
});
