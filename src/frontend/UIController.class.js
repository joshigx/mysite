// Hier kommt nur der Code rein, der Veränderungen in der UI hervorruft
//Also alles, was die sichtbare Seite verändert

import { MessageHandler } from "./MessageHandler.class.js";
export class UIController {

	constructor(document, websocketManager) {

		this.websocketManager = websocketManager;
		this.document = document;
		this.page = "login";
		this.output = null;
		this.activateButtons();
		this.messagehandler = new MessageHandler(this);

	}

	find(obj) {
		const found = this.document.getElementById(obj);
		return found;
	}


	activate(button, fnctn) {
		this.find(button).addEventListener('click', fnctn)
	}


	activateButtons() {

		this.activate("create-user", this.createUser.bind(this));
		this.activate("create-room", this.createRoom.bind(this));
		this.activate("join-room", this.joinRoom.bind(this));
		this.activate("submit", this.submit.bind(this));
		this.activate("admin-panel", this.restartRound.bind(this))


	}


	//Diese FUnktion verknüpft / holt die send FUnktion aus websocket Manager hier her
	//Alternativ: jedesmal: websocketMAnager.send(msg) direkt benutzen

	send(msg) {
		this.websocketManager.send(msg)
	}

	//Allgemeine / Hilfsfunktionen FUnktionen hier einfügen

	//Kurzform für document.getElementById


	//Fügt einen ClickListener an einen Knopf (via id) an und führt Funktionen aus


	//Einkommende "Befehle" vom Server werden hier verarbeiten:

	handleMessage(e) {

		try {
			const string = e.data
			const msg = JSON.parse(e.data);
			console.log(string);


			//Hier werden die Typen mit den Funktionen verknüpft
			const handlers = {
				"redirect": () => this.handleRedirect(msg),
				"login-info": () => this.handleLoginInfo(msg),
				"alert": () => this.handleAlert(msg),
				"show-answers": () => this.handleShowAnswers(msg),
				"show-admin-panel": () => this.handleShowAdminPanel(msg),
				// "": () => this. (),
				// "": () => this. (),
				// "": () => this. (),
				// Hier kommen die ganzen Handler rein

			};


			if (handlers[msg.type]) {
				handlers[msg.type]()
				console.log("Wurde erreicht" + string);

			}

			else {
				console.log("Nachricht unbekannten Typs ist eingetroffen");

			}




		}

		catch (e) {
			console.error(e);
		}

	}
	//spezifische Event-Handler

	handleRedirect(msg) {

		console.log("handleRedirect wurde erreicht");
		this.document.getElementById(this.page).style.display = "none";
		this.page = msg.page;
		this.document.getElementById(this.page).style.display = "block";
	}

	handleLoginInfo(msg) {
		console.log("Login-Info bekommen" + msg.name + msg.raum);
		//Hiermit werden die Login-Information angezeigt
		this.document.getElementById("show-user-name").innerHTML += msg.name;
		this.document.getElementById("show-room-id").innerHTML += msg.raum;
	}
	handleAlert(msg) {
		alert(msg.alert);

	}

	handleShowAnswers(msg) {
		this.find("all-answers").innerHTML = msg.answers;
	}

	handleShowAdminPanel() {
		this.find("admin-panel").style.display = "block"
	}




	//Button Funktion hier einfügen(die ausgeführt weden, wenn ein Button gedrückt wird.)


	createUser() {
		this.send({
			type: "createUser",
			id: this.find("user-name").value,
		})
	}



	createRoom() {
		this.send({
			type: "createRoom",
			nameRoomToCreate: this.find("create-room-name").value,
			passwordRoomToCreate: this.find("create-room-password").value
		})
		console.log("Erstellung eines Raumes beim Server angefragt");
	}

	joinRoom() {
		this.send({
			type: "login",
			roomToJoin: this.find("room-id").value,
			passwordOfRoom: this.find("room-password").value,
		})
		console.log("Raum-Beitrittsanfrage an Server gesendet.");

	}

	submit() {
		this.send({
			type: "submit",
			text: this.find("input").value,
		})

		this.document.getElementById("input").value = "";
		//Weiterleitung Serverseitig einbauen
	}

	restartRound() {
		this.send({
			type: "restart"
		});

	}








}