import Ship from '../modules/ship';

describe('Veryify object', () => {
  const carrier = new Ship(5);

  test('properties', () => {
    expect(carrier).toEqual({
      length: 5,
      position: [],
      hits: 0,
      sunk: false,
    });
  });
});

describe('Test methods', () => {
  const destroyer = new Ship(3);
  destroyer.hit();
  destroyer.hit();
  destroyer.hit();

  test('Hits property', () => {
    expect(destroyer).toHaveProperty('hits', 3);
  });

  test('Sunk property', () => {
    destroyer.isSunk();
    expect(destroyer).toHaveProperty('sunk', true);
  });
});
