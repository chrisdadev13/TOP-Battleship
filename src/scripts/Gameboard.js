import Battleship from "./Ship.js";

const BOARD_SIZE = 10;

class Gameboard{
  constructor(){
    this.board = [];
    this.init();
  }

  init(){
    for(let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++){
      this.board.push({
        status: 0, //0: Water, 1: Missed, 2, Hitted, 3: Boat, 4: Sunked 
        index: i
      }) 
    }
    return this.board;
  }

  rowShip(ship, coordinate){
    for(let i = coordinate; i < ship.long + coordinate; i++){
      ship.position.push(this.board[i].index);
      this.board[i].status = 3;
    }
  }

  colShip(ship, coordinate){
    for(let i = coordinate; i < (ship.long * BOARD_SIZE) - BOARD_SIZE; i += BOARD_SIZE){
      ship.position.push(this.board[i].index);
      this.board[i].status = 3;
    }
  }

  placeShip(ship, coordinate){
    if(ship.row == true){
      return this.rowShip(ship, coordinate);
    }else{
      return this.colShip(ship, coordinate);
    }
  }
}

const board = new Gameboard;

const submarine = new Battleship(3, [], true, false);
const carrier = new Battleship(5, [], false, false);

const boat = new Battleship(3, [], true, false);

console.log(board.placeShip(submarine, 0));

console.log(board.placeShip(carrier, 5));

console.log(board.placeShip(boat, 4));

console.log(submarine);
console.log(carrier);

console.log(board);
