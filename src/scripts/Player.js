import Battleship from "./Ship.js";
import Board from "./Gameboard.js";


export default class Player{
  constructor(turn, attackedPoints){
    this.turn = turn;
    this.attackedPoints = attackedPoints;
  }
  pcAttack(board){
    while(this.turn == true){
      let target = Math.floor(Math.random() * 10) + 1;
      if(board.board[target].status == 0 || board.board[target].status == 4){
        board.receiveAttack(target);
        this.turn = false;
      }else{
        console.log('Invalid');
      } 
    }
  }
}
