import { UIController } from "./UIController.class.js";

export class WebSocketManager {


	constructor(document) {

		this.document = document;
		this.wsUri = `wss://${window.location.host}/`;
		this.websocket = new WebSocket(this.wsUri);
		this.uic = new UIController(document, this);
		this.websocket.addEventListener("open", this.open.bind(this))
		this.websocket.addEventListener("message", this.message.bind(this));
		this.websocket.addEventListener("close", this.close.bind(this));
		this.websocket.addEventListener("error", this.error.bind(this));
		
		
	}


	open(e) {
		this.sendServerLog("Vom client aus: CONNECTED");
		
	}


	message(e) {
		this.uic.handleMessage(e);	
	}


	close() {
		console.log("DISCONNECTED");
	}

	error(error) {
		console.log("ERROR", error)
	}

	

	//Funktionen, die mit dem Server kommunizieren

	send(msg) {
		this.websocket.send(JSON.stringify(msg))
	}

	sendServerLog(log) {
		this.send({
			type: "log",
			log: log,
		})
	}



}
