<script>
  import SendToServerButton from "../lib/SendToServerButton.svelte";
  import GameLobby from "./GameLobby.svelte";
  import { WebSocketManager } from "../lib/Socket.class.js";

  let { hash } = $props();

  const websocket = new WebSocketManager(document);
  console.log("Websocketverbindung läuft unter: '" + websocket.wsUri);
  websocket.websocket.addEventListener("message", message.bind(this));


  let pageStatus = $state(0);
  let lobbyCode = $state("");
  let joinLobbyCode = $state("");

  //Hier können wir auf eingehende Nachrichten reagieren
  function message(e) {
    try {
      const string = e.data;
      const msg = JSON.parse(e.data);
      console.log(string);

      const handlers = {
        forwardToRoom: () => (lobbyCode = msg.id),
      };

      if (handlers[msg.type]) {
        handlers[msg.type]();
      }


    } catch (e) {
      console.error(e);
    }
  }

  //Hier können wir Nachrichten an den Server senden
  function sendNachricht(msgtype = "", text = "") {
    const msg = {
      type: msgtype,
      msg: text,
      date: Date.now(),
      origin: hash,
    };

    websocket.send(JSON.stringify(msg));
  }

  
  
 function createRoom() {
    pageStatus = 1;
    sendNachricht("createRoom", "");
  }

  function navJoinRoom() {
    pageStatus = 2;
  }

  function navMain() {
    pageStatus = 0;
    sendNachricht("leftRoom");
    lobbyCode = ("");
  }

  function joinRoom() {
    sendNachricht("joinRoom", joinLobbyCode);
    
  }
</script>

<main>
  <h1>Wer denkt was?</h1>
  

  {#if pageStatus === 0}
    <div>
      <button onclick={createRoom}>Raum erstellen</button>
      <button onclick={navJoinRoom}>Raum beitreten</button>
    </div>
  {/if}

  {#if pageStatus === 1}
    <button onclick={navMain}>Hauptmenü</button>

    <p>aktueller Raum: {lobbyCode}</p>
    <div><GameLobby {hash} /></div>
  {/if}

  {#if pageStatus === 2}
    <button onclick={navMain}>Hauptmenü</button>
    <div>
      <p>Code eingeben:</p>
      <input bind:value={joinLobbyCode} />
      <button onclick={joinRoom}>Raum beitreten</button>
    </div>
  {/if}
</main>

<style>
</style>
