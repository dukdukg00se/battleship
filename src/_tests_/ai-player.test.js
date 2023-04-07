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

  describe('Correctly update targets array', () => {
    let enemyShips;

    beforeEach(() => {
      const carrier = new Ship('Carrier', 5);
      const destroyer = new Ship('Destroyer', 3);
      const submarine = new Ship('Submarine', 3);
      carrier.position = [1, 2, 3, 4, 5];
      destroyer.position = [6, 7, 8];
      submarine.position = [11, 12, 13];

      enemyShips = [carrier, destroyer, submarine];
      computer.targets.push(submarine);
    });

    test('Update targets if target not present', () => {
      computer.updateTargetsList(1, computer.targets, enemyShips);
      expect(computer.targets).toEqual([
        { damage: [], length: 3, name: 'Submarine', position: [11, 12, 13] },
        { damage: [], length: 5, name: 'Carrier', position: [1, 2, 3, 4, 5] },
      ]);
    });

    test("Doesn't update targets if target already present", () => {
      computer.updateTargetsList(11, computer.targets, enemyShips);
      expect(computer.targets).toEqual([
        {
          damage: [],
          length: 3,
          name: 'Submarine',
          position: [11, 12, 13],
        },
      ]);
    });
  });

  describe('Change targetDir property', () => {
    test('Change direction to front', () => {
      computer.updateTargetingDir('back');
      expect(computer.targetDir).toEqual('front');
    });

    test('Change direction to up', () => {
      computer.updateTargetingDir('down');
      expect(computer.targetDir).toEqual('up');
    });
  });

  describe('Generate correct attack coordinates', () => {
    let enemyShip1;
    let enemyShip2;

    beforeEach(() => {
      enemyShip1 = new Ship('Carrier', 5);
      enemyShip2 = new Ship('Destroyer', 3);

      enemyShip1.position = [6, 7, 8, 9, 10];
      enemyShip1.damage = [9];
      enemyShip2.position = [16, 26, 36];
      enemyShip2.damage = [26];
    });

    test('Get random coord with no active targets', () => {
      expect(computer.getAttackCoord()).toBeLessThanOrEqual(100);
    });

    test('Get succeeding hit ship coord, x-axis', () => {
      computer.targets.push(enemyShip1);
      expect(computer.getAttackCoord()).toEqual(10);
    });

    test('Get preceding hit ship coord, x-axis', () => {
      enemyShip1.damage = [9, 10];
      computer.attacks = [9, 10];
      computer.targets.push(enemyShip1);

      expect(computer.getAttackCoord()).toEqual(8);
    });

    test('Get succeeding hit ship coord, y-axis', () => {
      computer.attacks = [25, 26, 27];
      computer.targets.push(enemyShip2);
      expect(computer.getAttackCoord()).toEqual(36);
    });

    test('Get preceding hit ship coord, y-axis', () => {
      computer.attacks = [25, 26, 27, 36];
      computer.targets.push(enemyShip2);
      expect(computer.getAttackCoord()).toEqual(16);
    });
  });
});
