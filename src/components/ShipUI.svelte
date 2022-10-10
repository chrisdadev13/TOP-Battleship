<script lang="ts">
    import { onDestroy } from "svelte/types/runtime/internal/lifecycle";


  export let ships:any;
  export let vertical: boolean;

  export let onDragShip;
  export let offDragShip;

  export let count = 0;
</script>

{#if vertical == true}
  <div class="ships-container-col">
      <div 
        draggable="true" 
        class="ship-preview-container"
        on:dragend={(event) => offDragShip(event)}
        on:dragstart={(event) => onDragShip(event)}
        id={count.toString()}
      >
        {#if count == 0} 
          {#each new Array(ships[count].longitude) as j}
            <div class="ship-preview-tile"></div>
          {/each}
        {:else if count == 1}
          {#each new Array(ships[count].longitude) as j}
            <div class="ship-preview-tile"></div>
          {/each}
        {:else if count == 2}
          {#each new Array(ships[count].longitude) as j}
            <div class="ship-preview-tile"></div>
          {/each}
        {:else if count == 3}
          {#each new Array(ships[count].longitude) as j}
            <div class="ship-preview-tile"></div>
          {/each}
        {:else if count == 4}
          {#each new Array(ships[count].longitude) as j}
            <div class="ship-preview-tile"></div>
          {/each}
        {/if}
      </div>
  </div>
{:else}
  <div class="ships-container-row">
      <div 
        draggable="true" 
        style="transform: rotate(90deg); margin-bottom: -90px;" 
        on:dragend={(event) => offDragShip(event)}
        on:dragstart={(event) => onDragShip(event)}
        id={count.toString()}
      >
        {#if count == 0} 
          {#each new Array(ships[count].longitude) as j}
            <div class="ship-preview-tile"></div>
          {/each}
        {:else if count == 1}
          {#each new Array(ships[count].longitude) as j}
            <div class="ship-preview-tile"></div>
          {/each}
        {:else if count == 2}
          {#each new Array(ships[count].longitude) as j}
            <div class="ship-preview-tile"></div>
          {/each}
        {:else if count == 3}
          {#each new Array(ships[count].longitude) as j}
            <div class="ship-preview-tile"></div>
          {/each}
        {:else if count == 4}
          {#each new Array(ships[count].longitude) as j}
            <div class="ship-preview-tile"></div>
          {/each}
        {/if}
      </div>
  </div>
{/if}

<style>
  .ships-container-row{
    display: flex;
    flex-direction: row;
    width: 350px;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
  .ships-container-col{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 65px;
    width: 350px;
  }
  .ship-preview-tile{
    width:35px; 
    height: 33px;
    border: 1px solid #0000ff;
    background-color: #fff;
    transition: 0.2s ease-in-out;
  }
  .ship-preview-tile:hover{
    background-color: #f2f2ff;
  }
  .ship-preview-container{
    margin: 0, auto;
  }
</style>

