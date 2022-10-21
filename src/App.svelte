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
  let finish = false;
  let winner = "";
  let player = new Player(turn, true);
  let computer = new Player(false, false);

  const hideBtn = () => {
    document.querySelector("#init-btn-container").remove();
    document.querySelector("#ship-container").remove();
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
    computerBoard.placeRandomly();
    computerBoard = computerBoard;
    started = true;
    turn = true;
  }

  const userAttack = (event) => {
    let row = parseInt(event.target.getAttribute("data-row"));
    let col = parseInt(event.target.getAttribute("data-col"));
    if(turn == true && (computerBoard.endGame() == false && userBoard.endGame() == false))
      player.userAttack(computerBoard, row, col);
      computerBoard = computerBoard;
      turn = false;
  }

  const computerAttack = () => {
    computer.computerAttack(userBoard, turn);
    userBoard = userBoard;
    turn = true;
  }

  $:if(started == true && turn == false && userBoard.endGame() == false && userBoard.endGame() == false){
        computerAttack()
    }

  $:if(userBoard.endGame() == true || computerBoard.endGame() == true){
    finish = true;
    if(computerBoard.endGame() == true){
      winner = "User";
    }else if(userBoard.endGame() == true){
      winner = "Computer";
    }
  }

</script>

<main>
  <h2>Battleship</h2>
  <div>
    <BoardUI board={userBoard} randomBoard={randomBoard} hideBtn={hideBtn}/>
    <EnemyBoardUi board={computerBoard} attackBoard={(event) => userAttack(event)} />
  </div>
  {#if finish == true}
    {#if winner == "User"}
      <div class="winner-modal">
        <h2>We have a winner</h2>
        <p>Congratulations human you are the winner!!</p>
        <button on:click={() => window.location.reload()}>Play Again</button>
      </div>
    {:else if winner == "Computer"}
      <div class="winner-modal">
        <h2>You lose</h2>
        <p>Meh, congratulations to the robots</p>
        <button on:click={() => window.location.reload()}>Play Again</button>
      </div>
    {/if}
  {/if}
</main>

<style>
  main{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 15vh;
  }
  div{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  h2{
    font-size: 36px;
  }
  .winner-modal{
    position: absolute; 
    background-color: white;
    left: 0; 
    right: 0; 
    margin-left: auto; 
    margin-right: auto; 
    width: 100px; /* Need a specific value to work */
    display: flex;
    flex-direction: column;
    width: 60vw;
    height: 60vh;
  }
</style>
