<script lang="ts">
  import BoardUI from "./components/BoardUI.svelte";
  import EnemyBoardUi from "./components/EnemyBoardUI.svelte";
  import Gameboard from "./scripts/gameboard";
  import Ship from './scripts/ship';
  import Player from './scripts/player';

  let userBoard = new Gameboard;
  let computerBoard = new Gameboard;

  let turn = false;
  let started = false;
  let player = new Player(turn, true);
  let computer = new Player(false, false);

  const hideBtn = () => {
    document.querySelector("#init-btn-container").remove();
    document.querySelector("#ship-container").remove();
    player.setTurn()
    computerBoard.placeRandomly();
    computerBoard = computerBoard;
    started = true;
    turn = true;
  }

  const randomBoard = () => {
    document.querySelector("#init-btn-container").remove();
    document.querySelector("#ship-container").remove();
    userBoard.placeRandomly();
    userBoard = userBoard;
    started = true;
    turn = true;
  }

  const userAttack = (event) => {
    let row = parseInt(event.target.getAttribute("data-row"));
    let col = parseInt(event.target.getAttribute("data-col"));
    if(turn == true)
      player.userAttack(computerBoard, row, col);
      computerBoard = computerBoard;
      turn = false;
  }

  const computerAttack = () => {
    if(started == true){
      if(turn == false){
        computerAttack
      }
    }
  }

  $:if(started == true){
      if(turn == false){
        computer.computerAttack(userBoard);
      }
  }

  $:console.log(turn);
</script>

<main>
  <BoardUI board={userBoard} randomBoard={randomBoard} hideBtn={hideBtn}/>
  <EnemyBoardUi board={computerBoard} attackBoard={(event) => userAttack(event)} />
</main>

<style>
  main{
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
