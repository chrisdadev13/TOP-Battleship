<script>
  const WIDTH = 10;
  const HEIGHT = 10;
  let board = [];
  const createBoard = () => {
    for(let i = 0; i < WIDTH * HEIGHT; i++){
      board.push(i);

    }
  }
  createBoard();


</script>

<main class="board-container">
  {#each board as tile}
    {#if typeof tile == 'number'}
      <div class="sea-container board-tile" />
    {:else if typeof tile == 'string' && tile == 'Missed'}
      <div class="missed-container">
      </div>
    {:else if typeof tile == 'string' && tile != 'Missed'}
      <div class="ship-container" />
    {/if}
  {/each}
</main>

<style>
  .board-container{
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(10, 1fr);
  }

  .sea-container{
    padding: 20px;
    background-container: #ffffff;
  }

  .missed-container{
    padding: 20px;
    border: 1px solid red;
    background-color: #f2f4f8;
    color: red;
  }

  .ship-container{
    padding: 20px;
    background-color: #f2f2ff; 
    border: 1px solid #0000ff;
  }

  .board-tile{
    border: 1px solid #b4b4ff;
    padding: 20px;
  }
</style>
