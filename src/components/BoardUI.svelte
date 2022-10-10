<script lang="ts">
  import Gameboard from "../scripts/gameboard";
  import Ship from "../scripts/ship";
  import ShipsUI from "./ShipUI.svelte"; 

  let board = new Gameboard;
  let carrier = new Ship(4, [], false);
  let battleship = new Ship(4, [], false);
  let cruiser= new Ship(3, [], false);
  let submarine= new Ship(2, [], false);
  let patrol= new Ship(2, [], false);
 
  let ships = [
    carrier,
    battleship,
    cruiser,
    submarine,
    patrol
  ] 

  let vertical = true;

  $: shipVertical = vertical;

  const rotateShips = () => vertical = !vertical;

  let tileRow = 0;
  let tileCol = 0;
  let dragging = false;

  $: row = tileRow;
  $: col = tileCol

  let count = 0;

  function dragShip(event){
    dragging = true;
    if(event.target.id == "0"){
      return ships[0];
    }
    else if(event.target.id == "1"){
      return ships[1];
    }
    else if(event.target.id == "2"){
      return ships[2];
    }
    else if(event.target.id == "3"){
      return ships[3];
    }
    else if(event.target.id == "4"){
      return ships[4];
    }
  }

  function getCoordinates(event){
    tileRow = parseInt(event.target.getAttribute("data-row"));
    tileCol = parseInt(event.target.getAttribute("data-col"));
  }

  function dropShip(event){
    if(board.isShipPlaceable(dragShip(event), row, col, vertical) == true){
      board.placeShip(dragShip(event), row, col, vertical);
      board = board;
      count++;
    }
    dragging = false;
  }

  $:console.log(dragging);

</script>
<main class="container">
  <div class="board-container">
    {#each board.board as row, rowIndex}
      {#each row as col, colIndex}
        {#if typeof board.board[rowIndex][colIndex] != "object"}
          <div 
            class={board.board[rowIndex][colIndex] == 1 && dragging == true ? "enable-tile" : "empty-tile"}
            data-row={rowIndex} 
            data-col={colIndex}
            on:dragover={(event) => getCoordinates(event)}
          >
            {board.board[rowIndex][colIndex] == "Hitted" ? "X" : ""}
          </div> 
        {:else if typeof board.board[rowIndex][colIndex] == "object"} 
          <div 
            class='ship-tile' 
            data-row={rowIndex} 
            data-col={colIndex}
          >
            {board.board[rowIndex][colIndex] == "Hitted" ? "X" : ""}
          </div> 
        {/if}
      {/each}
    {/each}
  </div>  
  <ShipsUI ships={ships} vertical={shipVertical} onDragShip={dragShip} offDragShip={dropShip} count={count} />
</main>

<div style="position: absolute; top: 390px; left: 15px; display: flex;">
  <p class={count == 5 ? "inactive-button" : "rotate-button"} on:click={rotateShips}>Rotate</p>
  <p class={count == 5 ? "rotate-button" : "inactive-button"}>Play </p>
</div>


<style>
  main{
    display: flex;
    flex-direction: column;
    padding: 20px;
  }
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
  }
  .enable-tile{
    transition: 0.3s ease-in-out;
    border: 1px solid #b4b4ff;
    background-color: #ff004c17;
  }
  .ship-tile{
    width: full;
    height: full;
    border: 1px solid #0000ff;
    background-color: #f2f2ff;
  }
  .rotate-button{
    font-weight: bold;
    color: #4e93d9;
    cursor: pointer;
    margin: 0px 15px;
  }
  .inactive-button{
    color: #757575;
    cursor:none;
    margin: 0px 15px;
  }
</style>
