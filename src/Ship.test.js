const Ship = require('./Ship');

describe('Ship was hitted test', () => {
  let sub = new Ship("submarine", 3, [1, 2, 3]);
  test('Hit function test', () => {
    expect(sub.hit(1)).toEqual(['hit', 2, 3]);
  });
  let boat = new Ship("boat", 2, [1, 2]);
  test('Hit failed', () => {
    expect(boat.hit(3)).toEqual([1, 2]);
  });
});

describe('Ship is sunked? test', () => {
  let newBoat = new Ship("submarine", 3, [1, 2, 3], false);
  newBoat,hit(1);
  newBoat.hit(2);
  newBoat.hit(3);
  test('Submarine is sunked', () => {
    expect(newBoat.isSunk()).toEqual(true);
  });
});
