const Gameboard = require('./Gameboard');
const Ship = require('./Ship');

describe('Place a ship in the game board', () => {
  let board = Gameboard();
  let sub = Ship("Submarine", 'row', 2, [], false);
  test('Place a ship in a row direction', () => {
    expect(board.placeShip(sub, 0, sub.direction)).toEqual(['Submarine', 'Submarine', 2, 3]);
  });
  /*
  let boat = Ship("Boat", 'col', 2, [], false);
  test('Place a ship in a col direction', () => {
    expect(board.placeShip(boat, 0, boat.direction)).toEqual(['Boat', 1, 'Boat', 3]);
  });
  */
})

describe('Receive attack function', () => {
  let attackBoard = Gameboard();
  let navy = Ship('Navy', 'row', 2, [], false);
  test('Place board function wrapper', () => {
    expect(attackBoard.placeShip(navy, 0, 'row')).toEqual(["Navy", "Navy", 2, 3]);
  })
  attackBoard.placeShip(navy, 0, 'row');
  test('Missed attack', () => {
    expect(attackBoard.receiveAttack(3, navy)).toEqual(['Navy', 'Navy', 2, 'missed']);
  })
})
