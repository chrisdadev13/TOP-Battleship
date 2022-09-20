class Gameboard{
  constructor(width = 10, long = 10){
    this.witdth = width;
    this.long = long;
  }

  boardMeasures(){
    return this.witdh * this.long;
  }
  
  setGameBoard(){
    let board = [];
    for(let i = 0; i < this.boardMeasures; i++){
      board.push(undefined);
    }
    return board;
  }

  rowShip(ship, coordinates){
    let board = this.setGameBoard;
    if(ship.direction == 'row'){
      for(let i = coordinates; i < ship.long + coordinates; i++){
        board[i] = ship.name;
      }
    }
    return board;
  }

  colShip(ship, coordinates){
    let board = this.setGameBoard;
    if(ship.direction == 'col'){
      for(let i = ship.coordinates; i < ship.long * 10; i = i + 10){
        board[i] = ship.name;
      }
    }
    return board;
  }

}

const Ship = require('./Ship');

const sub = new Ship("submarine", 3);
let board = new Gameboard;
console.log(board.rowShip(sub, 3));

module.exports = Gameboard;
