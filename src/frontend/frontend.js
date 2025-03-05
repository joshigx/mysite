import { WebSocketManager } from "./WebSocketManager.class.js";

const websocket = new WebSocketManager(document);
console.log("Websocketverbindung läuft unter: '" + websocket.wsUri);
