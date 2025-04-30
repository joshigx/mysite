<script>
  import { WebSocketManager } from "./Socket.class.js";

  const websocket = new WebSocketManager(document);
  console.log("Websocketverbindung läuft unter: '" + websocket.wsUri);
  
  let nachricht = $state("Hallo Server");

  function sendNachricht(text) {
    const msg = {
      type: "chatAll",
      text: text,
      date: Date.now(),
    };

    websocket.send(JSON.stringify(msg));
  }
</script>

<div>
    
  <input bind:value={nachricht} />

  <button onclick={() => sendNachricht(nachricht)}>
    Send message to server v2
  </button>
</div>
