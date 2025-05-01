<script>
    import SendToServerButton from "/home/deno-server/Schreibtisch/deno/server_josua/src/frontend/svelte-game/src/lib/SendToServerButton.svelte";
    
    let visible = $state(true);
    
    
    </script>
    
    <h1>Spielwiese</h1>
    <p>Hier werden FUnktionen usw ausprobiert</p>
    <p>Hier könnte irgendwas interessantes stehen</p>
    <label>
        <input type="checkbox" bind:checked={visible} />
        visible
      </label>
    
      {#if visible}
        <p>Fades in and out</p>
      {/if}
    
      <SendToServerButton />