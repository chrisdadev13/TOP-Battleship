const Gameboard = () => {
  let board = [];
  const COLS = 2;
  const ROWS = 2;

  const createBoard = () => {
    for(let i = 0; i < COLS * ROWS; i++){
      board.push(i);
    }
    return board;
  }

  createBoard();

  const rowShip = (ship, coordinate) => {
    for(let i = coordinate; i < ship.long + coordinate; i++){
      board[i] = ship.name;
      ship.position.push(i);
    }
    return board;
  }

  const colShip = (ship, coordinate) => {
    for(let i = coordinate; i < ship.long + COLS; i = i + ROWS){
      board[i] = ship.name;
      ship.position.push(i);
    }
    return board;
  }

  const placeShip = (ship, coordinate, direction) => {
    if(direction == 'row'){
      return rowShip(ship, coordinate);
    }else if(direction == 'col'){
      return colShip(ship, coordinate);
    }
  }

  const receiveAttack = (target, ship) => {
    for(let i = 0; i < board.length; i++){
      if(typeof board[i] != 'string' && i == target){
        board[i] = 'Missed';
        break;
      }else if(typeof board[i] == 'string' && board[i] != 'Missed' && i == target){
        board[i] = 'Hitted';
        break;
      } 
    }
    return board;
  }

  return { rowShip, colShip, placeShip, receiveAttack };
}

module.exports = Gameboard;
