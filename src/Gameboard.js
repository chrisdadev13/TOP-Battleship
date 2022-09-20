const Gameboard = () => {
  const COLS = 2;
  const ROWS = 2;

  board = COLS * ROWS;

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
        ship.position.push(i);
      }
    }
    return board;
  }

  const colShip = (ship, coordinate) => {
    let board = createBoard();
    if(ship.direction == 'col'){
      for(let i = coordinate; i < ship.long + COLS; i = i + ROWS){
        board[i] = ship.name;
        ship.position.push(i);
      }
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
    for(let i = 0; i < ship.position.length; i++){
      if(i == target && typeof board[i] != 'string'){
        ship.hit(target);
      }else{
        board[i] = 'missed';
      }
    }
    return board;
  }

  return { rowShip, colShip, placeShip, receiveAttack };
}

module.exports = Gameboard;
