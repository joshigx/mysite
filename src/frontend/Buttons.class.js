export class Buttons {

    constructor (uic) {

        this.uic = uic;
        this.activateButtons();

    }

    activate(button, fnctn) {
		this.uic.find(button).addEventListener('click', fnctn)
	}



//Hier werden Buttons mit Funktionen "verknüpft"
	

	activateButtons() {

		this.activate("create-user", this.createUser.bind(this));
		this.activate("create-room", this.createRoom.bind(this));
		this.activate("join-room", this.joinRoom.bind(this));
		this.activate("submit", this.submit.bind(this));
		this.activate("admin-panel", this.restartRound.bind(this))


	}

	createUser() {
		this.uic.send({
			type: "createUser",
			id: this.uic.find("user-name").value,
		})
	}



	createRoom() {
		this.uic.send({
			type: "createRoom",
			nameRoomToCreate: this.uic.find("create-room-name").value,
			passwordRoomToCreate: this.uic.find("create-room-password").value
		})
		console.log("Erstellung eines Raumes beim Server angefragt");
	}

	joinRoom() {
		this.uic.send({
			type: "login",
			roomToJoin: this.uic.find("room-id").value,
			passwordOfRoom: this.uic.find("room-password").value,
		})
		console.log("Raum-Beitrittsanfrage an Server gesendet.");

	}

	submit() {
		this.uic.send({
			type: "submit",
			text: this.uic.find("input").value,
		})

		this.uic.document.getElementById("input").value = "";
		//Weiterleitung Serverseitig einbauen
	}

	restartRound() {
		this.uic.send({
			type: "restart"
		});

	}



}