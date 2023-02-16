import Ship from '../modules/ship';

describe('Verify properties', () => {
  const carrier = new Ship(5, [1, 2, 3, 4, 5]);

  test('properties', () => {
    expect(carrier).toEqual({
      length: 5,
      position: [1, 2, 3, 4, 5],
      hits: 0,
    });
  });
});

describe('Test methods', () => {
  const destroyer = new Ship(3);
  destroyer.hit();
  destroyer.hit();

  test('Hits property', () => {
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
