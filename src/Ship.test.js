const Ship = require('./Ship');

describe('Ship was hitted test', () => {
  let sub = Ship("submarine", 'row' , 3, [1, 2, 3]);
  test('Hit function test', () => {
    expect(sub.hit(1)).toEqual(['hit', 2, 3]);
  });
  let boat = Ship("boat", 'row' ,2, [1, 2]);
  test('Hit failed', () => {
    expect(boat.hit(3)).toEqual([1, 2]);
  });
});
describe('Ship is sunked? test', () => {
  let testSub = Ship("submarine", 'row', 3, []);
  testSub.hit(1);
  testSub.hit(2);
  testSub.hit(3);
  test('Submarine is sunked', () => {
    expect(testSub.isSunk()).toEqual(true);
  });
  let testBoat = Ship("boat", 'row', 2, []);
  testBoat.hit(1);
  test('Boat is not sunked', () => {
    expect(testBoat.isSunk()).toEqual(false);
  });
});
