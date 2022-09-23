import Board from "./Gameboard";
import Battleship from "./Ship";

export default class Player{
  constructor(turn, attackedPoints){
    this.turn = turn;
    this.attackedPoints = attackedPoints;
  }
  pcAttack(board){
    let pcTarget = Math.floor(Math.random() * 100) + 1; 
  }
}

const boardGame = new Board();
