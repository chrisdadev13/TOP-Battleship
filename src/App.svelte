<script lang="ts">
  import BoardUI from "./components/BoardUI.svelte";
  import EnemyBoardUi from "./components/EnemyBoardUI.svelte";
  import Gameboard from "./scripts/gameboard";
  import Ship from './scripts/ship';

  let userBoard = new Gameboard;
  let computerBoard = new Gameboard;
  let userTurn = false;
  let started = false;

  const hideBtn = () => {
    document.querySelector("#init-btn-container").remove();
    userTurn = true;
    started = true;
    computerBoard.placeRandomly();
    computerBoard = computerBoard;
  }

  const userAttack = (event) => {
    if(userTurn == true){
      let row = parseInt(event.target.getAttribute("data-row"));  
      let col = parseInt(event.target.getAttribute("data-col"));
      if(computerBoard.board[row][col] == 0 || computerBoard.board[row][col] == 1 || typeof computerBoard.board[row][col] == "object"){
        computerBoard.receiveAttack(row, col);
        computerBoard = computerBoard;
        userTurn = false;
      }else{
        userTurn = true;
      }
    }
  }

  const computerAttack = () => {
    let row = Math.floor(Math.random() * 10);
    let col = Math.floor(Math.random() * 10);

    if(started == true){
      if(userTurn == false){
        userBoard.receiveAttack(row, col)
        userBoard = userBoard;
        userTurn = true;
      }
    }
  }

  $: if(userTurn == false){
    computerAttack();
  }
</script>

<main>
  <BoardUI board={userBoard} hideBtn={hideBtn}/>
  <EnemyBoardUi board={computerBoard} attackBoard={(event) => userAttack(event)} />
</main>

<style>
  main{
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
