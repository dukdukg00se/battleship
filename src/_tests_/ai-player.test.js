import AIPlayer from '../modules/data/ai-player';
import Ship from '../modules/data/ship';

describe('aiPlayer object', () => {
  let computer;

  beforeEach(() => {
    computer = new AIPlayer();
  });

  test('Properties', () => {
    expect(computer).toEqual({
      name: 'COMPUTER',
      board: {
        fleet: [],
        shipsLost: [],
      },
      attacks: [],
      winner: false,
      opponent: null,
      targets: [],
      targetDir: 'back',
    });
  });

  test('Updating targets', () => {
    const carrier = new Ship('Carrier', 5);
    const destroyer = new Ship('Destroyer', 3);
    const submarine = new Ship('Submarine', 3);

    this.targets.push(submarine);
    console.log(this.targets);
  });

  // test('Another hit', () => {
  //   destroyer.hit(1);
  //   expect(destroyer).toHaveProperty('damage', [1, 3]);
  // });

  // test('Ship not sunk', () => {
  //   expect(destroyer.isSunk()).toBe(false);
  // });

  // test('Ship sinks', () => {
  //   destroyer.hit(2);
  //   expect(destroyer.isSunk()).toBe(true);
  // });
});
