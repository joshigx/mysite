<script>
  import { WebSocketManager } from "./Socket.class.js";

  const websocket = new WebSocketManager(document);
  console.log("Websocketverbindung läuft unter: '" + websocket.wsUri);
  
  let nachricht = $state("Hallo Server");
  let {btnLabel = "Nachricht an Server senden", msgType ="chatAll"} = $props();

  function sendNachricht(text) {
    const msg = {
      type: msgType,
      text: text,
      date: Date.now(),
    };

    websocket.send(JSON.stringify(msg));
  }
</script>

<div>
  <input bind:value={nachricht} />
  <button onclick={() => sendNachricht(nachricht)}>
    {btnLabel}
  </button>
</div>
