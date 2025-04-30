
export class WebSocketManager {

    constructor (document) {


        this.document = document;
		this.protocol = window.location.protocol === "https:" ? "wss" : "ws";
		//this.wsUri = `${this.protocol}://${window.location.host}/`;
		this.wsUri = `${this.protocol}://${window.location.host}/${window.location.pathname}`;
		this.websocket = new WebSocket(this.wsUri);
		this.websocket.addEventListener("open", this.open.bind(this))
		this.websocket.addEventListener("message", this.message.bind(this));
		this.websocket.addEventListener("close", this.close.bind(this));
		this.websocket.addEventListener("error", this.error.bind(this));
		
		


    }


    open(e) {
		this.sendServerLog("Vom client aus: CONNECTED. Das geht schonmal");
		
	}


	message(e) {
		
	}


	close() {
		console.log("DISCONNECTED");
	}

	error(error) {
		console.log("ERROR", error)
	}

	
	send(test) {
		this.websocket.send(test);
	}

    sendServerLog(log) {

        const msg = {
          type: "log",
            log: log,
        }
        
        
        this.websocket.send(JSON.stringify(msg));
        
         }
    }