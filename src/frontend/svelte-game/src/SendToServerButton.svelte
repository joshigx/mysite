<script>
  import { WebSocketManager } from "./Socket.class.js";

  const websocket = new WebSocketManager(document);
  let msgToServer = $state("Hallo Server");

  function msg2Server(text) {
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
  <input bind:value={msgToServer} />

  <button onclick={() => msg2Server(msgToServer)}>
    Send message to server v2
  </button>
</div>
