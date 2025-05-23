import { Room } from "./Room.class.js";




export class Connection {
	/**
	 * @param {Socket} socket 
	 * @param {Server} server 
	 */

	constructor(socket, server) {
		this.socket = socket;

		
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
				case "login":
					this.handleLogin(msg);
					break;
				case "message":
					this.handleMessage(msg);
					break;
				case "submit":
					this.handleSubmit(msg);
					break;
				case "createUser":
					this.handleCreateUser(msg);
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
				this.room.clients.delete(this.uuid);
				this.room = null;
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
	handleCreateUser(msg) {

		if (!this.usernameExists(msg.id, this.server.clients)) {
			this.username = msg.id;
			console.log(`Neuer Log-In: ${this.username}`);
			const loginMsg = {
				type: "login",
				clientId: this.uuid,
			}
			this.send(loginMsg);
			this.redirect("select");
		}

		else { this.alert("Nutzername ist bereits vergeben") }
	}

	/**
	 * @param {JSON} msg 
	 */
	handleCreateRoom(msg) {
		console.log("Raumerstellungsanfrage erhalten");
		const name = msg.nameRoomToCreate;
		const password = msg.passwordRoomToCreate;
		const admin = this;
		//Prüft ob es der Raum bereits existiert: Dann Meldung geben und Raum nicht erstellen
		if (this.server.rooms.has(name)) {
			this.socket.send(msg);
			console.log("Raum existiert bereits");
			this.alert("Raum existiert bereits");
		} else {
			// Erstelle eine neue Instanz der Raum Klasse mit dem Namen und dem Passwort des Raumes
			const room = new Room(name, password, admin);
			//Erstellt einen Eintrag in der Map rooms. key: Raumname, Value: Raum Objekt Instanz
			this.server.rooms.set(name, room);

			// Setzt den aktuelle Raum des zu erstellenden Nutzers auf seinen erstellten Raum
			this.room = room;
			this.room.clients.set(this.uuid, this)
			this.room.startResultListener();

			this.redirect("room");
			this.sendLoginInfo();
		}
	}

	/**
	 * @param {JSON} msg 
	 * @returns 
	 */
	handleLogin(msg) {
		//Überprüfen ob der Raum, den der Nutzer beitreten will exisitiert und ob das Passwort richtig ist
		if (!this.server.rooms.has(msg.roomToJoin)) {
			this.alert("Der Raum existiert nicht!");
			return;
		}
		else {
			const room = this.server.rooms.get(msg.roomToJoin);
			if (room.password !== msg.passwordOfRoom) {
				this.alert(`Falsches Passwort für den Raum ${room.name}!`);
				return;
			}
			else {

				if (room.open === false) {

					this.alert("Der Raum ist bereits gerade in einer Sitzung und nicht mehr offen");
				}


				else {
					this.room = room;
					this.room.clients.set(this.uuid, this);
					this.redirect("room");
					this.sendLoginInfo();
					console.log(`Neuer Log-In: ${this.username} in Raum ${this.room.name}`);
				}
			}

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