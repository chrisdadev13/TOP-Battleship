const Gameboard = require('./Gameboard');
const Ship = require('./Ship');

describe('Place a ship in the game board', () => {
  let board = Gameboard();
  let sub = Ship("Submarine", 'row', 2, [], false);
  test('Place a ship in a row direction', () => {
    expect(board.rowShip(sub, 0)).toEqual(['Submarine', 'Submarine', 2, 3]);
  });
  let boat = Ship("Boat", 'col', 2, [], false);
  test('Place a ship in a col direction', () => {
    expect(board.colShip(boat, 0)).toEqual(['Boat', 1, 'Boat', 3]);
  });
})
