<script lang="ts">
  import Gameboard from "../scripts/gameboard";
  import Ship from "../scripts/ship";

  export let board;
  export let attackBoard;
</script>


<main class="container">
  <div class="board-container">
    {#each board.board as row, rowIndex}
      {#each row as col, colIndex}
        {#if board.board[rowIndex][colIndex] == 0}
          <div 
            class={"empty-tile"}
            data-row={rowIndex} 
            data-col={colIndex}
            on:click={(event) => attackBoard(event)}
          >
          </div> 
        {:else if board.board[rowIndex][colIndex] == 1 || typeof board.board[rowIndex][colIndex] == "object"}
          <div 
            class={"empty-tile"}
            data-row={rowIndex} 
            data-col={colIndex}
            on:click={(event) => attackBoard(event)}
          >
          </div> 
        {:else if board.board[rowIndex][colIndex] == "Missed"} 
          <div 
            class={"missed-tile"} 
            data-row={rowIndex} 
            data-col={colIndex}
          >
            *
          </div> 
        {:else if board.board[rowIndex][colIndex] == "Hitted"}
          <div 
            class={"hitted-tile"} 
            data-row={rowIndex} 
            data-col={colIndex}
          >
           X 
          </div>
        {/if}
      {/each}
    {/each}
  </div>  
</main>

<style>
  .board-container{
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(10, 1fr);
    width: 350px;
    height: 350px;
    border: 2px solid #b4b4ff;
    margin-right: 15px;
  }
  .empty-tile{
    width: full;
    height: full;
    border: 1px solid #b4b4ff;
    cursor:crosshair;
  }
  .missed-tile{
    width: full;
    height: full;
    border: 1px solid #b4b4ff;
    background-color: #fafad2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 12px;
  }
  .hitted-tile{
    width: full;
    height: full;
    border: 1px solid #b4b4ff;
    background-color: #fff2f2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 12px;
  }
</style>
