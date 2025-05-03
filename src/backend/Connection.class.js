import { Room } from "./Room.class.js";




export class Connection {
	/**
	 * @param {Socket} socket 
	 * @param {Server} server 
	 */

	constructor(socket, server) {
		this.socket = socket;
		this.room;

		
		this.server = server;
		//in this.server.clients sind alle clients gespeichert
		//this.server.clients ist eine map, key ist die uuid und value die instanz der jeweiligen connection
		//in this.server.rooms, sind die räume gespeichert
		this.uuid = crypto.randomUUID();
		this.username = undefined;

		this.socket.addEventListener("message", this.message.bind(this));
		this.socket.addEventListener("close", this.close.bind(this));
		this.socket.addEventListener("error", this.error.bind(this));
	}

	/**
	 * @param {Event} e 
	 */
	message(e) {
		try {
			const msg = JSON.parse(e.data);
			console.log(msg);
			switch (msg.type) {
				case "log":
					console.log(msg.log);
					break;
				case "message":
					this.handleMessage(msg);
					break;
				case "submit":
					this.handleSubmit(msg);
					break;
				case "createRoom":
					this.handleCreateRoom(msg);
					break;
				case "restart":
					this.handleRestart();
					break;
				case "chatAll":
					this.handleBroadcast(msg);
					break;
				case "leftRoom":
					this.handleLeftRoom();
					break
				case "joinRoom":
					this.handleJoinRoom(msg);
					break
				
				default:
					console.log("Unbekannte Nachricht ist eingetroffen", msg);
					break;
			}
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * @param {JSON} msg 
	 */
	send(msg) {
		this.socket.send(JSON.stringify(msg));
	}

	close() {
		try {
			console.log("DISCONNECTED");
			if (this.room) {

				this.handleLeftRoom();

			}
			this.server.clients.delete(this.uuid);
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * @param {Error} error 
	 */
	error(error) {
		console.log("ERROR", error)
	}

	/**
	 * @param {string} path 
	 */
	redirect(path) {
		this.send({
			type: "redirect",
			page: `${path}`
		});
	}

	/**
	 * @param {JSON} msg 
	 */
	alert(msg) {
		this.send({
			type: "alert",
			alert: msg,
		});
	}

	sendLoginInfo() {
		const userInfo = {
			type: "login-info",
			name: this.username,
			raum: this.room.name
		};
		//und dann an den socket als JSON-String gesendet
		this.send(userInfo);
	}




	//Überprüft ob der client name in der Map map existiert
	usernameExists(name, map) {
		for (const client of map.values()) {
			if (client.username === name) {
				return true;
			}
		}
		return false;
	}


	waitForCondition(checkFunction, interval = 100) {
		return new Promise(resolve => {
			let check = setInterval(() => {
				if (checkFunction()) {
					clearInterval(check);
					resolve();
				}
			}, interval);
		});
	}

	/**
	 * Spezifische Nachrichten Handler
	 */

	/**
	 * @param {JSON} msg 
	 */


	/**
	 * @param {JSON} msg 
	 */
	handleCreateRoom(msg) {

		function generateRoomID(length) {
			const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		
			// Konvertiere den String in ein Array von Zeichen
			const charactersArray = characters.split("");
		
			// Fisher-Yates Shuffle
			for (let i = charactersArray.length - 1; i > 0; i--) {
			  const j = Math.floor(Math.random() * (i + 1));
			  [charactersArray[i], charactersArray[j]] = [
				charactersArray[j],
				charactersArray[i],
			  ];
			}
		
			// Nehme die ersten 'length' Zeichen vom gemischten Array
			let roomID = charactersArray.slice(0, length).join("");
			return roomID;
		  }

		
			let  id = generateRoomID(6);
			//TODO
			// Überprüfung ob es den Raum schon gibt
			//this.server.rooms durchsuchen

		  //Erstellt einen Raum mit einer zufälligen ID
		  const room = new Room(id);

		  //Fügt den Raum der Raumliste des Server hinzu, Key: room.id, value: room-Instanz
		  this.server.rooms.set(room.id, room);


		  //Setz die "In-welchem-Raum-ist-der-Nutzer"-Variable des Nutzers auf seinen erstellten Raum
		  this.room = room;

		  //Fügt den Nutzer der Nutzerliste des Raums hinzu
		  this.room.clients.set(this.uuid, this);

		  //Antwort an CLient senden

		  this.send({
			type: "forwardToRoom",
			id: id,
		});

		console.log("Raum erstellt:" + id);
		


	}

	/**
	 * @param {JSON} msg 
	 * @returns 
	 */


	handleLeftRoom() {

		
		//Entfernt den Nutzer aus der Nutzerliste des Raums
		this.room.clients.delete(this.uuid);
		let raum_id = this.room.id;
		console.log("Der Nutzer '" + this.uuid + "' hat den Raum '" + raum_id + "' verlassen");
		

		//Wemm die Nutzerliste des Raums 0 ist
		if (this.room.clients.size === 0) {		



			//Raum aus der Raum-Liste des Servers löschen
			this.server.rooms.delete(this.room.id);
			console.log("Der Raum '" + raum_id +"' wurde gelöscht, da keine Nutzer mehr in ihm sind");

		}

		

		//Setz die "In-welchem-Raum-ist-der-Nutzer"-Variable des Nutzers auf null
		this.room = null;

		


		
		
		
	}

	handleJoinRoom(msg) {
		let requested_id = msg.msg;


		if (this.server.rooms.get(requested_id)) {


			this.room = this.server.rooms.get(requested_id);
			this.room.clients.set(this.uuid, this);

			console.log("Der Nutzer: " + this.uuid + " wurde dem Raum: " + this.room.id + " hinzugefügt");
			

		}

		else {

			this.alert("Der Raum existiert nicht");
			
		}

			

	}



	/**
	 * @param {JSON} msg 
	 */
	handleMessage(msg) {
		if (!this.room) {
			console.log("Jemand ohne Raum, der eventuell den Fehler auslöste ist auf die index.html gekommen");
			this.redirect("game");
			return;
		}

		msg.userName = this.username;
		this.room.broadcast(msg);
	}

	handleSubmit(msg) {

		const answer = msg.text;
		this.redirect("waiting");
		this.room.allAnswers.push(answer); ;
		return;


	}

	handleRestart() {
		if (this.uuid === this.room.admin.uuid) {
			this.room.open = true;
			this.room.redirectAll("room");
			this.room.allAnswers.length = 0;

			this.room.startResultListener();

		} else {

			this.alert("Du bist kein Admin und solltest diesen Knopf gar nicht sehen dürfen")

		}

	}

	handleBroadcast(msg) {
		console.log("handleBroadcast wurde erreicht");
		
		this.alert("Folgenden Text hat der Server empfangen: "+ msg.text);

	}


}