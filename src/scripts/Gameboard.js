import Battleship from "./Ship.js";

const BOARD_SIZE = 10;

export default class Gameboard{
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
      this.board[i] = ship;
    }
  }

  colShip(ship, coordinate){
    for(let i = coordinate; i < ((ship.long * BOARD_SIZE) + coordinate) - BOARD_SIZE; i += BOARD_SIZE){
      ship.position.push(this.board[i].index);
      this.board[i] = ship;
    }
  }

  placeShip(ship, coordinate){
    if(ship.row == true && this.isPlaceable(ship, coordinate) == true){
      return this.rowShip(ship, coordinate);
    }else if(ship.row == false){
      return this.colShip(ship, coordinate);
    }  
  }

  isPlaceable(ship, coordinate){
    let placeable = false;
    if(ship.row == true){
      for(let i = 0; i < ship.long + coordinate; i++){
        if(this.board[i].status == 0){
          placeable = true;
        }else{
          placeable = false;
        }
      }
    }else if(ship.row == false){
      for(let i = 0; i < (ship.long + BOARD_SIZE) - BOARD_SIZE; i+= BOARD_SIZE){
        if(this.board[i].status == 0){
          placeable = true;
        }else{
          placeable = false;
        }
      }
    }
    return placeable;
  }

  receiveAttack(target){
    for(let i = 0; i < this.board.length; i++){
      if(target == this.board[i].index && this.board[i].status == 0){
        this.board[i].status = 1;
      }
    }  
  }
}

const board = new Gameboard;

const submarine = new Battleship(3, [], true, false);
const carrier = new Battleship(3, [], false, false);
const boat = new Battleship(3, [], true, false);
const carror = new Battleship(5, [], false, false);

board.placeShip(carror, 0);

board.placeShip(submarine, 60);

board.placeShip(carrier, 65);

board.placeShip(carrier, 80);
console.log(board);
