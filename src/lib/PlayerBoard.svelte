<script>
  import Board from '../scripts/Gameboard';
  import Ship from '../scripts/Ship';
  import Player from '../scripts/Player';

  let gameBoard = new Board; 
  let direction = true;
  let submarine = new Ship(3, [], false, direction);
  let carrier = new Ship(5, [], false, false);

  const placeShipOnBoard = (event) => {
    let target = parseInt(event.target.id);
    gameBoard.placeShip(submarine, target);
    console.log(submarine);
    gameBoard = gameBoard;
  }

  const changeDirection = () => {
    direction = false;
    submarine = submarine;
  }
</script>

<main class="board-container">
  {#each gameBoard.board as tile}
    {#if tile.status == 0}
      <div class="sea-tile" id={tile.index} on:click={event => placeShipOnBoard(event)}>
      </div> 
    {:else if tile.status != 0}
      <div class="ship-tile">
      </div> 
    {/if}
 {/each}
</main>
  <button on:click={changeDirection}>rotate</button>

<style>
  .board-container{
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(10, 1fr);
  }
  .sea-tile{
    border: 1px solid white;
    width: 40px;
    height: 40px;
  }
  .ship-tile{
    border: 1px solid white;
    width: 40px;
    height: 40px;
    background-color: teal;
  }
</style>
