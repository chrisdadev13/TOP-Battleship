<script lang="ts">
  import BoardUi from "./components/BoardUI.svelte";
  import EnemyBoardUi from "./components/EnemyBoardUI.svelte";
  import Gameboard from "./scripts/gameboard";
  import Ship from './scripts/ship';

  let carrier = new Ship(4, [], false);

  let userBoard = new Gameboard;
  let computerBoard = new Gameboard;
  computerBoard.receiveAttack(5, 0);
  computerBoard.placeShip(carrier, 3, 0, false)
  console.log(computerBoard);
  computerBoard.receiveAttack(3, 0);
</script>

<main>
  <BoardUi board={userBoard}/>
  <EnemyBoardUi board={computerBoard}/>
</main>

<style>
  main{
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
