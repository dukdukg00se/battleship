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
          hits: [],
          shipsLost: 0,
        },
        attacks: [],
      });
    });
  });

  describe('What happens when attacking', () => {
    const player2 = new Player();

    test('Opponent receives attack', () => {
      const called = jest.spyOn(player2.board, 'receiveAttack');
      player1.attack(player2, 2);
      expect(called).toHaveBeenCalled();
    });

    test('Attack is logged', () => {
      expect(player1.attacks).toEqual([2]);
    });
  });
});
