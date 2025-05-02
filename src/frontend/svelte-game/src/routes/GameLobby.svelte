<script>
  import { WebSocketManager } from "../lib/Socket.class.js";

  let { hash } = $props();

  let t = $state(0);
</script>

<p>Hash: {hash}</p>

{#if hash === "#game"}
  <p>Hier kommt Code rein, wenn man</p>
  <p>Hash auf GameLobby.svelte: {hash}</p>
{/if}
