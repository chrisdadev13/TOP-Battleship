const Gameboard = () => {
  const COLS = 2;
  const ROWS = 2;
  let board = [];

  const createBoard = () => {
    for(let i = 0; i < COLS * ROWS; i++){
      board.push(i);
    }
    return board;
  }

  const rowShip = (ship, coordinate) => {
    let board = createBoard();
    if(ship.direction == 'row'){
      for(let i = coordinate; i < ship.long + coordinate; i++){
        board[i] = ship.name;
        ship.position.push(board[i]);
      }
    }
    return board;
  }

  const colShip = (ship, coordinate) => {
    let board = createBoard();
    if(ship.direction == 'col'){
      for(let i = coordinate; i < ship.long * COLS; i = i + ROWS){
        board[i] = ship.name;
        ship.position.push(board[i]);
      }
    }
    return board;
  }

  return { rowShip, colShip };
}

module.exports = Gameboard;
