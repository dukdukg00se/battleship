import Ship from '../modules/data/ship';

describe('Ship object', () => {
  const destroyer = new Ship('Destroyer', 3);

  test('Properties', () => {
    expect(destroyer).toEqual({
      name: 'Destroyer',
      length: 3,
      position: [],
      damage: [],
    });
  });

  test('A hit', () => {
    destroyer.position = [1, 2, 3];
    destroyer.hit(3);
    expect(destroyer).toHaveProperty('damage', [3]);
  });

  test('Another hit', () => {
    destroyer.hit(1);
    expect(destroyer).toHaveProperty('damage', [1, 3]);
  });

  test('Ship not sunk', () => {
    expect(destroyer.isSunk()).toBe(false);
  });

  test('Ship sinks', () => {
    destroyer.hit(2);
    expect(destroyer.isSunk()).toBe(true);
  });
});
