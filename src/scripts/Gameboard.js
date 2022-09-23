import Battleship from "./Ship.js";

const BOARD_SIZE = 10;

export default class Board{
  constructor(){
    this.board = [];
    this.init();
  }

  init(){
    for(let i = 0; i < 100; i++){
      this.board.push({
        status: 0, //0: Water, 1: Missed, 2: Hitted, 3: Boat, 4: Sunked 
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
    for(let i = coordinate; i < ((ship.long * BOARD_SIZE) + coordinate); i += BOARD_SIZE){
      ship.position.push(this.board[i].index);
      this.board[i] = ship;
    }
  }

  placeShip(ship, coordinate){
    if(ship.row == true && this.isPlaceable(ship, coordinate) == true){
      return this.rowShip(ship, coordinate);
    }else if(ship.row == false && this.isPlaceable(ship, coordinate) == true){
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
      for(let i = 0; i < ((ship.long * BOARD_SIZE) + coordinate); i+= BOARD_SIZE){
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
    if(this.board[target].status == 0){
      this.board[target].status = 1;
    }else if(typeof this.board[target] == 'object'){
      this.board[target].hit(target);
      this.board[target] = {status: 2};
    }else{
      this.board[target].status = this.board[target].status;
    }
  }
}
