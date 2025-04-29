const protocol = window.location.protocol === "https:" ? "wss" : "ws";
const wsUri = `${protocol}://${window.location.host}/${window.location.pathname}`;
const websocket = new WebSocket(wsUri);

