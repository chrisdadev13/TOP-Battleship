import Ship from "./ship";
import Gameboard from "./gameboard";

export default class Player{
  turn: boolean;
  human: boolean;
  constructor(turn:boolean, human: boolean){
    this.turn = turn;
    this.human = human;  
  }

  computerAttack(board: any){
    let row: number;
    let col: number;

    while(this.turn == true){
      row = (Math.random() * 10) + 1;
      col = (Math.random() * 10) + 1;
      if(board[row][col] == 0 || typeof board[row][col] == 'object'){
        board.receiveAttack(row, col);
        this.turn = false;
      }else{
        this.turn = true;
      }
    }
  }
}
