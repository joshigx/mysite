export class MessageHandler {

    constructor (UIController) {
        this.uic = UIController;
    }


	//Diese Funktionen werden bei bestimmten einkommenden Nachrichten ausgeführt

	handleRedirect(msg) {

		console.log("handleRedirect wurde erreicht");
		this.uic.document.getElementById(this.uic.page).style.display = "none";
		this.uic.page = msg.page;
		this.uic.document.getElementById(this.uic.page).style.display = "block";
	}

	handleLoginInfo(msg) {
		console.log("Login-Info bekommen" + msg.name + msg.raum);
		//Hiermit werden die Login-Information angezeigt
		this.uic.document.getElementById("show-user-name").innerHTML += msg.name;
		this.uic.document.getElementById("show-room-id").innerHTML += msg.raum;
	}
	handleAlert(msg) {
		alert(msg.alert);

	}

	handleShowAnswers(msg) {
		console.log(msg.answers);
		
		//in msg.answers sind die antworten enthalten
		//this.uic.find("all-answers").innerHTML = msg.answers;

	

	}

	handleShowAdminPanel() {
		this.uic.find("admin-panel").style.display = "block"
	}



}