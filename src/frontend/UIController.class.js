// Hier kommt nur der Code rein, der Veränderungen in der UI hervorruft
//Also alles, was die sichtbare Seite verändert

import { Buttons } from "./Buttons.class.js";
import { MessageHandler } from "./MessageHandler.class.js";
export class UIController {

	constructor(document, websocketManager) {

		this.websocketManager = websocketManager;
		this.document = document;
		this.page = "login";
		this.output = null;
		
		this.messagehandler = new MessageHandler(this);
		this.btn = new Buttons(this);
	}

	find(obj) {
		const found = this.document.getElementById(obj);
		return found;
	}

	send(msg) {
		this.websocketManager.send(msg)
	}

	handleMessage(e) {

		try {
			const string = e.data
			const msg = JSON.parse(e.data);
			console.log(string);


			//Hier werden die Typen mit den Funktionen verknüpft
			const handlers = {
				"redirect": () => this.messagehandler.handleRedirect(msg),
				"login-info": () => this.messagehandler.handleLoginInfo(msg),
				"alert": () => this.messagehandler.handleAlert(msg),
				"show-answers": () => this.messagehandler.handleShowAnswers(msg),
				"show-admin-panel": () => this.messagehandler.handleShowAdminPanel(msg),
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







}