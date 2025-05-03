<script>

  //Komponente hat folgende Properties: <SendToServerButton btnLabel = {""} msgType = {""} defaultMsg = {""} origin = {hash}/>
  import { WebSocketManager } from "./Socket.class.js";

  
  //const defaultWebSocket = new WebSocketManager(document);
  
  let {websocket, btnLabel = "Nachricht an Server senden", msgType ="chatAll", defaultMsg = "Hallo Server", origin = ""} = $props();
  console.log("Websocketverbindung läuft unter: '" + websocket.wsUri);
  let nachricht = $state(defaultMsg);
  function sendNachricht(nachricht) {
    const msg = {
      type: msgType,
      text: nachricht,
      date: Date.now(),
      origin: origin,
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
