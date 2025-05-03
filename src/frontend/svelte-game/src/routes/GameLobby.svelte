<script>
  import SendToServerButton from "../lib/SendToServerButton.svelte";

  let { hash, websocket } = $props();

  let t = $state(0);
  let userName = $state("");
  let userList = $state();
</script>

<p>Hash: {hash}</p>

{#if hash === "#game"}
  <h1>Willkommen in der Lobby</h1>

  <p>Hier kommt Code rein, wenn man</p>
  <p>Hash auf GameLobby.svelte: {hash}</p>
  <SendToServerButton
    {websocket}
    btnLabel={"Gib einen Nutzernamen ein"}
    msgType={"getUserName"}
    defaultMsg={""}
    origin={hash}
  />
{/if}
