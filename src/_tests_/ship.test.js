import Ship from '../modules/ship';

describe('Ship object', () => {
  const destroyer = new Ship('Destroyer', [1, 2, 3]);

  test('properties', () => {
    expect(destroyer).toEqual({
      name: 'Destroyer',
      position: [1, 2, 3],
      hits: 0,
    });
  });

  test('hit method', () => {
    destroyer.hit();
    destroyer.hit();
    expect(destroyer).toHaveProperty('hits', 2);
  });

  test('isSunk shows false', () => {
    expect(destroyer.isSunk()).toBe(false);
  });

  test('isSunk shows true', () => {
    destroyer.hit();
    expect(destroyer.isSunk()).toBe(true);
  });
});
