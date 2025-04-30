<script>
  import { WebSocketManager } from "./Socket.class.js";

  const websocket = new WebSocketManager(document);
  let nachricht = $state("Hallo Server");

  function sendNachricht(text) {
    const msg = {
      type: "chatAll",
      text: text,
      date: Date.now(),
    };

    websocket.send(JSON.stringify(msg));
    console.log("Button gedrückt");
  }
</script>

<div>
    
  <input bind:value={nachricht} />

  <button onclick={() => sendNachricht(nachricht)}>
    Send message to server v2
  </button>
</div>
