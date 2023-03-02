import Player from '../modules/player';

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
      });
    });
  });

  describe('What happens when attacking', () => {
    const player2 = new Player();

    test('Opponent receives attack', () => {
      const receiveAttack = jest.spyOn(player2.board, 'receiveAttack');
      player1.attack(player2, 2);
      expect(receiveAttack).toHaveBeenCalled();
    });

    test('Attack is logged', () => {
      expect(player1.attacks).toEqual([2]);
    });
  });

  describe('Assembling fleet', () => {
    test('Correct number of ships', () => {
      player1.assembleFleet();
      expect(player1.board.fleet).toHaveLength(5);
    });

    test('Fleet has a carrier', () => {
      expect(player1.board.fleet).toContainEqual({
        name: 'carrier',
        length: 5,
        position: [],
        damage: [],
      });
    });
  });
});
