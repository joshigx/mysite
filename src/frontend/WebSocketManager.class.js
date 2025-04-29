import { UIController } from "/UIController.class.js";

export class WebSocketManager {


	constructor(document) {

		this.document = document;
		this.protocol = window.location.protocol === "https:" ? "wss" : "ws";
		//this.wsUri = `${this.protocol}://${window.location.host}/`;
		this.wsUri = `${this.protocol}://${window.location.host}/${window.location.pathname}`;
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
		//Die eigentliche Verarbeitung der Nachrichten geschieht über die UIController Klasse in der MessageHandler-Klasse
		//Hier wird nur die Nachricht an die UIController-Klasse weitergegeben
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
