import Ship from "./ship";
import Gameboard from "./gameboard";

export default class Player{
  turn: boolean;
  human: boolean;
  constructor(turn:boolean, human: boolean){
    this.turn = turn;
    this.human = human;  
  }

  setTurn(){
    return this.turn == false ? this.turn = true : this.turn = false;
  }

  attackable(board: any, row: number, col: number){
    return board.board[row][col] == 0 || board.board[row][col] == 1 || typeof board.board[row][col] == "object";
  }

  userAttack(board: any, row: number, col: number){
    if(this.attackable(board, row, col)){
      board.receiveAttack(row, col);
      board = board;
    }else{
      return 0;
    }
  }

  computerAttack(board: any, turn: boolean){
    while(turn == false){
      let row = Math.floor(Math.random() * 10);
      let col = Math.floor(Math.random() * 10);

      if(this.attackable(board, row, col)){
        board.receiveAttack(row, col);
        board = board;
        turn = true;
      }
      else{
        return 0;
      }
    }
  }
}
