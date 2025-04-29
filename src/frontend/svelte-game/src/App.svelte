<script>

const protocol = window.location.protocol === "https:" ? "wss" : "ws";
const wsUri = `${protocol}://${window.location.host}/${window.location.pathname}`;
const websocket = new WebSocket(wsUri);

websocket.onopen = (e) => {
    sendServerLog("Vom client aus: CONNECTED");
    }

websocket.onclose = (e) => {

};

websocket.onmessage = (e) => {
    console.log(e.data);
    let text = "";
    const msg = JSON.parse(e.data);
    const time = new Date(msg.date);
    const timeStr = time.toLocaleTimeString();


    //Überprüft, welches "Protokoll" auf die vom Server eingehenden Nachrichten anzuwenden ist
    switch (msg.type) {
        case "id":

        break;
        default:;
        
    }
};

websocket.onerror = (e) => {
};


  let count = $state(0);
  let nachricht = $state("");
  let msgToServer = $state("Hallo Server");
  function increment() {
    count += 1;
  }

  function sendServerLog(log) {

const msg = {
    type: "log",
    log: log,
}


websocket.send(JSON.stringify(msg));

}

function sendMsgToServer() {
  const msg = {
        type: "chatAll",
        text: msgToServer,
        date: Date.now(),
    };

    websocket.send(JSON.stringify(msg));
}


</script>

<main>
  <h1>Hey</h1>

  <input bind:value={msgToServer}/>
  <button id="test" onclick={sendMsgToServer}>Send message to server{count}</button>
  <p>Folgende Nachricht erhalten: {nachricht}</p>

</main>
