<script>
  import SendToServerButton from "../lib/SendToServerButton.svelte";

  let { hash, websocket, username } = $props();

  let userList = $state();
</script>

<p>Hash: {hash}</p>

{#if hash === "#game"}
  <h1>Willkommen in der Lobby</h1>

  <p>Hier kommt Code rein, wenn man</p>
  <p>Hash auf GameLobby.svelte: {hash}</p>

  {#if (username === "")}
    
  
  <SendToServerButton
    {websocket}
    btnLabel={"Gib einen Nutzernamen ein"}
    msgType={"getUsername"}
    defaultMsg={""}
    origin={hash}
  />
  {:else}

  <p>du hast bereits einen nutzer namen</p>



  {/if}




{/if}
