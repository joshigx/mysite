<script>

  //Komponente hat folgende Properties: <SendToServerButton btnLabel = {""} msgType = {""} defaultMsg = {""} origin = {hash}/>
  import { WebSocketManager } from "./Socket.class.js";

  const websocket = new WebSocketManager(document);
  console.log("Websocketverbindung läuft unter: '" + websocket.wsUri);
  
  
  let {btnLabel = "Nachricht an Server senden", msgType ="chatAll", defaultMsg = "Hallo Server", origin = ""} = $props();
  let nachricht = $state(defaultMsg);
  function sendNachricht(text) {
    const msg = {
      type: msgType,
      text: text,
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
